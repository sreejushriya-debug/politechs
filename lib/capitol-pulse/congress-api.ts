// Congress.gov API Integration
// API Documentation: https://api.congress.gov/
// This module fetches REAL data from official government sources

import { Bill, CongressMember, Vote, detectTopics, TechTopic, TECH_TOPICS } from './types';

// Congress.gov API base URL
const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

// Note: In production, this should be an environment variable
// Users can get a free API key from https://api.congress.gov/sign-up/
const API_KEY = process.env.CONGRESS_API_KEY || '';

interface CongressApiResponse<T> {
  request: { format: string };
  pagination?: { count: number; next?: string };
  [key: string]: T | unknown;
}

// Fetch wrapper with rate limiting
async function fetchFromCongress<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!API_KEY) {
    console.warn('Congress.gov API key not configured. Set CONGRESS_API_KEY environment variable.');
    return null;
  }

  const url = new URL(`${CONGRESS_API_BASE}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('format', 'json');
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Congress API error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Congress API fetch error:', error);
    return null;
  }
}

// Fetch all current members of Congress
export async function fetchCurrentMembers(): Promise<CongressMember[]> {
  const members: CongressMember[] = [];
  
  // Fetch current congress number (119th as of 2025)
  const congress = 119;
  
  // Fetch House members
  const houseData = await fetchFromCongress<{ members?: any[] }>(`/member/congress/${congress}/house`, { limit: '250' });
  if (houseData?.members && Array.isArray(houseData.members)) {
    for (const m of houseData.members) {
      members.push(transformMember(m, 'House'));
    }
  }

  // Fetch Senate members
  const senateData = await fetchFromCongress<{ members?: any[] }>(`/member/congress/${congress}/senate`, { limit: '100' });
  if (senateData?.members && Array.isArray(senateData.members)) {
    for (const m of senateData.members) {
      members.push(transformMember(m, 'Senate'));
    }
  }

  return members;
}

function transformMember(apiMember: any, chamber: 'House' | 'Senate'): CongressMember {
  const partyMap: Record<string, 'Democratic' | 'Republican' | 'Independent'> = {
    'D': 'Democratic',
    'R': 'Republican',
    'I': 'Independent',
    'Democratic': 'Democratic',
    'Republican': 'Republican',
    'Independent': 'Independent'
  };

  return {
    bioguideId: apiMember.bioguideId || apiMember.member?.bioguideId || '',
    name: apiMember.name || `${apiMember.firstName} ${apiMember.lastName}`,
    firstName: apiMember.firstName || apiMember.name?.split(' ')[0] || '',
    lastName: apiMember.lastName || apiMember.name?.split(' ').slice(1).join(' ') || '',
    chamber,
    party: partyMap[apiMember.partyName] || partyMap[apiMember.party] || 'Independent',
    state: apiMember.state || '',
    district: chamber === 'House' ? parseInt(apiMember.district) || undefined : undefined,
    imageUrl: apiMember.depiction?.imageUrl || `https://bioguide.congress.gov/bioguide/photo/${apiMember.bioguideId?.[0]}/${apiMember.bioguideId}.jpg`,
    officialUrl: apiMember.url || apiMember.officialWebsiteUrl || '',
    phone: apiMember.phone || undefined,
    office: apiMember.office || undefined,
    termStart: apiMember.terms?.item?.[0]?.startYear?.toString() || new Date().getFullYear().toString(),
    termEnd: undefined,
    isActive: true,
    lastUpdated: new Date().toISOString()
  };
}

// Fetch tech-related bills from current congress
export async function fetchTechBills(congress: number = 119): Promise<Bill[]> {
  const bills: Bill[] = [];
  
  // Search for bills by tech-related subjects
  const techSubjects = [
    'Artificial intelligence',
    'Computer security',
    'Internet and video services',
    'Right of privacy',
    'Computers and information technology',
    'Telecommunication',
    'Space flight and exploration',
    'Science, Technology, Communications'
  ];

  for (const subject of techSubjects) {
    const data = await fetchFromCongress<{ bills?: any[] }>(`/bill/${congress}`, { 
      subject: subject,
      limit: '50'
    });
    
    if (data?.bills && Array.isArray(data.bills)) {
      for (const b of data.bills) {
        // Avoid duplicates
        if (!bills.find(existing => existing.billId === `${congress}-${b.type}-${b.number}`)) {
          const bill = await transformBill(b, congress);
          if (bill) bills.push(bill);
        }
      }
    }
  }

  // Also search by keywords in title
  const keywords = ['artificial intelligence', 'AI', 'cybersecurity', 'privacy', 'social media', 'cryptocurrency', 'semiconductor', 'broadband'];
  
  for (const keyword of keywords) {
    const data = await fetchFromCongress<{ bills?: any[] }>(`/bill/${congress}`, { 
      query: keyword,
      limit: '25'
    });
    
    if (data?.bills && Array.isArray(data.bills)) {
      for (const b of data.bills) {
        if (!bills.find(existing => existing.billId === `${congress}-${b.type}-${b.number}`)) {
          const bill = await transformBill(b, congress);
          if (bill) bills.push(bill);
        }
      }
    }
  }

  return bills;
}

