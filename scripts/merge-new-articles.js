const fs = require('fs');
const path = require('path');

// Read the current articles.ts file
const articlesPath = path.join(__dirname, '../data/articles.ts');
let content = fs.readFileSync(articlesPath, 'utf-8');

// Read new scraped articles
const newArticlesPath = path.join(__dirname, '../scraped-data/capitol-commentary-new-articles.json');
const newArticles = JSON.parse(fs.readFileSync(newArticlesPath, 'utf-8'));

console.log(`Found ${newArticles.length} new Capitol Commentary articles to add`);

// Fix author slugs based on content
const articlesToAdd = newArticles.map(article => {
  // Clean up author name from scraping artifacts
  let authorSlug = article.authorSlug;
  const originalAuthor = article._originalAuthor || '';
  
  if (originalAuthor.includes('Omar Dahabra')) {
    authorSlug = 'omar-dahabra';
  } else if (originalAuthor.includes('Samyak Duggirala')) {
    authorSlug = 'samyak-duggirala';
  } else if (originalAuthor.includes('Ryon')) {
    authorSlug = 'ryon-jemail';
  } else if (originalAuthor.includes('Suhayb')) {
    authorSlug = 'suhayb-zahid';
  } else if (originalAuthor.includes('Aneesh')) {
    authorSlug = 'aneesh-velicheti';
  } else if (originalAuthor.includes('Daniela')) {
    authorSlug = 'daniela-serna';
  }
  
  article.authorSlug = authorSlug;
  
  // Clean up content - remove "Sources" and other artifacts at end
  let cleanContent = article.content
    .replace(/\n\nSources\s*$/m, '')
    .replace(/\n\nShare This Article\s*$/m, '')
    .replace(/\n\nCapitol Commentary\s*$/m, '')
    .replace(/\n\n— [A-Za-z\s]+\s*$/m, '')
    .trim();
  
  article.content = cleanContent;
  
  // Remove internal field
  delete article._originalAuthor;
  
  return article;
});

// Generate the article object as TypeScript code
function articleToTS(article) {
  const contentEscaped = article.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
    
  return `  {
    slug: "${article.slug}",
    title: "${article.title.replace(/"/g, '\\"')}",
    subtitle: "${article.subtitle || ''}",
    description: "${article.description.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
    category: "${article.category}",
    publishedAt: "${article.publishedAt}",
    authorSlug: "${article.authorSlug}",
    readTime: "${article.readTime}",
    hasFullContent: true,
    graphicColors: ["${article.graphicColors[0]}", "${article.graphicColors[1]}"],
    graphicIcon: "${article.graphicIcon}",
    partnership: "Capitol Commentary",
    content: \`${contentEscaped}\`
  }`;
}

// Find the articles array in the content
const articlesStartMatch = content.match(/export const articles: Article\[\] = \[/);
if (!articlesStartMatch) {
  console.error('Could not find articles array');
  process.exit(1);
}

const articlesStart = content.indexOf(articlesStartMatch[0]) + articlesStartMatch[0].length;

// Find existing articles by counting braces
let braceCount = 1;
let articlesEnd = articlesStart;
for (let i = articlesStart; i < content.length; i++) {
  if (content[i] === '[') braceCount++;
  if (content[i] === ']') braceCount--;
  if (braceCount === 0) {
    articlesEnd = i;
    break;
  }
}

const articlesSection = content.slice(articlesStart, articlesEnd);

// Count existing articles
const articleMatches = articlesSection.match(/\{\s*slug:/g);
const existingCount = articleMatches ? articleMatches.length : 0;

console.log(`Found ${existingCount} existing articles`);

// Find all article end positions (},)
const articleEndRegex = /\}\s*,/g;
let positions = [];
let match;

while ((match = articleEndRegex.exec(articlesSection)) !== null) {
  positions.push(articlesStart + match.index + match[0].length);
}

console.log(`Found ${positions.length} article positions`);

// Calculate insertion points for even distribution
const totalNew = articlesToAdd.length;
const insertAfterArticles = [];
for (let i = 0; i < totalNew; i++) {
  const pos = Math.floor((i + 1) * positions.length / (totalNew + 1));
  insertAfterArticles.push(Math.min(pos, positions.length - 1));
}

console.log(`Will distribute ${totalNew} articles evenly throughout existing ${existingCount} articles`);

// Build insertions map: position -> articles to insert
const insertionMap = new Map();
articlesToAdd.forEach((article, i) => {
  const posIndex = insertAfterArticles[i];
  const pos = positions[posIndex];
  if (!insertionMap.has(pos)) {
    insertionMap.set(pos, []);
  }
  insertionMap.get(pos).push(article);
});

// Apply insertions in reverse order to maintain position validity
const sortedPositions = Array.from(insertionMap.keys()).sort((a, b) => b - a);

let modifiedContent = content;

for (const pos of sortedPositions) {
  const articles = insertionMap.get(pos);
  const articleCode = articles.map(a => '\n' + articleToTS(a) + ',').join('');
  modifiedContent = modifiedContent.slice(0, pos) + articleCode + modifiedContent.slice(pos);
}

// Write back
fs.writeFileSync(articlesPath, modifiedContent);

console.log(`\n✅ Successfully merged ${totalNew} Capitol Commentary articles!`);
console.log('Articles are now evenly dispersed throughout the existing articles.');

