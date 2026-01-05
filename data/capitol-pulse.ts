// Capitol Pulse - Congress Technology Tracker Data

export type Chamber = "House" | "Senate";
export type Party = "Democrat" | "Republican" | "Independent";

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

export interface CongressMember {
  id: string;
  name: string;
  chamber: Chamber;
  party: Party;
  state: string;
  district?: string; // House only
  imageUrl?: string;
  officialWebsite: string;
  techFingerprint: { topic: TechTopic; score: number }[];
}

export interface Statement {
  id: string;
  memberId: string;
  title: string;
  excerpt: string;
  fullText: string;
  sourceUrl: string;
  publishedAt: string;
  topics: TechTopic[];
  tone: ToneLabel;
  toneConfidence: number; // 0-100
  framings: FramingLabel[];
  keywords: string[];
  entities: string[];
  highlightedExcerpts: { text: string; reason: string }[];
}

export interface Bill {
  id: string;
  number: string;
  title: string;
  summary: string;
  topics: TechTopic[];
  introducedAt: string;
  status: "Introduced" | "In Committee" | "Passed House" | "Passed Senate" | "Enacted" | "Failed";
  sponsors: string[]; // member IDs
  cosponsors: string[]; // member IDs
  congressGovUrl: string;
}

export interface Vote {
  id: string;
  billId: string;
  chamber: Chamber;
  date: string;
  question: string;
  result: "Passed" | "Failed";
  votes: { memberId: string; vote: "Yea" | "Nay" | "Present" | "Not Voting" }[];
}

export interface TopicTrend {
  topic: TechTopic;
  date: string;
  statementsCount: number;
  billsCount: number;
  framingBreakdown: { framing: FramingLabel; count: number }[];
}

export interface MemberAlignment {
  memberId: string;
  topic: TechTopic;
  attentionScore: number; // 0-100: how often they talk about it
  actionScore: number; // 0-100: bills sponsored + votes
  alignment: "High Attention, Low Action" | "Low Attention, High Action" | "Aligned" | "Inactive";
  explanation: string;
}

// Tech Topics with descriptions
export const techTopics: { id: TechTopic; name: string; description: string; icon: string }[] = [
  {
    id: "AI & Automation",
    name: "AI & Automation",
    description: "Artificial intelligence regulation, machine learning governance, algorithmic accountability, and workforce automation impacts.",
    icon: "🤖"
  },
  {
    id: "Cybersecurity",
    name: "Cybersecurity",
    description: "National cybersecurity strategy, critical infrastructure protection, cyber defense funding, and data breach response.",
    icon: "🔒"
  },
  {
    id: "Data Privacy & Surveillance",
    name: "Data Privacy & Surveillance",
    description: "Consumer data protection, government surveillance programs, FISA, and digital rights.",
    icon: "👁️"
  },
  {
    id: "Social Media & Online Safety",
    name: "Social Media & Online Safety",
    description: "Section 230, content moderation, online harassment, platform accountability, and child safety online.",
    icon: "📱"
  },
  {
    id: "Antitrust & Platform Regulation",
    name: "Antitrust & Platform Regulation",
    description: "Big Tech antitrust enforcement, platform competition, merger review, and market dominance.",
    icon: "⚖️"
  },
  {
    id: "Telecom & Broadband",
    name: "Telecom & Broadband",
    description: "Broadband infrastructure, net neutrality, spectrum allocation, and rural connectivity.",
    icon: "📡"
  },
  {
    id: "Crypto & Digital Assets",
    name: "Crypto & Digital Assets",
    description: "Cryptocurrency regulation, stablecoins, CBDCs, blockchain policy, and digital asset taxation.",
    icon: "₿"
  },
  {
    id: "Semiconductors & Supply Chain",
    name: "Semiconductors & Supply Chain",
    description: "CHIPS Act implementation, semiconductor manufacturing, supply chain security, and tech export controls.",
    icon: "🔌"
  },
  {
    id: "Space & Commercial Space",
    name: "Space & Commercial Space",
    description: "NASA authorization, commercial space regulation, satellite policy, and space exploration funding.",
    icon: "🚀"
  }
];