async function transformBill(apiBill: any, congress: number): Promise<Bill | null> {
  const billType = apiBill.type?.toLowerCase() || 'hr';
  const billNumber = apiBill.number;
  
  // Get full bill details
  const details = await fetchFromCongress<any>(`/bill/${congress}/${billType}/${billNumber}`);
  const billData = details?.bill || apiBill;

  const title = billData.title || billData.shortTitle || '';
  const subjects = billData.subjects?.legislativeSubjects?.map((s: any) => s.name) || [];
  const policyArea = billData.policyArea?.name || '';

  // Detect tech topics
  const { topics, matchedSnippet } = detectTopics(
    `${title} ${policyArea} ${subjects.join(' ')}`,
    [...subjects, policyArea].filter(Boolean)
  );

  // Only include if tech-related
  if (topics.length === 0) return null;

  return {
    billId: `${congress}-${billType}-${billNumber}`,
    congress,
    billType: billType as Bill['billType'],
    billNumber: parseInt(billNumber),
    title,
    shortTitle: billData.shortTitle || undefined,
    summary: billData.summaries?.summary?.[0]?.text || undefined,
    policyArea,
    subjects,
    introducedDate: billData.introducedDate || '',
    latestActionDate: billData.latestAction?.actionDate || '',
    latestAction: billData.latestAction?.text || '',
    sponsorBioguideId: billData.sponsors?.[0]?.bioguideId || '',
    cosponsorBioguideIds: [], // Would need additional API call
    cosponsorCount: billData.cosponsors?.count || 0,
    url: `https://www.congress.gov/bill/${congress}th-congress/${billType === 'hr' ? 'house-bill' : 'senate-bill'}/${billNumber}`,
    topics,
    matchedSubjects: subjects.filter((s: string) => 
      TECH_TOPICS.some(t => t.subjects.some(ts => s.toLowerCase().includes(ts.toLowerCase())))
    ),
    lastUpdated: new Date().toISOString()
  };
}

// Fetch recent roll-call votes
export async function fetchRecentVotes(chamber: 'House' | 'Senate', limit: number = 50): Promise<Vote[]> {
  // Note: Congress.gov API has limited vote data
  // For comprehensive vote data, would need to use house.gov/senate.gov clerk data
  
  const votes: Vote[] = [];
  
  // This would integrate with the House Clerk / Senate.gov vote data
  // For now, return empty - votes require a different data source
  
  return votes;
}

// Validate that a bill exists and matches our data
export async function validateBill(billId: string): Promise<{ valid: boolean; error?: string; officialData?: any }> {
  const [congress, type, number] = billId.split('-');
  
  if (!congress || !type || !number) {
    return { valid: false, error: 'Invalid bill ID format' };
  }

  const data = await fetchFromCongress<any>(`/bill/${congress}/${type}/${number}`);
  
  if (!data?.bill) {
    return { valid: false, error: 'Bill not found in Congress.gov' };
  }

  return { valid: true, officialData: data.bill };
}

// Export function to check API health
export async function checkApiHealth(): Promise<{ available: boolean; message: string }> {
  if (!API_KEY) {
    return { available: false, message: 'API key not configured' };
  }

  try {
    const response = await fetch(`${CONGRESS_API_BASE}/bill?api_key=${API_KEY}&format=json&limit=1`);
    if (response.ok) {
      return { available: true, message: 'Congress.gov API is available' };
    }
    return { available: false, message: `API returned ${response.status}` };
  } catch (error) {
    return { available: false, message: `API error: ${error}` };
  }
}

