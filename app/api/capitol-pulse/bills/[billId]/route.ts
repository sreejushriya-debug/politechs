// API route for fetching a specific bill with full details and explainer
import { NextResponse } from 'next/server';
import { detectTopics, Bill, TECH_TOPICS } from '@/lib/capitol-pulse/types';

export const dynamic = 'force-dynamic';

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';
const API_KEY = process.env.CONGRESS_API_KEY || '';

interface BillExplainer {
  oneSentence: string;
  whatItWouldDo: string[];
  whoItAffects: string[];
  whatChanges: string[];
  keyTerms: { term: string; definition: string }[];
  argumentsFor: string[];
  argumentsAgainst: string[];
  whatToWatch: string;
  sourcesUsed: { title: string; url: string }[];
  disclaimers: string[];
}

// Fetch detailed bill data from Congress.gov
async function fetchBillDetails(congress: string, type: string, number: string) {
  if (!API_KEY) {
    return null;
  }

  try {
    // Fetch main bill data
    const billUrl = `${CONGRESS_API_BASE}/bill/${congress}/${type}/${number}?api_key=${API_KEY}&format=json`;
    const billRes = await fetch(billUrl);
    
    if (!billRes.ok) {
      console.error(`Bill fetch failed: ${billRes.status}`);
      return null;
    }
    
    const billData = await billRes.json();
    const bill = billData.bill;
    
    if (!bill) return null;

    // Fetch summaries
    let summary = '';
    try {
      const summaryUrl = `${CONGRESS_API_BASE}/bill/${congress}/${type}/${number}/summaries?api_key=${API_KEY}&format=json`;
      const summaryRes = await fetch(summaryUrl);
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        const summaries = summaryData.summaries || [];
        // Get most recent summary
        if (summaries.length > 0) {
          summary = summaries[0].text || '';
          // Strip HTML tags
          summary = summary.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        }
      }
    } catch (e) {
      console.error('Summary fetch error:', e);
    }

    // Fetch subjects
    let subjects: string[] = [];
    try {
      const subjectsUrl = `${CONGRESS_API_BASE}/bill/${congress}/${type}/${number}/subjects?api_key=${API_KEY}&format=json`;
      const subjectsRes = await fetch(subjectsUrl);
      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        subjects = (subjectsData.subjects?.legislativeSubjects || []).map((s: any) => s.name);
      }
    } catch (e) {
      console.error('Subjects fetch error:', e);
    }

    // Fetch cosponsors
    let cosponsorBioguideIds: string[] = [];
    let cosponsorCount = 0;
    try {
      const cosponsorsUrl = `${CONGRESS_API_BASE}/bill/${congress}/${type}/${number}/cosponsors?api_key=${API_KEY}&format=json`;
      const cosponsorsRes = await fetch(cosponsorsUrl);
      if (cosponsorsRes.ok) {
        const cosponsorsData = await cosponsorsRes.json();
        const cosponsors = cosponsorsData.cosponsors || [];
        cosponsorBioguideIds = cosponsors.map((c: any) => c.bioguideId);
        cosponsorCount = cosponsors.length;
      }
    } catch (e) {
      console.error('Cosponsors fetch error:', e);
    }

    // Determine topics from title and subjects
    const { topics, matchedSnippet } = detectTopics(
      `${bill.title || ''} ${summary}`,
      subjects
    );
    
    // Find matched subjects for transparency
    const matchedSubjects = subjects.filter(s => {
      const sLower = s.toLowerCase();
      return TECH_TOPICS.some(t => 
        t.subjects.some(ts => sLower.includes(ts.toLowerCase())) ||
        t.keywords.some(k => sLower.includes(k.toLowerCase()))
      );
    });

    return {
      billId: `${congress}-${type}-${number}`,
      congress: parseInt(congress),
      billType: type as Bill['billType'],
      billNumber: parseInt(number),
      title: bill.title || '',
      shortTitle: bill.constitutionalAuthorityStatementText ? undefined : bill.title,
      summary,
      policyArea: bill.policyArea?.name || '',
      subjects,
      introducedDate: bill.introducedDate || '',
      latestActionDate: bill.latestAction?.actionDate || '',
      latestAction: bill.latestAction?.text || '',
      sponsorBioguideId: bill.sponsors?.[0]?.bioguideId || '',
      cosponsorBioguideIds,
      cosponsorCount,
      url: `https://www.congress.gov/bill/${congress}th-congress/${getBillTypeSlug(type)}/${number}`,
      topics: topics.length > 0 ? topics : ['AI & Automation'],
      matchedSubjects,
      lastUpdated: bill.updateDate || new Date().toISOString(),
      // Raw data for explainer
      _raw: {
        textUrl: bill.textVersions?.url,
        amendments: bill.amendments?.count || 0,
        committees: bill.committees || []
      }
    };
  } catch (error) {
    console.error('Bill details fetch error:', error);
    return null;
  }
}

function getBillTypeSlug(type: string): string {
  const slugs: Record<string, string> = {
    hr: 'house-bill',
    s: 'senate-bill',
    hjres: 'house-joint-resolution',
    sjres: 'senate-joint-resolution',
    hconres: 'house-concurrent-resolution',
    sconres: 'senate-concurrent-resolution',
    hres: 'house-resolution',
    sres: 'senate-resolution'
  };
  return slugs[type] || type;
}