// Sample Congress Members (mix of real structure with mock data)
export const congressMembers: CongressMember[] = [
  {
    id: "sen-warner",
    name: "Mark Warner",
    chamber: "Senate",
    party: "Democrat",
    state: "VA",
    officialWebsite: "https://www.warner.senate.gov",
    techFingerprint: [
      { topic: "Cybersecurity", score: 92 },
      { topic: "AI & Automation", score: 85 },
      { topic: "Data Privacy & Surveillance", score: 78 },
      { topic: "Social Media & Online Safety", score: 71 }
    ]
  },
  {
    id: "sen-cruz",
    name: "Ted Cruz",
    chamber: "Senate",
    party: "Republican",
    state: "TX",
    officialWebsite: "https://www.cruz.senate.gov",
    techFingerprint: [
      { topic: "Social Media & Online Safety", score: 88 },
      { topic: "Antitrust & Platform Regulation", score: 75 },
      { topic: "Space & Commercial Space", score: 82 },
      { topic: "Telecom & Broadband", score: 65 }
    ]
  },
  {
    id: "rep-lofgren",
    name: "Zoe Lofgren",
    chamber: "House",
    party: "Democrat",
    state: "CA",
    district: "18",
    officialWebsite: "https://lofgren.house.gov",
    techFingerprint: [
      { topic: "AI & Automation", score: 90 },
      { topic: "Data Privacy & Surveillance", score: 88 },
      { topic: "Antitrust & Platform Regulation", score: 85 },
      { topic: "Semiconductors & Supply Chain", score: 70 }
    ]
  },
  {
    id: "rep-buck",
    name: "Ken Buck",
    chamber: "House",
    party: "Republican",
    state: "CO",
    district: "4",
    officialWebsite: "https://buck.house.gov",
    techFingerprint: [
      { topic: "Antitrust & Platform Regulation", score: 95 },
      { topic: "Social Media & Online Safety", score: 72 },
      { topic: "Data Privacy & Surveillance", score: 68 }
    ]
  },
  {
    id: "sen-schumer",
    name: "Chuck Schumer",
    chamber: "Senate",
    party: "Democrat",
    state: "NY",
    officialWebsite: "https://www.schumer.senate.gov",
    techFingerprint: [
      { topic: "AI & Automation", score: 88 },
      { topic: "Semiconductors & Supply Chain", score: 92 },
      { topic: "Antitrust & Platform Regulation", score: 75 }
    ]
  },
  {
    id: "sen-thune",
    name: "John Thune",
    chamber: "Senate",
    party: "Republican",
    state: "SD",
    officialWebsite: "https://www.thune.senate.gov",
    techFingerprint: [
      { topic: "Telecom & Broadband", score: 90 },
      { topic: "AI & Automation", score: 72 },
      { topic: "Cybersecurity", score: 68 }
    ]
  },
  {
    id: "rep-eshoo",
    name: "Anna Eshoo",
    chamber: "House",
    party: "Democrat",
    state: "CA",
    district: "16",
    officialWebsite: "https://eshoo.house.gov",
    techFingerprint: [
      { topic: "Data Privacy & Surveillance", score: 94 },
      { topic: "Telecom & Broadband", score: 88 },
      { topic: "AI & Automation", score: 82 }
    ]
  },
  {
    id: "sen-cotton",
    name: "Tom Cotton",
    chamber: "Senate",
    party: "Republican",
    state: "AR",
    officialWebsite: "https://www.cotton.senate.gov",
    techFingerprint: [
      { topic: "Semiconductors & Supply Chain", score: 90 },
      { topic: "Cybersecurity", score: 85 },
      { topic: "AI & Automation", score: 78 }
    ]
  },
  {
    id: "rep-jayapal",
    name: "Pramila Jayapal",
    chamber: "House",
    party: "Democrat",
    state: "WA",
    district: "7",
    officialWebsite: "https://jayapal.house.gov",
    techFingerprint: [
      { topic: "Antitrust & Platform Regulation", score: 92 },
      { topic: "Data Privacy & Surveillance", score: 85 },
      { topic: "AI & Automation", score: 78 }
    ]
  },
  {
    id: "sen-hagerty",
    name: "Bill Hagerty",
    chamber: "Senate",
    party: "Republican",
    state: "TN",
    officialWebsite: "https://www.hagerty.senate.gov",
    techFingerprint: [
      { topic: "Crypto & Digital Assets", score: 88 },
      { topic: "AI & Automation", score: 72 },
      { topic: "Semiconductors & Supply Chain", score: 68 }
    ]
  }
];

