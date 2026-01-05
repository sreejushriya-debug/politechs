// Capitol Pulse - Official Data Types
// All data must be sourced from official government sources

export type Chamber = "House" | "Senate";
export type Party = "Democratic" | "Republican" | "Independent";

export type TechTopic = 
  | "AI & Automation"
  | "Cybersecurity"
  | "Data Privacy & Surveillance"
  | "Social Media & Online Safety"
  | "Antitrust & Platform Regulation"
  | "Telecom & Broadband"
  | "Crypto & Digital Assets"
  | "Semiconductors & Supply Chain"
  | "Space & Commercial Space";

export type ToneLabel = "Support" | "Concern" | "Neutral";
export type FramingLabel = 
  | "Innovation"
  | "National Security"
  | "Jobs & Economy"
  | "Rights & Privacy"
  | "Competition"
  | "Child Safety"
  | "Consumer Protection"
  | "Global Competitiveness";

export type SourceType = "congressional_record" | "press_release" | "committee_hearing";

// Member from official House/Senate sources
export interface CongressMember {
  bioguideId: string; // Official bioguide ID (e.g., "W000805")
  name: string;
  firstName: string;
  lastName: string;
  chamber: Chamber;
  party: Party;
  state: string;
  district?: number; // House only
  imageUrl: string;
  officialUrl: string;
  phone?: string;
  office?: string;
  termStart: string;
  termEnd?: string;
  isActive: boolean;
  lastUpdated: string;
}

// Statement from official sources (Congressional Record, press releases)
export interface Statement {
  id: string;
  bioguideId: string; // Links to member
  title: string;
  excerpt: string;
  fullText?: string;
  sourceUrl: string; // Must be verifiable official URL
  sourceType: SourceType;
  publishedAt: string;
  topics: TechTopic[];
  tone?: ToneLabel;
  toneConfidence?: number; // 0-100
  framings?: FramingLabel[];
  keywords: string[];
  entities: string[];
  matchedSnippet: string; // Exact text that triggered tech topic tagging
  lastUpdated: string;
}

// Bill from Congress.gov
export interface Bill {
  billId: string; // e.g., "119-s-123"
  congress: number; // e.g., 119
  billType: "hr" | "s" | "hjres" | "sjres" | "hconres" | "sconres" | "hres" | "sres";
  billNumber: number;
  title: string;
  shortTitle?: string;
  summary?: string;
  policyArea?: string;
  subjects: string[];
  introducedDate: string;
  latestActionDate: string;
  latestAction: string;
  sponsorBioguideId: string;
  cosponsorBioguideIds: string[];
  cosponsorCount: number;
  url: string; // congress.gov URL
  topics: TechTopic[];
  matchedSubjects: string[]; // Which subjects triggered tech tagging
  lastUpdated: string;
}

// Roll-call vote from House/Senate
export interface Vote {
  voteId: string;
  chamber: Chamber;
  congress: number;
  session: number;
  rollNumber: number;
  date: string;
  question: string;
  description: string;
  result: string;
  url: string;
  billId?: string; // If vote is related to a bill
  topics: TechTopic[];
  matchedText: string; // Why this was tagged as tech-related
  yeas: number;
  nays: number;
  present: number;
  notVoting: number;
  memberVotes: { bioguideId: string; vote: "Yea" | "Nay" | "Present" | "Not Voting" }[];
  lastUpdated: string;
}

// Ingestion run tracking
export interface IngestionRun {
  id: string;
  timestamp: string;
  source: "congress_api" | "house_clerk" | "senate_gov" | "congressional_record";
  dataType: "members" | "bills" | "votes" | "statements";
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  errors: { message: string; context?: string }[];
  duration: number; // milliseconds
}

// Coverage metrics
export interface CoverageMetrics {
  lastUpdated: string;
  members: {
    total: number;
    house: number;
    senate: number;
    withStatements: number;
    withBills: number;
  };
  bills: {
    total: number;
    byTopic: Record<TechTopic, number>;
  };
  votes: {
    total: number;
    houseTotal: number;
    senateTotal: number;
  };
  statements: {
    total: number;
    congressionalRecord: number;
    pressReleases: number;
  };
}

