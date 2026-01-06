// Comprehensive search API for Capitol Pulse
// Searches across bills, statements (words), and votes (actions)
import { NextResponse } from 'next/server';
import { TechTopic, Bill, Statement, Vote, CongressMember, TECH_TOPICS } from '@/lib/capitol-pulse/types';

export const dynamic = 'force-dynamic';

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';
const API_KEY = process.env.CONGRESS_API_KEY || '';

// Search result types
interface SearchResult {
  id: string;
  type: 'bill' | 'statement' | 'vote';
  title: string;
  date: string;
  snippet: string;
  topics: TechTopic[];
  member?: { name: string; bioguideId: string; party: string; state: string };
  sourceUrl: string;
  sourceType?: string;
  matchedTerms: string[];
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  filters: Record<string, string>;
  hasMore: boolean;
}

// Parse search request
function parseSearchParams(url: URL) {
  return {
    q: url.searchParams.get('q') || '',
    type: url.searchParams.get('type') || 'all', // all, bills, statements, votes
    topic: url.searchParams.get('topic') as TechTopic | null,
    dateFrom: url.searchParams.get('dateFrom'),
    dateTo: url.searchParams.get('dateTo'),
    chamber: url.searchParams.get('chamber') as 'House' | 'Senate' | null,
    party: url.searchParams.get('party') as 'Democratic' | 'Republican' | 'Independent' | null,
    member: url.searchParams.get('member'), // bioguideId
    sourceType: url.searchParams.get('sourceType') as 'press_release' | 'congressional_record' | null,
    offset: parseInt(url.searchParams.get('offset') || '0'),
    limit: parseInt(url.searchParams.get('limit') || '20')
  };
}

// Tech keywords for filtering bills
const TECH_KEYWORDS = [
  'artificial intelligence', 'ai ', ' ai', 'machine learning', 'algorithm',
  'cybersecurity', 'cyber', 'data breach', 'ransomware', 'hacking',
  'privacy', 'surveillance', 'fisa', 'data protection',
  'social media', 'section 230', 'content moderation', 'online safety', 'tiktok',
  'antitrust', 'big tech', 'platform', 'monopoly',
  'broadband', 'telecommunications', 'spectrum', '5g', 'net neutrality',
  'cryptocurrency', 'crypto', 'bitcoin', 'blockchain', 'digital asset',
  'semiconductor', 'chips', 'microchip', 'supply chain',
  'space', 'nasa', 'satellite', 'aerospace', 'commercial space',
  'technology', 'digital', 'internet', 'online', 'software', 'computer'
];

// Check if title is tech-related
function isTechRelated(title: string): boolean {
  const titleLower = title.toLowerCase();
  return TECH_KEYWORDS.some(keyword => titleLower.includes(keyword.toLowerCase()));
}

// Search bills from Congress.gov
async function searchBills(query: string, params: ReturnType<typeof parseSearchParams>): Promise<SearchResult[]> {
  if (!API_KEY) {
    console.log('[Search API] No API key configured');
    return [];
  }
  
  try {
    // Fetch recent bills
    const billsUrl = `${CONGRESS_API_BASE}/bill/119?api_key=${API_KEY}&format=json&limit=250&sort=updateDate+desc`;
    console.log('[Search API] Fetching bills from Congress.gov');
    const res = await fetch(billsUrl, { next: { revalidate: 300 } }); // Cache for 5 min
    
    if (!res.ok) {
      console.error('[Search API] Congress.gov returned:', res.status);
      return [];
    }
    
    const data = await res.json();
    const bills = data.bills || [];
    console.log('[Search API] Got', bills.length, 'bills from Congress.gov');
    
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();
    
    for (const bill of bills) {
      const title = bill.title || '';
      const titleLower = title.toLowerCase();
      
      // Only include tech-related bills
      if (!isTechRelated(title)) continue;
      
      // Match query in title (if query provided)
      if (query && !titleLower.includes(queryLower)) continue;
      
      // Topic filter
      const { topics } = detectTopicsFromTitle(title);
      if (params.topic && !topics.includes(params.topic)) continue;
      
      // Date filter
      const billDate = bill.latestAction?.actionDate || bill.introducedDate || '';
      if (params.dateFrom && billDate && billDate < params.dateFrom) continue;
      if (params.dateTo && billDate && billDate > params.dateTo) continue;
      
      const billType = (bill.type || 'hr').toLowerCase();
      const billNumber = bill.number;
      
      results.push({
        id: `119-${billType}-${billNumber}`,
        type: 'bill',
        title,
        date: billDate,
        snippet: bill.latestAction?.text || 'No action yet',
        topics: topics.length > 0 ? topics : ['AI & Automation'],
        sourceUrl: `https://www.congress.gov/bill/119th-congress/${getBillTypeSlug(billType)}/${billNumber}`,
        matchedTerms: query ? [query] : []
      });
    }
    
    console.log('[Search API] Returning', results.length, 'tech-related bills');
    return results;
  } catch (error) {
    console.error('[Search API] Bill search error:', error);
    return [];
  }
}