// Sample Statements
export const statements: Statement[] = [
  {
    id: "stmt-1",
    memberId: "sen-warner",
    title: "Warner Calls for Comprehensive AI Legislation",
    excerpt: "As artificial intelligence systems become more sophisticated, we need clear guardrails that protect Americans while fostering innovation. I'm working with colleagues on both sides of the aisle to develop legislation that addresses algorithmic accountability.",
    fullText: "Senator Mark Warner today released a statement calling for comprehensive legislation to regulate artificial intelligence systems...",
    sourceUrl: "https://www.warner.senate.gov/public/index.cfm/pressreleases",
    publishedAt: "2025-12-18",
    topics: ["AI & Automation"],
    tone: "Concern",
    toneConfidence: 85,
    framings: ["Innovation", "Consumer Protection"],
    keywords: ["AI", "artificial intelligence", "guardrails", "algorithmic accountability"],
    entities: ["Senate Intelligence Committee"],
    highlightedExcerpts: [
      { text: "clear guardrails that protect Americans", reason: "Policy position indicator" },
      { text: "algorithmic accountability", reason: "Topic keyword" }
    ]
  },
  {
    id: "stmt-2",
    memberId: "sen-cruz",
    title: "Cruz Demands Action on Big Tech Censorship",
    excerpt: "Big Tech platforms continue to silence conservative voices and interfere with free speech. We must reform Section 230 to hold these companies accountable for their biased moderation practices.",
    fullText: "Senator Ted Cruz renewed his calls for Section 230 reform in response to recent content moderation decisions...",
    sourceUrl: "https://www.cruz.senate.gov/newsroom/press-releases",
    publishedAt: "2025-12-15",
    topics: ["Social Media & Online Safety", "Antitrust & Platform Regulation"],
    tone: "Concern",
    toneConfidence: 92,
    framings: ["Rights & Privacy", "Competition"],
    keywords: ["Section 230", "Big Tech", "censorship", "free speech", "content moderation"],
    entities: ["FCC", "Section 230"],
    highlightedExcerpts: [
      { text: "silence conservative voices", reason: "Framing indicator" },
      { text: "reform Section 230", reason: "Policy position" }
    ]
  },
  {
    id: "stmt-3",
    memberId: "rep-lofgren",
    title: "Lofgren Introduces Bipartisan AI Transparency Act",
    excerpt: "Americans deserve to know when they're interacting with AI systems. This legislation requires clear disclosure and establishes baseline standards for high-risk AI applications in healthcare, employment, and criminal justice.",
    fullText: "Representative Zoe Lofgren introduced the AI Transparency Act with bipartisan support...",
    sourceUrl: "https://lofgren.house.gov/media/press-releases",
    publishedAt: "2025-12-20",
    topics: ["AI & Automation", "Data Privacy & Surveillance"],
    tone: "Support",
    toneConfidence: 88,
    framings: ["Consumer Protection", "Rights & Privacy"],
    keywords: ["AI transparency", "disclosure", "high-risk AI", "healthcare", "employment"],
    entities: ["AI Transparency Act", "NIST"],
    highlightedExcerpts: [
      { text: "Americans deserve to know", reason: "Framing indicator" },
      { text: "high-risk AI applications", reason: "Topic keyword" }
    ]
  },
  {
    id: "stmt-4",
    memberId: "sen-schumer",
    title: "Schumer Announces $52B CHIPS Act Implementation Progress",
    excerpt: "Today we're announcing the next phase of CHIPS Act funding that will bring semiconductor manufacturing back to America. This investment creates thousands of high-paying jobs and strengthens our national security.",
    fullText: "Senate Majority Leader Chuck Schumer announced new CHIPS Act funding allocations...",
    sourceUrl: "https://www.schumer.senate.gov/newsroom/press-releases",
    publishedAt: "2025-12-22",
    topics: ["Semiconductors & Supply Chain"],
    tone: "Support",
    toneConfidence: 95,
    framings: ["Jobs & Economy", "National Security", "Global Competitiveness"],
    keywords: ["CHIPS Act", "semiconductor", "manufacturing", "jobs", "national security"],
    entities: ["CHIPS Act", "Commerce Department", "Intel", "TSMC"],
    highlightedExcerpts: [
      { text: "semiconductor manufacturing back to America", reason: "Policy position" },
      { text: "strengthens our national security", reason: "Framing indicator" }
    ]
  },
  {
    id: "stmt-5",
    memberId: "rep-buck",
    title: "Buck: Google Antitrust Ruling is 'Historic Victory'",
    excerpt: "Today's ruling confirms what we've been saying for years—Google has operated as an illegal monopoly. This is a historic victory for competition and innovation. Now we must ensure strong remedies that restore a level playing field.",
    fullText: "Representative Ken Buck praised the federal court ruling in the Google antitrust case...",
    sourceUrl: "https://buck.house.gov/media/press-releases",
    publishedAt: "2025-12-10",
    topics: ["Antitrust & Platform Regulation"],
    tone: "Support",
    toneConfidence: 90,
    framings: ["Competition", "Innovation"],
    keywords: ["Google", "antitrust", "monopoly", "competition", "DOJ"],
    entities: ["Google", "DOJ", "Federal Court"],
    highlightedExcerpts: [
      { text: "illegal monopoly", reason: "Policy position" },
      { text: "restore a level playing field", reason: "Framing indicator" }
    ]
  },
  {
    id: "stmt-6",
    memberId: "sen-thune",
    title: "Thune Pushes Rural Broadband Expansion",
    excerpt: "Every American deserves access to high-speed internet, regardless of their zip code. I'm proud to announce new funding for rural broadband infrastructure that will connect underserved communities across South Dakota and the nation.",
    fullText: "Senator John Thune announced new rural broadband funding under the Infrastructure Investment and Jobs Act...",
    sourceUrl: "https://www.thune.senate.gov/public/index.cfm/press-releases",
    publishedAt: "2025-12-05",
    topics: ["Telecom & Broadband"],
    tone: "Support",
    toneConfidence: 92,
    framings: ["Jobs & Economy", "Consumer Protection"],
    keywords: ["broadband", "rural", "infrastructure", "connectivity", "internet access"],
    entities: ["FCC", "USDA", "NTIA"],
    highlightedExcerpts: [
      { text: "Every American deserves access to high-speed internet", reason: "Policy position" },
      { text: "underserved communities", reason: "Framing indicator" }
    ]
  },
  {
    id: "stmt-7",
    memberId: "rep-eshoo",
    title: "Eshoo Introduces Federal Data Privacy Bill",
    excerpt: "It's time for a comprehensive federal privacy law. My legislation creates strong protections for consumer data, limits data collection, and gives Americans real control over their personal information.",
    fullText: "Representative Anna Eshoo introduced the American Data Privacy Protection Act...",
    sourceUrl: "https://eshoo.house.gov/media/press-releases",
    publishedAt: "2025-12-01",
    topics: ["Data Privacy & Surveillance"],
    tone: "Support",
    toneConfidence: 94,
    framings: ["Rights & Privacy", "Consumer Protection"],
    keywords: ["privacy", "data protection", "consumer data", "personal information", "ADPPA"],
    entities: ["FTC", "ADPPA"],
    highlightedExcerpts: [
      { text: "comprehensive federal privacy law", reason: "Policy position" },
      { text: "real control over their personal information", reason: "Framing indicator" }
    ]
  },
  {
    id: "stmt-8",
    memberId: "sen-cotton",
    title: "Cotton Warns of China's Tech Ambitions",
    excerpt: "China is racing to dominate critical technologies including AI and semiconductors. We must counter this threat with strategic investments and strict export controls to protect American technological leadership.",
    fullText: "Senator Tom Cotton issued a statement on China's technology strategy...",
    sourceUrl: "https://www.cotton.senate.gov/news/press-releases",
    publishedAt: "2025-12-08",
    topics: ["Semiconductors & Supply Chain", "AI & Automation"],
    tone: "Concern",
    toneConfidence: 88,
    framings: ["National Security", "Global Competitiveness"],
    keywords: ["China", "AI", "semiconductors", "export controls", "technology competition"],
    entities: ["China", "Commerce Department", "BIS"],
    highlightedExcerpts: [
      { text: "China is racing to dominate critical technologies", reason: "Framing indicator" },
      { text: "protect American technological leadership", reason: "Policy position" }
    ]
  },
  {
    id: "stmt-9",
    memberId: "sen-hagerty",
    title: "Hagerty Proposes Crypto Regulatory Framework",
    excerpt: "The digital asset industry needs regulatory clarity, not regulation by enforcement. My bill creates a clear framework that protects consumers while allowing American innovation to flourish.",
    fullText: "Senator Bill Hagerty introduced legislation to establish a comprehensive cryptocurrency regulatory framework...",
    sourceUrl: "https://www.hagerty.senate.gov/press-releases",
    publishedAt: "2025-12-12",
    topics: ["Crypto & Digital Assets"],
    tone: "Support",
    toneConfidence: 86,
    framings: ["Innovation", "Consumer Protection"],
    keywords: ["crypto", "digital assets", "regulatory framework", "cryptocurrency", "SEC", "CFTC"],
    entities: ["SEC", "CFTC", "Treasury Department"],
    highlightedExcerpts: [
      { text: "regulatory clarity, not regulation by enforcement", reason: "Policy position" },
      { text: "American innovation to flourish", reason: "Framing indicator" }
    ]
  },
  {
    id: "stmt-10",
    memberId: "rep-jayapal",
    title: "Jayapal Calls for Amazon Breakup",
    excerpt: "Amazon's dominance across e-commerce, cloud computing, and logistics gives it unprecedented power over American consumers and small businesses. It's time to break up this monopoly.",
    fullText: "Representative Pramila Jayapal renewed calls for structural remedies in Big Tech antitrust enforcement...",
    sourceUrl: "https://jayapal.house.gov/media/press-releases",
    publishedAt: "2025-12-14",
    topics: ["Antitrust & Platform Regulation"],
    tone: "Concern",
    toneConfidence: 90,
    framings: ["Competition", "Consumer Protection"],
    keywords: ["Amazon", "monopoly", "antitrust", "breakup", "small business"],
    entities: ["Amazon", "FTC", "DOJ"],
    highlightedExcerpts: [
      { text: "unprecedented power over American consumers", reason: "Framing indicator" },
      { text: "break up this monopoly", reason: "Policy position" }
    ]
  }
];

