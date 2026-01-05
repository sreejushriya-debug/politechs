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
import { fetchCurrentMembers, fetchTechBills, checkApiHealth } from './congress-api';

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

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

function isCacheValid<T>(cache: DataCache<T> | null): boolean {
  if (!cache) return false;
  const age = Date.now() - new Date(cache.lastUpdated).getTime();
  return age < CACHE_DURATION;
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

  // Try to fetch from Congress API
  const apiHealth = await checkApiHealth();
  
  if (apiHealth.available) {
    try {
      const members = await fetchCurrentMembers();
      if (members.length > 0) {
        membersCache = {
          data: members,
          lastUpdated: new Date().toISOString(),
          source: 'Congress.gov API'
        };
        return { members, lastUpdated: membersCache.lastUpdated, source: membersCache.source };
      }
    } catch (error) {
      console.error('Failed to fetch members from API:', error);
    }
  }

  // Return empty with clear messaging - NO FAKE DATA
  return {
    members: [],
    lastUpdated: new Date().toISOString(),
    source: 'No data available - API key required'
  };
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

  const apiHealth = await checkApiHealth();
  
  if (apiHealth.available) {
    try {
      const bills = await fetchTechBills();
      if (bills.length > 0) {
        billsCache = {
          data: bills,
          lastUpdated: new Date().toISOString(),
          source: 'Congress.gov API'
        };
        return { bills, lastUpdated: billsCache.lastUpdated, source: billsCache.source };
      }
    } catch (error) {
      console.error('Failed to fetch bills from API:', error);
    }
  }

  return {
    bills: [],
    lastUpdated: new Date().toISOString(),
    source: 'No data available - API key required'
  };
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

  // Congressional Record integration would go here
  // This requires the Government Publishing Office API or congress.gov
  // For now, return empty with clear messaging
  
  return {
    statements: [],
    lastUpdated: new Date().toISOString(),
    source: 'Congressional Record integration pending'
  };
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
    checkApiHealth(),
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