// Search statements (Congressional Record + Press Releases)
async function searchStatements(query: string, params: ReturnType<typeof parseSearchParams>): Promise<SearchResult[]> {
  try {
    // Fetch real Congressional Record statements
    const { getCongressionalRecordStatements } = await import('@/lib/capitol-pulse/congressional-record');
    const statements = await getCongressionalRecordStatements();
    
    console.log('[Search API] Got', statements.length, 'Congressional Record statements');
    
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();
    
    for (const stmt of statements) {
      // Query filter
      if (query) {
        const titleMatch = stmt.title.toLowerCase().includes(queryLower);
        const excerptMatch = stmt.excerpt.toLowerCase().includes(queryLower);
        if (!titleMatch && !excerptMatch) continue;
      }
      
      // Topic filter
      if (params.topic && !stmt.topics.includes(params.topic)) continue;
      
      // Source type filter
      if (params.sourceType && stmt.sourceType !== params.sourceType) continue;
      
      // Date filter
      if (params.dateFrom && stmt.publishedAt < params.dateFrom) continue;
      if (params.dateTo && stmt.publishedAt > params.dateTo) continue;
      
      // Member filter
      if (params.member && stmt.bioguideId !== params.member) continue;
      
      results.push({
        id: stmt.id,
        type: 'statement',
        title: stmt.title,
        date: stmt.publishedAt,
        snippet: stmt.excerpt,
        topics: stmt.topics,
        member: stmt.bioguideId ? {
          name: stmt.bioguideId,
          bioguideId: stmt.bioguideId,
          party: 'Unknown',
          state: ''
        } : undefined,
        sourceUrl: stmt.sourceUrl,
        sourceType: stmt.sourceType,
        matchedTerms: query ? [query] : []
      });
    }
    
    console.log('[Search API] Returning', results.length, 'statements after filtering');
    return results;
  } catch (error) {
    console.error('[Search API] Statement search error:', error);
    return [];
  }
}

// Search votes
async function searchVotes(query: string, params: ReturnType<typeof parseSearchParams>): Promise<SearchResult[]> {
  // Vote data requires House Clerk and Senate.gov integration
  // For now, return empty
  
  return [];
}

// Helper to detect topics from title
function detectTopicsFromTitle(title: string): { topics: TechTopic[]; matchedSnippet: string } {
  const titleLower = title.toLowerCase();
  const matched: TechTopic[] = [];
  let matchedSnippet = '';
  
  for (const topic of TECH_TOPICS) {
    for (const keyword of topic.keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        if (!matched.includes(topic.id)) {
          matched.push(topic.id);
          matchedSnippet += `"${keyword}"; `;
        }
        break;
      }
    }
  }
  
  return { topics: matched.slice(0, 3), matchedSnippet };
}

function getBillTypeSlug(type: string): string {
  const slugs: Record<string, string> = {
    hr: 'house-bill',
    s: 'senate-bill',
    hjres: 'house-joint-resolution',
    sjres: 'senate-joint-resolution'
  };
  return slugs[type] || type;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = parseSearchParams(url);
  
  let results: SearchResult[] = [];
  
  // Search based on type filter
  const searchPromises: Promise<SearchResult[]>[] = [];
  
  if (params.type === 'all' || params.type === 'bills') {
    searchPromises.push(searchBills(params.q, params));
  }
  
  if (params.type === 'all' || params.type === 'statements') {
    searchPromises.push(searchStatements(params.q, params));
  }
  
  if (params.type === 'all' || params.type === 'votes') {
    searchPromises.push(searchVotes(params.q, params));
  }
  
  const searchResults = await Promise.all(searchPromises);
  results = searchResults.flat();
  
  // Sort by date descending
  results.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Apply pagination
  const paginatedResults = results.slice(params.offset, params.offset + params.limit);
  
  return NextResponse.json({
    results: paginatedResults,
    total: results.length,
    query: params.q,
    filters: {
      type: params.type,
      topic: params.topic || 'all',
      dateFrom: params.dateFrom || '',
      dateTo: params.dateTo || '',
      chamber: params.chamber || 'all',
      party: params.party || 'all',
      member: params.member || '',
      sourceType: params.sourceType || 'all'
    },
    hasMore: params.offset + params.limit < results.length,
    dataSources: {
      bills: 'Congress.gov API',
      statements: 'Congress.gov (Bill Summaries + Hearings)',
      votes: 'Pending integration (House Clerk + Senate.gov)'
    }
  } as SearchResponse & { dataSources: Record<string, string> });
}