// Sample Bills
export const bills: Bill[] = [
  {
    id: "bill-1",
    number: "S.2025",
    title: "Algorithmic Accountability Act of 2025",
    summary: "Requires companies to conduct impact assessments for automated decision systems and establishes transparency requirements for AI systems affecting consumers.",
    topics: ["AI & Automation", "Data Privacy & Surveillance"],
    introducedAt: "2025-06-15",
    status: "In Committee",
    sponsors: ["sen-warner"],
    cosponsors: ["rep-lofgren", "rep-eshoo"],
    congressGovUrl: "https://www.congress.gov/bill/119th-congress/senate-bill/2025"
  },
  {
    id: "bill-2",
    number: "H.R.3301",
    title: "Section 230 Reform Act",
    summary: "Amends Section 230 of the Communications Decency Act to require transparency in content moderation and create liability for amplification of harmful content.",
    topics: ["Social Media & Online Safety"],
    introducedAt: "2025-07-01",
    status: "Passed House",
    sponsors: ["rep-buck"],
    cosponsors: ["sen-cruz"],
    congressGovUrl: "https://www.congress.gov/bill/119th-congress/house-bill/3301"
  },
  {
    id: "bill-3",
    number: "S.1842",
    title: "American Data Privacy Protection Act",
    summary: "Establishes comprehensive federal data privacy protections, creates individual data rights, and limits data collection by large data holders.",
    topics: ["Data Privacy & Surveillance"],
    introducedAt: "2025-05-20",
    status: "In Committee",
    sponsors: ["rep-eshoo"],
    cosponsors: ["sen-warner", "sen-thune"],
    congressGovUrl: "https://www.congress.gov/bill/119th-congress/senate-bill/1842"
  },
  {
    id: "bill-4",
    number: "S.2100",
    title: "CHIPS and Science Act Supplemental Funding",
    summary: "Provides additional funding for domestic semiconductor manufacturing incentives and research initiatives under the CHIPS and Science Act.",
    topics: ["Semiconductors & Supply Chain"],
    introducedAt: "2025-08-10",
    status: "Enacted",
    sponsors: ["sen-schumer"],
    cosponsors: ["sen-cotton", "rep-lofgren"],
    congressGovUrl: "https://www.congress.gov/bill/119th-congress/senate-bill/2100"
  },
  {
    id: "bill-5",
    number: "H.R.4422",
    title: "Digital Asset Market Structure Act",
    summary: "Creates a regulatory framework for cryptocurrency and digital assets, clarifying jurisdiction between SEC and CFTC.",
    topics: ["Crypto & Digital Assets"],
    introducedAt: "2025-09-05",
    status: "Passed House",
    sponsors: ["sen-hagerty"],
    cosponsors: [],
    congressGovUrl: "https://www.congress.gov/bill/119th-congress/house-bill/4422"
  },
  {
    id: "bill-6",
    number: "S.2250",
    title: "Rural Broadband Acceleration Act",
    summary: "Streamlines permitting for broadband infrastructure deployment and provides additional funding for rural connectivity programs.",
    topics: ["Telecom & Broadband"],
    introducedAt: "2025-07-15",
    status: "In Committee",
    sponsors: ["sen-thune"],
    cosponsors: [],
    congressGovUrl: "https://www.congress.gov/bill/119th-congress/senate-bill/2250"
  },
  {
    id: "bill-7",
    number: "H.R.5001",
    title: "Platform Competition and Opportunity Act",
    summary: "Prohibits dominant platforms from engaging in self-preferencing and requires interoperability for large platforms.",
    topics: ["Antitrust & Platform Regulation"],
    introducedAt: "2025-10-01",
    status: "In Committee",
    sponsors: ["rep-jayapal", "rep-buck"],
    cosponsors: ["sen-cruz"],
    congressGovUrl: "https://www.congress.gov/bill/119th-congress/house-bill/5001"
  }
];

