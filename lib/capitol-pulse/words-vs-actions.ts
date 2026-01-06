// Words vs Actions Aggregation System
// 
// WORDS = Official statements about tech topics
//   - Press releases from member .gov sites
//   - Floor remarks from Congressional Record
// 
// ACTIONS = Concrete legislative activity
//   - Bills sponsored/cosponsored
//   - Roll-call votes on tech-related legislation

import { Statement, Bill, Vote, TechTopic, CongressMember, TECH_TOPICS } from './types';

// Gap labels based on attention vs action ratios
export type GapLabel = 
  | 'high_attention_low_action'  // Talks a lot, does little
  | 'low_attention_high_action'  // Does without fanfare
  | 'aligned'                     // Words match actions
  | 'no_data';                   // Insufficient data

// Time range for trend calculations
export type TimeRange = '30d' | '90d' | '6m' | '1y' | 'all';

// Weekly data point for trends
export interface WeeklyCount {
  weekStart: string; // ISO date
  count: number;
}

// Topic-level aggregates
export interface TopicAggregate {
  topic: TechTopic;
  timeRange: TimeRange;
  attention: {
    count: number;
    trend: WeeklyCount[];
    evidenceQuery: string; // URL query to search evidence
  };
  action: {
    count: number;
    trend: WeeklyCount[];
    evidenceQuery: string;
  };
  topMembers: {
    byAttention: { bioguideId: string; name: string; count: number }[];
    byAction: { bioguideId: string; name: string; count: number }[];
  };
}

// Member-level aggregates per topic
export interface MemberTopicAggregate {
  bioguideId: string;
  memberName: string;
  topic: TechTopic;
  attention: {
    count: number;
    trend: WeeklyCount[];
    evidenceQuery: string;
  };
  action: {
    count: number;
    billsSponsored: number;
    billsCosponsored: number;
    votesCount: number;
    evidenceQuery: string;
  };
  gap: GapLabel;
  gapScore: number; // -1 to 1 (negative = more action, positive = more attention)
}

// Member overview (all topics)
export interface MemberOverview {
  bioguideId: string;
  memberName: string;
  party: string;
  state: string;
  chamber: 'House' | 'Senate';
  topicBreakdown: MemberTopicAggregate[];
  overallGap: GapLabel;
  biggestGaps: MemberTopicAggregate[];
  mostAligned: MemberTopicAggregate[];
  totalAttention: number;
  totalAction: number;
}

// Evidence link generator
export function generateEvidenceLink(params: {
  type?: 'statements' | 'bills' | 'votes' | 'all';
  topic?: TechTopic;
  member?: string;
  dateFrom?: string;
  dateTo?: string;
  sourceType?: 'press_release' | 'congressional_record';
}): string {
  const searchParams = new URLSearchParams();
  
  if (params.type && params.type !== 'all') {
    searchParams.set('type', params.type);
  }
  if (params.topic) {
    searchParams.set('topic', params.topic);
  }
  if (params.member) {
    searchParams.set('member', params.member);
  }
  if (params.dateFrom) {
    searchParams.set('dateFrom', params.dateFrom);
  }
  if (params.dateTo) {
    searchParams.set('dateTo', params.dateTo);
  }
  if (params.sourceType) {
    searchParams.set('sourceType', params.sourceType);
  }
  
  return `/capitol-pulse/search?${searchParams.toString()}`;
}

// Calculate gap label from attention and action counts
export function calculateGapLabel(
  attentionCount: number, 
  actionCount: number
): { label: GapLabel; score: number } {
  if (attentionCount === 0 && actionCount === 0) {
    return { label: 'no_data', score: 0 };
  }
  
  // Normalize to avoid division by zero
  const total = attentionCount + actionCount;
  const attentionRatio = attentionCount / total;
  const actionRatio = actionCount / total;
  
  // Score: positive means more attention, negative means more action
  const score = attentionRatio - actionRatio;
  
  // Thresholds for labels
  if (score > 0.3) {
    return { label: 'high_attention_low_action', score };
  } else if (score < -0.3) {
    return { label: 'low_attention_high_action', score };
  } else {
    return { label: 'aligned', score };
  }
}

// Get date range from TimeRange
export function getDateRange(range: TimeRange): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString().split('T')[0];
  let from: Date;
  
  switch (range) {
    case '30d':
      from = new Date(now.setDate(now.getDate() - 30));
      break;
    case '90d':
      from = new Date(now.setDate(now.getDate() - 90));
      break;
    case '6m':
      from = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case '1y':
      from = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    case 'all':
    default:
      from = new Date('2023-01-01'); // Start of 118th Congress
      break;
  }
  
  return { from: from.toISOString().split('T')[0], to };
}