// Tech Topics with descriptions and keyword mappings
export const TECH_TOPICS: { 
  id: TechTopic; 
  name: string; 
  description: string; 
  icon: string;
  keywords: string[];
  subjects: string[]; // Congress.gov policy areas/subjects
}[] = [
  {
    id: "AI & Automation",
    name: "AI & Automation",
    description: "Artificial intelligence regulation, machine learning governance, algorithmic accountability, and workforce automation impacts.",
    icon: "🤖",
    keywords: ["artificial intelligence", "AI", "machine learning", "algorithm", "automation", "robotics", "neural network", "deep learning", "generative AI", "ChatGPT", "large language model"],
    subjects: ["Artificial intelligence", "Automation", "Technology assessment", "Science, Technology, Communications"]
  },
  {
    id: "Cybersecurity",
    name: "Cybersecurity",
    description: "National cybersecurity strategy, critical infrastructure protection, cyber defense funding, and data breach response.",
    icon: "🔒",
    keywords: ["cybersecurity", "cyber attack", "hacking", "data breach", "ransomware", "CISA", "critical infrastructure", "cyber defense", "malware", "phishing"],
    subjects: ["Computer security", "Cybercrime", "Internet and video services", "Science, Technology, Communications"]
  },
  {
    id: "Data Privacy & Surveillance",
    name: "Data Privacy & Surveillance",
    description: "Consumer data protection, government surveillance programs, FISA, and digital rights.",
    icon: "👁️",
    keywords: ["privacy", "surveillance", "FISA", "data protection", "personal data", "consumer data", "tracking", "NSA", "wiretap", "Section 702"],
    subjects: ["Right of privacy", "Civil Rights and Liberties, Minority Issues", "Intelligence activities, surveillance, classified information"]
  },
  {
    id: "Social Media & Online Safety",
    name: "Social Media & Online Safety",
    description: "Section 230, content moderation, online harassment, platform accountability, and child safety online.",
    icon: "📱",
    keywords: ["social media", "Section 230", "content moderation", "online safety", "TikTok", "Facebook", "Meta", "Twitter", "X", "platform", "child safety", "COPPA", "KOSA"],
    subjects: ["Internet and video services", "Computer security and identity theft"]
  },
  {
    id: "Antitrust & Platform Regulation",
    name: "Antitrust & Platform Regulation",
    description: "Big Tech antitrust enforcement, platform competition, merger review, and market dominance.",
    icon: "⚖️",
    keywords: ["antitrust", "monopoly", "Big Tech", "competition", "merger", "FTC", "DOJ", "platform regulation", "market dominance", "app store"],
    subjects: ["Competition and antitrust", "Business competition"]
  },
  {
    id: "Telecom & Broadband",
    name: "Telecom & Broadband",
    description: "Broadband infrastructure, net neutrality, spectrum allocation, and rural connectivity.",
    icon: "📡",
    keywords: ["broadband", "telecommunications", "net neutrality", "spectrum", "5G", "FCC", "rural connectivity", "internet access", "wireless", "fiber"],
    subjects: ["Telecommunication rates and fees", "Broadcasting, Coverage", "Internet and video services", "Rural conditions and development"]
  },
  {
    id: "Crypto & Digital Assets",
    name: "Crypto & Digital Assets",
    description: "Cryptocurrency regulation, stablecoins, CBDCs, blockchain policy, and digital asset taxation.",
    icon: "₿",
    keywords: ["cryptocurrency", "crypto", "bitcoin", "blockchain", "stablecoin", "CBDC", "digital asset", "DeFi", "NFT", "Ethereum"],
    subjects: ["Currency", "Digital currencies and finance"]
  },
  {
    id: "Semiconductors & Supply Chain",
    name: "Semiconductors & Supply Chain",
    description: "CHIPS Act implementation, semiconductor manufacturing, supply chain security, and tech export controls.",
    icon: "🔌",
    keywords: ["semiconductor", "chip", "CHIPS Act", "supply chain", "manufacturing", "export control", "TSMC", "Intel", "microchip", "fab"],
    subjects: ["Computers and information technology", "Manufacturing", "Trade restrictions"]
  },
  {
    id: "Space & Commercial Space",
    name: "Space & Commercial Space",
    description: "NASA authorization, commercial space regulation, satellite policy, and space exploration funding.",
    icon: "🚀",
    keywords: ["space", "NASA", "SpaceX", "satellite", "orbit", "launch", "commercial space", "lunar", "Mars", "aerospace"],
    subjects: ["Space flight and exploration", "Spacecraft and satellites"]
  }
];

// Helper to get topic by keywords
export function detectTopics(text: string, subjects?: string[]): { topics: TechTopic[]; matchedSnippet: string } {
  const normalizedText = text.toLowerCase();
  const matchedTopics: TechTopic[] = [];
  let matchedSnippet = "";

  for (const topic of TECH_TOPICS) {
    // Check subjects first (higher confidence)
    if (subjects) {
      for (const subject of topic.subjects) {
        if (subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))) {
          if (!matchedTopics.includes(topic.id)) {
            matchedTopics.push(topic.id);
            matchedSnippet += `Subject: "${subject}"; `;
          }
        }
      }
    }

    // Check keywords
    for (const keyword of topic.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        if (!matchedTopics.includes(topic.id)) {
          matchedTopics.push(topic.id);
          // Find the surrounding context
          const idx = normalizedText.indexOf(keyword.toLowerCase());
          const start = Math.max(0, idx - 30);
          const end = Math.min(text.length, idx + keyword.length + 30);
          matchedSnippet += `"...${text.slice(start, end)}..."; `;
        }
      }
    }
  }

  return { topics: matchedTopics.slice(0, 3), matchedSnippet: matchedSnippet.trim() };
}

