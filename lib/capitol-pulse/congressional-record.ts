// Congressional Data Integration
// Fetches searchable text from Congress.gov API
// Note: Congressional Record only provides PDFs, so we use bill summaries and hearing titles
// as searchable "statement" content about tech policy

import { Statement, TechTopic, detectTopics, TECH_TOPICS } from './types';

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';
const API_KEY = process.env.CONGRESS_API_KEY || '';

// Tech keywords for filtering
const TECH_KEYWORDS = [
  'artificial intelligence', 'ai ', ' ai,', ' ai.', 'machine learning', 'algorithm',
  'cybersecurity', 'cyber', 'data breach', 'ransomware', 'hacking',
  'privacy', 'surveillance', 'fisa', 'data protection', 'personal data',
  'social media', 'section 230', 'content moderation', 'online safety', 'tiktok', 'facebook', 'meta',
  'antitrust', 'big tech', 'platform', 'monopoly', 'competition',
  'broadband', 'telecommunications', 'spectrum', '5g', 'net neutrality', 'fcc',
  'cryptocurrency', 'crypto', 'bitcoin', 'blockchain', 'digital asset', 'stablecoin',
  'semiconductor', 'chips act', 'microchip', 'supply chain', 'chip',
  'space', 'nasa', 'satellite', 'aerospace', 'commercial space', 'spacex',
  'technology', 'digital', 'internet', 'software', 'computer', 'tech company',
  'innovation', 'startup', 'venture capital', 'silicon valley'
];

function isTechRelated(text: string): boolean {
  const textLower = text.toLowerCase();
  return TECH_KEYWORDS.some(keyword => textLower.includes(keyword));
}

// Strip HTML tags from text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
}

