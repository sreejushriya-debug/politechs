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
  let offset = 0;
  const limit = 250;
  
  // Fetch all current members (paginated)
  while (true) {
    const data = await fetchFromCongress<{ members?: any[]; pagination?: { count: number } }>('/member', { 
      currentMember: 'true',
      limit: String(limit),
      offset: String(offset)
    });
    
    if (data?.members && Array.isArray(data.members)) {
      for (const m of data.members) {
        // Determine chamber from terms
        const chamber = m.terms?.item?.[0]?.chamber?.includes('Senate') ? 'Senate' : 'House';
        members.push(transformMember(m, chamber));
      }
      
      // Check if we've fetched all members
      if (data.members.length < limit) break;
      offset += limit;
      
      // Safety limit
      if (offset > 600) break;
    } else {
      break;
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

  // Parse name - API returns "LastName, FirstName MiddleName" format
  const nameParts = (apiMember.name || '').split(', ');
  const lastName = nameParts[0] || '';
  const firstNameParts = (nameParts[1] || '').split(' ');
  const firstName = firstNameParts[0] || '';
  const fullName = nameParts.length > 1 ? `${firstName} ${lastName}` : apiMember.name || '';

  return {
    bioguideId: apiMember.bioguideId || '',
    name: fullName,
    firstName: firstName,
    lastName: lastName,
    chamber,
    party: partyMap[apiMember.partyName] || 'Independent',
    state: apiMember.state || '',
    district: chamber === 'House' ? (apiMember.district || undefined) : undefined,
    imageUrl: apiMember.depiction?.imageUrl || `https://bioguide.congress.gov/bioguide/photo/${apiMember.bioguideId?.[0]}/${apiMember.bioguideId}.jpg`,
    officialUrl: `https://bioguide.congress.gov/search/bio/${apiMember.bioguideId}`,
    phone: undefined,
    office: undefined,
    termStart: apiMember.terms?.item?.[0]?.startYear?.toString() || new Date().getFullYear().toString(),
    termEnd: undefined,
    isActive: true,
    lastUpdated: apiMember.updateDate || new Date().toISOString()
  };
}

// Fetch tech-related bills from current congress with sponsor details
export async function fetchTechBills(congress: number = 119): Promise<Bill[]> {
  const techBillsBasic: any[] = [];
  
  // Fetch recent bills and filter for tech-related content
  let offset = 0;
  const limit = 250;
  const maxBills = 2000;
  
  console.log('[Bills API] Starting bill fetch from Congress.gov');
  
  while (offset < maxBills) {
    const data = await fetchFromCongress<{ bills?: any[] }>(`/bill/${congress}`, { 
      limit: String(limit),
      offset: String(offset),
      sort: 'updateDate+desc'
    });
    
    if (!data?.bills || !Array.isArray(data.bills) || data.bills.length === 0) {
      break;
    }
    
    for (const b of data.bills) {
      const title = (b.title || '').toLowerCase();
      
      // Check if title contains tech-related keywords
      const isTechRelated = TECH_KEYWORDS.some(keyword => title.includes(keyword.toLowerCase()));
      
      if (isTechRelated) {
        const billId = `${congress}-${b.type?.toLowerCase()}-${b.number}`;
        if (!techBillsBasic.find(existing => `${congress}-${existing.type?.toLowerCase()}-${existing.number}` === billId)) {
          techBillsBasic.push(b);
        }
      }
    }
    
    offset += limit;
    
    // If we have enough tech bills, stop early
    if (techBillsBasic.length >= 80) break;
  }
  
  console.log('[Bills API] Found', techBillsBasic.length, 'tech-related bills');
  
  // Now fetch sponsor details for each tech bill (limit to prevent rate limiting)
  const bills: Bill[] = [];
  const billsToFetchDetails = techBillsBasic.slice(0, 50); // Limit detail fetches
  
  console.log('[Bills API] Fetching sponsor details for', billsToFetchDetails.length, 'bills');
  
  for (const b of billsToFetchDetails) {
    try {
      const billType = (b.type || 'hr').toLowerCase();
      const billNumber = b.number;
      
      // Fetch individual bill to get sponsor info
      const detailData = await fetchFromCongress<{ bill?: any }>(
        `/bill/${congress}/${billType}/${billNumber}`
      );
      
      if (detailData?.bill) {
        const bill = transformBillWithDetails(detailData.bill, congress);
        if (bill) bills.push(bill);
      } else {
        // Fallback to basic info if detail fetch fails
        const bill = transformBillSimple(b, congress);
        if (bill) bills.push(bill);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (e) {
      // Fallback to basic info
      const bill = transformBillSimple(b, congress);
      if (bill) bills.push(bill);
    }
  }
  
  // Add remaining bills without sponsor details
  for (const b of techBillsBasic.slice(50)) {
    const bill = transformBillSimple(b, congress);
    if (bill) bills.push(bill);
  }
  
  console.log('[Bills API] Returning', bills.length, 'bills with', bills.filter(b => b.sponsorBioguideId).length, 'having sponsor info');
  
  return bills;
}

// Transform bill with full details including sponsors
function transformBillWithDetails(apiBill: any, congress: number): Bill | null {
  const billType = (apiBill.type || 'hr').toLowerCase();
  const billNumber = apiBill.number;
  
  if (!billNumber) return null;
  
  const title = apiBill.title || '';
  const { topics, matchedSnippet } = detectTopics(title, []);
  
  // Extract sponsor from detailed response
  let sponsorBioguideId = '';
  if (apiBill.sponsors && Array.isArray(apiBill.sponsors) && apiBill.sponsors.length > 0) {
    sponsorBioguideId = apiBill.sponsors[0]?.bioguideId || '';
  }

  return {
    billId: `${congress}-${billType}-${billNumber}`,
    congress,
    billType: billType as Bill['billType'],
    billNumber: parseInt(billNumber),
    title,
    shortTitle: undefined,
    summary: undefined,
    policyArea: apiBill.policyArea?.name || '',
    subjects: [],
    introducedDate: apiBill.introducedDate || apiBill.latestAction?.actionDate || '',
    latestActionDate: apiBill.latestAction?.actionDate || '',
    latestAction: apiBill.latestAction?.text || '',
    sponsorBioguideId,
    cosponsorBioguideIds: [],
    cosponsorCount: apiBill.cosponsors?.count || 0,
    url: `https://www.congress.gov/bill/${congress}th-congress/${billType === 'hr' ? 'house-bill' : billType === 's' ? 'senate-bill' : billType}/${billNumber}`,
    topics: topics.length > 0 ? topics : ['AI & Automation'],
    matchedSubjects: [],
    lastUpdated: apiBill.updateDate || new Date().toISOString()
  };
}

// Keywords to identify tech-related bills
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

// Simple bill transform for list view
function transformBillSimple(apiBill: any, congress: number): Bill | null {
  const billType = (apiBill.type || 'hr').toLowerCase();
  const billNumber = apiBill.number;
  
  if (!billNumber) return null;
  
  const title = apiBill.title || '';
  const { topics, matchedSnippet } = detectTopics(title, []);
  
  // Extract sponsor info from API response
  // The API returns sponsors in different formats depending on endpoint
  let sponsorBioguideId = '';
  const cosponsorBioguideIds: string[] = [];
  
  // Try to get sponsor from various API response formats
  if (apiBill.sponsors && Array.isArray(apiBill.sponsors)) {
    const primarySponsor = apiBill.sponsors.find((s: any) => s.isByRequest !== 'true') || apiBill.sponsors[0];
    sponsorBioguideId = primarySponsor?.bioguideId || '';
  } else if (apiBill.sponsor?.bioguideId) {
    sponsorBioguideId = apiBill.sponsor.bioguideId;
  }

  return {
    billId: `${congress}-${billType}-${billNumber}`,
    congress,
    billType: billType as Bill['billType'],
    billNumber: parseInt(billNumber),
    title,
    shortTitle: undefined,
    summary: undefined,
    policyArea: '',
    subjects: [],
    introducedDate: apiBill.latestAction?.actionDate || apiBill.introducedDate || '',
    latestActionDate: apiBill.latestAction?.actionDate || '',
    latestAction: apiBill.latestAction?.text || '',
    sponsorBioguideId,
    cosponsorBioguideIds,
    cosponsorCount: apiBill.cosponsors || 0,
    url: `https://www.congress.gov/bill/${congress}th-congress/${billType === 'hr' ? 'house-bill' : billType === 's' ? 'senate-bill' : billType}/${billNumber}`,
    topics: topics.length > 0 ? topics : ['AI & Automation'], // Default topic for tech bills
    matchedSubjects: [],
    lastUpdated: apiBill.updateDate || new Date().toISOString()
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

