const fs = require('fs');
const path = require('path');

// Read articles.ts
const articlesPath = path.join(__dirname, '../data/articles.ts');
let content = fs.readFileSync(articlesPath, 'utf-8');

// Category mappings based on article titles/topics
const categoryMappings = {
  // International Relations
  'sudan': 'International Relations',
  'ceasefire': 'International Relations',
  'palestine': 'International Relations',
  'israel': 'International Relations',
  'flotilla': 'International Relations',
  'morocco': 'International Relations',
  'venezuela': 'International Relations',
  'iraq': 'International Relations',
  'forever-wars': 'International Relations',
  'ukraine': 'International Relations',
  'putin': 'International Relations',
  'congo': 'International Relations',
  'nepal': 'International Relations',
  'kerala': 'International Relations',
  'corbyn': 'International Relations',
  'sanctions': 'International Relations',
  'mexico': 'International Relations',
  'un-general-assembly': 'International Relations',
  
  // Climate & Environment  
  'nuclear-energy': 'Climate & Environment',
  'high-speed-rail': 'Climate & Environment',
  'we-need-nuclear': 'Climate & Environment',
  'green-capitalism': 'Climate & Environment',
  'florida-heartland': 'Climate & Environment',
  'alaska-environmental': 'Climate & Environment',
  'deep-desert-ai-data': 'Climate & Environment',
  'water-supply': 'Climate & Environment',
  
  // Technology & Society
  'aws': 'Technology & Society',
  'big-tech': 'Technology & Society',
  'surveillance': 'Technology & Society',
  'palantir': 'Technology & Society',
  'ai-data-centers': 'Technology & Society',
  'digital-monopolization': 'Technology & Society',
  
  // Data & Privacy
  'subpoenas': 'Data & Privacy',
  
  // Economics & Business
  'gdp': 'Economics & Business',
  'private-equity': 'Economics & Business',
  'minimum-wage': 'Economics & Business',
  'tariff': 'Economics & Business',
  'crypto': 'Economics & Business',
  'cvs': 'Economics & Business',
  'big-pharma': 'Economics & Business',
  'healthcare-industry': 'Economics & Business',
  
  // Democracy & Policy
  'gun-control': 'Democracy & Policy',
  'zohran': 'Democracy & Policy',
  'authoritarianism': 'Democracy & Policy',
  'government-shutdown': 'Democracy & Policy',
  'gerrymandering': 'Democracy & Policy',
  'mail-in-ballots': 'Democracy & Policy',
  'protest': 'Democracy & Policy',
  'antifa': 'Democracy & Policy',
  'christian-nationalism': 'Democracy & Policy',
  'democratic-party': 'Democracy & Policy',
  'infrastructure-oppresses': 'Democracy & Policy',
  'rugged-individualism': 'Democracy & Policy',
  'welfare': 'Democracy & Policy',
  'rhetoric-racist': 'Democracy & Policy',
  'passport': 'Democracy & Policy',
  'bds-laws': 'Democracy & Policy',
  'dissent': 'Democracy & Policy',
  'visa-wall': 'Democracy & Policy',
  'dei': 'Democracy & Policy',
  'higher-education': 'Democracy & Policy',
  'native-lands': 'Democracy & Policy',
  'national-guard': 'Democracy & Policy',
  'journalism': 'Democracy & Policy',
  
  // Media & Communication
  'mainstream-media': 'Media & Communication',
  'pentagon-restrictive-press': 'Media & Communication',
  
  // Health & Wellness
  'rfk-war-on-vaccines': 'Health & Wellness',
  'minneapolis-shooting': 'Health & Wellness',
};

// Find all Capitol Commentary articles and update their categories
let updatedCount = 0;

// Match pattern: slug: "cc-something" followed by category line
const ccArticleRegex = /slug: "cc-([^"]+)"[\s\S]*?category: "Policy & Governance"/g;

content = content.replace(ccArticleRegex, (match, slug) => {
  // Find best matching category
  let newCategory = 'Democracy & Policy'; // Default fallback
  
  for (const [keyword, category] of Object.entries(categoryMappings)) {
    if (slug.includes(keyword)) {
      newCategory = category;
      break;
    }
  }
  
  updatedCount++;
  return match.replace('category: "Policy & Governance"', `category: "${newCategory}"`);
});

// Also update non-cc articles that have "Policy & Governance"
content = content.replace(/category: "Policy & Governance"/g, (match) => {
  // This will catch any remaining ones
  return 'category: "Democracy & Policy"';
});

// Write back
fs.writeFileSync(articlesPath, content);

console.log(`✅ Updated ${updatedCount} Capitol Commentary article categories`);
console.log('Categories have been properly assigned based on article content.');