// Group items by week for trend calculation
export function calculateWeeklyTrend<T extends { date: string }>(
  items: T[],
  dateField: keyof T = 'date' as keyof T
): WeeklyCount[] {
  const weeks = new Map<string, number>();
  
  for (const item of items) {
    const date = new Date(item[dateField] as string);
    // Get start of week (Sunday)
    const dayOfWeek = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - dayOfWeek);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    weeks.set(weekKey, (weeks.get(weekKey) || 0) + 1);
  }
  
  // Convert to sorted array
  return Array.from(weeks.entries())
    .map(([weekStart, count]) => ({ weekStart, count }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

// Aggregate topic-level data
export function aggregateByTopic(
  statements: Statement[],
  bills: Bill[],
  votes: Vote[],
  members: CongressMember[],
  topic: TechTopic,
  timeRange: TimeRange
): TopicAggregate {
  const { from, to } = getDateRange(timeRange);
  
  // Filter by topic and date
  const topicStatements = statements.filter(s => 
    s.topics.includes(topic) &&
    s.publishedAt >= from &&
    s.publishedAt <= to
  );
  
  const topicBills = bills.filter(b =>
    b.topics.includes(topic) &&
    b.introducedDate >= from &&
    b.introducedDate <= to
  );
  
  const topicVotes = votes.filter(v =>
    v.topics.includes(topic) &&
    v.date >= from &&
    v.date <= to
  );
  
  // Calculate attention (statements)
  const attentionCount = topicStatements.length;
  const attentionTrend = calculateWeeklyTrend(
    topicStatements.map(s => ({ date: s.publishedAt }))
  );
  
  // Calculate actions (bills + votes)
  const actionCount = topicBills.length + topicVotes.length;
  const actionItems = [
    ...topicBills.map(b => ({ date: b.introducedDate })),
    ...topicVotes.map(v => ({ date: v.date }))
  ];
  const actionTrend = calculateWeeklyTrend(actionItems);
  
  // Top members by attention
  const memberAttention = new Map<string, number>();
  for (const s of topicStatements) {
    memberAttention.set(s.bioguideId, (memberAttention.get(s.bioguideId) || 0) + 1);
  }
  const topByAttention = Array.from(memberAttention.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([bioguideId, count]) => {
      const member = members.find(m => m.bioguideId === bioguideId);
      return { bioguideId, name: member?.name || bioguideId, count };
    });
  
  // Top members by action (sponsors + cosponsors)
  const memberAction = new Map<string, number>();
  for (const b of topicBills) {
    memberAction.set(b.sponsorBioguideId, (memberAction.get(b.sponsorBioguideId) || 0) + 2); // Weight sponsor higher
    for (const cosponsor of b.cosponsorBioguideIds) {
      memberAction.set(cosponsor, (memberAction.get(cosponsor) || 0) + 1);
    }
  }
  const topByAction = Array.from(memberAction.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([bioguideId, count]) => {
      const member = members.find(m => m.bioguideId === bioguideId);
      return { bioguideId, name: member?.name || bioguideId, count };
    });
  
  return {
    topic,
    timeRange,
    attention: {
      count: attentionCount,
      trend: attentionTrend,
      evidenceQuery: generateEvidenceLink({ type: 'statements', topic, dateFrom: from, dateTo: to })
    },
    action: {
      count: actionCount,
      trend: actionTrend,
      evidenceQuery: generateEvidenceLink({ type: 'bills', topic, dateFrom: from, dateTo: to })
    },
    topMembers: {
      byAttention: topByAttention,
      byAction: topByAction
    }
  };
}

// Aggregate member-level data for all topics
export function aggregateByMember(
  member: CongressMember,
  statements: Statement[],
  bills: Bill[],
  votes: Vote[],
  timeRange: TimeRange
): MemberOverview {
  const { from, to } = getDateRange(timeRange);
  
  // Filter by member and date
  const memberStatements = statements.filter(s =>
    s.bioguideId === member.bioguideId &&
    s.publishedAt >= from &&
    s.publishedAt <= to
  );
  
  const memberBillsSponsored = bills.filter(b =>
    b.sponsorBioguideId === member.bioguideId &&
    b.introducedDate >= from &&
    b.introducedDate <= to
  );
  
  const memberBillsCosponsored = bills.filter(b =>
    b.cosponsorBioguideIds.includes(member.bioguideId) &&
    b.introducedDate >= from &&
    b.introducedDate <= to
  );
  
  const memberVotes = votes.filter(v =>
    v.memberVotes.some(mv => mv.bioguideId === member.bioguideId) &&
    v.date >= from &&
    v.date <= to
  );
  
  // Calculate per-topic breakdown
  const topicBreakdown: MemberTopicAggregate[] = [];
  
  for (const topicDef of TECH_TOPICS) {
    const topic = topicDef.id;
    
    const topicStatements = memberStatements.filter(s => s.topics.includes(topic));
    const topicBillsSponsored = memberBillsSponsored.filter(b => b.topics.includes(topic));
    const topicBillsCosponsored = memberBillsCosponsored.filter(b => b.topics.includes(topic));
    const topicVotes = memberVotes.filter(v => v.topics.includes(topic));
    
    const attentionCount = topicStatements.length;
    const actionCount = topicBillsSponsored.length + topicBillsCosponsored.length + topicVotes.length;
    
    const { label: gap, score: gapScore } = calculateGapLabel(attentionCount, actionCount);
    
    topicBreakdown.push({
      bioguideId: member.bioguideId,
      memberName: member.name,
      topic,
      attention: {
        count: attentionCount,
        trend: calculateWeeklyTrend(topicStatements.map(s => ({ date: s.publishedAt }))),
        evidenceQuery: generateEvidenceLink({ type: 'statements', topic, member: member.bioguideId, dateFrom: from, dateTo: to })
      },
      action: {
        count: actionCount,
        billsSponsored: topicBillsSponsored.length,
        billsCosponsored: topicBillsCosponsored.length,
        votesCount: topicVotes.length,
        evidenceQuery: generateEvidenceLink({ type: 'bills', topic, member: member.bioguideId, dateFrom: from, dateTo: to })
      },
      gap,
      gapScore
    });
  }
  
  // Find biggest gaps and most aligned
  const sortedByGap = [...topicBreakdown]
    .filter(t => t.gap !== 'no_data')
    .sort((a, b) => Math.abs(b.gapScore) - Math.abs(a.gapScore));
  
  const biggestGaps = sortedByGap
    .filter(t => t.gap !== 'aligned')
    .slice(0, 3);
  
  const mostAligned = sortedByGap
    .filter(t => t.gap === 'aligned')
    .slice(0, 3);
  
  // Overall totals
  const totalAttention = memberStatements.length;
  const totalAction = memberBillsSponsored.length + memberBillsCosponsored.length + memberVotes.length;
  const { label: overallGap } = calculateGapLabel(totalAttention, totalAction);
  
  return {
    bioguideId: member.bioguideId,
    memberName: member.name,
    party: member.party,
    state: member.state,
    chamber: member.chamber,
    topicBreakdown,
    overallGap,
    biggestGaps,
    mostAligned,
    totalAttention,
    totalAction
  };
}

// Get dashboard summary with top gaps across all members
export function getDashboardGaps(
  memberOverviews: MemberOverview[]
): {
  topGaps: {
    member: { bioguideId: string; name: string; party: string; state: string };
    topic: TechTopic;
    gapLabel: GapLabel;
    attentionCount: number;
    actionCount: number;
    evidenceLink: string;
  }[];
} {
  const allGaps: {
    member: { bioguideId: string; name: string; party: string; state: string };
    topic: TechTopic;
    gapLabel: GapLabel;
    gapScore: number;
    attentionCount: number;
    actionCount: number;
    evidenceLink: string;
  }[] = [];
  
  for (const overview of memberOverviews) {
    for (const topicData of overview.topicBreakdown) {
      if (topicData.gap !== 'aligned' && topicData.gap !== 'no_data') {
        allGaps.push({
          member: {
            bioguideId: overview.bioguideId,
            name: overview.memberName,
            party: overview.party,
            state: overview.state
          },
          topic: topicData.topic,
          gapLabel: topicData.gap,
          gapScore: topicData.gapScore,
          attentionCount: topicData.attention.count,
          actionCount: topicData.action.count,
          evidenceLink: generateEvidenceLink({
            member: overview.bioguideId,
            topic: topicData.topic
          })
        });
      }
    }
  }
  
  // Sort by absolute gap score
  allGaps.sort((a, b) => Math.abs(b.gapScore) - Math.abs(a.gapScore));
  
  return {
    topGaps: allGaps.slice(0, 10).map(g => ({
      member: g.member,
      topic: g.topic,
      gapLabel: g.gapLabel,
      attentionCount: g.attentionCount,
      actionCount: g.actionCount,
      evidenceLink: g.evidenceLink
    }))
  };
}

// Gap label display helpers
export function getGapLabelDisplay(label: GapLabel): { 
  text: string; 
  description: string; 
  color: string;
  icon: string;
} {
  switch (label) {
    case 'high_attention_low_action':
      return {
        text: 'All Talk',
        description: 'High attention (words) but low action (bills/votes)',
        color: 'amber',
        icon: '📢'
      };
    case 'low_attention_high_action':
      return {
        text: 'Quiet Doer',
        description: 'Takes action without much public attention',
        color: 'emerald',
        icon: '🔧'
      };
    case 'aligned':
      return {
        text: 'Aligned',
        description: 'Words and actions are balanced',
        color: 'blue',
        icon: '⚖️'
      };
    case 'no_data':
    default:
      return {
        text: 'No Data',
        description: 'Insufficient data to determine gap',
        color: 'gray',
        icon: '❓'
      };
  }
}

