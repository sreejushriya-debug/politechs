// Tech policy topics and the rules used to classify a bill into them.
// Matching runs on the bill's official title and uses word boundaries, so
// "AI" only matches the acronym (not "maintain") and "chip" never matches
// "partnership". Each pattern here is listed on the methodology page.

export type TopicSlug =
  | "ai"
  | "cybersecurity"
  | "privacy"
  | "kids-online"
  | "antitrust"
  | "telecom"
  | "crypto"
  | "chips"
  | "space";

export interface Topic {
  slug: TopicSlug;
  name: string;
  icon: string;
  description: string;
  // Human-readable list shown on the methodology page
  examples: string[];
  patterns: RegExp[];
  // Optional: a match only counts if one of these also appears
  requires?: RegExp[];
}

export const TOPICS: Topic[] = [
  {
    slug: "ai",
    name: "Artificial Intelligence",
    icon: "🤖",
    description: "Rules for AI systems, deepfakes, chatbots, and algorithms that make decisions about people.",
    examples: ["artificial intelligence", "AI", "machine learning", "algorithm(ic)", "deepfake", "chatbot", "large language model", "automated decision"],
    patterns: [
      /\bartificial intelligence\b/i,
      /\bAI\b/,
      /\bmachine learning\b/i,
      /\balgorithm(s|ic)?\b/i,
      /\bdeep ?fakes?\b/i,
      /\bgenerative\b/i,
      /\bchatbots?\b/i,
      /\bCHATBOT\b/,
      /\blarge language models?\b/i,
      /\bautomated decision/i
    ]
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    icon: "🔒",
    description: "Protecting networks, hospitals, utilities, and government systems from hacks and ransomware.",
    examples: ["cyber…", "ransomware", "data breach", "hacking", "malware", "phishing", "CISA"],
    patterns: [
      /\bcyber/i,
      /\bransomware\b/i,
      /\bdata breach(es)?\b/i,
      /\bhack(ing|ers?)\b/i,
      /\bmalware\b/i,
      /\bphishing\b/i,
      /\bCISA\b/
    ]
  },
  {
    slug: "privacy",
    name: "Privacy & Surveillance",
    icon: "👁️",
    description: "Who can collect your personal data, data brokers, facial recognition, and government surveillance.",
    examples: ["privacy", "surveillance", "FISA", "personal data/information", "data broker", "Section 702", "facial recognition", "biometric", "geolocation", "encryption"],
    patterns: [
      /\bprivacy\b/i,
      /\bsurveillance\b/i,
      /\bFISA\b/,
      /\bpersonal (data|information)\b/i,
      /\bdata brokers?\b/i,
      /\bconsumer data\b/i,
      /\bsection 702\b/i,
      /\bfacial recognition\b/i,
      /\bbiometric/i,
      /\bgeolocation\b/i,
      /\bencrypt/i
    ]
  },
  {
    slug: "kids-online",
    name: "Social Media & Kids Online",
    icon: "📱",
    description: "Social media rules, Section 230, TikTok, and keeping children safe online.",
    examples: ["social media", "Section 230", "online platform", "content moderation", "TikTok", "kids/children/minors + online", "COPPA", "KOSA", "screen time"],
    patterns: [
      /\bsocial media\b/i,
      /\bsection 230\b/i,
      /\bonline platforms?\b/i,
      /\bcontent moderation\b/i,
      /\btiktok\b/i,
      /\b(kids|children|minors|teens?|youth)\b.*\bonline\b/i,
      /\bonline\b.*\b(kids|children|minors|teens?|youth|safety)\b/i,
      /\bCOPPA\b/,
      /\bKOSA\b/,
      /\bchild sexual abuse material\b/i,
      /\bscreen time\b/i
    ]
  },
  {
    slug: "antitrust",
    name: "Big Tech & Competition",
    icon: "⚖️",
    description: "App stores, digital markets, and antitrust action aimed at large tech platforms.",
    examples: ["app store", "big tech", "digital markets", "self-preferencing", "antitrust/monopoly + a tech term"],
    patterns: [
      /\bapp stores?\b/i,
      /\bbig tech\b/i,
      /\bdigital markets?\b/i,
      /\bself-preferenc/i,
      /\b(antitrust|monopol\w*|anticompetitive)\b/i
    ],
    requires: [/\b(app stores?|big tech|digital|online|platforms?|internet|software|data|tech\w*|algorithm\w*)\b/i]
  },
  {
    slug: "telecom",
    name: "Broadband & Telecom",
    icon: "📡",
    description: "Internet access, broadband funding, wireless spectrum, robocalls, and the FCC.",
    examples: ["broadband", "telecom…", "spectrum", "5G/6G", "net neutrality", "FCC", "Communications Act", "wireless", "universal service", "internet", "robocall"],
    patterns: [
      /\bbroadband\b/i,
      /\btelecom/i,
      /\bspectrum\b/i,
      /\b[56]G\b/,
      /\bnet neutrality\b/i,
      /\bFCC\b/,
      /\bFederal Communications Commission\b/i,
      /\bCommunications Act\b/i,
      /\bwireless\b/i,
      /\buniversal service\b/i,
      /\binternet\b/i,
      /\brobocalls?\b/i,
      /\bnext generation 9-1-1\b/i
    ]
  },
  {
    slug: "crypto",
    name: "Crypto & Digital Assets",
    icon: "₿",
    description: "Cryptocurrency, stablecoins, blockchain, and whether the U.S. should have a digital dollar.",
    examples: ["crypto…", "bitcoin", "blockchain", "stablecoin", "CBDC / central bank digital currency", "digital asset/commodity"],
    patterns: [
      /\bcrypto/i,
      /\bbitcoin\b/i,
      /\bBITCOIN\b/,
      /\bblockchain\b/i,
      /\bstablecoins?\b/i,
      /\bCBDC\b/,
      /\bcentral bank digital currenc/i,
      /\bdigital (assets?|commodit)/i
    ]
  },
  {
    slug: "chips",
    name: "Chips & Quantum",
    icon: "🔌",
    description: "Semiconductor manufacturing, the CHIPS Act, microelectronics, and quantum computing.",
    examples: ["semiconductor", "microchip", "CHIPS", "microelectronics", "quantum"],
    patterns: [
      /\bsemiconductors?\b/i,
      /\bmicrochips?\b/i,
      /\bCHIPS\b/,
      /\bmicroelectronics\b/i,
      /\bquantum\b/i
    ]
  },
  {
    slug: "space",
    name: "Space",
    icon: "🚀",
    description: "NASA, satellites, commercial launches, and the U.S. position in space.",
    examples: ["NASA", "outer space", "commercial space", "space launch/station/exploration/…", "satellite", "orbital", "spaceport", "lunar", "Artemis"],
    patterns: [
      /\bNASA\b/,
      /\bNational Aeronautics\b/i,
      /\bouter space\b/i,
      /\bcommercial space\b/i,
      /\bspace (launch|station|force|exploration|flight|weather|debris|industry|commerce|situational|act|program|leadership)/i,
      /\bsatellites?\b/i,
      /\borbital\b/i,
      /\bspaceports?\b/i,
      /\bSPACEPORT\b/,
      /\blunar\b/i,
      /\bArtemis\b/
    ]
  }
];

export const TOPIC_BY_SLUG: Record<TopicSlug, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t])
) as Record<TopicSlug, Topic>;

export function isTopicSlug(value: string | undefined | null): value is TopicSlug {
  return !!value && value in TOPIC_BY_SLUG;
}

export function classifyTitle(title: string): TopicSlug[] {
  return TOPICS.filter(
    (t) =>
      t.patterns.some((p) => p.test(title)) &&
      (!t.requires || t.requires.some((p) => p.test(title)))
  ).map((t) => t.slug);
}
