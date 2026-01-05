const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://capitolcommentary.news';
const CATEGORY_PAGES = ['/politics', '/policy', '/opinion'];

async function scrapeArticleLinks(page, categoryUrl) {
  console.log(`📂 Fetching ${categoryUrl}...`);
  await page.goto(categoryUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait for articles to load
  await page.waitForSelector('a[href*="/article/"]', { timeout: 10000 }).catch(() => {});
  
  const links = await page.evaluate(() => {
    const anchors = document.querySelectorAll('a[href*="/article/"]');
    return Array.from(anchors).map(a => a.href).filter((v, i, a) => a.indexOf(v) === i);
  });
  
  console.log(`   Found ${links.length} article links`);
  return links;
}

async function scrapeArticle(page, url) {
  console.log(`📄 Scraping: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for content to load
    await new Promise(r => setTimeout(r, 2000));
    
    const article = await page.evaluate(() => {
      // Get title
      const titleEl = document.querySelector('h1') || document.querySelector('[class*="title"]');
      const title = titleEl ? titleEl.innerText.trim() : '';
      
      // Get author
      let author = '';
      const authorPatterns = [
        '[class*="author"]',
        '[class*="byline"]',
        'span:contains("By")',
      ];
      for (const selector of authorPatterns) {
        try {
          const el = document.querySelector(selector);
          if (el) {
            author = el.innerText.replace(/^by\s*/i, '').trim();
            break;
          }
        } catch {}
      }
      // Also check for text containing "By" or author name pattern
      if (!author) {
        const allText = document.body.innerText;
        const byMatch = allText.match(/By\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
        if (byMatch) author = byMatch[1];
      }
      
      // Get date
      let date = '';
      const dateEl = document.querySelector('time') || document.querySelector('[class*="date"]');
      if (dateEl) {
        date = dateEl.getAttribute('datetime') || dateEl.innerText.trim();
      }
      // Also look for date pattern in text
      if (!date) {
        const dateMatch = document.body.innerText.match(/([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/);
        if (dateMatch) date = dateMatch[1];
      }
      
      // Get content - look for article body
      let content = '';
      const contentSelectors = [
        'article',
        '[class*="article-content"]',
        '[class*="post-content"]',
        '[class*="content"]',
        'main',
      ];
      
      for (const selector of contentSelectors) {
        try {
          const el = document.querySelector(selector);
          if (el) {
            // Get all paragraphs
            const paragraphs = el.querySelectorAll('p');
            if (paragraphs.length > 0) {
              content = Array.from(paragraphs).map(p => p.innerText.trim()).filter(t => t.length > 0).join('\n\n');
              break;
            }
          }
        } catch {}
      }
      
      // If no paragraphs found, get all text from main area
      if (!content) {
        const main = document.querySelector('main') || document.querySelector('article') || document.body;
        content = main.innerText;
      }
      
      return { title, author, date, content };
    });
    
    article.url = url;
    article.slug = url.split('/article/')[1] || 'unknown';
    
    console.log(`   ✅ "${article.title || 'Unknown title'}"`);
    return article;
    
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    return null;
  }
}

function toPolitechsFormat(article, index) {
  const colors = [
    ['#dc2626', '#f97316'],
    ['#7c3aed', '#3b82f6'],
    ['#059669', '#10b981'],
    ['#0891b2', '#6366f1'],
    ['#d946ef', '#ec4899'],
    ['#f59e0b', '#ef4444'],
    ['#8b5cf6', '#ec4899'],
    ['#14b8a6', '#3b82f6'],
  ];
  const icons = ['📰', '⚖️', '🏛️', '📊', '🗳️', '💼', '🌐', '📋', '🔍', '💡'];
  
  const slug = article.slug || article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
    
  const authorSlug = article.author
    ? article.author.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')
    : 'capitol-commentary';
    
  // Parse date
  let publishedAt = new Date().toISOString().split('T')[0];
  if (article.date) {
    try {
      const d = new Date(article.date);
      if (!isNaN(d.getTime())) {
        publishedAt = d.toISOString().split('T')[0];
      }
    } catch {}
  }

  return {
    slug: `cc-${slug}`,
    title: article.title || 'Untitled Article',
    subtitle: '',
    description: article.content ? article.content.substring(0, 200).replace(/\n/g, ' ') + '...' : '',
    category: 'Policy & Governance',
    publishedAt: publishedAt,
    authorSlug: authorSlug,
    readTime: Math.max(3, Math.ceil((article.content || '').split(' ').length / 200)) + ' min read',
    hasFullContent: true,
    graphicColors: colors[index % colors.length],
    graphicIcon: icons[index % icons.length],
    partnership: 'Capitol Commentary',
    content: article.content || '',
    _originalAuthor: article.author || 'Capitol Commentary'
  };
}

async function main() {
  console.log('🔍 Scraping Capitol Commentary with Puppeteer...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Collect all article links
  const allLinks = [];
  for (const category of CATEGORY_PAGES) {
    try {
      const links = await scrapeArticleLinks(page, BASE_URL + category);
      allLinks.push(...links);
    } catch (err) {
      console.log(`   Error on ${category}: ${err.message}`);
    }
  }
  
  // Remove duplicates
  const uniqueLinks = [...new Set(allLinks)];
  console.log(`\n📚 Total unique articles: ${uniqueLinks.length}\n`);
  
  // Scrape each article
  const articles = [];
  const authors = {};
  
  for (let i = 0; i < uniqueLinks.length; i++) {
    const article = await scrapeArticle(page, uniqueLinks[i]);
    if (article && (article.title || article.content)) {
      const formatted = toPolitechsFormat(article, i);
      articles.push(formatted);
      
      // Track author
      if (formatted._originalAuthor && !authors[formatted.authorSlug]) {
        authors[formatted.authorSlug] = {
          slug: formatted.authorSlug,
          name: formatted._originalAuthor,
          bio: `${formatted._originalAuthor} is a contributing writer for Capitol Commentary.`,
          role: 'Capitol Commentary Writer'
        };
      }
    }
    
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  await browser.close();
  
  console.log(`\n✨ Successfully scraped ${articles.length} articles\n`);
  
  // Save to files
  const outputDir = path.join(__dirname, '../scraped-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'capitol-commentary-articles.json'),
    JSON.stringify(articles, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'capitol-commentary-authors.json'),
    JSON.stringify(Object.values(authors), null, 2)
  );
  
  console.log(`📁 Saved to ${outputDir}/`);
  console.log(`   - capitol-commentary-articles.json (${articles.length} articles)`);
  console.log(`   - capitol-commentary-authors.json (${Object.keys(authors).length} authors)`);
}

main().catch(console.error);
