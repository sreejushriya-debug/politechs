// Capitol Pulse Data Store
// This module provides access to congressional data with validation
// All data is sourced from official government APIs or is clearly marked as unavailable

import { 
  CongressMember, 
  Bill, 
  Vote, 
  Statement, 
  CoverageMetrics,
  TechTopic,
  TECH_TOPICS,
  IngestionRun
} from './types';

// Cache for data with timestamps
interface DataCache<T> {
  data: T;
  lastUpdated: string;
  source: string;
}

let membersCache: DataCache<CongressMember[]> | null = null;
let billsCache: DataCache<Bill[]> | null = null;
let statementsCache: DataCache<Statement[]> | null = null;
let votesCache: DataCache<Vote[]> | null = null;

// Cache duration in milliseconds (5 minutes for client, longer on server)
const CACHE_DURATION = 5 * 60 * 1000;

function isCacheValid<T>(cache: DataCache<T> | null): boolean {
  if (!cache) return false;
  const age = Date.now() - new Date(cache.lastUpdated).getTime();
  return age < CACHE_DURATION;
}

// Determine base URL for API calls (works in both browser and SSR)
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL
    return '';
  }
  // Server: use absolute URL
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

// Get all current members with caching
export async function getMembers(): Promise<{ members: CongressMember[]; lastUpdated: string; source: string }> {
  if (isCacheValid(membersCache)) {
    return { 
      members: membersCache!.data, 
      lastUpdated: membersCache!.lastUpdated,
      source: membersCache!.source
    };
  }

  try {
    // Fetch from our API route (which has access to the API key)
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/capitol-pulse/members`, {
      cache: 'no-store' // Don't cache in browser, we handle our own caching
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.members && data.members.length > 0) {
      membersCache = {
        data: data.members,
        lastUpdated: data.lastUpdated,
        source: data.source
      };
      return { members: data.members, lastUpdated: data.lastUpdated, source: data.source };
    }
    
    return {
      members: [],
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      source: data.source || 'No data available'
    };
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return {
      members: [],
      lastUpdated: new Date().toISOString(),
      source: 'Error fetching data - check API configuration'
    };
  }
}

// Get tech-related bills
export async function getBills(): Promise<{ bills: Bill[]; lastUpdated: string; source: string }> {
  if (isCacheValid(billsCache)) {
    return { 
      bills: billsCache!.data, 
      lastUpdated: billsCache!.lastUpdated,
      source: billsCache!.source
    };
  }

  try {
    // Fetch from our API route (which has access to the API key)
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/capitol-pulse/bills`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.bills && data.bills.length > 0) {
      billsCache = {
        data: data.bills,
        lastUpdated: data.lastUpdated,
        source: data.source
      };
      return { bills: data.bills, lastUpdated: data.lastUpdated, source: data.source };
    }
    
    return {
      bills: [],
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      source: data.source || 'No data available'
    };
  } catch (error) {
    console.error('Failed to fetch bills:', error);
    return {
      bills: [],
      lastUpdated: new Date().toISOString(),
      source: 'Error fetching data - check API configuration'
    };
  }
}

// Get statements - Congressional Record and press releases
export async function getStatements(): Promise<{ statements: Statement[]; lastUpdated: string; source: string }> {
  if (isCacheValid(statementsCache)) {
    return { 
      statements: statementsCache!.data, 
      lastUpdated: statementsCache!.lastUpdated,
      source: statementsCache!.source
    };
  }

  // Fetch real statements from Congressional Record
  try {
    const { getCongressionalRecordStatements } = await import('./congressional-record');
    const statements = await getCongressionalRecordStatements();
    
    if (statements.length > 0) {
      statementsCache = {
        data: statements,
        lastUpdated: new Date().toISOString(),
        source: 'Congressional Record (Congress.gov)'
      };
      
      return {
        statements,
        lastUpdated: new Date().toISOString(),
        source: 'Congressional Record (Congress.gov)'
      };
    }
    
    // If no statements from CR, return empty with clear message
    return {
      statements: [],
      lastUpdated: new Date().toISOString(),
      source: 'No tech-related Congressional Record entries found'
    };
  } catch (error) {
    console.error('Failed to fetch Congressional Record:', error);
    return {
      statements: [],
      lastUpdated: new Date().toISOString(),
      source: 'Congressional Record fetch failed - check API key'
    };
  }
}

// Get votes
export async function getVotes(): Promise<{ votes: Vote[]; lastUpdated: string; source: string }> {
  if (isCacheValid(votesCache)) {
    return { 
      votes: votesCache!.data, 
      lastUpdated: votesCache!.lastUpdated,
      source: votesCache!.source
    };
  }

  // Vote data from clerk.house.gov / senate.gov would go here
  return {
    votes: [],
    lastUpdated: new Date().toISOString(),
    source: 'Vote data integration pending'
  };
}