// Generate plain-English explainer from official sources ONLY
function generateExplainer(bill: any): BillExplainer | null {
  // We can only generate an explainer if we have a summary
  if (!bill.summary || bill.summary.length < 50) {
    return null;
  }

  const summary = bill.summary;
  const title = bill.title;
  const subjects = bill.subjects || [];

  // Extract key points from summary (rule-based, no hallucination)
  const sentences = summary.split(/[.!?]/).filter((s: string) => s.trim().length > 10);

  // Generate one-sentence summary (first sentence or truncated)
  const oneSentence = sentences[0]?.trim() || title;

  // Extract "what it would do" - look for action verbs in summary
  const actionPatterns = [
    /(?:would|shall|must|requires?|establishes?|creates?|authorizes?|directs?|prohibits?|amends?)[^.]+/gi
  ];
  const whatItWouldDo: string[] = [];
  for (const pattern of actionPatterns) {
    const matches = summary.match(pattern) || [];
    whatItWouldDo.push(...matches.map((m: string) => m.trim()).slice(0, 3));
  }
  if (whatItWouldDo.length === 0 && sentences.length > 1) {
    whatItWouldDo.push(sentences[1]?.trim() || 'See official summary for details');
  }

  // Who it affects - extract from subjects and summary
  const whoItAffects: string[] = [];
  const affectsPatterns = [
    /(?:consumers?|businesses?|companies?|agencies?|government|federal|state|citizens?|individuals?|workers?|employees?)[^,.]*/gi
  ];
  for (const pattern of affectsPatterns) {
    const matches = summary.match(pattern) || [];
    whoItAffects.push(...matches.map((m: string) => m.trim()).slice(0, 3));
  }
  if (whoItAffects.length === 0) {
    whoItAffects.push('See official summary for affected parties');
  }

  // What changes - derive from actions
  const whatChanges = whatItWouldDo.map(action => 
    `If passed: ${action.charAt(0).toUpperCase() + action.slice(1)}`
  ).slice(0, 3);
  if (whatChanges.length === 0) {
    whatChanges.push('Specific changes depend on final bill text');
  }

  // Key terms - extract technical terms from subjects
  const keyTerms: { term: string; definition: string }[] = [];
  const techTerms = subjects.filter((s: string) => 
    s.length > 3 && 
    !['United States', 'Congress', 'Federal'].some(skip => s.includes(skip))
  ).slice(0, 4);
  for (const term of techTerms) {
    keyTerms.push({
      term,
      definition: `A legislative subject area. See Congress.gov for official definition.`
    });
  }

  // Arguments for/against - we CANNOT generate these without sources
  // Instead, we provide factual framing based on bill language
  const argumentsFor = [
    `Proponents argue this addresses: ${subjects.slice(0, 2).join(', ') || 'policy gaps'}`,
    `Supporters cite the bill's focus on: ${bill.policyArea || 'federal policy improvement'}`
  ];
  
  const argumentsAgainst = [
    `Critics may raise concerns about implementation costs`,
    `Opposition may question scope or federal authority`
  ];

  // What to watch - based on latest action
  let whatToWatch = 'Track this bill on Congress.gov for updates.';
  if (bill.latestAction) {
    const action = bill.latestAction.toLowerCase();
    if (action.includes('introduced') || action.includes('referred')) {
      whatToWatch = 'This bill is in committee. Watch for hearings or markups.';
    } else if (action.includes('passed') && !action.includes('passed house') && !action.includes('passed senate')) {
      whatToWatch = 'This bill has passed one chamber. Watch for action in the other chamber.';
    } else if (action.includes('became law') || action.includes('signed')) {
      whatToWatch = 'This bill has become law. Watch for implementation guidance.';
    }
  }

  // Sources - ONLY official sources
  const sourcesUsed = [
    { title: 'Bill Summary - Congress.gov', url: bill.url },
    { title: 'Official Bill Text', url: `${bill.url}/text` }
  ];

  // Disclaimers - be honest about limitations
  const disclaimers: string[] = [];
  if (summary.length < 200) {
    disclaimers.push('This explainer is based on a brief official summary.');
  }
  if (!bill._raw?.textUrl) {
    disclaimers.push('Full bill text was not available for analysis.');
  }
  disclaimers.push('Arguments for/against are general framings, not actual stakeholder positions.');
  disclaimers.push('Always verify with official Congress.gov sources.');

  return {
    oneSentence,
    whatItWouldDo: whatItWouldDo.slice(0, 4),
    whoItAffects: whoItAffects.slice(0, 3),
    whatChanges,
    keyTerms,
    argumentsFor,
    argumentsAgainst,
    whatToWatch,
    sourcesUsed,
    disclaimers
  };
}

export async function GET(
  request: Request,
  { params }: { params: { billId: string } }
) {
  const billId = params.billId;
  
  // Parse billId format: "119-hr-123" or "119-s-456"
  const parts = billId.split('-');
  if (parts.length < 3) {
    return NextResponse.json(
      { error: "Invalid bill ID format. Expected: congress-type-number (e.g., 119-hr-123)" },
      { status: 400 }
    );
  }
  
  const [congress, type, ...numberParts] = parts;
  const number = numberParts.join('-'); // In case number has dashes
  
  if (!API_KEY) {
    return NextResponse.json(
      { 
        error: "API key not configured",
        message: "CONGRESS_API_KEY environment variable is required"
      },
      { status: 500 }
    );
  }

  const bill = await fetchBillDetails(congress, type, number);
  
  if (!bill) {
    return NextResponse.json(
      { 
        error: "Bill not found",
        message: `Could not find bill ${billId} in Congress.gov`,
        billId 
      },
      { status: 404 }
    );
  }

  // Generate explainer from official sources
  const explainer = generateExplainer(bill);

  // Remove internal fields before returning
  const { _raw, ...billData } = bill;

  return NextResponse.json({
    bill: billData,
    explainer,
    lastUpdated: new Date().toISOString()
  });
}

