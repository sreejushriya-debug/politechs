const fs = require('fs');
const path = require('path');

// Read the current articles.ts file
const articlesPath = path.join(__dirname, '../data/articles.ts');
let content = fs.readFileSync(articlesPath, 'utf-8');

// Read scraped Capitol Commentary articles
const ccArticlesPath = path.join(__dirname, '../scraped-data/capitol-commentary-articles.json');
const ccArticles = JSON.parse(fs.readFileSync(ccArticlesPath, 'utf-8'));

// Filter out the duplicate (profits-over-people which is already added)
const newCCArticles = ccArticles.filter(a => a.slug !== 'cc-profits-over-people-how-privatization-is-reshaping-ice');

console.log(`Found ${newCCArticles.length} new Capitol Commentary articles to add`);

// Fix author slugs based on content
const articlesToAdd = newCCArticles.map(article => {
  // Determine author from content signature
  if (article.content.includes('— Omar Dahabra')) {
    article.authorSlug = 'omar-dahabra';
  } else if (article.content.includes('— Samyak Duggirala')) {
    article.authorSlug = 'samyak-duggirala';
  } else {
    article.authorSlug = 'omar-dahabra'; // default
  }
  
  // Clean up content - remove date prefix if present
  article.content = article.content.replace(/^[A-Z][a-z]+ \d{1,2}, \d{4}\n\n/, '');
  
  // Remove the _originalAuthor field
  delete article._originalAuthor;
  
  return article;
});

// Generate the article objects as TypeScript code
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

// Find existing articles by counting opening braces
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

// Split into individual article objects (rough split by looking for article boundaries)
const articleMatches = articlesSection.match(/\{\s*slug:/g);
const existingCount = articleMatches ? articleMatches.length : 0;

console.log(`Found ${existingCount} existing articles`);

// Calculate insertion points for even distribution
const totalNew = articlesToAdd.length;
const interval = Math.floor(existingCount / (totalNew + 1));

console.log(`Will insert every ~${interval} articles`);

// Generate the new articles code
const newArticlesCode = articlesToAdd.map((article, i) => articleToTS(article)).join(',\n');

// For simplicity, let's append them at regular intervals
// We'll insert after the first article, then every few articles

// Find each article end point and insert
let insertionPoints = [];
let currentPos = articlesStart;
let articleCount = 0;

// Find all article end positions (},)
const articleEndRegex = /\}\s*,/g;
let match;
let positions = [];

while ((match = articleEndRegex.exec(articlesSection)) !== null) {
  positions.push(articlesStart + match.index + match[0].length);
}

console.log(`Found ${positions.length} article positions`);

// Calculate which positions to insert at
const insertAfterArticles = [];
for (let i = 0; i < totalNew; i++) {
  const pos = Math.floor((i + 1) * positions.length / (totalNew + 1));
  insertAfterArticles.push(pos);
}

console.log(`Inserting at article positions: ${insertAfterArticles.join(', ')}`);

// Build new content by inserting articles at the calculated positions
let newContent = content.slice(0, articlesStart);
let lastEnd = articlesStart;

// Sort articles by where they should go
const insertions = articlesToAdd.map((article, i) => ({
  article,
  afterPosition: positions[insertAfterArticles[i] - 1] || positions[0]
})).sort((a, b) => a.afterPosition - b.afterPosition);

// Apply insertions in reverse order to maintain position validity
let modifiedSection = articlesSection;
let offset = 0;

for (let i = insertions.length - 1; i >= 0; i--) {
  const insertion = insertions[i];
  const relativePos = insertion.afterPosition - articlesStart;
  const articleCode = '\n' + articleToTS(insertion.article) + ',';
  
  modifiedSection = 
    modifiedSection.slice(0, relativePos) + 
    articleCode + 
    modifiedSection.slice(relativePos);
}

// Write back
const finalContent = 
  content.slice(0, articlesStart) + 
  modifiedSection + 
  content.slice(articlesEnd);

fs.writeFileSync(articlesPath, finalContent);

console.log(`\n✅ Successfully merged ${totalNew} Capitol Commentary articles!`);
console.log('Articles are now evenly dispersed throughout the existing articles.');