// Fetch tech-related bill summaries as "statements" about policy
// These are official CRS summaries explaining what bills do
export async function fetchBillSummaryStatements(): Promise<Statement[]> {
  if (!API_KEY) {
    console.log('[Statements] No API key configured');
    return [];
  }

  const statements: Statement[] = [];
  
  try {
    // Fetch recent bill summaries with text
    const summaryUrl = `${CONGRESS_API_BASE}/summaries?api_key=${API_KEY}&format=json&limit=100&sort=updateDate+desc`;
    console.log('[Statements] Fetching bill summaries from Congress.gov');
    
    const res = await fetch(summaryUrl, { 
      next: { revalidate: 1800 }, // Cache for 30 minutes
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) {
      console.error('[Statements] Congress.gov returned:', res.status);
      return [];
    }
    
    const data = await res.json();
    const summaries = data.summaries || [];
    console.log('[Statements] Got', summaries.length, 'bill summaries');
    
    for (const summary of summaries) {
      const title = summary.bill?.title || '';
      const text = stripHtml(summary.text || '');
      const combinedText = `${title} ${text}`;
      
      // Filter for tech-related content
      if (!isTechRelated(combinedText)) continue;
      
      const { topics, matchedSnippet } = detectTopics(combinedText);
      if (topics.length === 0) continue;
      
      const billType = (summary.bill?.type || 'HR').toLowerCase();
      const billNumber = summary.bill?.number || '';
      const congress = summary.bill?.congress || 119;
      
      statements.push({
        id: `summary-${congress}-${billType}-${billNumber}`,
        bioguideId: '', // Summaries don't have a speaker
        title: title || 'Bill Summary',
        excerpt: text.substring(0, 400) + (text.length > 400 ? '...' : ''),
        fullText: text,
        sourceUrl: `https://www.congress.gov/bill/${congress}th-congress/${billType === 'hr' ? 'house-bill' : 'senate-bill'}/${billNumber}`,
        sourceType: 'congressional_record', // CRS summaries are official record
        publishedAt: summary.updateDate || summary.actionDate || new Date().toISOString(),
        topics,
        tone: undefined,
        keywords: extractKeywords(combinedText),
        entities: extractEntities(combinedText),
        matchedSnippet,
        lastUpdated: new Date().toISOString()
      });
    }
    
    console.log('[Statements] Found', statements.length, 'tech-related bill summaries');
    return statements;
    
  } catch (error) {
    console.error('[Statements] Error fetching summaries:', error);
    return [];
  }
}

// Fetch tech-related hearing titles/descriptions
export async function fetchHearingStatements(): Promise<Statement[]> {
  if (!API_KEY) return [];

  const statements: Statement[] = [];
  
  try {
    const hearingUrl = `${CONGRESS_API_BASE}/hearing/119?api_key=${API_KEY}&format=json&limit=50`;
    console.log('[Statements] Fetching hearings from Congress.gov');
    
    const res = await fetch(hearingUrl, { 
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) {
      console.error('[Statements] Hearings endpoint returned:', res.status);
      return [];
    }
    
    const data = await res.json();
    const hearings = data.hearings || [];
    console.log('[Statements] Got', hearings.length, 'hearings');
    
    // Fetch details for each hearing to get title
    for (const hearing of hearings.slice(0, 20)) { // Limit to avoid rate limits
      try {
        const detailRes = await fetch(`${hearing.url}?api_key=${API_KEY}&format=json`);
        if (!detailRes.ok) continue;
        
        const detailData = await detailRes.json();
        const hearingDetail = detailData.hearing;
        
        const title = hearingDetail?.title || '';
        if (!isTechRelated(title)) continue;
        
        const { topics, matchedSnippet } = detectTopics(title);
        if (topics.length === 0) continue;
        
        const committee = hearingDetail?.committees?.[0]?.name || 'Congressional Committee';
        const hearingDate = hearingDetail?.dates?.[0]?.date || '';
        
        statements.push({
          id: `hearing-${hearing.jacketNumber}`,
          bioguideId: '',
          title: title,
          excerpt: `${committee} held a hearing: "${title}"`,
          sourceUrl: hearingDetail?.formats?.[0]?.url || `https://www.congress.gov/event/119th-congress/hearings`,
          sourceType: 'committee_hearing',
          publishedAt: hearingDate || new Date().toISOString(),
          topics,
          keywords: extractKeywords(title),
          entities: extractEntities(title),
          matchedSnippet,
          lastUpdated: new Date().toISOString()
        });
      } catch (e) {
        // Skip individual hearing errors
        continue;
      }
    }
    
    console.log('[Statements] Found', statements.length, 'tech-related hearings');
    return statements;
    
  } catch (error) {
    console.error('[Statements] Error fetching hearings:', error);
    return [];
  }
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const textLower = text.toLowerCase();
  
  for (const topic of TECH_TOPICS) {
    for (const keyword of topic.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        keywords.push(keyword);
      }
    }
  }
  
  return [...new Set(keywords)].slice(0, 10);
}

// Extract entities from text
function extractEntities(text: string): string[] {
  const entities: string[] = [];
  
  const commonEntities = [
    'Google', 'Meta', 'Facebook', 'Apple', 'Amazon', 'Microsoft', 'OpenAI',
    'TikTok', 'ByteDance', 'Twitter', 'X Corp', 'Elon Musk',
    'FTC', 'FCC', 'DOJ', 'SEC', 'CISA', 'NSA', 'FBI', 'DHS',
    'CHIPS Act', 'KOSA', 'COPPA', 'Section 230', 'FISA'
  ];
  
  for (const entity of commonEntities) {
    if (text.includes(entity)) {
      entities.push(entity);
    }
  }
  
  return [...new Set(entities)].slice(0, 8);
}

// Cache for statements
let statementsCache: { data: Statement[]; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Get all statements (summaries + hearings)
export async function getCongressionalRecordStatements(): Promise<Statement[]> {
  const now = Date.now();
  
  if (statementsCache && (now - statementsCache.timestamp) < CACHE_TTL) {
    console.log('[Statements] Returning cached statements:', statementsCache.data.length);
    return statementsCache.data;
  }
  
  // Fetch both sources in parallel
  const [summaryStatements, hearingStatements] = await Promise.all([
    fetchBillSummaryStatements(),
    fetchHearingStatements()
  ]);
  
  // Combine and sort by date
  const allStatements = [...summaryStatements, ...hearingStatements]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  console.log('[Statements] Total statements:', allStatements.length);
  
  statementsCache = { data: allStatements, timestamp: now };
  return allStatements;
}