// Get member by bioguide ID
export async function getMemberById(bioguideId: string): Promise<CongressMember | null> {
  const { members } = await getMembers();
  return members.find(m => m.bioguideId === bioguideId) || null;
}

// Get bills by topic
export async function getBillsByTopic(topic: TechTopic): Promise<Bill[]> {
  const { bills } = await getBills();
  return bills.filter(b => b.topics.includes(topic));
}

// Get statements by member
export async function getStatementsByMember(bioguideId: string): Promise<Statement[]> {
  const { statements } = await getStatements();
  return statements.filter(s => s.bioguideId === bioguideId);
}

// Get comprehensive coverage metrics
export async function getCoverageMetrics(): Promise<CoverageMetrics> {
  const [membersData, billsData, statementsData, votesData] = await Promise.all([
    getMembers(),
    getBills(),
    getStatements(),
    getVotes()
  ]);

  const members = membersData.members;
  const bills = billsData.bills;
  const statements = statementsData.statements;
  const votes = votesData.votes;

  // Calculate bills by topic
  const billsByTopic: Record<TechTopic, number> = {} as Record<TechTopic, number>;
  for (const topic of TECH_TOPICS) {
    billsByTopic[topic.id] = bills.filter(b => b.topics.includes(topic.id)).length;
  }

  // Calculate members with statements
  const memberBioguideIds = new Set(members.map(m => m.bioguideId));
  const membersWithStatements = new Set(statements.map(s => s.bioguideId)).size;
  const membersWithBills = new Set(bills.flatMap(b => [b.sponsorBioguideId, ...b.cosponsorBioguideIds])).size;

  return {
    lastUpdated: new Date().toISOString(),
    members: {
      total: members.length,
      house: members.filter(m => m.chamber === 'House').length,
      senate: members.filter(m => m.chamber === 'Senate').length,
      withStatements: membersWithStatements,
      withBills: membersWithBills
    },
    bills: {
      total: bills.length,
      byTopic: billsByTopic
    },
    votes: {
      total: votes.length,
      houseTotal: votes.filter(v => v.chamber === 'House').length,
      senateTotal: votes.filter(v => v.chamber === 'Senate').length
    },
    statements: {
      total: statements.length,
      congressionalRecord: statements.filter(s => s.sourceType === 'congressional_record').length,
      pressReleases: statements.filter(s => s.sourceType === 'press_release').length
    }
  };
}

// Check API health via our API route
async function checkApiHealthViaRoute(): Promise<{ available: boolean; message: string }> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/capitol-pulse/health`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return { available: false, message: `Health check returned ${response.status}` };
    }
    
    const data = await response.json();
    return { available: data.available, message: data.message };
  } catch (error) {
    return { available: false, message: 'Failed to check API health' };
  }
}

// Get data health status
export async function getDataHealth(): Promise<{
  apiAvailable: boolean;
  membersLoaded: number;
  billsLoaded: number;
  statementsLoaded: number;
  votesLoaded: number;
  lastUpdate: string;
  issues: string[];
}> {
  const [apiHealth, membersData, billsData, statementsData, votesData] = await Promise.all([
    checkApiHealthViaRoute(),
    getMembers(),
    getBills(),
    getStatements(),
    getVotes()
  ]);

  const issues: string[] = [];
  
  if (!apiHealth.available) {
    issues.push(`Congress.gov API: ${apiHealth.message}`);
  }
  
  if (membersData.members.length === 0) {
    issues.push('No members loaded - cannot display member profiles');
  } else if (membersData.members.length < 500) {
    issues.push(`Only ${membersData.members.length} members loaded (expected ~535)`);
  }

  if (billsData.bills.length === 0) {
    issues.push('No bills loaded - bill tracker will be empty');
  }

  if (statementsData.statements.length === 0) {
    issues.push('No statements loaded - evidence explorer will be empty');
  }

  return {
    apiAvailable: apiHealth.available,
    membersLoaded: membersData.members.length,
    billsLoaded: billsData.bills.length,
    statementsLoaded: statementsData.statements.length,
    votesLoaded: votesData.votes.length,
    lastUpdate: new Date().toISOString(),
    issues
  };
}

// Clear all caches (for manual refresh)
export function clearCaches(): void {
  membersCache = null;
  billsCache = null;
  statementsCache = null;
  votesCache = null;
}

// Export tech topics for UI
export { TECH_TOPICS };