// Topic Trends (weekly data for charts)
export const topicTrends: TopicTrend[] = [
  // AI & Automation trends
  { topic: "AI & Automation", date: "2025-10-01", statementsCount: 12, billsCount: 2, framingBreakdown: [{ framing: "Innovation", count: 5 }, { framing: "National Security", count: 4 }, { framing: "Jobs & Economy", count: 3 }] },
  { topic: "AI & Automation", date: "2025-10-08", statementsCount: 15, billsCount: 1, framingBreakdown: [{ framing: "Innovation", count: 7 }, { framing: "Consumer Protection", count: 5 }, { framing: "National Security", count: 3 }] },
  { topic: "AI & Automation", date: "2025-10-15", statementsCount: 18, billsCount: 3, framingBreakdown: [{ framing: "Innovation", count: 8 }, { framing: "Rights & Privacy", count: 6 }, { framing: "Jobs & Economy", count: 4 }] },
  { topic: "AI & Automation", date: "2025-10-22", statementsCount: 22, billsCount: 2, framingBreakdown: [{ framing: "National Security", count: 9 }, { framing: "Innovation", count: 8 }, { framing: "Consumer Protection", count: 5 }] },
  { topic: "AI & Automation", date: "2025-10-29", statementsCount: 25, billsCount: 4, framingBreakdown: [{ framing: "Innovation", count: 10 }, { framing: "National Security", count: 8 }, { framing: "Rights & Privacy", count: 7 }] },
  { topic: "AI & Automation", date: "2025-11-05", statementsCount: 28, billsCount: 3, framingBreakdown: [{ framing: "Innovation", count: 12 }, { framing: "Jobs & Economy", count: 9 }, { framing: "National Security", count: 7 }] },
  { topic: "AI & Automation", date: "2025-11-12", statementsCount: 24, billsCount: 2, framingBreakdown: [{ framing: "Innovation", count: 10 }, { framing: "Consumer Protection", count: 8 }, { framing: "Rights & Privacy", count: 6 }] },
  { topic: "AI & Automation", date: "2025-11-19", statementsCount: 30, billsCount: 5, framingBreakdown: [{ framing: "National Security", count: 12 }, { framing: "Innovation", count: 10 }, { framing: "Global Competitiveness", count: 8 }] },
  
  // Cybersecurity trends
  { topic: "Cybersecurity", date: "2025-10-01", statementsCount: 8, billsCount: 1, framingBreakdown: [{ framing: "National Security", count: 6 }, { framing: "Consumer Protection", count: 2 }] },
  { topic: "Cybersecurity", date: "2025-10-08", statementsCount: 10, billsCount: 2, framingBreakdown: [{ framing: "National Security", count: 7 }, { framing: "Consumer Protection", count: 3 }] },
  { topic: "Cybersecurity", date: "2025-10-15", statementsCount: 14, billsCount: 1, framingBreakdown: [{ framing: "National Security", count: 10 }, { framing: "Consumer Protection", count: 4 }] },
  { topic: "Cybersecurity", date: "2025-10-22", statementsCount: 12, billsCount: 2, framingBreakdown: [{ framing: "National Security", count: 8 }, { framing: "Consumer Protection", count: 4 }] },
  
  // Data Privacy trends
  { topic: "Data Privacy & Surveillance", date: "2025-10-01", statementsCount: 10, billsCount: 2, framingBreakdown: [{ framing: "Rights & Privacy", count: 7 }, { framing: "Consumer Protection", count: 3 }] },
  { topic: "Data Privacy & Surveillance", date: "2025-10-08", statementsCount: 12, billsCount: 1, framingBreakdown: [{ framing: "Rights & Privacy", count: 8 }, { framing: "Consumer Protection", count: 4 }] },
  { topic: "Data Privacy & Surveillance", date: "2025-10-15", statementsCount: 15, billsCount: 3, framingBreakdown: [{ framing: "Rights & Privacy", count: 10 }, { framing: "Consumer Protection", count: 5 }] },
  
  // Social Media trends
  { topic: "Social Media & Online Safety", date: "2025-10-01", statementsCount: 14, billsCount: 2, framingBreakdown: [{ framing: "Child Safety", count: 6 }, { framing: "Rights & Privacy", count: 5 }, { framing: "Competition", count: 3 }] },
  { topic: "Social Media & Online Safety", date: "2025-10-08", statementsCount: 18, billsCount: 3, framingBreakdown: [{ framing: "Child Safety", count: 8 }, { framing: "Rights & Privacy", count: 6 }, { framing: "Competition", count: 4 }] },
  
  // Antitrust trends
  { topic: "Antitrust & Platform Regulation", date: "2025-10-01", statementsCount: 9, billsCount: 2, framingBreakdown: [{ framing: "Competition", count: 6 }, { framing: "Consumer Protection", count: 3 }] },
  { topic: "Antitrust & Platform Regulation", date: "2025-10-08", statementsCount: 11, billsCount: 1, framingBreakdown: [{ framing: "Competition", count: 7 }, { framing: "Innovation", count: 4 }] },
  
  // Semiconductors trends
  { topic: "Semiconductors & Supply Chain", date: "2025-10-01", statementsCount: 7, billsCount: 1, framingBreakdown: [{ framing: "National Security", count: 4 }, { framing: "Jobs & Economy", count: 3 }] },
  { topic: "Semiconductors & Supply Chain", date: "2025-10-08", statementsCount: 10, billsCount: 2, framingBreakdown: [{ framing: "National Security", count: 6 }, { framing: "Global Competitiveness", count: 4 }] }
];

