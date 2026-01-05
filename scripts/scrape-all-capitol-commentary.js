const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// All unique article URLs from user
const ARTICLE_URLS = [
  'https://capitolcommentary.news/article/american-lie-rugged-individualism-welfare',
  'https://capitolcommentary.news/article/how-zohran-won',
  'https://capitolcommentary.news/article/aws-digital-monopolization',
  'https://capitolcommentary.news/article/us-infrastructure-oppresses-minorities',
  'https://capitolcommentary.news/article/nuclear-energy-myths-debunked',
  'https://capitolcommentary.news/article/sudan-forgotten-victim-imperialism',
  'https://capitolcommentary.news/article/high-speed-rail-myths-debunked',
  'https://capitolcommentary.news/article/gdp-economic-reality-disconnect',
  'https://capitolcommentary.news/article/gun-control-myths-debunked',
  'https://capitolcommentary.news/article/government-shutdown-hurting-education',
  'https://capitolcommentary.news/article/the-ceasefire-explained',
  'https://capitolcommentary.news/article/debunking-5-lies-justify-genocide',
  'https://capitolcommentary.news/article/private-equity-chokehold-housing',
  'https://capitolcommentary.news/article/crisis-catalyst-political-violence-security-measures',
  'https://capitolcommentary.news/article/invisible-deaths-palestinians-israeli-captivity',
  'https://capitolcommentary.news/article/genz-212-morocco-revolt-against-corruption',
  'https://capitolcommentary.news/article/israel-intercepts-global-sumud-flotilla',
  'https://capitolcommentary.news/article/analysis-maga-christian-nationalism',
  'https://capitolcommentary.news/article/big-tech-silent-subpoenas',
  'https://capitolcommentary.news/article/kerala-model-economic-prosperity-through-inclusivity',
  'https://capitolcommentary.news/article/trump-war-on-protest-antifa',
  'https://capitolcommentary.news/article/a-recap-of-the-un-general-assembly',
  'https://capitolcommentary.news/article/trump-rhetoric-racist-policies',
  'https://capitolcommentary.news/article/rubio-passport-power-grab',
  'https://capitolcommentary.news/article/how-israel-attacks-create-cycle-violence',
  'https://capitolcommentary.news/article/how-anti-bds-laws-silence-free-speech',
  'https://capitolcommentary.news/article/corruption-structural-case-study-nepal',
  'https://capitolcommentary.news/article/mainstream-media-fundamental-problem',
  'https://capitolcommentary.news/article/how-sanctions-kill-more-than-wars',
  'https://capitolcommentary.news/article/rfk-war-on-vaccines',
  'https://capitolcommentary.news/article/corbyn-new-party-britain-disillusioned-left',
  'https://capitolcommentary.news/article/healthcare-industry-pervasive-strategy-denial',
  'https://capitolcommentary.news/article/strangling-competition-swallowing-rivals-cvs-model-healthcare',
  'https://capitolcommentary.news/article/big-pharma-crowds-out-innovation',
  'https://capitolcommentary.news/article/visa-wall-no-one-sees',
  'https://capitolcommentary.news/article/when-prayers-arent-enough-minneapolis-shooting',
  'https://capitolcommentary.news/article/the-criminalization-of-dissent',
  'https://capitolcommentary.news/article/trump-crypto-empire-policy-personal-profit',
  'https://capitolcommentary.news/article/how-palestine-abandoned-international-relations',
  'https://capitolcommentary.news/article/green-capitalism-comes-at-cost-of-congo',
  'https://capitolcommentary.news/article/gerrymandering-wars-texas-california-2026',
  'https://capitolcommentary.news/article/the-democratic-party-must-support-progressives',
  'https://capitolcommentary.news/article/when-aid-masks-genocide',
  'https://capitolcommentary.news/article/trump-admin-cites-dei-excuse-cut-research-funding',
  'https://capitolcommentary.news/article/militarizing-mexico-trump-push-towards-war',
  'https://capitolcommentary.news/article/signs-authoritarianism-mail-in-ballots',
  'https://capitolcommentary.news/article/we-need-nuclear',
  'https://capitolcommentary.news/article/deep-desert-ai-data-centers-threaten-southwest-resources',
  'https://capitolcommentary.news/article/summit-that-sidelined-ukraine',
  'https://capitolcommentary.news/article/florida-heartland-rock-mine-threatens-restoration',
  'https://capitolcommentary.news/article/putin-gambit-ploy-peace',
  'https://capitolcommentary.news/article/signs-authoritarianism-shaping-maps-control',
  'https://capitolcommentary.news/article/heart-national-immediate-peril',
  'https://capitolcommentary.news/article/israel-war-on-journalism',
  'https://capitolcommentary.news/article/trump-tariff-plans-economic-populism',
  'https://capitolcommentary.news/article/palantir-war-tech-fuels-genocide-gaza',
  'https://capitolcommentary.news/article/shadow-colonization-creeps-native-lands-again',
  'https://capitolcommentary.news/article/signs-authoritarianism-attacking-higher-education',
  'https://capitolcommentary.news/article/toxic-promises-how-deregulation-is-poisoning-americas-water-supply',
  // These may have already been added but we'll check
  'https://capitolcommentary.news/article/surveillance-has-wings-now',
  'https://capitolcommentary.news/article/a-brief-history-of-false-flag-attacks',
  'https://capitolcommentary.news/article/the-08-recession-explained',
];

