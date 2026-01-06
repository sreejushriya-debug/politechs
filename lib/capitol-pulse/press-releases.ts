// Press Release Ingestion System
// Fetches press releases from official .gov member websites only
// NO social media, NO unofficial sources

import { Statement, TechTopic, detectTopics, TECH_TOPICS } from './types';

// Press release coverage tracking
export interface PressReleaseCoverage {
  memberId: string;
  memberName: string;
  party: string;
  chamber: 'House' | 'Senate';
  state: string;
  officialUrl: string;
  pressPageUrl: string | null;
  status: 'available' | 'unavailable' | 'error' | 'not_checked';
  lastChecked: string | null;
  lastSuccessfulFetch: string | null;
  totalReleases: number;
  techRelatedReleases: number;
  error?: string;
}

// Known patterns for official press release pages
const PRESS_PAGE_PATTERNS: { chamber: 'House' | 'Senate'; pattern: string }[] = [
  // House patterns
  { chamber: 'House', pattern: 'https://{lastName}.house.gov/media/press-releases' },
  { chamber: 'House', pattern: 'https://{lastName}.house.gov/news/press-releases' },
  { chamber: 'House', pattern: 'https://{lastName}.house.gov/media-center/press-releases' },
  { chamber: 'House', pattern: 'https://{lastName}.house.gov/newsroom' },
  // Senate patterns
  { chamber: 'Senate', pattern: 'https://www.{lastName}.senate.gov/news/press-releases' },
  { chamber: 'Senate', pattern: 'https://www.{lastName}.senate.gov/newsroom/press-releases' },
  { chamber: 'Senate', pattern: 'https://www.{lastName}.senate.gov/media/press-releases' },
];

// Result of a press release fetch attempt
export interface FetchResult {
  success: boolean;
  releases: Statement[];
  error?: string;
  sourceUrl: string;
}

// Get potential press release URLs for a member
export function getPressReleaseUrls(
  lastName: string, 
  chamber: 'House' | 'Senate'
): string[] {
  const normalizedName = lastName.toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/^mc/, 'mc') // Handle McConnell etc.
    .replace(/^de/, 'de'); // Handle DeSantis etc.
  
  return PRESS_PAGE_PATTERNS
    .filter(p => p.chamber === chamber)
    .map(p => p.pattern.replace('{lastName}', normalizedName));
}

// Deduplicate press releases by URL, title, and content hash
export function deduplicateReleases(releases: Statement[]): Statement[] {
  const seen = new Map<string, Statement>();
  
  for (const release of releases) {
    // Create dedup key from URL, title, and date
    const key = `${release.sourceUrl}|${release.title}|${release.publishedAt}`;
    
    // Also create content hash if we have full text
    const contentKey = release.fullText 
      ? simpleHash(release.fullText.substring(0, 500))
      : null;
    
    // Check if we've seen this before
    if (!seen.has(key) && (!contentKey || !seen.has(contentKey))) {
      seen.set(key, release);
      if (contentKey) seen.set(contentKey, release);
    }
  }
  
  // Return unique releases
  return Array.from(new Map([...seen.entries()].map(([k, v]) => [v.id, v])).values());
}

// Simple hash for content comparison
function simpleHash(text: string): string {
  let hash = 0;
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `content-${hash.toString(36)}`;
}

// Tag a press release with tech topics
export function tagPressRelease(
  title: string,
  content: string
): { topics: TechTopic[]; matchedSnippet: string; isTechRelated: boolean } {
  const combinedText = `${title} ${content}`;
  const result = detectTopics(combinedText);
  
  return {
    topics: result.topics,
    matchedSnippet: result.matchedSnippet,
    isTechRelated: result.topics.length > 0
  };
}

// Create a statement from a press release
export function createStatementFromPressRelease(
  bioguideId: string,
  title: string,
  content: string,
  sourceUrl: string,
  publishedAt: string
): Statement | null {
  const { topics, matchedSnippet, isTechRelated } = tagPressRelease(title, content);
  
  // Only include tech-related press releases
  if (!isTechRelated) return null;
  
  // Extract first 300 chars as excerpt
  const excerpt = content.length > 300 
    ? content.substring(0, 297) + '...'
    : content;
  
  // Extract keywords from content
  const keywords = extractKeywords(content);
  
  // Extract entities (companies, agencies, etc.)
  const entities = extractEntities(content);
  
  return {
    id: `pr-${bioguideId}-${simpleHash(sourceUrl)}`,
    bioguideId,
    title,
    excerpt,
    fullText: content,
    sourceUrl,
    sourceType: 'press_release',
    publishedAt,
    topics,
    tone: undefined, // Would need NLP to determine
    toneConfidence: undefined,
    framings: undefined,
    keywords,
    entities,
    matchedSnippet,
    lastUpdated: new Date().toISOString()
  };
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const textLower = text.toLowerCase();
  
  // Check for tech topic keywords
  for (const topic of TECH_TOPICS) {
    for (const keyword of topic.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        keywords.push(keyword);
      }
    }
  }
  
  return [...new Set(keywords)].slice(0, 10);
}

// Extract entities (companies, agencies, etc.)
function extractEntities(text: string): string[] {
  const entities: string[] = [];
  
  const commonEntities = [
    'Google', 'Meta', 'Facebook', 'Apple', 'Amazon', 'Microsoft', 'OpenAI',
    'TikTok', 'ByteDance', 'Twitter', 'X Corp',
    'FTC', 'FCC', 'DOJ', 'SEC', 'CISA', 'NSA', 'FBI',
    'Congress', 'White House', 'Supreme Court',
    'CHIPS Act', 'CHIPS and Science Act'
  ];
  
  for (const entity of commonEntities) {
    if (text.includes(entity)) {
      entities.push(entity);
    }
  }
  
  return [...new Set(entities)].slice(0, 8);
}

// Get coverage summary
export function getCoverageSummary(coverages: PressReleaseCoverage[]): {
  total: number;
  available: number;
  unavailable: number;
  error: number;
  notChecked: number;
  byParty: Record<string, { total: number; available: number }>;
  byChamber: Record<string, { total: number; available: number }>;
} {
  const result = {
    total: coverages.length,
    available: 0,
    unavailable: 0,
    error: 0,
    notChecked: 0,
    byParty: {} as Record<string, { total: number; available: number }>,
    byChamber: {} as Record<string, { total: number; available: number }>
  };
  
  for (const c of coverages) {
    // Count by status
    switch (c.status) {
      case 'available': result.available++; break;
      case 'unavailable': result.unavailable++; break;
      case 'error': result.error++; break;
      case 'not_checked': result.notChecked++; break;
    }
    
    // Count by party
    if (!result.byParty[c.party]) {
      result.byParty[c.party] = { total: 0, available: 0 };
    }
    result.byParty[c.party].total++;
    if (c.status === 'available') result.byParty[c.party].available++;
    
    // Count by chamber
    if (!result.byChamber[c.chamber]) {
      result.byChamber[c.chamber] = { total: 0, available: 0 };
    }
    result.byChamber[c.chamber].total++;
    if (c.status === 'available') result.byChamber[c.chamber].available++;
  }
  
  return result;
}

// Note: Actual fetching of press releases requires server-side implementation
// This is because:
// 1. We need to make HTTP requests to .gov sites
// 2. We need to parse HTML (each site has different structure)
// 3. We need to respect rate limits
// 4. We need to handle errors gracefully
// 
// The API route /api/capitol-pulse/press-releases handles this