// Member alignment data
export const memberAlignments: MemberAlignment[] = [
  {
    memberId: "sen-warner",
    topic: "AI & Automation",
    attentionScore: 85,
    actionScore: 78,
    alignment: "Aligned",
    explanation: "Sen. Warner frequently discusses AI policy and has sponsored 2 major AI bills this session."
  },
  {
    memberId: "sen-cruz",
    topic: "Social Media & Online Safety",
    attentionScore: 92,
    actionScore: 45,
    alignment: "High Attention, Low Action",
    explanation: "Sen. Cruz frequently criticizes social media platforms but has sponsored fewer bills compared to his statements."
  },
  {
    memberId: "rep-lofgren",
    topic: "AI & Automation",
    attentionScore: 80,
    actionScore: 88,
    alignment: "Aligned",
    explanation: "Rep. Lofgren has both spoken extensively on AI and introduced key legislation including the AI Transparency Act."
  },
  {
    memberId: "rep-buck",
    topic: "Antitrust & Platform Regulation",
    attentionScore: 90,
    actionScore: 85,
    alignment: "Aligned",
    explanation: "Rep. Buck has been a leader in bipartisan antitrust efforts, matching rhetoric with legislative action."
  },
  {
    memberId: "sen-schumer",
    topic: "Semiconductors & Supply Chain",
    attentionScore: 75,
    actionScore: 95,
    alignment: "Low Attention, High Action",
    explanation: "Sen. Schumer was instrumental in passing CHIPS Act but speaks less frequently about semiconductors than other topics."
  }
];

