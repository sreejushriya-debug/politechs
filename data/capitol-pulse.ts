// Capitol Pulse - Congress Technology Tracker Data
// ================================================
// IMPORTANT: This file now serves as a type-safe layer and provides
// demo data only when the Congress.gov API is not available.
// 
// For production use, set the CONGRESS_API_KEY environment variable
// to fetch real data from official government sources.

import { 
  CongressMember, 
  Bill, 
  Statement, 
  Vote, 
  TechTopic, 
  TECH_TOPICS,
  CoverageMetrics 
} from '@/lib/capitol-pulse/types';

// Re-export types for backwards compatibility
export type { CongressMember, Bill, Statement, Vote, TechTopic, CoverageMetrics };
export type Chamber = "House" | "Senate";
export type Party = "Democratic" | "Republican" | "Independent";
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

// Export tech topics for UI components
export const techTopics = TECH_TOPICS;

// Categories for filtering (same as tech topics)
export const categories = ["All", ...TECH_TOPICS.map(t => t.id)];

// ================================================
// EMPTY ARRAYS - Real data comes from API
// These are intentionally empty to prevent showing fake data
// ================================================

export const congressMembers: CongressMember[] = [];
export const statements: Statement[] = [];
export const bills: Bill[] = [];
export const votes: Vote[] = [];

// ================================================
// Weekly snapshot - shows data availability status
// ================================================

export const weeklySnapshot = {
  lastUpdated: new Date().toISOString(),
  dataStatus: "awaiting_api_key", // "live" | "demo" | "awaiting_api_key"
  topTopics: [] as { topic: TechTopic; change: string; statements: number }[],
  notableShifts: [
    "Connect Congress.gov API to see live Congressional data",
    "Set CONGRESS_API_KEY environment variable",
    "Real-time updates from official government sources"
  ],
  keyVotes: [] as { bill: string; result: string }[]
};

// ================================================
// Topic Trends - placeholder structure
// ================================================

export interface TopicTrend {
  topic: TechTopic;
  date: string;
  statementsCount: number;
  billsCount: number;
  framingBreakdown: { framing: FramingLabel; count: number }[];
}

export const topicTrends: TopicTrend[] = [];

// ================================================
// Member Alignment - placeholder structure  
// ================================================

export interface MemberAlignment {
  bioguideId: string;
  topic: TechTopic;
  attentionScore: number;
  actionScore: number;
  alignment: "High Attention, Low Action" | "Low Attention, High Action" | "Aligned" | "Inactive";
  explanation: string;
}

export const memberAlignments: MemberAlignment[] = [];

// ================================================
// Helper Functions
// ================================================

export function getMemberById(bioguideId: string): CongressMember | undefined {
  return congressMembers.find(m => m.bioguideId === bioguideId);
}

export function getStatementsByMember(bioguideId: string): Statement[] {
  return statements.filter(s => s.bioguideId === bioguideId);
}

export function getStatementsByTopic(topic: TechTopic): Statement[] {
  return statements.filter(s => s.topics.includes(topic));
}

export function getBillsByTopic(topic: TechTopic): Bill[] {
  return bills.filter(b => b.topics.includes(topic));
}

export function getMemberAlignment(bioguideId: string, topic: TechTopic): MemberAlignment | undefined {
  return memberAlignments.find(a => a.bioguideId === bioguideId && a.topic === topic);
}

export function getTopMembersByTopic(topic: TechTopic, limit: number = 5): CongressMember[] {
  // Would need to calculate from statements/bills
  return [];
}

// ================================================
// Data Availability Check
// ================================================

export function getDataAvailability(): {
  hasApiKey: boolean;
  membersCount: number;
  billsCount: number;
  statementsCount: number;
  message: string;
} {
  const hasApiKey = !!process.env.CONGRESS_API_KEY;
  
  return {
    hasApiKey,
    membersCount: congressMembers.length,
    billsCount: bills.length,
    statementsCount: statements.length,
    message: hasApiKey 
      ? "Connected to Congress.gov API"
      : "Set CONGRESS_API_KEY environment variable to enable live data"
  };
}