// Already added slugs (skip these)
const ALREADY_ADDED = [
  'profits-over-people-how-privatization-is-reshaping-ice',
  'surveillance-has-wings-now',
  'iraq-2-0-venezuela',
  'forever-wars-explained',
  'signs-authoritarianism-big-tech',
  'minimum-wage-myths-debunked',
  'pentagon-restrictive-press-rules',
  'alaska-environmental-impacts-ai',
  'signs-authoritarianism-expanding-national-guard',
  'the-government-shutdown-explained',
  'a-brief-history-of-false-flag-attacks',
  'the-08-recession-explained',
];

async function scrapeArticle(page, url) {
  const slug = url.split('/article/')[1];
  
  // Skip if already added
  if (ALREADY_ADDED.includes(slug)) {
    console.log(`⏭️  Skipping (already added): ${slug}`);
    return null;
  }
  
  console.log(`📄 Scraping: ${slug}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const article = await page.evaluate(() => {
      // Get title
      const titleEl = document.querySelector('h1');
      const title = titleEl ? titleEl.innerText.trim() : '';
      
      // Get author - look for author name pattern
      let author = '';
      const bodyText = document.body.innerText;
      
      // Look for "— Author Name" pattern at end of article
      const authorMatch = bodyText.match(/—\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*$/m);
      if (authorMatch) {
        author = authorMatch[1];
      }
      
      // Also try to find author in byline
      if (!author) {
        const bylineMatch = bodyText.match(/By\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
        if (bylineMatch) author = bylineMatch[1];
      }
      
      // Get date
      let date = '';
      const dateMatch = bodyText.match(/([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/);
      if (dateMatch) date = dateMatch[1];
      
      // Get content
      let content = '';
      const article = document.querySelector('article') || document.querySelector('main');
      if (article) {
        const paragraphs = article.querySelectorAll('p');
        content = Array.from(paragraphs)
          .map(p => p.innerText.trim())
          .filter(t => t.length > 20) // Filter out short strings
          .join('\n\n');
      }
      
      return { title, author, date, content };
    });
    
    article.url = url;
    article.slug = slug;
    
    if (article.title && article.content) {
      console.log(`   ✅ "${article.title}" by ${article.author || 'Unknown'}`);
      return article;
    } else {
      console.log(`   ⚠️ Missing content for ${slug}`);
      return null;
    }
    
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
    ['#ef4444', '#f97316'],
    ['#6366f1', '#8b5cf6'],
  ];
  const icons = ['📰', '⚖️', '🏛️', '📊', '🗳️', '💼', '🌐', '📋', '🔍', '💡', '🔬', '⚡'];
  
  // Map author names to slugs
  const authorMap = {
    'Omar Dahabra': 'omar-dahabra',
    'Samyak Duggirala': 'samyak-duggirala',
    'Ryon': 'ryon',
    'Suhayb Zahid': 'suhayb-zahid',
    'Aneesh Velicheti': 'aneesh-velicheti',
    'Daniela Serna': 'daniela-serna',
  };
  
  const authorSlug = authorMap[article.author] || 'omar-dahabra';
  
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
  
  // Clean content - remove date prefix
  let content = article.content
    .replace(/^[A-Z][a-z]+\s+\d{1,2},?\s+\d{4}\s*\n*/m, '')
    .trim();

  return {
    slug: `cc-${article.slug}`,
    title: article.title,
    subtitle: '',
    description: content.substring(0, 180).replace(/\n/g, ' ') + '...',
    category: 'Policy & Governance',
    publishedAt: publishedAt,
    authorSlug: authorSlug,
    readTime: Math.max(3, Math.ceil(content.split(' ').length / 200)) + ' min read',
    hasFullContent: true,
    graphicColors: colors[index % colors.length],
    graphicIcon: icons[index % icons.length],
    partnership: 'Capitol Commentary',
    content: content,
    _originalAuthor: article.author || 'Capitol Commentary'
  };
}

async function main() {
  console.log('🔍 Scraping all Capitol Commentary articles...\n');
  console.log(`📋 Total URLs to process: ${ARTICLE_URLS.length}`);
  console.log(`⏭️  Already added: ${ALREADY_ADDED.length}\n`);
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const articles = [];
  
  for (let i = 0; i < ARTICLE_URLS.length; i++) {
    const article = await scrapeArticle(page, ARTICLE_URLS[i]);
    if (article) {
      articles.push(toPolitechsFormat(article, articles.length));
    }
    await new Promise(r => setTimeout(r, 800));
  }
  
  await browser.close();
  
  console.log(`\n✨ Successfully scraped ${articles.length} NEW articles\n`);
  
  // Save to file
  const outputPath = path.join(__dirname, '../scraped-data/capitol-commentary-new-articles.json');
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
  
  console.log(`📁 Saved to ${outputPath}`);
  
  // Print summary
  const authorCounts = {};
  articles.forEach(a => {
    authorCounts[a._originalAuthor] = (authorCounts[a._originalAuthor] || 0) + 1;
  });
  console.log('\n📊 Articles by author:');
  Object.entries(authorCounts).forEach(([author, count]) => {
    console.log(`   ${author}: ${count}`);
  });
}

main().catch(console.error);