// Helper functions
export function getMemberById(id: string): CongressMember | undefined {
  return congressMembers.find(m => m.id === id);
}

export function getStatementsByMember(memberId: string): Statement[] {
  return statements.filter(s => s.memberId === memberId);
}

export function getStatementsByTopic(topic: TechTopic): Statement[] {
  return statements.filter(s => s.topics.includes(topic));
}

export function getBillsByTopic(topic: TechTopic): Bill[] {
  return bills.filter(b => b.topics.includes(topic));
}

export function getMemberAlignment(memberId: string, topic: TechTopic): MemberAlignment | undefined {
  return memberAlignments.find(a => a.memberId === memberId && a.topic === topic);
}

export function getTopMembersByTopic(topic: TechTopic, limit: number = 5): CongressMember[] {
  return congressMembers
    .filter(m => m.techFingerprint.some(f => f.topic === topic))
    .sort((a, b) => {
      const aScore = a.techFingerprint.find(f => f.topic === topic)?.score || 0;
      const bScore = b.techFingerprint.find(f => f.topic === topic)?.score || 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

// This week's snapshot
export const weeklySnapshot = {
  lastUpdated: "2025-12-23T08:00:00Z",
  topTopics: [
    { topic: "AI & Automation" as TechTopic, change: "+15%", statements: 30 },
    { topic: "Semiconductors & Supply Chain" as TechTopic, change: "+8%", statements: 18 },
    { topic: "Data Privacy & Surveillance" as TechTopic, change: "-3%", statements: 15 }
  ],
  notableShifts: [
    "Bipartisan AI legislation gains momentum with 12 new cosponsors",
    "Semiconductor funding debate intensifies ahead of appropriations deadline",
    "New TikTok hearing scheduled for January sparks social media policy discussion"
  ],
  keyVotes: [
    { bill: "CHIPS Act Supplemental", result: "Passed Senate 72-25" },
    { bill: "Section 230 Reform Act", result: "Passed House 245-180" }
  ]
};

