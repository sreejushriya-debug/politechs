export type Author = {
  slug: string;
  name: string;
  bio: string;
  role?: string;
  school?: string;
  interests?: string[];
  image?: string; // Path to author photo
};

export type Article = {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  publishedAt: string;
  authorSlug: string;
  readTime: string;
  content?: string;
  hasFullContent: boolean;
  // For generated graphics
  graphicColors: [string, string]; // gradient colors
  graphicIcon: string; // emoji or symbol
  // Partnership info
  partnership?: string; // e.g., "Capitol Commentary"
};

// Authors database
export const authors: Author[] = [
  {
    slug: "shriya-sreeju",
    name: "Shriya Sreeju",
    bio: "Shriya Sreeju is a sophomore from Flower Mound, Texas, and a dedicated individual to the fields of political science and finance. Beyond her contributions to Politechs, Shriya is a passionate member of competitive debate and DECA.",
    role: "Founder & Writer",
    interests: ["Political Science", "Finance", "Debate"]
  },
  {
    slug: "eileen-cho",
    name: "Eileen Cho",
    bio: "Eileen Cho is a junior from Dallas, Texas. Eileen's articles for Politechs showcase her dedication and passion for the field. Eileen is also a talented violin player for her symphony orchestra.",
    role: "Contributing Writer",
    interests: ["Technology", "Policy", "Music"],
    image: "/authors/eileen.png"
  },
  {
    slug: "aanya-ujjval",
    name: "Aanya Ujjval",
    bio: "Aanya Ujjval is a sophomore from Austin, Texas, and a dedicated individual to the fields of political science. Beyond Politechs, she is also a competitive member of DECA and Policy Debate.",
    role: "Contributing Writer",
    interests: ["Political Science", "Debate", "Policy"],
    image: "/authors/aanya.png"
  },
  {
    slug: "basma-milha",
    name: "Basma Milha",
    bio: "Basma Milha, an avid learner and writer, excels in both academic and extracurricular domains, dedicating herself to intellectual discourse and exploring the intricacies of the human mind. As a skilled treasurer of a business club, she brings financial expertise to the table, and her captivating public speaking engagements showcase her eloquence and insightful perspectives.",
    role: "Contributing Writer",
    interests: ["Psychology", "Business", "Public Speaking"],
    image: "/authors/basmamilha.jpeg"
  },
  {
    slug: "zaaviyar-malik",
    name: "Zaaviyar Malik",
    bio: "Zaaviyar Malik, who goes by Zavi, is a junior from Houston, Texas. Zavi is committed to the field of computer science and law. Beyond Politechs, Zavi competes in Public Forum Debate.",
    role: "Contributing Writer",
    interests: ["Computer Science", "Law", "Debate"],
    image: "/authors/swag - zavi m (Axtr).jpg"
  },
  {
    slug: "arthur-hu",
    name: "Arthur Hu",
    bio: "Arthur Hu is currently a sophomore from Downingtown Pennsylvania with a passion for political science-based writing. In addition to Politechs, Arthur also excels in debate, state band, and his award-winning political commentary blog, recognized by the Harvard International Review.",
    role: "Contributing Writer",
    interests: ["Political Science", "Debate", "Writing"],
    image: "/authors/arthurhu.jpg"
  },
  {
    slug: "ratul-chakraborty",
    name: "Ratul Chakraborty",
    bio: "Ratul Chakraborty is a junior at Foothill High School in Pleasanton, California. He is the current president and founder of California High School Democrats, Pleasanton Chapter. He also serves in leadership positions at various clubs in his high school, including the quiz bowl, research, and math clubs.",
    role: "Contributing Writer",
    interests: ["Economics", "Politics", "Research"],
    image: "/authors/ratulchakraborty.jpeg"
  },
  {
    slug: "kamila-toor",
    name: "Kamila Toor",
    bio: "Kamila Toor is an Afghan-American high school student with a fervor for writing, politics, and psychology. Kamila is a natural leader with vast creative skills. Dedicated to community betterment, she weaves her passions into impactful articles.",
    role: "Contributing Writer",
    interests: ["Writing", "Politics", "Psychology"]
  },
  {
    slug: "zaina-qureshi",
    name: "Zaina Qureshi",
    bio: "Zaina Qureshi is a freshman from Dallas, Texas. Her contributions to Politechs display her interest and dedication to both the political and scientific fields. Outside of her involvement in Politechs, she is an avid member of HOSA and partakes in competitive archery.",
    role: "Contributing Writer",
    interests: ["Science", "Politics", "Archery"],
    image: "/authors/zainaqureshi.jpeg"
  },
  {
    slug: "vidmahi-tantry",
    name: "Vidmahi Tantry",
    bio: "Vidmahi Tantry is an 11th grade student from Bangalore, India who is deeply interested in International Relations. She is currently studying Business, Economics and Psychology in school and hopes to explore these fields further in the future. Outside of Politechs, she volunteers as an English tutor and enjoys learning about random things.",
    role: "Contributing Writer",
    school: "Bangalore, India",
    interests: ["International Relations", "Business", "Economics"],
    image: "/authors/vidmahi.png"
  },
  {
    slug: "fangyuan-cao",
    name: "Fangyuan Cao",
    bio: "Fangyuan Cao is a sophomore at Miramonte High School. He loves exploring philosophy, economics, politics, and history in his free time. Aside from this, he also enjoys doing art and reading.",
    role: "Contributing Writer",
    interests: ["Philosophy", "Economics", "History"],
    image: "/authors/fangyuancao.jpg"
  },
  {
    slug: "sharvari-mahesh-kumar",
    name: "Sharvari Mahesh Kumar",
    bio: "Sharvari Mahesh Kumar is a 12th grader at NAFL. Her favorite subjects are economics and history. She loves painting and reading books on military history.",
    role: "Contributing Writer",
    interests: ["Economics", "History", "Art"],
    image: "/authors/sharvari.jpeg"
  },
  {
    slug: "qawiyyat",
    name: "Qawiyyat",
    bio: "Qawiyyat is a passionate educator and aspiring lawyer. Currently, she is tutoring grade 10 students in history and teaching History. With a strong background in education, she specializes in creating engaging and informative lessons. She has been fortunate to work with Afghan girls, helping them navigate their educational journey online.",
    role: "Contributing Writer",
    interests: ["Education", "Law", "History"]
  },
  {
    slug: "luke-rowe",
    name: "Luke Rowe",
    bio: "Luke Rowe is a senior at Lake Travis High School. Aside from running track, doing school work, and working at his local golf course, Luke finds passion in law, business, and philosophy. Outside of his responsibilities, Luke loves to paint, play basketball, and go on hikes.",
    role: "Contributing Writer",
    interests: ["Law", "Business", "Philosophy"],
    image: "/authors/lukerowe.jpg"
  },
  {
    slug: "brooke-anderson",
    name: "Brooke Anderson",
    bio: "Brooke is a high school senior and a passionate journalist. Despite living internationally, her life overseas has never kept her from deep political interest and engagement.",
    role: "Contributing Writer",
    interests: ["Journalism", "Politics", "International Affairs"],
    image: "/authors/brooke.jpeg"
  },
  {
    slug: "daniela-mcelfresh",
    name: "Daniela McElfresh",
    bio: "Daniela McElfresh is a Junior in high school living in San Diego. Daniela is an avid writer, and holds a special passion for journalism. Beyond writing, she also participates in Model UN, as she loves to debate and is not scared to raise her voice.",
    role: "Contributing Writer",
    interests: ["Journalism", "Model UN", "Debate"],
    image: "/authors/daniela mcelfresh.jpg"
  },
  {
    slug: "william-spence",
    name: "William Spence",
    bio: "William Spence is a contributing writer at Politechs, focusing on the intersection of democratic processes and technological innovation.",
    role: "Contributing Writer",
    interests: ["Democracy", "Policy", "Technology"]
  },
  {
    slug: "nicole-rapu",
    name: "Nicole Rapu",
    bio: "Nicole Rapu is a dynamic secondary school student from Nigeria, renowned for her unwavering confidence, assertiveness, and creative vision. As the founder of multiple teen organizations, she is a trailblazer in empowering her peers and fostering their active involvement in politics and governance.",
    role: "Contributing Writer",
    interests: ["Youth Empowerment", "Politics", "Leadership"]
  },
  {
    slug: "alaa-sunjuq",
    name: "Alaa Sunjuq",
    bio: "Alaa is a senior from Palestine with a strong interest in physics, politics, and global affairs. Expert in Model United Nations, they enjoy tackling complex issues and fostering discussions on challenging topics, bringing both insight and multi-faceted perspectives into work.",
    role: "Contributing Writer",
    interests: ["Physics", "Politics", "Model UN"],
    image: "/authors/alaa.png"
  },
  {
    slug: "shreya-munjal",
    name: "Shreya Munjal",
    bio: "Shreya Munjal is a passionate high school student fascinated by the topics of politics, public voice and scientific research. She is a writer committed to spreading public awareness of vital issues and promoting new ideas among her readers.",
    role: "Contributing Writer",
    interests: ["Politics", "Science", "Research"],
    image: "/authors/shreyamunjal.jpeg"
  },
  {
    slug: "izis-aidianna-da-silva-chang",
    name: "Izis Aidianna Da Silva Chang",
    bio: "High school student passionate about medieval history and politics, eager to explore the past events and modern governance.",
    role: "Contributing Writer",
    interests: ["History", "Politics", "Governance"],
    image: "/authors/izis.png"
  },
  {
    slug: "aimee-wirajendy",
    name: "Aimee Wirajendy",
    bio: "Aimee Wirajendy is a high school student from Indonesia with a passion for exploring new experiences. She has covered topics ranging from tourist destinations to social media phenomena. When she's not writing, she's probably rotting in her bed and scrolling endlessly on TikTok.",
    role: "Contributing Writer",
    interests: ["Social Media", "Culture", "Writing"]
  },
  {
    slug: "adina-medencevic",
    name: "Adina Medencevic",
    bio: "Adina Medencevic is a junior at Mira Costa High School. She is interested in business and finance, and is passionate about research in the global economy. In her free time, she enjoys traveling, skiing, and playing tennis.",
    role: "Contributing Writer",
    interests: ["Business", "Finance", "Economics"],
    image: "/authors/adina.jpeg"
  },
  {
    slug: "arya-miller",
    name: "Arya Miller",
    bio: "Arya Miller is an 11th grade student at Riverwood International Charter School in Atlanta. She has an interest in legal and STEM related fields.",
    role: "Student Writer",
    school: "Riverwood International Charter School",
    interests: ["Legal Studies", "STEM", "Policy"],
    image: "/authors/aryamiller.jpg"
  },
  {
    slug: "politechs-team",
    name: "Politechs Team",
    bio: "The Politechs editorial team consists of passionate students and researchers dedicated to exploring the intersection of politics and technology. Our team works collaboratively to bring insightful analysis and thought-provoking content to our readers.",
    role: "Editorial Team",
    interests: ["Politics", "Technology", "Civic Engagement"]
  },
  {
    slug: "omar-dahabra",
    name: "Omar Dahabra",
    bio: "Omar Dahabra is a contributing writer focused on immigration policy, civil liberties, and the intersection of corporate interests with government enforcement. His work examines the systemic implications of privatization on democratic accountability.",
    role: "Capitol Commentary Writer",
    interests: ["Immigration Policy", "Civil Liberties", "Corporate Accountability"]
  },
  {
    slug: "samyak-duggirala",
    name: "Samyak Duggirala",
    bio: "Samyak Duggirala is a contributing writer for Capitol Commentary covering U.S. foreign policy, military intervention, surveillance, and the military-industrial complex. His analysis examines the intersection of corporate interests, democratic accountability, and American imperialism.",
    role: "Capitol Commentary Writer",
    interests: ["Foreign Policy", "Military-Industrial Complex", "Surveillance", "Democracy"]
  }
];

// Categories for filtering
export const categories = [
  "All",
  "Democracy & Policy",
  "Technology & Society",
  "Climate & Environment",
  "Data & Privacy",
  "Science & Ethics",
  "International Relations",
  "Media & Communication",
  "Economics & Business",
  "Health & Wellness"
];

// Color schemes for article graphics
const colorSchemes: [string, string][] = [
  ["#3b82f6", "#8b5cf6"], // blue to purple
  ["#ef4444", "#f97316"], // red to orange
  ["#10b981", "#06b6d4"], // green to cyan
  ["#8b5cf6", "#ec4899"], // purple to pink
  ["#f59e0b", "#ef4444"], // amber to red
  ["#06b6d4", "#3b82f6"], // cyan to blue
  ["#ec4899", "#8b5cf6"], // pink to purple
  ["#14b8a6", "#22c55e"], // teal to green
];

// Icons for different categories
const categoryIcons: Record<string, string> = {
  "Democracy & Policy": "🏛️",
  "Technology & Society": "💻",
  "Climate & Environment": "🌍",
  "Data & Privacy": "🔐",
  "Science & Ethics": "🧬",
  "International Relations": "🌐",
  "Media & Communication": "📱",
  "Economics & Business": "📊",
  "Health & Wellness": "🏃"
};

// All articles from the Politechs Thought Gallery
export const articles: Article[] = [
  {
    slug: "profits-over-people-privatization-ice",
    title: "Profits Over People: How Privatization Is Reshaping ICE",
    subtitle: "The Corporate Takeover of Immigration Enforcement",
    description: "Examining how private prison companies are expanding their reach into digital surveillance and immigration enforcement, prioritizing shareholder value over human rights.",
    category: "Policy & Governance",
    publishedAt: "2025-12-25",
    authorSlug: "omar-dahabra",
    readTime: "6 min read",
    hasFullContent: true,
    graphicColors: ["#dc2626", "#7c3aed"],
    graphicIcon: "⚖️",
    partnership: "Capitol Commentary",
    content: `The increasing entertainment of corporate control and immigration enforcement has reflected how the state is prioritizing profits over humanity. For the past few years, private prisons have steadily expanded their reach beyond detention centers and into digital monitoring, surveillance, and immigration enforcement. Recently, <a href="https://theintercept.com/2025/12/19/ice-bounty-hunters-location-surveillance-geo-group/" target="_blank" rel="noopener noreferrer">BI Incorporated, a subsidiary of GEO Group, obtained a contract with ICE</a> for location-tracking and other enforcement services. This recent development sits at the center of a larger pattern of outsourcing state power to companies whose primary motivation isn't the benefit of the public, but rather value for shareholders.

## The Corporate Carceral State

The corporate carceral state, even outside the lens of immigration, has for decades been reorganized around market incentives. As a result, the <a href="https://www.prisonpolicy.org/profiles/US.html" target="_blank" rel="noopener noreferrer">United States has amassed the largest incarceration rate in the world</a>. Private prison firms have lobbied in recent years for immigration strategies that focus on detention, not because of any consideration for humanity, but because they provide revenue streams. When slavery was abolished with the 13th Amendment, an exception was carved out for prisoners, and <a href="https://www.epi.org/publication/rooted-racism-prison-labor/" target="_blank" rel="noopener noreferrer">this carveout continues to be exploited by the private prison system</a>, directly rooted in the legacies of slavery. Now that corporations directly benefit from monitoring immigrants and later housing them in the facilities they operate, deportation is no longer an instrument of policy but one of the economy.

## Surveillance as a Substitute for Due Process

Also troubling is the expansion of surveillance in the context of it acting as a substitute for constitutional due-process. As BI Incorporated themselves market the monitoring through GPS tracking, they are new "community-based alternatives" for traditional applications of the law. When digital tracking is administered through private vendors, traditional safety mechanisms designed through courts and government institutions to provide accountability are fragmented. Even when immigrants are free and live outside the walls of detention, their daily existence is shaped by <a href="https://theconversation.com/always-watching-how-ices-plan-to-monitor-social-media-24-7-threatens-privacy-and-civic-participation-268175" target="_blank" rel="noopener noreferrer">constant monitoring, whether outside or on social media</a>.

## Human Rights Concerns

The moral stakes of this privatization become even more abhorrent when placed in the context of the conditions of abuse and neglect that occur inside these private detention centers. In such centers, investigations have repeatedly uncovered failures in basic safety standards, a lack of medical care, and <a href="https://phr.org/our-work/resources/endless-nightmare-solitary-confinement-in-us-immigration-detention/" target="_blank" rel="noopener noreferrer">violations of human rights</a>. These are the direct natural conclusions of a model built around the containment of cost and prioritization of profit. When the corporate ecosystem is now handed greater control over enforcement, human rights are overlooked in the name of "shareholder value."

## The Erosion of Democratic Accountability

This privatized enforcement has dispersed state power into networks of contracts that are harder to challenge due to less accountability and harder for communities to confront. Once functions meant for the public move into the hands of the private, any means of responsibility disappear. Decisions that determine who is detained and separated from their family are increasingly moved towards meetings rather than in courtrooms.

Society shouldn't be willing to accept a model where corporations are the actors of policy rather than elected officials. These developments in ICE enforcement should be understood as a warning for the trend of governance towards other areas of policy. They reveal a trajectory where democracy dies in the wake of capitalism.`
  },
  {
    slug: "eunice-foote-inspiring-the-future",
    title: "Eunice Foote Inspiring The Future",
    subtitle: "How a 19th Century Scientist Laid the Groundwork for Climate Science",
    description: "Exploring Eunice Newton Foote's groundbreaking 1856 experiments on greenhouse gases and her lasting impact on climate science.",
    category: "Science & Ethics",
    publishedAt: "2025-08-23",
    authorSlug: "shreya-munjal",
    readTime: "8 min read",
    hasFullContent: true,
    graphicColors: ["#10b981", "#06b6d4"],
    graphicIcon: "🔬",
    content: `Eunice Newton Foote was born on July 17, 1819, in Southampton, New York. She had many interests in the scientific field, specifically atmospheric science, even as women have been excluded from medical research and such fields in large part. Foote attended <a href="https://www.emmawillard.org/" target="_blank" rel="noopener noreferrer">Troy Female Seminary</a>, one of the few establishments within the early 19th century that allowed women formal education beyond the basics. Here, she advanced her skills in the science field which would eventually lead to her discoveries in atmospheric gases and the effect of greenhouse gases. Despite societal policies that confined ladies's involvement in technology, Foote had an interest in studying plants, causing her to be one of the most influential people to explore climate science.

## The 1856 Experiment

In 1856, Eunice Foote conducted a series of experiments to discover the effect of daylight on numerous gases, making it one of the earliest signs of research related to greenhouse gases. Using glass cylinders, she filled one with ordinary air and the other with carbon dioxide and placed them in the daylight to measure temperature changes. Foote determined that the carbon dioxide cylinder always showed higher temperatures than the cylinder of ordinary air, causing her to conclude that carbon dioxide had a greater capacity to hold warmth.

This has become an impactful discovery as it related the presence of carbon dioxide to weather changes before other scientists could notice. Foote's test and findings supplied essential information about how certain gases make warmth and gave ideas about the cause of the Earth's climate warming. Her findings were published in <a href="https://www.jstor.org/journal/amerjscie" target="_blank" rel="noopener noreferrer">The American Journal of Science</a> in 1856, where they recognized this heating effect of carbon dioxide, foreshadowing the debate about greenhouse gases and weather exchange.

## Scientific Predecessors

Scientists that have discoveries that influenced Eunice Foote include John Dalton and his study of the behavior of gases underneath great pressures. Dalton, an English chemist and physicist, is very popular for formulating Dalton's Law of Partial Pressures in 1801, which states that during a mixture of non-reacting gases, each gas develops a voltage independently of the others, and the total voltage is the sum of the partial pressures of the gases.

This became important for information on how gases behave in the transformation of temperatures and pressures and therefore laid the foundation for later research on the behavior of gases. Additionally, Dalton's work on the atomic nature of matter and the molecular composition of gases provided an important basis for Foote's research on atmospheric gases.

## Scientific Successors

Following Foote's initial observations, other scientists improved on her findings and provided more data that supported our information on climate science. <a href="https://www.britannica.com/biography/John-Tyndall" target="_blank" rel="noopener noreferrer">John Tyndall</a>, a physicist who conducted research on the absorption of infrared radiation by way of gas in 1861, has become one of the greatest successors of Foote's artwork. Although Tyndall's experiments weren't the same as Foote's, they showed Foote's findings about the warmth-retaining properties of gases, especially carbon dioxide and water vapor.

In the 19th century, Swedish chemist <a href="https://www.nobelprize.org/prizes/chemistry/1903/arrhenius/biographical/" target="_blank" rel="noopener noreferrer">Svante Arrhenius</a> observed Tyndall's findings and became the first scientist to quantify the greenhouse effect. Arrhenius used Foote's and Tyndall's findings to understand further how carbon dioxide would affect worldwide temperatures, predicting that rising carbon dioxide concentrations might lead to tremendous warming of the Earth's bottom.

In the 1930s, British engineer Guy Stewart Callendar persisted in this research and observed a correlation between the stages of carbon dioxide and rising temperatures. Callendar's studies delivered global warming to the general public, leading to ground-breaking discoveries that no scientist had reached before.

## Legacy

Eunice Newton Foote's work laid the groundwork for amazing discoveries related to greenhouse gases from the heat-trapping properties of carbon dioxide. Despite the obstacles she faced as a lady in nineteenth-century America, her experiments opened the door to future research and also suggested an idea of these greenhouse gasses causing harm to the planet.

Her observations inspired scientists including Tyndall, Arrhenius, and Callendar, who added to her findings and organized the framework for climate science and potential threats that can be opposed to the earth. Eunice Foote's legacy lives on as a testament to the importance of interest, resilience, and scientific inquiry despite any societal boundaries.`
  },
  {
    slug: "cc-surveillance-has-wings-now",
    title: "Surveillance Has Wings Now",
    subtitle: "",
    description: "December 1, 2025  In America, our surveillance state rarely announces its next evolution with a press conference or any official announcement. Instead, it creeps forward in procurement filing and vagu...",
    category: "Policy & Governance",
    publishedAt: "2025-12-01",
    authorSlug: "omar-dahabra",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#7c3aed", "#3b82f6"],
    graphicIcon: "⚖️",
    partnership: "Capitol Commentary",
    content: `In America, our surveillance state rarely announces its next evolution with a press conference or any official announcement. Instead, it creeps forward in procurement filing and vague "requests for information" that seem innocuous until you read the fine print. The FBI's recent request for AI-enhanced surveillance drones equipped with facial recognition, weapons detection, and mass-tracking capabilities signals one of those silent but seismic shifts. It is a blueprint for a dystopian future where aerial monitoring, even of peaceful, constitutionally protected activity, becomes unaccountable.

AI-powered surveillance doesn't just expand state power; it erases any boundaries between investigation and mass monitoring of all. As Matthew Guariglia of the Electronic Frontier Foundation told The Intercept, these systems are "built to do indiscriminate mass surveillance of all people." And while the language and rhetoric of the FBI's request may invoke "public safety," history tells a different story: tools built for terrorism and crime prevention inevitably end up turned on protesters and marginalized communities.

The U.S. government has repeatedly used aerial technologies to monitor political speech, often in defiance of constitutional norms. During the George Floyd protests of 2020, the DHS deployed Predator-class drones over Minneapolis, later expanding operations to at least 15 cities. The U.S. Marshals Service also used drones to record demonstrators in Washington, D.C., showing the history of this technology's use. What the FBI now seeks is not merely more drones, but drones driven by AI, systems able to identify faces, scan license plates, chart movement patterns, and detect "anomalous behavior" without any human oversight. Real-time facial recognition deployed at demonstrations, beyond having high potential for government abuse, chills participation and undermines the freedoms of association and assembly, even perceptually. The FBI's request sits atop a decade of precedent in which every new surveillance tool ends up pointed at those demanding justice rather than those committing violence.

While the Bureau pitches weapon-detection AI as a safety tool, the technology's current reality is closer to science fiction than reliability. As an example, school AI weapons-detection systems repeatedly misidentified everyday objects as firearms and failed to detect actual guns in monitored environments. These systems don't just "make mistakes," they generate false alerts that escalate police encounters, creating even greater danger in communities where armed responses are already the norm. "No company has yet proven that AI firearm detection is a viable technology," as Guariglia told The Intercept. A misread shadow could trigger a police response with lethal consequences.

Modern surveillance doesn't expand through sweeping new laws out in the open. It grows through quiet "mission creep", in which agencies justify new tools under narrow circumstances and gradually broaden their use. Documents obtained by The ACLU show that "public safety drone programs" at local police departments evolve into wide-ranging aerial monitoring systems deployed at parades, community gatherings, and peaceful demonstrations. New York City offers a cautionary example. The NYPD's drone flights increased 3,200% between 2019 and 2024, but faced minimal oversight and repeated uses unrelated to emergencies. The FBI's proposed AI-powered drones would accelerate this dynamic dramatically. Because they are not merely. Their interpretations, embedded with algorithmic bias, disproportionately misidentify Black, Brown, and immigrant faces.

The FBI's pursuit of AI-enabled surveillance drones is not a technical upgrade; it is an authoritarian escalation. It represents a transition from human-directed monitoring to automated dystopia, where a flying camera powered by machine learning becomes the first arbiter of who is dangerous, who is suspicious, and who deserves police attention.

— Omar Dahabra`
  },
  {
    slug: "controversies-and-dieting",
    title: "Controversies and Dieting",
    subtitle: "A Scientific Analysis of Low-Carb Diets vs Intermittent Fasting",
    description: "Examining the scientific evidence behind low-carbohydrate diets and their effectiveness compared to intermittent fasting.",
    category: "Health & Wellness",
    publishedAt: "2025-08-01",
    authorSlug: "shreya-munjal",
    readTime: "7 min read",
    hasFullContent: true,
    graphicColors: ["#f59e0b", "#ef4444"],
    graphicIcon: "🥗",
    content: `Obesity and poor metabolic health are increasing, especially in the U.S., where over 42% of adults are classified as obese. Among strategies to address this, low-carbohydrate diets have proven to be an effective method for weight loss and improving health. Though intermittent fasting (IF) has gained popularity recently, data shows low-carb diets help faster fat loss but also improve blood sugar control, preserve muscle mass, and have cognitive and cardiovascular benefits, especially when compared to IF's long-term concerns.

## Scientific Evidence for Low-Carb Diets

A study published in the <a href="https://www.cambridge.org/core/journals/british-journal-of-nutrition" target="_blank" rel="noopener noreferrer">British Journal of Nutrition</a> found participants on low-carb diets lost more weight than people on low-fat diets in six-months of this study (Naude et al., 2014). In one study published in the <a href="https://www.nejm.org/" target="_blank" rel="noopener noreferrer">New England Journal of Medicine</a>, there was an experiment to see the difference between low-carb and low-fat diets. People who did the low-carb diet lost about 5.8 kg over 12 months, compared to 1.9 kg lost by people on a calorie-restricted low-fat diet (Shai et al., 2008).

This is due to reduced insulin levels, which causes the body to burn fat for energy instead of storing it. Unlike IF, which uses meal timing and quantity and overlooks nutrition of a meal, low-carb diets address the true causes of gaining weight and create a balanced meal.

## Comparing Low-Carb to Intermittent Fasting

Cutting carbohydrates reduces insulin spikes, stabilizes blood sugar, and reduces appetite over time. This helps reduce calorie intake without feeling hungry, making the diet easier to stick to. A randomized trial published on <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer">PubMed</a> also showed that individuals on a ketogenic low-carb diet had more muscle mass while reducing fat mass, compared to those on a standard calorie-restriction diet.

Proponents of intermittent fasting often cite studies where participants who fasted for 8-10 hours per day experienced slightly more weight loss than those who just restricted calories. However, these studies often fail to control for macronutrient quality—meaning that the benefits could just as easily be attributed to lower calorie intake rather than the timing of food.

One highly cited study in the New England Journal of Medicine (Liu et al., 2022) showed only a 1.7 kg difference between time-restricted eating and standard calorie restriction over an entire year. This minimal difference, though statistically significant, hardly justifies choosing a method that many find socially restrictive and difficult to maintain in the long run.

## Cognitive and Gut Health Benefits

A less known but important benefit of low-carb diets is that they help cognitive function. Diets such as ketogenic (a form of low-carb) reduce brain fog, improve memory, and help hold back neurological conditions like epilepsy and early-stage Alzheimer's disease. A paper in Frontiers in Nutrition explained the neuroprotective positive impacts of ketones (created when restricting carbs) on clarity in the brain's function and increased brain energy.

Furthermore, low-carb diets improve gut health and reduce systemic inflammation. By stopping the consumption of carbs and sugars, people on low-carb diets have reduced inflammation (such as C-reactive protein) and improved gut microbiome diversity when they prioritize vegetables which are filled with fibers and healthy fats.

## Conclusion

Low-carb diets are a stable solution not only for losing weight but to also increase metabolic, cardiovascular, and neurological health. There has been so much data supporting low-carb diets, including randomized trials on PubMed and studies published by qualified nutritionists. This shows its benefits over diets like intermittent fasting, which rely on small gains and may accidentally encourage non-nutritional eating. By stabilizing insulin levels and encouraging the consumption of nutrient-dense foods, low-carb plans are scientifically proven as the best long-term solution.`
  },
  {
    slug: "the-threat-voter-purges-and-voter-id-laws-pose-on-our-right-to-vote",
    title: "The Threat Voter Purges and Voter ID Laws Pose on Our Right to Vote",
    subtitle: "A legal and civil rights issue",
    description: "Examining how voter purges and strict ID requirements impact democratic participation and access to the ballot box.",
    category: "Democracy & Policy",
    publishedAt: "2025-03-31",
    authorSlug: "arya-miller",
    readTime: "10 min read",
    hasFullContent: true,
    graphicColors: ["#3b82f6", "#8b5cf6"],
    graphicIcon: "🗳️",
    content: `In 1962, Fannie Lou Hamer entered a polling place intending to cast her vote for president, only to be immediately turned away. "No coloreds allowed!" they shouted at her. In 2017, Taylor McClark walked into her local polling station to vote for senator and was similarly turned away shortly after entering. "Photo ID required!" they yelled at her. Although more than fifty years separated these events, both women—African Americans—were denied their fundamental right to vote. Hamer was barred by discriminatory practices despite the 19th Amendment, which had extended voting rights predominantly to white women, while McClark was prevented from voting due to Alabama legislation mandating photo identification. Elections, whether local or national, profoundly impact the livelihoods of countless individuals. Thus, ensuring voting accessibility for all eligible voters is essential for upholding our nation's core values and protecting citizens' welfare. Consequently, voting rights and election integrity remain among the most pressing legal issues in the United States today, just as they were over half a century ago.

Since the Supreme Court's decision in <a href="https://www.brennancenter.org/our-work/court-cases/shelby-county-v-holder" target="_blank" rel="noopener noreferrer">Shelby County v. Holder (2012)</a>, more than half of U.S. states have enacted laws imposing strict voter ID requirements, restricting access to early voting, and purging voter rolls—actions that disproportionately affect marginalized communities. Substantial evidence highlights the discriminatory impact of strict voter ID laws on voters of color. For instance, a 2021 study by Phoebe Henninger, Marc Meredith, and Michael Morse examined affidavits from randomly selected precincts during the 2016 presidential election, revealing that approximately 0.45 percent of voters lacked proper identification. More significantly, minority voters were about five times more likely than white voters to lack access to acceptable IDs.

Similarly, in Texas, Bernard L. Fraga and Michael G. Miller analyzed approximately 16,000 "Reasonable Impediment Declarations" (RIDs) filed by voters without IDs during the 2016 election. Their research found that voters filing RIDs were disproportionately Black and Latino compared to those voting with standard IDs. Furthermore, socioeconomic hardship was among the most commonly cited barriers to obtaining identification. These findings clearly demonstrate that strict voter ID laws unjustly prevent many minority voters, who are otherwise eligible and willing, from exercising their right to vote. Therefore, proactive measures must be taken to address and correct these voter-suppression policies.

Furthermore, mass voter purges significantly contribute to the systematic disenfranchisement of citizens. Although initially intended to responsibly maintain voter rolls, these purges are increasingly used by states as tools of mass disenfranchisement. Removing eligible voters from rolls due to inaccurate data or unjustified reasons is unethical and violates citizens' rights. Often, these purges occur without adequate notice, leaving voters unaware until Election Day, when there is insufficient time to correct the issue.

Election administrators, responsible for updating voter rolls by removing deceased, relocated, or otherwise ineligible voters, frequently execute these purges. Unfortunately, flawed processes, inaccurate data, and improper targeting—such as purging voters with felony convictions without following federally mandated safeguards—often lead to wrongful disenfranchisement. For example, in 2016, a data error by the Arkansas Secretary of State's office resulted in the removal of numerous eligible voters. Over 4,000 individuals without felony convictions, along with ex-felons who had regained their voting rights, were mistakenly flagged as ineligible by the Arkansas Crime Information Center. Deeper analysis of such incidents reveals further systematic disenfranchisement, as Black Americans disproportionately represent the ex-felon population.

While voter suppression affecting communities of color may seem straightforward to address by overturning recent restrictive laws, the problem is systemic and requires significant and sustained action. Nevertheless, meaningful steps can be taken to counteract these inequalities and implement federal protections. For instance, in 2011, Kansas Secretary of State Kris Kobach promoted a law requiring Kansans to provide "proof of citizenship" documents, such as passports or birth certificates, to register to vote. Since most Americans do not regularly carry these documents, the law prevented more than 30,000 Kansans from registering. The <a href="https://www.aclu.org/" target="_blank" rel="noopener noreferrer">American Civil Liberties Union (ACLU)</a> challenged and successfully overturned this law in 2018, a ruling upheld in 2020 by both the Supreme Court and the 10th Circuit Court of Appeals.

These examples illustrate effective actions to ensure equitable voting access and provide guidance for addressing ongoing voter suppression. However, combating voter suppression is not solely the responsibility of national organizations—citizens at all levels can and should become involved. One crucial step eligible voters can take is urging Congress to pass the <a href="https://www.congress.gov/bill/118th-congress/house-bill/14" target="_blank" rel="noopener noreferrer">Voting Rights Advancement Act (VRAA)</a>, which would restore essential protections weakened by the Supreme Court's 2013 decision to dismantle parts of the Voting Rights Act.

Voter fraud is frequently cited to justify restrictive voter ID laws that disproportionately disenfranchise socially and economically disadvantaged voters. In reality, voter fraud consists of isolated incidents, representing only a tiny fraction of total votes cast, and research consistently demonstrates that voter fraud has never significantly impacted the outcome of an election. Nevertheless, repeated false claims of widespread voter fraud result in policies that unjustly impede millions of eligible citizens from voting.

It is essential that we move beyond restrictive voter ID laws and pursue election-security measures that also increase voter participation, including secure automatic voter registration, consistent and transparent election audits, reliable voter-roll maintenance with strong safeguards against wrongful purging, and accessible, cost-free voter identification for all citizens. Ensuring fair, equal, and broad voter participation is fundamental to our democracy and our future, making voting rights perhaps the most pressing legal issue of our time.`
  },
  {
    slug: "the-future-of-crypto",
    title: "The Future of Crypto",
    subtitle: "Exploring the future of cryptocurrency as a payment method in international trade",
    description: "Analyzing the trajectory of cryptocurrency and its potential impact on financial systems and governance.",
    category: "Economics & Business",
    publishedAt: "2025-02-11",
    authorSlug: "adina-medencevic",
    readTime: "6 min read",
    hasFullContent: true,
    graphicColors: ["#f59e0b", "#ef4444"],
    graphicIcon: "₿",
    content: `Envision a global marketplace where businesses can effortlessly engage in international trade, unburdened by currency conversion, banking fees, or political barriers. As society continues to progress, we are beginning to see cryptocurrency as tomorrow's international trade payment method.

## What is Cryptocurrency and How Does it Work?

Cryptocurrency is a virtual currency that enables secure transactions through cryptographic techniques, existing only electronically and through decentralized networks. Cryptocurrency does not rely on banks for transactions, and this digital payment system allows anyone anywhere to receive or send payments instantly. The cryptocurrency payments exist as digital entries to an online database describing specific transactions, and the currency is stored in digital wallets.

Cryptocurrency received its name due to its use of encryption to verify transactions, hence providing additional security to its users. When transmitting cryptocurrency between public ledgers and wallets, complex coding procedures monitor that the transaction is safe and secure.

Cryptocurrency runs on a record of all transactions held by currency holders, known as a <a href="https://www.investopedia.com/terms/b/blockchain.asp" target="_blank" rel="noopener noreferrer">blockchain</a>, and cryptocurrency units are created through mining. Mining is when coins are generated through computer power solving complex mathematical problems, but users can also purchase the cryptocurrencies from brokers. Cryptocurrency is not tangible—think of it as a "key" to move a record or measurement unit from one person to another without a middleman, or third party.

## Cryptocurrency and the Future of International Trade

Since 2009, cryptocurrencies have been continuing to emerge, and more financial uses of this blockchain technology are expected in the future. It is rapidly changing the global economy, especially because of its decentralization which allows for businesses to reduce costs while streamlining operations. Using cryptocurrencies in international trade holds key benefits, transforming the new global economic procedures.

For companies involved in international trade, the use of cryptocurrency globally is extremely advantageous as these transactions can be completed significantly faster than traditional banking methods, and with lower transaction fees. This digital currency does not belong to any specific country, simplifying the complexities of currency exchange and conversions, allowing for a notably smoother and simpler transaction process.

Additionally, the use of blockchain technology in cryptocurrency makes it an ideal payment method for international trade. Because the blockchain is a distributed ledger that records all transactions across a network of computers, it is almost impossible to alter the transaction data. This allows for an extra layer of security when trading internationally.

The global integration of cryptocurrency promises significant simplifications and safety when dealing with international trade. The benefits are clear—society will see a decrease in corruption, an increase in transparency, and small businesses will now have access to the global market, previously excluded due to financial constraints. As cryptocurrency continues to pave its way onto a global economic scale, it will reshape our economy to a more equitable and inclusive environment.

## The Transition from Traditional Banking Methods to Cryptocurrency

Traditional banking methods when trading internationally involve multiple third parties and span over a few days to complete the transaction. When performing international trade, the traditional method includes bringing in a third-party financial provider certified to remove supply and payment risks from the global operations. For international transactions, the currency will have to be converted to the respective currency of the country where the transaction was sent to. This causes currency conversion issues and large amounts of fees through these international transactions.

Now, with cryptocurrency, our future is promised with smooth and secure international trades and transactions. In this digital age, cryptocurrency will redefine the ways businesses engage in worldwide economic affairs, promising an enhanced alternative to traditional banking systems. The integration of this digital currency through blockchain technology fosters a more inclusive and accessible global marketplace. The future of cryptocurrency as a payment method in international trade is not just a possibility—it is an inevitable step toward a more streamlined, secure, and inclusive global economy.`
  },
  {
    slug: "cc-iraq-2-0-venezuela",
    title: "Iraq 2.0: Venezuela",
    subtitle: "",
    description: "November 19, 2025  The renewed escalation toward U.S. military intervention in Venezuela feels less like a fresh strategy of conflict and more like a tragic reprise of a script Washington never learne...",
    category: "Policy & Governance",
    publishedAt: "2025-11-19",
    authorSlug: "omar-dahabra",
    readTime: "4 min read",
    hasFullContent: true,
    graphicColors: ["#059669", "#10b981"],
    graphicIcon: "🏛️",
    partnership: "Capitol Commentary",
    content: `The renewed escalation toward U.S. military intervention in Venezuela feels less like a fresh strategy of conflict and more like a tragic reprise of a script Washington never learned to stop performing, throughout the many years of the "war on terror." Official statements frame the buildup of warships and surveillance aircraft in the Caribbean as "counter-narcotics operations," yet this framing collapses under scrutiny. The United States is massing significant military power offshore, while the administration leans on rhetorical devices like "narco-terrorism" to cast Nicolás Maduro as a global menace, precisely the kind of elastic threat label that has historically smoothed America's path to war.

What makes this moment so chilling is how directly it echoes the flawed assumptions that led the United States into Iraq. The Senate Intelligence Committee's Phase II findings established that the Bush administration "repeatedly presented intelligence as fact when in reality it was unsubstantiated, contradicted, or even non-existent". Those conclusions, once dismissed as partisan, are now part of the historical record. The Committee determined that the most alarming judgments in the 2002 National Intelligence Estimate were "overstated or unsupported," an indictment of the threat-inflation that became the foundation for war. To watch the same architecture of narrative-building re-emerge around Venezuela, claims of hidden criminal networks, global terror linkages, and emergency powers, is to witness history attempting, once again, to repeat its darkest mistakes.

And just as in 2002, the media ecosystem is already softening the ground. During the Iraq buildup, major outlets amplified administration claims in the name of sober expertise. The New York Times itself eventually conceded its coverage "wasn't as rigorous as it should have been," acknowledging that it gave disproportionate weight to officials eager to make the case for invasion. Today's early Venezuela coverage is beginning to trace similar patterns to what we saw earlier: presenting naval deployments as routine, accepting "limited strike" language at face value, and framing escalation as a technocratic calibration rather than a pivot toward open conflict.

Those who claim Venezuela is "different" often point to narrow military objectives or insist that the United States is not seeking regime change. But foreign policy experts warn that this belief in controlled outcomes is a fantasy. As the Stimson Center cautions, "a war in Venezuela would not solve Latin America's drug or dictator problems" and would instead trigger cascading instability across an already fragile region. These assessments are not ideological; they are warnings from institutions familiar with the contours of failed interventions.

The legal justification for escalation also mirrors wars in the Middle East. The Bush administration relied on overbroad interpretations of the 2001 Authorization for Use of Military Force, stretching its reach far beyond any reasonable intent. Now, the Venezuela narrative is being routed through a similar loophole: reclassifying geopolitical confrontation as "counter-narcotics" enforcement. The U.S. has a long pattern of waging war "based on false and overstated intelligence" and dressing exceptional violence in the language of technical necessity.

The conviction that America can topple governments and manage the aftermath has been disproven repeatedly. Iraq's collapse into sectarian violence was not the product of bad luck but of a fundamental misreading of power vacuums and post-regime realities; U.S. planners assume that political institutions would endure the shock of intervention, or just simply don't care. Instead, they crumble. Venezuela, already grappling with economic crisis, mass migration, and eroded infrastructure, is even less equipped to absorb such a blow. Intervention would not create stability; it would detonate what remains of the state.

And yet, despite two decades of empirical evidence, Washington continues to treat war as a manageable instrument. As tensions rise in the Caribbean, commentators are already recycling the language of "limited strikes" and "measured responses," the same euphemisms that obscured the real magnitude of the Iraq invasion until it was irreversible. Any U.S. miscalculation, a naval confrontation, an armed retaliation, or a misidentified target could rapidly escalate a regional standoff into a full-spectrum conflict.

The lesson Iraq left us, taught in blood, debt, and global distrust, was that war is never as clean, controlled, or righteous as its architects promise. Venezuela is not an exception. It is a warning. And if the United States once again confuses military coercion for political wisdom, the next generation will inherit the consequences, just as this one inherited the ghosts of Baghdad. The real question is not whether we can stop another misguided war. It is whether we are willing to learn from the last one before it is too late.

— Omar Dahabra`
  },
  {
    slug: "brain-rot",
    title: "Brain Rot",
    subtitle: "A Blessing or a Curse?",
    description: "Exploring the cognitive effects of excessive digital consumption and its societal implications.",
    category: "Technology & Society",
    publishedAt: "2025-02-11",
    authorSlug: "aimee-wirajendy",
    readTime: "5 min read",
    hasFullContent: true,
    graphicColors: ["#8b5cf6", "#ec4899"],
    graphicIcon: "🧠",
    content: `The word "brain rot" isn't unfamiliar to us by now. We've all encountered it, seen it, heard it, or even used it in our daily lives. Brain rot was first popularized in 2010 and soon grew more popular in the 2020s. 2024 was probably the peak of brain rot where many memes and Gen Alpha slangs were displayed and used across social media platforms like <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>, Instagram, YouTube, and others.

## What is Brain Rot?

According to <a href="https://www.dictionary.com" target="_blank" rel="noopener noreferrer">dictionary.com</a>, brain rot is a slang term used to describe the effects of being "perpetually online" and consuming large amounts of low-value internet content. Back in 2007, brain rot was used in Twitter (X), to describe dating game shows, video games, and hanging out online. Later on, it was introduced more in the app Discord where people used it for internet memes. The effect of brain rot can be easily seen in the rising gen alphas who can't go a day without singing Sigma Sigma Boy.

## Is Brain Rot Good or Bad?

Being brain-rotted doesn't necessarily mean it's a bad thing. Some people might even start using brain rot to their benefit. As it's a popular slang used by many people; by understanding brain rot you can join in other people's conversations without feeling left behind or confused. It can even help some people socialize and make new friends! The creators of brain rot also get many benefits for example: Betsy and Maria Yankovskaya who are the singers of Sigma Boy have performed many successful concerts with engaging crowds thanks to their viral song.

However, there are some drawbacks to the rising brain rot trend. Although I am a culprit myself, I do admit that the use of brain rot in real life can often be seen as cringe and annoying by other people. Whenever I see someone singing the new KSI song: Thick Of It in public, I would feel secondhand embarrassment. Some people may find it funny but many people may find it disturbing, especially the older generations who do not understand brain rot.

## Why Do We Love Brain Rot?

Brain Rot is most commonly used by the Gen Alphas. Gen Z used to critique the use of Brain Rot yet they use it themselves in their daily lives. But why are all these young generations obsessed with brain rot? It's meaningless online content that "rots" your brain. The trend first started with Skibidi Toilet. Yeah, we all remember that video of a guy's head popping out from a closet.

I remember seeing videos on my FYP (For You Page) about people unboxing their surprise skibidi toilet toy. Next, it evolved to the looksmaxxing trend where people would "mew" to somewhat make their jawline sharper. Other popular brain rots are: Chill Guy (which I think originated from someone's OC on Twitter/X), Only in Ohio (a trend that relates every weird and horrible thing to Ohio), and Queen Never Cry (from a webtoon called Ki Sisters).

Brain rot serves as a comedic way to express ourselves with jokes and silly memes with our friends. Most of my friends know it's cringe. They're using brain rot while being aware it's weird. So brain rot is not dangerous or anything—as long as we don't overdo it.

In conclusion, brain rot neither serves as a blessing nor a curse. It's up to us to interpret it based on our views. We can see brain rot as something humorous yet some may see it as something weird. But that's okay! Everyone has their own opinion about this topic and we should respect each view.`
  },
  {
    slug: "usa",
    title: "USA",
    subtitle: "A History Behind Gun Violence and Rights",
    description: "An analysis of current political dynamics and challenges facing the United States.",
    category: "Democracy & Policy",
    publishedAt: "2024-11-02",
    authorSlug: "izis-aidianna-da-silva-chang",
    readTime: "6 min read",
    hasFullContent: true,
    graphicColors: ["#ef4444", "#3b82f6"],
    graphicIcon: "🇺🇸",
    content: `From its inception, the USA has been a country surrounded by immense discourse about some of its controversial decisions and events. At the very start of its creation European sailors voyaged across the Atlantic hoping to discover new lands. First, it was the Dutch who settled in modern-day New York renaming it 'New Amsterdam' then the more infamous settlers came the British. Sir Walter Raleigh and others set up colonies in Virginia, Massachusetts, and Roanoke. At first, they were civil with the natives but over time they became increasingly hostile to the Natives, tensions increased and physical altercations took place.

First, they turned on them then the tumultuous cycle repeated with the British. This led to the <a href="https://www.archives.gov/founding-docs/declaration-transcript" target="_blank" rel="noopener noreferrer">Declaration of Independence</a> in 1776. Then following the revolution, the First and Second Amendments and the Bill of Rights followed shortly. These laws granted Americans many rights the most significant being the right to bear arms, freedom of speech, freedom of assembly, freedom of information, and freedom of law.

The <a href="https://constitution.congress.gov/constitution/amendment-2/" target="_blank" rel="noopener noreferrer">Second Amendment</a> allowing Americans to bear guns is particularly a common topic of discourse. It was created for citizens to 'protect themselves' against the native Americans when in reality they were massacring the natives and created the country's first genocide against the natives. It is estimated that approximately 56 million Native Americans died as a result of colonization over 100 years in the Americas.

Using this historical context provides insight into why some Americans choose to bear arms and why they choose to use them against others given the violent history. America was the first country in the world to be a republic, having no monarch but instead a leader elected by inhabitants of the land—George Washington. This was the innovative blueprint that inspired many republics to come, America was the first of its kind a pioneer and resulted in many countries following suit, wanting to seize power and overthrow their monarchies shown by the French Revolution and Russian Revolution.

The State's role in becoming a pioneer in the sectors of law and sovereignty led to the state being disputably the world's most influential leader to date. Dominating every inch of the globe, displayed by having the highest GDP in the world, being the first to create an Atomic Bomb, their triumph in the space race, and emerging from the Cold War as the ultimate superpower, are all some of the USA's greatest victories.

So far in 2024, there have been more than 385 mass shootings where 4 or more people had been killed. In 2021, 48,830 people died due to gun-related injuries and more than 20,000 of those deaths were homicides. A study that was published in February by the Annals of Internal Medicine discovered that 7.5 million adults in the USA became new gun owners between January 2019 and April 2021. As a result, this increase in possessing guns led to 11 million individuals to firearms in their own homes with half of those exposed being children.

This tempestuous history helps to explain views on guns and violence in contemporary American society. The stained legacy of violence deeply rooted in the country's founding, continues to shape the beliefs of Americans today.`
  },
  {
    slug: "politics",
    title: "Politics",
    subtitle: "A Complete Analysis",
    description: "A comprehensive look at the evolving nature of political engagement in the modern era.",
    category: "Democracy & Policy",
    publishedAt: "2024-10-25",
    authorSlug: "ratul-chakraborty",
    readTime: "15 min read",
    hasFullContent: true,
    graphicColors: ["#3b82f6", "#8b5cf6"],
    graphicIcon: "🏛️",
    content: `The word democracy stems from the Greek word "dēmos", meaning "the people", and the suffix "-kratia", meaning "power". The origins of the word itself ask the most salient questions of the democratic process: which members of society are included in the "dēmos", and how much power should they be given? In the many millennia since the foundations of democracy, scholars and activists alike have debated these contentious but crucial questions.

The modern consensus on the first typically rests upon all naturalized residents of a democratic nation, regardless of ethnicity or economic status, being extended the right to vote for their leaders and policies. Modern scholarship thus squarely focuses on the question of lending power to the people, particularly how much influence the citizenry should have over the politics of the nation, and what checks and balances should be placed upon this influence so as to curtail a "tyranny of the majority".

These examinations of democracy, however, often ignore a key factor, one which poses a threat to the very basis of democracy: what factual, unbiased knowledge of policy and politics do everyday voters carry? Moreover, can the aforementioned balance of powers protect democracy from the demagoguery that this inevitably causes?

In this paper, I argue that there is such a thing as too much democracy. Without proper care given to civic education and the unbiased dissemination of policy instruction to a nation's constituents, the body politic becomes increasingly misinformed and polarized. This regression to the extremes poses an existential threat to the security of the democratic process in both direct and representative democracies.

## Civic Education and Political Violence

Firstly, backsliding civic education makes a body politic more prone to tribalistic tendencies. This makes a democratic society increasingly vulnerable to instability as polarization increases and leads to populism and demagoguery.

The inverse relationship between an individual knowing their obligations to the republic and political violence is well known in psychology. In a pivotal study of data from the <a href="https://www.worldvaluessurvey.org/" target="_blank" rel="noopener noreferrer">World Values Survey</a>, a theoretical model suggested that educated individuals have a comparative advantage under democracy in translating their (better) judgment of public policies into action—an advantage that was also reflected in more totalitarian regimes.

Accordingly, a less educated citizen of a democracy is thus left less represented by the political process, particularly if they are not as knowledgeable in politics. Unable to address their problems as efficiently as those more civically-minded and educated, the less educated citizen is estranged and alienated from the former.

## Plato's Republic and Demagoguery

<a href="https://www.gutenberg.org/ebooks/1497" target="_blank" rel="noopener noreferrer">Plato's Republic</a> and Greek history both provide notable evidence for the increase in demagoguery as factionalism becomes increasingly prominent in polarized societies. In Book six of the Republic, Socrates analogizes democracy to a ship, arguing that the shipowner, large and strong, but without adequate knowledge of ships, is nonetheless expected to elect the true leader amongst arguing sailors who have "never learnt that skill", while "the true captain will be called a real stargazer, a babbler, and a good-for-nothing."

Rather than electing a leader based on true skill, the deserved and experienced captain is skipped over for the more confident and convincing commander who appeals to the prejudices of the elector and their faction of supporters rather than rationality.

## The January 6th Example

Ancient examples of demagoguery and populism rhyme with similar issues faced in the modern era. In 2021, the United States of America saw an attempted coup as far-right coteries from various states attacked the U.S. Capitol building. Despite being largely unorganized, these groups were united in the belief that the Presidential Candidate they supported, Donald Trump, had wrongly been denied the Presidency, despite there being no evidence to verify that claim.

The lack of humanities and civics education amongst the rioters also played a key role in causing the attempted coup. Education in these fields often helps individuals adjust to different perspectives, a necessity in an increasingly diverse society.

## Media Polarization and Tyranny of the Majority

Secondly, bias in mainstream media serves to further divide the body politic among partisan lines. This has the added effect of distancing people from their government and producing a "tyranny of the majority", leading to the oppression of minority groups.

Biased media feeds political biases, factionalizing society through ideological division. In a study from the University of Rochester, researchers found that news stories about domestic politics and social issues are becoming increasingly polarized along ideological lines, and people are used to only listening to things they like to hear.

## Conclusion

As <a href="https://www.gutenberg.org/ebooks/815" target="_blank" rel="noopener noreferrer">Alexis de Tocqueville</a> states in Democracy in America, "the majority [in a democracy] possesses a power which is physical and moral at the same time; it acts upon the will as well as upon the actions of men, and it represses not only all contest, but all controversy."

The philosopher and educationist John Dewey, writing of an industrial America, states that "democracy has to be born anew every generation, and education is its midwife." This is particularly true of civic education and proper instruction in policy, without which voters are reduced to making groundless and misinformed decisions about a nation's highest offices.`
  },
  {
    slug: "cc-forever-wars-explained",
    title: "Forever Wars, Explained",
    subtitle: "",
    description: "November 17, 2025  Why does it seem as if the U.S is constantly at war? In every administration, we hear stories of unilateral drone strikes taken against what seems to be a new country every day. Ven...",
    category: "Policy & Governance",
    publishedAt: "2025-11-17",
    authorSlug: "samyak-duggirala",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#0891b2", "#6366f1"],
    graphicIcon: "📊",
    partnership: "Capitol Commentary",
    content: `Why does it seem as if the U.S is constantly at war? In every administration, we hear stories of unilateral drone strikes taken against what seems to be a new country every day. Venezuela, Nicaragua, Iran, Iraq, Yemen, Afghanistan, Somalia, and the list keeps on growing. While Congress needs to formally declare war, the POTUS, as commander-in-chief, can take action in any way they see fit. Politicians excuse their actions in the name of "democracy". But what kind of democracy is America? As the Council of Foreign Relations laments, the U.S is above international law; many of the U.S's actions in foreign countries would be condemned if the country were a signatory to international treaties. Clearly, the U.S's obsession with foreign intervention is driven by an ulterior motive: the Military-Industrial Complex.

Defense companies directly benefit from their products being "shipped" worldwide. In order to secure their future profits, defense contractors lobby the government to support pro-war legislation. Jacobin analyzes two key ways the military-industrial complex hurts Americans at home and global citizens abroad. First, military budgets are at an all-time high. Of the \$14.5 trillion the Pentagon spent between fiscal years 2002 and 2021, 55 percent went to military contractors. Our tax money is going directly into the private sector. Second, military contractors donate millions to congressmen during re-elections while spending even more on lobbying. Companies like Lockheed Martin, Northrop Grumman, and Boeing are all top ten contributors in lobbying expenses.

Empirically, the U.S military interventions are rarely successful. In fact, the U.S does more to fuel terrorism than hurt it. In Yemen, for example, the European Council on Foreign Relations warrants that U.S strikes empower the Houthis to increase military drills. In Somalia, data proves that more instability has ravaged the region as a result of post 9/11 interventions. More recently, the strikes on Venezuela killing 21 people, only emboldened cartels to continue confrontational policies. The industry thrives on a never-ending threat. The more conflicts around the world, the more contracts private companies can sign.

The billions going towards war are billions not allocated to feeding our population, providing livable wages, and issuing healthcare. As the defense budget ramps up even further, it is imperative to keep in mind the effects of the U.S's military adventurism both at home and abroad. Here, companies like Lockheed Martin, Raytheon, Northrop Grumman, Palantir, etc., line their pockets with war. Abroad, terror organizations fuel violence.

— Samyak Duggirala`
  },
  {
    slug: "xenotransplantation",
    title: "Xenotransplantation",
    subtitle: "The Effects and Importance of the Developing Technology",
    description: "The science, ethics, and policy implications of cross-species organ transplantation.",
    category: "Science & Ethics",
    publishedAt: "2024-10-10",
    authorSlug: "shreya-munjal",
    readTime: "12 min read",
    hasFullContent: true,
    graphicColors: ["#10b981", "#06b6d4"],
    graphicIcon: "🧬",
    content: `Imagine you are suffering in the hospital from organ failure and all you need is an organ transplant to turn your life around; however, being able to attain one requires excellent luck. Organ shortages should not be disregarded, as they have been an ongoing issue for many years. Though concerns about the use of animals for transplant have raised ethical concerns, it shouldn't eliminate this revolutionary discovery. Xenotransplantation is already a great technology that will only improve; there are areas for growth and fitting ethical concerns but scientists are on track to overtake these hurdles. Xenotransplantation has been doubted by many due to the risks of its side effects, but accounting for the significant shortage of organs right now and with advancing technology, this technology could save thousands of lives.

## Organ Supply Shortage

With the struggle of organ shortages in the US, Xenotransplantation offers potential relief from the organ shortage crisis. From the 1950s to the present time, organ supply has been a recurring issue, and it is only getting worse. According to Mary Sauer, "43,000 organ transplants were performed in the US… but 105,000 patients were on the organ waitlist in the US." The significant gap in the number of organ transplants and the overwhelming waitlist over decades emphasizes the severity of the organ shortage crisis and how the necessity of new technologies is crucial since the problem is not getting better.

Due to several increasing factors such as the aging population, chronic pain, and increase in disease, another study by the <a href="https://www.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer">National Library of Medicine</a> says that in just 2006, the number of patients on the waitlist increased to over 95,000. Then, due to the lack of transplants for this spiked population, the number of patient deaths were over 6,300. Due to these undersupplied patients, their lives are the cost they have to face.

## The Consequence of Organ Shortages

Although many people are dying year by year due to this singular issue, lives are not the only fallout of this crisis. First, there is a spike in the illegal trade of organs for an exceedingly large amount of money. Due to organ shortages, many convicts have started an internationally illegal business of selling organs on the "red market." The red market is a term that refers to the illegal trade of organs in an underground black market.

The red market may seem quite shady and unlikely to be successful to the common eye; however, as Arianna L. Bianchino writes, "Buyers are typically driven to the red market as a last-ditch effort to save their lives and sellers usually participate because of the endless opportunities to make a profit." The fierce desperation that buyers project encourages this criminal activity, which is solely based on consumerism. If organ shortages could be stopped, there would be no need or continuation of such illegal activities.

## Purpose and Societal Impact of Xenotransplantation

With the shortage crisis, doctors have been trying to come up with numerous altering technologies to help the dilemma, one of them being Xenotransplantation, an advancement that saves millions of lives and gives people a more secure "last chance" option. Xenotransplantation transfers organs, tissues, or cells from an animal to a human. The main goal is to help the problem of organ shortages and give people who are struggling to find donors a more sure option to trust.

Pigs are commonly used for this new advantage since they are physiologically similar to humans. Pigs are also easy to modify genetically, meaning that doctors could genetically modify their DNA to reduce the risks of humans rejecting the organ. In a Xenotransplantation experiment by Robert P. Lanza, David K. C. Cooper, and William L. Chick, they used pig cells to implant into monkeys, and the results have been incredibly responsive, specifically in the islet and corneal.

## The Ethical Debate

The most significant setback that Xenotransplantation is currently facing is following ethical protocols; this topic is being debated amongst many people even today. The prominent concern people acknowledge when learning about this progression is: What about the animals? The animals have their organs extracted from them for the pure benefit of humans, but people are debating whether this is right or not.

Three central clinical ethics principles are Autonomy, beneficence, and justice. The ethical debate is complex, so one would have to compare the greater magnitude of human benefit and animal welfare. It is subjective based on the person on whether human lives should be considered more important than animal lives and if putting them at risk for humans is selfish, so doctors have been looking for work around ways to pass all ethical conditions.

## Future Developments

There are several significant setbacks that Xenotransplantation doctors are facing from several different industries questioning their discovery, yet with the number of advancements and improvements scientists have made decade after decade, the future is promising. A recent study published on May 12, 2024 on <a href="https://www.cnn.com" target="_blank" rel="noopener noreferrer">CNN</a>, discusses a research experiment where they implanted a pig's organ into a 62 year old man, as his last resort option since he was about to die. He ended up becoming the first living person from a genetically edited pig kidney and lived a few additional months before his inevitable death came.

Although the man ended up dying, this milestone only foreshadows the future of this advancement. When normal human organ transplants started, most people died on the dot, yet we developed transplantation to where it can help people live another 10-15 years, possibly the rest of their lives. This example is applicable to xenotransplantation's development in future years as well.

## Conclusion

In conclusion, remembering that lives are being held back from being saved is important, even if there are a few ethical questions around this subject. Although ethical consideration should not be overlooked, having a supply of organs large enough to support the 100,000 people put at risk per year heavily outweighs. Although there are definitely places for improvement in xenotransplantation, we already see a promising future with examples such as with the 62 year old man on CNN that got a semi-successful transplant. Overall, xenotransplantation is highly effective in many different areas and over the course of the next few years it will become a game changer for patients all around the world.`
  },
  {
    slug: "nuclear-weapons-international-relations",
    title: "Nuclear Weapons & International Relations",
    subtitle: "Exploring the Histories",
    description: "How nuclear arsenals continue to shape global diplomacy and international security frameworks.",
    category: "International Relations",
    publishedAt: "2024-10-14",
    authorSlug: "alaa-sunjuq",
    readTime: "10 min read",
    hasFullContent: true,
    graphicColors: ["#ef4444", "#f97316"],
    graphicIcon: "☢️",
    content: `The dawn of World War II made the undeniable need for a new, more powerful means of weaponry in war ever so prominent. The rumors that Nazi Germany's top-tier physicists were forming advancements in nuclear research coerced President Roosevelt to establish the <a href="https://www.atomicheritage.org/history/manhattan-project" target="_blank" rel="noopener noreferrer">Manhattan Project</a>, whose critical and sensitive research was leaked, leading to the Soviet Union's rise as a superpower; its dissolution after the Chernobyl nuclear incident; and the ever increasing number of broken UN resolutions and international treaties concerning nuclear proliferation, as well as rising tensions between countries all due to the threat of nuclear weapons—stemming from one thing and one thing only, nuclear physics.

This article aims to explore the vile, yet undeniable adverse effects of nuclear weapons on international relations and global politics; to give the reader a more insightful, interesting (and for a skeptical few, amusing) view of what an 'atomic bomb' really is—what the consequences of such dangerous toys are, all while keeping a moderate distance from the complicated world of physics.

It was 1939 when Albert Einstein sent a letter to President Roosevelt expressing the importance of furthering nuclear research to maintain the United States' status as a major global power. Six years and four days later, the United States marked the first weaponization of nuclear energy on another nation upon the explicit consent of President Roosevelt and his consequential negligence of Dr. J. Robert Oppenheimer's ethical concerns. Few are familiar with the name of the bomb Little Boy, but many struggle to forget the name of the incident, <a href="https://www.britannica.com/event/atomic-bombings-of-Hiroshima-and-Nagasaki" target="_blank" rel="noopener noreferrer">Hiroshima</a>.

## The Birth of Nuclear Terror

The words used to describe the faces of exhilarated scientists upon the detonation of the first atomic bomb read "A few people laughed; a few people cried. Most people were silent." Prevailing simply, these words signified something that can only be understood once examined, as they weren't the words of just any person, but the director of the Manhattan Project, Dr. J. Robert Oppenheimer.

The reason most were silent upon witnessing the hideous view is because the horror on their faces unveiled the dark path humans are bound to follow with these deadly toys. Sure, Hiroshima occurred, marking the first step of the aforementioned gloomy path. But something substantially greater was set in place: The global reign of nuclear weapons. At their heart, nuclear weapons can kill millions, but what they can do even better than that, is silence billions.

## Nuclear Brinkmanship

The practice of pursuing danger to its limits before stopping: also known as brinkmanship. Nuclear brinkmanship, however, pushes the stakes to the max, where nations attempt to project their power by showing off their fancy toys (also known as atomic bombs).

The most notable example of this brings us back over 60 years in history, to 1962, when the world witnessed the United States and the Soviet Union engage in tense negotiations after it was deduced that Cuba held nuclear missiles. Although the conflict was eventually resolved with a deal where both nations would retract their nuclear missiles from different countries, humanity experienced 13 days of extreme uncertainty, with both nations threatening to put their nuclear weapons to use if necessary, almost like a bomb ticking (no pun intended).

## The Ever-Present Threat

On a 24/7 basis, nuclear weapons are aimed at every major city of every major country around the globe. Russia towards the United States, the United States towards China, China towards North Korea, and vice versa. Kept discreet, this undeniable tension between nations is prominent. What countries attempt to keep even more secret, however, is their crimes of nuclear manipulation.

By maintaining an unambiguous stance on their nuclear capabilities, many countries tactically, but purposefully manipulate international opinion and attempt to mislead nuclear proliferation plans and treaties, amongst other things. Nuclear manipulation, however, branches out to an even larger predicament.

## Treaties and Disarmament

Hence, the need for more countermeasures to be enforced by organizations like the <a href="https://www.un.org/" target="_blank" rel="noopener noreferrer">United Nations</a> and even by country leaders themselves. The world has seen many nuclear proliferation treaties get passed around, starting with the Baruch Plan, which Dr. Oppenheimer supported, suggesting to shift the authority of managing and controlling all aspects of atomic energy production to the United Nations Atomic Energy Commission (UNAEC).

Although this brilliant plan failed, many wonder how different the world would be if this missed opportunity was put in place. Other instances where global nuclear disarmament tactics were attempted are the famous 1968 <a href="https://www.un.org/disarmament/wmd/nuclear/npt/" target="_blank" rel="noopener noreferrer">Non-Proliferation of Nuclear Weapons (NPT)</a> treaty with 191 signatories and the recently renewed 2010 New START Treaty between the United States and Russia.

## Conclusion

Albert Einstein, reflecting on this precarious balance, once said, "I know not with what weapons World War III will be fought, but World War IV will be fought with sticks and stones." This horrifying quote becomes less of a saying every day, and more like a foreboding prediction.`
  },
  {
    slug: "like-share-change",
    title: "Like, Share, Change",
    subtitle: "Teens Make Waves With Tech!",
    description: "The power of social media activism and its effectiveness in driving real-world political change.",
    category: "Media & Communication",
    publishedAt: "2024-10-14",
    authorSlug: "nicole-rapu",
    readTime: "9 min read",
    hasFullContent: true,
    graphicColors: ["#ec4899", "#8b5cf6"],
    graphicIcon: "👍",
    content: `Teens nowadays are known for being notorious screen-tappers, and addicted app-scrollers. As of 2024, approximately 54% of GenZers use social media four or more hours daily, and 38% spend even more! And it's not even just teens, 5.07 billion people all over the world use social media now and spend on average 2 hours and 20 minutes daily. It's no secret that social media has everyone utterly hooked—and the number of social media junkies doesn't seem to be slowing down anytime soon!

I'd love to pretend I'm above all that, but the stark reality is that I'm not. As a generation subconsciously nuts about instant gratification, constantly seeking connections and scarily plagued by the infamous and terribly dreaded FOMO—fear of missing out—those pings and chimes for our apps, letting us know your friend sent you a few funny videos or someone's liked your latest post, are technically crack cocaine.

## The Power We Hold

Studies show that 97% of GenZ shoppers use social media apps such as <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a> as their primary source of inspiration, hence, 42% of GenZers have also reported purchasing a product just because it was featured on a TikTok haul. These facts make one thing glaring; social media is the largest and most influential force at the moment, especially to teens and every one of us has this powerful tool at the very tips of our fingers.

Realistically, as many previous articles have mentioned, this ability to disseminate and broadcast information, ideas and media so rapidly is, unfortunately, a double-edged sword, allowing us to spread positive and impactful ideas on real, pressing matters such as poverty, climate change, inequality and conflict but when fallen into the wrong hands—or perhaps just someone uninformed—could be used to spread misinformation, false claims and perpetuate downright harmful ideas.

## The 2024 African Uprisings

An example of how social media and tech can be used to make change is the recent 2024 uprisings, taking place all across the continent of Africa. In June of 2024, Kenya, with the largest economy in East Africa, saw large, unyielding peaceful protests against the Finance Bill proposed by the Kenyan government which put forward a tax increase.

Young Kenyans, angry and frustrated, took to the streets to have their voices heard and grievances aired, and all events were given the name GenZ Protests. The events trended tremendously online, on platforms like Twitter and Instagram with the hashtag #RejectFinanceBill2024. This caused the movement and ideas to spread across the borders of Kenya and the spirit of resistance spilled into Kenya's neighbour, Uganda. The young people of Uganda then began their protests in July of 2024, inspired by the hashtags and trending videos of the Kenyan protests.

And no, it didn't stop there. Broadcasted media about the protests in East Africa encouraged Africa's most populous nation, Nigeria, to stand up for what they believed in and take to their own country's streets with placards and megaphones. Yet again, thanks to the power of social media, a country more than 4,000 miles away was infected by the suddenly contagious spirit of resistance and demand for change—with just a few clicks and shares, three major African nations made waves and their people had their voices heard.

## How You Can Use Tech for Change

★ **Digital Art and Design:** Use your tools and skills to create compelling posters, infographics and pieces of art that send important and impactful messages that will bring light to important issues and political matters and drive change.

★ **Coding:** A few lines of code could potentially change the world, developing apps and websites to tackle and solve real-world problems alongside events such as Hackathons which create tech solutions for social good!

★ **Online Communities:** Join forums on apps like Discord that focus on activism and social change, where you collaborate with like-minded individuals on change-driving projects.

★ **Fundraising and Crowdfunding:** Apps like <a href="https://www.gofundme.com" target="_blank" rel="noopener noreferrer">GoFundMe</a> allow you to raise money for innovative and trailblazing initiatives, and make a difference in the world around you.

★ **E-learning and Skill Sharing:** Developing and taking part in online courses that provide knowledge and teach skills to help drive change.

## Conclusion

So yes, social media and technology can be seen as a double-edged sword—on one end, it keeps us endlessly scrolling and craving for artificial dopamine releases, on the other end, it offers us a familiar platform, to amplify our voices and spark a real change, specifically in the political arena. Let's make waves with every post, share and tweet, and not scroll past change but rather, towards it. We, as teenagers, hold the future in our very hands, so let's make sure it's one worth sharing!`
  },
  {
    slug: "cc-signs-authoritarianism-big-tech",
    title: "Signs of Authoritarianism: Big Tech",
    subtitle: "",
    description: "November 14, 2025  On January 20, 2025, beside incumbent Donald J. Trump stood the billionaire tech leaders of the future. Bezos, Zuckerberg, and Musk. 287 days later, we are staring down the barrel o...",
    category: "Policy & Governance",
    publishedAt: "2025-11-14",
    authorSlug: "samyak-duggirala",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#d946ef", "#ec4899"],
    graphicIcon: "🗳️",
    partnership: "Capitol Commentary",
    content: `On January 20, 2025, beside incumbent Donald J. Trump stood the billionaire tech leaders of the future. Bezos, Zuckerberg, and Musk. 287 days later, we are staring down the barrel of right-wing authoritarianism boosted by new technological capabilities. However, the U.S. has long used "innovation" to violate the civil liberties of everyday citizens. From the Patriot Act to Biden's virtual border, today's techno-fascism is merely a continuation of America's long history of surveillance.

Political commentators and experts on fascism all see the writing on the wall. The U.S has long been involved in using its private tech sector to further its imperial interests. Now, imperialism has turned inwards. Researchers from the Review of European Economic Policy put it best: "Military and intelligence apparatuses cannot do without Big Tech." The natural progression of military partnerships is the technology being used on American citizens. Perhaps the biggest example is surveillance technology, provided by Palantir, in towns hundreds of miles away from the U.S.-Mexico border.

While Trump keeps his Big Tech allies close, the actions of previous presidents have paved the path forward. For example, post 9/11 policy infringed on privacy rights. The New York Times reveals that surveillance exceeded national security needs, with the government collecting over 534 million phone records from ordinary people. In Obama's case, rampant drone strikes and the excuse of "metadata" brought surveillance further into the mainstream. For Biden, the digital border fueled by invasive surveillance technology built the backbone of Trump's largest deportation campaign in history.

The U.S is built on data. In fact, the entire world is. As the U.S further marginalizes and oppresses communities back home, it's crucial to recognize where it all started. The current administration's partnership with Big Tech would not exist without previous presidents pushing the envelope further. Authoritarianism develops as technology gets better, and the government becomes willing to apply the same technology against us, instead of for us.

— Samyak Duggirala`
  },
  {
    slug: "cyber-warfare",
    title: "Cyber Warfare",
    subtitle: "Exploring the Strategies and Consequences of Battles in the Digital Realm",
    description: "Understanding the new battleground of nation-state cyber attacks and digital defense strategies.",
    category: "International Relations",
    publishedAt: "2024-10-14",
    authorSlug: "daniela-mcelfresh",
    readTime: "9 min read",
    hasFullContent: true,
    graphicColors: ["#06b6d4", "#3b82f6"],
    graphicIcon: "🛡️",
    content: `In the digital age, the battleground for international power and security has expanded beyond traditional physical realms. With the concept of cyberwarfare starting in the late 20th century, the complexity and popularity of the virtual battle strategy continues to multiply infinitely. Cyber warfare refers to the use of computer systems and networks. In global affairs, cyberwarfare is utilized to attack a country or organization's infrastructure, primarily targeting a countries' government or military. Like traditional warfare, cyberwarfare entails countless variations and methods of attack, whether it is the theft of classified information or the undermining of an entire system's functionality.

## Understanding Cyberspace Layers

To understand the complexities of cyberwarfare, we must also understand the layers of cyberspace, or digital spaces that are used to share information. Cyberspaces are composed of three layers. Each layer is interdependent on the other, and all are vulnerable to attacks of cyberwarfare.

**The Physical Layer:** This layer is composed of physical hardware such as wires and computers. This layer is susceptible to physical attacks, the destroying of computers, wires, routers, etc. The demolishing of this layer could cause a disruption in the other layers.

**The Syntactic Layer:** This includes the software and networks of cyberspace. Malware is the biggest offender towards this layer, allowing for the erasing of data or complete take over of a computer. Spyware is also a looming threat to the syntactic layer, allowing attackers to monitor a user's activity on a computer.

**The Semantic Layer:** This is the human aspect of cyberspace. The humans that operate computers can be conned and impersonated. Often, attackers try to con people into pressing on fake links or giving personal data by posing as a credible source.

## Types of Cyber Attacks

**Malware:** Malicious software designed to steal or encrypt data, take control of devices, monitor activities, or disrupt operations, with examples including spyware, viruses, and ransomware.

**Phishing:** A social engineering attack that disguises itself as a credible inquiry to steal personal information such as credit card numbers or Social Security numbers.

**DDoS Attacks:** Distributed Denial of Service attacks overwhelm systems with an excessive amount of traffic, rendering them unusable.

**Man-in-the-Middle Attacks:** An attacker intercepts communications between two individuals or devices to eavesdrop or manipulate the conversation.

## Case Study: Stuxnet

One of the earliest and most significant cyber attacks with political effects is <a href="https://www.kaspersky.com/resource-center/definitions/what-is-stuxnet" target="_blank" rel="noopener noreferrer">Stuxnet</a>. Stuxnet was a cyber weapon developed by the American CIA and Israeli Intelligence in a joint campaign called Operation Olympic Games in attempts to hinder Iran's nuclear production. Having been in development since 2005, this attack was not uncovered until 2010, once the malware had already run its course.

This malware targeted Iran's Natanz uranium enrichment plant, specifically the centrifuge used in their nuclear program. Spreading through the commonly used USB flash drives, Stuxnet caused the programmed centrifuges to fail, lowering the efficiency of the uranium plant.

## Recent Developments

In February of 2024, a Russian hacking group was found to be monitoring the communication servers of many European embassies and an Iranian embassy. The embassies of Iran, Georgia, Poland, and Ukraine all used the same website to send mail, Roundcube. By exploiting a vulnerability in the mail server, the hacking group was able to track all communications on Roundcube, and specifically focused on information sent from the embassies to their home countries.

## Conclusion

Cyber warfare plays an ever growing role in politics and international relationships and has evolved to become an expanding threat in the modern world. As nations become increasingly dependent on cyberspace as grounds for political actions, it's impossible to estimate how dangerous cyber warfare will eventually grow to become. Hence, we must understand how to prevent cyberattacks, and how to not exploit cyber attacks. As the digital world continues to sophisticate, cyberwarfare, undoubtedly, will become a staple in affairs and politics, nationally and internationally.`
  },
  {
    slug: "kamala-is-brat",
    title: "Kamala is Brat",
    subtitle: "Why Younger Voters are Rallying Behind the VP in Record Numbers",
    description: "Analyzing the viral moment and what it reveals about political communication in the social media age.",
    category: "Media & Communication",
    publishedAt: "2024-08-08",
    authorSlug: "brooke-anderson",
    readTime: "5 min read",
    hasFullContent: true,
    graphicColors: ["#84cc16", "#22c55e"],
    graphicIcon: "💚",
    content: `In the weeks following President Biden's official withdrawal from the 2024 presidential campaign, support for Vice President Harris as the next Democratic candidate has increased among Democratic officials and voters alike. Biden endorsed Harris in the latter half of his letter of departure, and most Democrat officials followed suit, including President Barack Obama and United States Representative Nancy Pelosi.

However, many of such endorsements assumed a sense of obligation in their immediacy ranging from hours to days following Biden's withdrawal. Contrarily, Harris has earned the support and excitement of voters, especially those of Generation Z.

## The Brat Phenomenon

In the days following Biden's endorsement of Harris, pop singer sensation <a href="https://twitter.com/charaborto" target="_blank" rel="noopener noreferrer">Charli XCX</a> posted "kamala IS brat" on X—the post has since gained significant media attention and praise. The term "brat," originating from the singer's hit album of the same name, encapsulates an aesthetic hugely popular across platforms such as TikTok and Instagram.

Additionally, sound clips of a past speech made by Harris have gone viral on TikTok, often remixed with other popular tracks. Harris has since embraced the attention, changing certain aspects of her social media accounts to match the brat album branding and officially joining TikTok.

## Record-Breaking Registrations

Harris and her team's efforts to take advantage of the trends have proven successful. According to <a href="https://www.vote.org" target="_blank" rel="noopener noreferrer">Vote.org</a>, in the 48 hours following Harris's emergence as a presidential candidate, there were a record-breaking 38,500 new voter registrations, 85% of which were under the age of 35. As of Friday, July 26th, the figure has surged well past 100,000.

## Why Young Voters Respond

Why are young voters so responsive to Harris, given that her policy differs little from Biden's? The answer is her youth. Joe Biden was known for being elderly, and questions of his mental and physical competence were concerns of most Democrat voters. His age, at times, distracted supporters from his policy and made "backing Biden" a frustrating pill to swallow.

Kamala Harris, in comparison, is quite the opposite. Her engagement in social media and trends starkly and refreshingly contrasts Biden's elderly conduct. In short, Harris is young and cool, while Biden was anything but. With less negative attention attributed to the candidate's fitness, more time can be allotted to discussing policy, substance, and real change for our country.

## Looking Forward

As we advance with this election, expect more of Harris contributing to trends on your FYP. You'll see Harris' proposed plans and policies go deeper than just her age and relevance. And, of course, as we near the election, register to vote and turn up at the polls in November.`
  },
  {
    slug: "the-growing-influence-of-deepfakes-on-the-political-landscape",
    title: "The Growing Influence of Deepfakes on the Political Landscape",
    subtitle: "Investigating the impact of Artificial Intelligence on information consumption",
    description: "How AI-generated synthetic media threatens electoral integrity and public trust.",
    category: "Data & Privacy",
    publishedAt: "2024-07-25",
    authorSlug: "luke-rowe",
    readTime: "7 min read",
    hasFullContent: true,
    graphicColors: ["#8b5cf6", "#ec4899"],
    graphicIcon: "🎭",
    content: `Over the past year, AI, or artificial intelligence, has grown exponentially, its capacity and capabilities expanding at a swift rate. From Apple to Grammarly, the power of AI is constantly being harnessed to broaden and improve the means of many corporations. However, harness does not necessarily equal tame.

The potential of AI, similar to a hurricane miles offshore, is hard to read, the possible damages not fully comprehensible. An aspect of this ambiguous storm is the "deepfake," an artificially generated video or image, often made through malicious intent, to misrepresent and manipulate the words and actions of someone. Whether it be an impression of Barack Obama or an impersonation of Tom Cruise, deepfakes can be severely consequential, damaging the trust of civilians and pushing us into a world in which it is hard to distinguish between what is real and what is fake.

## How Deepfakes Work

Deepfakes, similar to the human mind, are complex and its learning capacity is determined by a computer program known as a "neural network." This neural network performs in the same way a child learns to write or draw. The nodes in the network act as neurons, and in turn, transform real images/videos into fakes by "learning" about the given image. The deeper the network, the better the fake.

There's another aspect to the process of creating complex deepfakes and this is a sort of "guess and check" method. In short, one program produces fakes and another "checks" them, determining whether or not the given image is fabricated. This system has become incredibly advanced, and the images produced often pass the human rationality check, making deepfakes a cause for concern.

## Impact on Politics

Artificial Intelligence has altered the global political landscape enormously, especially in nations where the democratic process is critical to the preservation of the country as a whole. In America, many citizens already doubt the integrity of elections, and with the addition of deepfakes and misleading artificial intelligence, the nation seems to be on the brink of an informational crisis.

According to <a href="https://www.pewresearch.org" target="_blank" rel="noopener noreferrer">Pew Research Center</a>, a nonpartisan think tank based in Washington, D.C, 50% of Americans at least sometimes obtain news on social media and 69% of Americans at least rarely use social media as a news outlet. As social media penetration expands, those looking to exploit the American public and promote their own personal ideologies through malicious misinformation are finding an ever growing market.

## The Threat to Democracy

When the truth becomes hard to discern, heavy polarization of politics brews. As one side believes something is true while the other vehemently disagrees, we find ourselves at a growing rift between political ideologies, and often experience more and more radicalism. If Americans continue down a path of continual consumption of misinformation, we will soon find ourselves in a dysfunctional society in which truth is no longer a valued virtue. Rather, ideology will become the determination of good or bad and real or fake.

## Solutions

Is there a way to fix this issue? Well, no. You can't magically stop another human's desire to spread a certain ideology. However what we can do is develop software that can be used on all platforms that is able to determine the authenticity of a video, image, or voice instantaneously. We are still in the early stages of AI development, so as deepfakes develop, so will the technology to police them.

Additionally, American citizens can scroll with caution. It can be easy to believe everything you see, accepting every news article at face value. However, this can have ill consequences such as falling victim to misinformation. Citizens must browse the internet with a continual skepticism, not coming to conclusions until the entire picture of a story has been painted. There is no need to be scared, it's not like the world is ending. However, it is important to stay aware. Truth is not relative.`
  },
  {
    slug: "cc-minimum-wage-myths-debunked",
    title: "5 Myths About Minimum Wage, Debunked",
    subtitle: "",
    description: "November 10, 2025  Across the United States, the cost of living is rising, while wages are stagnating. As the fight over the minimum wage in legislatures is becoming more prominent, it is important to...",
    category: "Policy & Governance",
    publishedAt: "2025-11-10",
    authorSlug: "omar-dahabra",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#f59e0b", "#ef4444"],
    graphicIcon: "💼",
    partnership: "Capitol Commentary",
    content: `Across the United States, the cost of living is rising, while wages are stagnating. As the fight over the minimum wage in legislatures is becoming more prominent, it is important to combat myths that overtake the conversation surrounding the minimum wage.

**Myth 1: "A higher minimum wage only benefits younger workers."**

According to a report from Keystone Research Center, 90% of workers who would benefit from a \$12 minimum wage in Pennsylvania were age 20 or older; many had some college education and worked full-time. Adults comprise the majority of low-wage earners, with women and family providers forming a large share. In short, raising the minimum wage directly impacts working adults and families, not just high-school students. Providing a minimum wage is necessary for the backbone of America's workforce.

**Myth 2: "Raising the minimum wage will drive large price increases across all goods and services."**

While raising wages may increase some costs for businesses slightly, the actual pass-through to consumer prices is remarkably small. Keystone Research Center reports that a 25% minimum-wage increase resulted in only a 1.45% rise in restaurant prices. Overall, the gains from reduced turnover, higher morale, and improved productivity can offset much of the cost. Modest wage adjustments are not proven to cause inflation; instead, they bring manageable changes while building stronger, more stable, and more livable local economies.

**Myth 3: "Workers earning just above the minimum wage will be harmed when the wage rises."**

Higher floors lift wages across nearby brackets as employers raise pay to retain experienced workers, meaning that people overall are benefiting. In Pennsylvania, when wages rose to \$15, over 560,000 Pennsylvanians earning slightly more than that also benefited from upward adjustments. Raising the floor for minimum wage exerts upward pressure throughout the low-wage spectrum, including those just above minimum wage.

**Myth 4: "Small businesses will be destroyed by a higher minimum wage."**

In reality, the opposite is true. Uniform living wage standards actually level the playing field, preventing larger corporations from undercutting smaller competitors through wage suppression. Moreover, higher pay reduces turnover, saving small businesses thousands in rehiring and training costs. As an added benefit, increased consumer purchasing power flows directly back into local shops and services, driving the growth of these businesses.

**Myth 5: "Raising the minimum wage will cause significant job losses."**

Research shows that wage hikes ensure that workers have basic living standards while reducing turnover. Overall, a review of 64 empirical studies found no consistent evidence that higher minimum wages cause job losses, because the jobs are set into the ecosystem. Rather than destroying jobs, higher wages stabilize employment and benefit both employees and employers over time through overall economic growth.

— Omar Dahabra`
  },
  {
    slug: "the-future-politics",
    title: "The Future of Politics",
    subtitle: "AI's Game-Changing Role in Election Campaigns",
    description: "Predictions and analysis on how technology will reshape political systems in the coming decades.",
    category: "Technology & Society",
    publishedAt: "2024-07-25",
    authorSlug: "qawiyyat",
    readTime: "12 min read",
    hasFullContent: true,
    graphicColors: ["#3b82f6", "#8b5cf6"],
    graphicIcon: "🔮",
    content: `In recent years, the landscape of political campaigning has undergone a significant transformation, largely driven by advances in artificial intelligence (AI). In 2024, a record number of voters will head to the polls. Elections are scheduled to take place in at least 64 countries, collectively representing approximately 49% of the global population. And this year, there's a noteworthy new development: emerging AI technologies that have the potential to impact electoral processes.

## What is AI?

Artificial Intelligence (AI) refers to the stimulation of human intelligence processes by computer systems, including learning, reasoning, problem-solving, and understanding natural language.

### AI's Importance in Elections:

**Data Analysis:** AI processes vast amounts of data to identify voter preferences and trends, enabling more informed strategies in campaign decisions.

**Voter Engagement:** AI-driven tools, such as chatbots and personalized content, enhance voter interaction and engagement.

**Resource Allocation:** Predictive models help campaigns allocate resources effectively, focusing on crucial swing states or demographics.

**Misinformation Detection:** AI detects and combats misinformation, ensuring the integrity of information.

**Real-Time Adaptation:** AI provides real-time sentiment analysis, allowing campaigns to quickly adapt strategies.

## Historical Context

The first political campaign to utilize the internet was President Bill Clinton's and Republican nominee Bob Dole's in 1996. In the 26 years since, technology has had a huge impact on elections around the world—for better or worse. With the advent of social media in the early 2000s, new platforms emerged nearly every year that transformed how candidates communicated, voters engaged and the media covered the day-to-day horse race.

The <a href="https://www.barackobama.com/" target="_blank" rel="noopener noreferrer">Obama campaigns (2008-2012)</a> were groundbreaking in their use of social media platforms like Facebook, Twitter, and YouTube. They also leveraged mobile technology for grassroots organizing. Social media enabled real-time interactions with voters, personalized communication, and viral content.

## Current Applications

**Data Analysis and Voter Targeting:** AI algorithms analyze vast amounts of voter data to identify patterns and trends that would be impossible for humans to discern. This allows campaigns to target specific demographics with tailored messages.

**Social Media and Content Creation:** AI tools can generate personalized content through chatbots. These technologies enable campaigns to maintain a constant presence online, engaging with voters in real-time.

**Sentiment Analysis:** AI-powered sentiment analysis tools scan social media platforms, news articles, and other online content to gauge public opinion on various issues.

**Predictive Analytics:** By analyzing historical data and current trends, AI can predict voter behavior and election outcomes with remarkable accuracy.

## Challenges and Risks

**Attack of bots:** Massive swarms of political bots have been used to spread propaganda and fake news on social media. Bots are autonomous accounts programmed to spread political messages creating the illusion of public support.

**The dark side of political AI:** During elections, extensive advertising campaigns have targeted persuadable voters based on their individual psychology. This highly sophisticated micro-targeting operation relied on big data and machine learning to influence people's emotions.

**The damage to democracy:** The nefarious application of AI in elections raises much larger questions about the stability of the political system. A representative democracy depends on free and fair elections in which citizens can vote with their conscience, free of intimidation or manipulation.

## Conclusion

AI is revolutionizing election campaigns by enhancing voter targeting, streamlining communication, and optimizing resource allocation. Imagine how personalized campaign messages can become with AI analyzing vast amounts of voter's data, or how virtual assistants can engage with voters in real time. AI can even predict election outcomes with unprecedented accuracy, allowing campaigns to adapt strategies on the fly. As we look to the future, it's crucial to consider both the opportunities and the ethical implications of this tech-driven landscape.`
  },
  {
    slug: "how-to-tackle-american-polarization",
    title: "How to Tackle American Polarization",
    subtitle: "Analyzing the Increase in Polarization and Measures to Decrease it",
    description: "Strategies and solutions for bridging the growing political divide in the United States.",
    category: "Democracy & Policy",
    publishedAt: "2024-07-19",
    authorSlug: "aanya-ujjval",
    readTime: "7 min read",
    hasFullContent: true,
    graphicColors: ["#ef4444", "#3b82f6"],
    graphicIcon: "🤝",
    content: `The US political climate in the status quo is getting more and more polarized per day, and the heightened extremism has resulted in negative consequences for the American people. The effects of extremism, mass media, fundamental ideological differences, misinformation, and the system itself have resulted in mutual distrust and a divisive, corrupt, and messy system.

Efforts and solutions that exist and have been attempted before have, for the large part, failed. Most are not drastic enough to enact change and fail to address the root causes that originate in the campaign system and media itself. Others are heavily partisan and only make the problem worse. Every other attempt has been small-scale and is either impossible or not being attempted in today's political climate.

## Three Steps to Address Polarization

The first steps to address polarization and its root causes, which are structural and entrenched in the political system and campaign culture itself, are three-fold. The steps are to enact bipartisan legislation, combat misinformation and extremism, and enact social and structural reform. These three steps must be implemented simultaneously and on both a national and local level.

### 1. Bipartisan Legislation

Bipartisan legislation incentivizes and shows inter-party unity. It demonstrates that despite differences and disagreements and harsh rhetoric, politicians across the spectrum can agree and do what is best for the country. Bipartisan legislation prevents most delays in the Senate and the House and enacts changes that are best for the overall society.

This will also likely increase the amount of positive media coverage, as bipartisan movements are encouraging and represent a less divisive government. Empirical examples show that both Republicans and Democrats agree on areas such as criminal justice reform, education, the environment, health and vaccine diplomacy, human rights, and access to broader democratic ideals.

### 2. Combat Extremism and Mass Media Misinformation

The second facet of addressing polarization is to combat extremism and mass media misinformation. These problems cause heavy mistrust and increase partisanship. Federal and local governments working in unison to regulate the use of media, hold platforms accountable, and increase media literacy nationwide will attack the catalyst and root cause of polarization.

This would also be a big, bipartisan, and critical step to combat extremism and the negative effects of media on the electoral process. Critics may argue that this infringes on first amendment rights, but this is a fundamental misunderstanding of how the constitution works. Since social media apps are private entities and the regulation would be with public interest in mind, it is a common democratic practice and doesn't infringe on an individual's first amendment right of free speech.

### 3. Social and Structural Reforms

The third and final facet of preventing a government perceived as divisive, corrupt, and messy is to enact social and structural reforms that trickle down and prevent polarization from spreading. Social welfare, such as redistributing money from the rich to the poor, may decrease the likelihood of violent populist and extremist movements to form and distort the democratic world as we see it.

Structural reforms within the political system itself, such as campaign finance reform, will abolish the mutual distrust between parties and corruption within the government.

## Conclusion

Addressing polarization in the United States will be a long path, but I believe that these three steps, if completed simultaneously, can enact change in the structure of the US political system and the negative perception of that very political climate.`
  },
  {
    slug: "politics-of-scientific-funding",
    title: "Politics of Scientific Funding",
    subtitle: "The complex interplay between politics and resources for scientific research",
    description: "How political priorities shape research agendas and the allocation of scientific resources.",
    category: "Science & Ethics",
    publishedAt: "2024-07-19",
    authorSlug: "sharvari-mahesh-kumar",
    readTime: "8 min read",
    hasFullContent: true,
    graphicColors: ["#10b981", "#06b6d4"],
    graphicIcon: "🔬",
    content: `Science has always been depicted as a source of trustworthy and objective information that we can use to make sense of the world around us. But, like most of our lives, science is not immune to the financial aspect of life. Scientists require money to conduct their research which they must compete for. The financing of the research usually comes with obligations. This affects the outcome of the studies for better or for worse. This effect is called the funding effect or funding bias. This can consciously or unconsciously influence the structure and outcome of the research.

## Political Influence on Scientific Integrity

The implications of political influence on scientific funding extend beyond the immediate impact on research outcomes. They also shape public perception of science and scientific integrity. In an era characterized by low media literacy and widespread misinformation, the public's understanding of science is often superficial and influenced by political narratives.

When scientific research becomes entangled with political agendas, it can lead to polarized views and diminish the perceived objectivity of scientific findings. This, in turn, can affect policy decisions and public behavior, with far-reaching consequences for societal well-being.

## Government Funding Statistics

In the United States of America, 42% of all basic research and development is funded by the US government. With this much money being poured into studies from the government, politics has a strong influence on what research is being conducted.

## The "War on Science"

For example during the infamous "War on Science" during the G.W. Bush era, research on stem cell research was halted due to President Bush signing an executive order banning any federal funding towards stem cell research. This critically set back American research on stem cells, when they previously had been foremost in the field.

Stem cell is a relatively new field that can profoundly affect how we treat certain diseases that currently have no cures, or take a long time to recover from. It is presently poised for incorporation into therapy for cardiovascular disease, neurological diseases, renal failure, type 1 diabetes mellitus, lung disease and gastrointestinal issues.

## Scientific Community Response

Many scientists have decried and criticized political influence in government funding. According to a study done by the <a href="https://www.pewresearch.org" target="_blank" rel="noopener noreferrer">Pew Research Center</a> about scientific funding, half of the scientists (50%) say that political groups or officials have too much influence on the direction of research in their specialty, while 47% disagree. In addition, more scientists working in government (62%) and industry (56%) say political groups or officials have too much influence than do those in non-profits (45%) or academia (45%).

## Alternative Funding Models

Addressing the challenges of political influence on scientific funding requires a multifaceted approach, and one way can approach this problem is through a system of funding called egalitarian funding. Using this method, resources would be evenly divided among researchers rather than distributed through peer review.

Here, there would be no bias in direct decision-making about funding because decisions would not be 'made' in the same sense as before. When compared to the current system, which takes a long time and is suspect to outside influence, egalitarian funding can be cheaper and more efficient to administer. It also helps reduce dropout rates of scientists who ultimately cannot receive funding in a highly competitive environment.

## Conclusion

In conclusion, the politics of scientific funding represents a delicate balance between opportunity and risk. While political support can drive significant scientific advancements, undue influence can impede progress and undermine public trust in science. Navigating this complex landscape requires vigilance, transparency, and a commitment to scientific integrity, ensuring that research can flourish and contribute to societal advancement free from the constraints of political bias.`
  },
  {
    slug: "cc-pentagon-restrictive-press-rules",
    title: "The Pentagon's New Restrictive Rules on Freedom of the Press",
    subtitle: "",
    description: "October 17, 2025  The First Amendment calls for the freedom of the press. In typical Trump administration fashion, constitutional language is being overlooked, misinterpreted, and violated. Behind the...",
    category: "Policy & Governance",
    publishedAt: "2025-10-17",
    authorSlug: "samyak-duggirala",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#8b5cf6", "#ec4899"],
    graphicIcon: "🌐",
    partnership: "Capitol Commentary",
    content: `The First Amendment calls for the freedom of the press. In typical Trump administration fashion, constitutional language is being overlooked, misinterpreted, and violated. Behind the new policy is Cabinet Member and Secretary of War Pete Hegseth, infamous for his text message follies. Now, a mass exodus of journalists has occurred, leaving the Pentagon instead of agreeing to restrictive rules.

So, what does the Pentagon's new policy exactly entail? In order to answer that, we first have to look at the decades of history surrounding the relationship between the Pentagon and the Press. For decades, a staple of U.S democracy has been the freedom of the Press to report on crucial foreign policy issues through rigorous journalism in the Pentagon. Mainstream media organizations disseminate political information to millions of Americans quickly and efficiently. A key facilitator of this process is our government's willingness to work with the press. Now, any story published must be specifically authorized by the Department of Defense (now referred to as the Department of War). In response, most major news outlets have completely withdrawn from the Pentagon's reporting process simply because the new rules are too restrictive. While this administration claims its policies are aligned with First Amendment-protected rights, reality paints a different picture. If the DoD has complete control over the content of various mainstream media publications, then the press is no longer free.

Today's attacks on the free press are nothing new. Earlier this year, the Trump administration orchestrated massive cuts to funding. Both NPR and CBS were victims of a \$1.1 billion dollar cut to public broadcasting. The consequences have already led to tangible negative effects when it comes to the First Amendment. Although it may seem contradictory, state-funded media has been a cornerstone of America's dissemination of information. Simply put, state-funded media is a huge factor into local news, a key indicator of a strong democracy. Moreover, public media is typically free of bias as proven empirically. However, the Trump administration's policy decisions act under the false assumption that the media has a liberal bias. Precisely, that's why

Overall, the Trump Administration's rampant attacks on protected Free Press signal a slippery slope. As increased government changes to free and public media rise, it is the American people who are worse off due to a lack of access to information.

— Samyak Duggirala`
  },
  {
    slug: "technology-and-geopolitics",
    title: "Technology and Geopolitics",
    subtitle: "How Modern Technology Shapes Political Analysis and Engagement",
    description: "The intersection of technological advancement and international power dynamics.",
    category: "International Relations",
    publishedAt: "2024-06-01",
    authorSlug: "fangyuan-cao",
    readTime: "8 min read",
    hasFullContent: true,
    graphicColors: ["#06b6d4", "#3b82f6"],
    graphicIcon: "🌐",
    content: `The intersection of technology and geopolitics is a dynamic and increasingly influential domain. The advent of the Fourth Industrial Revolution has ushered in a new era where artificial intelligence (AI), blockchain, and 5G are not just technological advancements but pivotal geopolitical tools.

These technologies are reshaping power structures and creating new forms of competition and cooperation on the global stage. As stated by <a href="https://www.pwc.com" target="_blank" rel="noopener noreferrer">PwC</a>, the impact of these technologies is profound, with AI alone projected to add over $15 trillion to the global economy by 2030. This economic potential signals the significant geostrategic role emerging technologies will play, influencing everything from economic policies to national security strategies.

## Nationalization and Militarization of Technology

Federal governments are currently encountering the challenge of creating a landscape where innovation is nationalized and militarized, changing the conventional "map" of power that was once defined by location and control over physical regions. The digitalization of power, defined by control over information flows and technological requirements, has become a new frontier in global connections and conflicts.

This shift may actually bring about a fragmentation of globalization as nations use laws and export controls to protect access to essential modern technologies while limiting others' access to those same technologies.

## Impact on Businesses

Businesses, too, are caught in the crosshairs of this new geopolitical reality. Companies must now navigate a "Balkanized" global market, where they may be compelled to choose between markets or develop redundant capacities to safeguard against geopolitical uncertainties. This environment poses significant risks but also opportunities for businesses that can adeptly maneuver through the complex web of technological and political considerations. In this environment, competition between nations can be intensified, leading to more opportunities for conflict.

## Digital Sovereignty and Individual Rights

People are not immune to the impacts of the merger of these two ideas. The surge of electronic sovereignty where countries look for to regulate their electronic policies has ramifications for privacy, data protection, and the free flow of information. The pursuit of digital sovereignty by countries can result in raised security coupled with unreasonable control over people, worsening civil rights issues.

## Global Challenges

The joint challenges faced by all stakeholders in this new geopolitical landscape are multifaceted. There is a pressing need for global norms and protocols to mitigate the risks and maximize the benefits of emerging technologies.

As stated by the <a href="https://www.un.org" target="_blank" rel="noopener noreferrer">United Nations</a>, this includes addressing the digital divide that could widen the gap between developed and developing nations, potentially redrawing geopolitical boundaries along technological capabilities. This has the potential to become a huge problem—with the increasing technological gap between the technologically developed and underdeveloped nations, it would not be far-reaching to surmise the emergence of a new age of technological imperialism.

## Lessons from the Pandemic

Furthermore, the role of technology in situation and human monitoring, as verified throughout the COVID-19 pandemic, has highlighted the importance of technological resilience and the capability to adapt to rapidly changing scenarios. The pandemic has accelerated the adoption of electronic innovation, entwining technology with geopolitics to a further degree, and also highlighting the need for long-term joint worldwide administration structures to manage the implications of this combined forced.

## Conclusion

In conclusion, the intersection between technology and geopolitics is shaping the future of international relations. It presents a complex array of challenges and opportunities for governments, businesses, and individuals alike. Navigating this landscape requires a nuanced understanding of the technological drivers of geopolitical change and a collaborative approach to governance that can harness the potential of emerging technologies while safeguarding global stability and human rights. The development of such an approach will be crucial in ensuring that technology serves as a force for good in the geopolitical arena.`
  },
  {
    slug: "the-impact-of-technology-on-political-science",
    title: "The Impact of Technology on Political Science",
    subtitle: "How Modern Technology Shapes Political Analysis and Engagement",
    description: "How digital tools are transforming political research, analysis, and academic study.",
    category: "Technology & Society",
    publishedAt: "2024-05-26",
    authorSlug: "fangyuan-cao",
    readTime: "7 min read",
    hasFullContent: true,
    graphicColors: ["#8b5cf6", "#3b82f6"],
    graphicIcon: "📚",
    content: `The effect of modern technology on political scientific research jobs is extensive and diverse, reshaping the landscape of research study, evaluation as well as interaction within the area. With the introduction of innovative electronic devices, information analytics, and the universality of social networks, political researchers are exploring a swiftly progressing surface that utilizes both unprecedented chances and obstacles.

## Data Analytics Revolution

Among one of the most considerable improvements lies in the world of information analytics. The expansion of huge information has changed political study by offering copious quantities of details for evaluation. Through strategies such as artificial intelligence and information mining, political researchers can extract beneficial understandings from datasets that were formerly unattainable or also difficult to examine by hand.

As an example, by evaluating social networking patterns, scientists can much better comprehend political characteristics as well as predict outcomes. Additionally, breakthroughs in information visualization have boosted the discussion of searching for making complex information much more easily accessible, along with absorbable for policymakers and the public alike. Interactive maps and charts along with graphs permit political researchers to communicate their study by searching for in engaging plus appealing methods promoting data-driven decision-making in the political science field.

## Social Media as Research Tool

Along with information analytics, social media sites have become an effective device for political study as well as evaluation of current political systems. Systems like Twitter, Facebook and Instagram also function as digital online forums where political discourse unfolds in real-time. Political researchers take advantage of social network information to research public points of view, track political patterns, together with examine the spread of information and false information.

By checking on internet discussions as well as individual communications, scientists get important understandings right into the characteristics of political interaction and involvement. Furthermore, social network systems help with straight involvement with political leaders, plant manufacturers and components making it possible for political researchers to perform studies, collect comments and circulate their research study searching for better.

## Democratization of Research

Digital interaction technologies have likewise changed the method political researchers work together to share details along with circulate their research study. Online systems such as scholastic journals, meetings, plus collective devices, make it possible for scientists to contact coworkers worldwide, exchange concepts as well as team up on interdisciplinary tasks.

Online seminars and webinars have ended up being progressively prominent, supplying possibilities for knowledge-sharing and specialist growth without the restrictions of physical place. Furthermore, the democratization of details assisted in by electronic innovations has encouraged people from varied histories to take part in political discussion coupled with involve with academic study. Open-access journals on the internet discussion forums plus instructional sources have broadened accessibility to governmental literary works, promoting an extra comprehensive together with varied scholastic area.

## Challenges and Considerations

Nonetheless, together with these chances, innovation provides difficulties for political researchers, consisting of issues regarding information safety, information overload and the polarization of public discussion. As political stars progressively depend on advanced electronic methods to form popular opinion along with impact-selecting results, political researchers need to stay watchful in seriously reviewing the resources plus honesty of electronic information.

## Conclusion

Finally, innovation is significantly forming the future of political scientific research jobs, using brand-new devices along with techniques for research study, evaluation together with interaction. From information analytics and social networks to electronic interaction systems, innovation has broadened the opportunities for political questions while additionally presenting moral as well as methodological difficulties. By welcoming technology along with the crucial query, political researchers can harness the transformative possibility of innovation to progress our understanding of political procedures together with add to educated decision-making in an increasingly complicated together with adjoined globe.`
  },
  {
    slug: "cc-alaska-environmental-impacts-ai",
    title: "Alaska: A Case Study for the Environmental Impacts of AI",
    subtitle: "",
    description: "October 13, 2025  Trump's call to \"win the AI arms race\" has come at a steep environmental price. On October 6, 2025, the administration approved the Ambler Road Project, a 211-mile industrial corrido...",
    category: "Policy & Governance",
    publishedAt: "2025-10-13",
    authorSlug: "omar-dahabra",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#14b8a6", "#3b82f6"],
    graphicIcon: "📋",
    partnership: "Capitol Commentary",
    content: `Trump's call to "win the AI arms race" has come at a steep environmental price. On October 6, 2025, the administration approved the Ambler Road Project, a 211-mile industrial corridor that will traverse national parks and one of the most important ecosystems on the planet. This decision reverses a previous 2024 rejection that cited potential harm to wildlife and Indigenous communities that would be irreversible. Using "critical minerals" as a justification, communities are being destroyed.

During an Oval Office meeting, Trump said that the decision was necessary to "unleash billions and billions of dollars in wealth." And he is correct, from a financial side, there is a motivation. The Ambler district holds more than \$7 billion on copper reserves, the same metals that are crucial to energy-hungry data centers that drive AI systems, crucial to AI. In an area where the growth of these data centers is crucial, resource nationalism is necessary. Trump's recent calls for resource nationalism, despite coming at the cost of much of the stock market, have only increased.

Looking at the project specifically, just last year, the Bureau of Land Management, citing the EPA and tribal councils, went into detail describing how devastating the project would be: destroying fish habitats, contaminating waterways, and destroying migration routes for organisms that are already endangered. The scale of the project is staggering, cutting across 3,000 different streams, necessitating the construction of 50 bridges, and slicing through habitats that have sustained native communities for thousands of years. For tribal leaders, both ecological collapse and cultural erasure are at stake, with the project a part of the continued genocide of Native culture. The approval of this project is just an example of the pattern of deregulation. The administration also plans to roll back the "Roadless Area Conservation Rule," now allowing over 45 million acres of protected forests to construction of roads and access to logging, shifting conservation to a backseat while corporate profits are coming first.

Unsurprisingly, AI commentators have celebrated this move. Trump's \$500 billion "Stargate Project," which was launched earlier this year with OpenAI, Oracle, and SoftBank, aims to build a nationwide chain of these exact energy-intensive data centers. Executives like Sam Altman, Tim Cook, and Mark Zuckerberg contributed millions to Trump's fund after attending a White House roundtable. These AI datacenters consume enormous amounts of power, billions of gallons of water for cooling, and generate insane amounts of carbon emissions. These facilities are often clustered near vulnerable ecosystems, because that is where cheap water and land intersect. The Ambler Road project is simply an example of this trend.

As climate disasters are only accelerating and Arctic ice is melting at a record pace, Trump's push for resource extraction could shape America's ecological legacy for decades. The decision of policymakers and corporations will have deep implications on our world, and the pursuit of AI dominance may sacrifice millions worldwide.

— Omar Dahabra`
  },
  {
    slug: "the-ticketmaster-monopoly",
    title: "The Ticketmaster Monopoly",
    subtitle: "How One Company Dominates the Live Entertainment Industry and What It Means for Consumers",
    description: "Examining antitrust concerns and the political implications of entertainment industry consolidation.",
    category: "Economics & Business",
    publishedAt: "2024-05-26",
    authorSlug: "vidmahi-tantry",
    readTime: "10 min read",
    hasFullContent: true,
    graphicColors: ["#f59e0b", "#ef4444"],
    graphicIcon: "🎫",
    content: `In November 2022, Taylor Swift announced her "Eras" tour—her first tour in five years. Millions of Swifties awaited the coveted ticket pre-sale opportunities, ready to overcome the odds of securing seats for the hugely anticipated and limited run of shows. However, what should have been an exciting day for Taylor's fanbase quickly descended into chaos.

## The Eras Tour Disaster

On November 15th, the pre-sale for "Verified Fans" granted special access codes devolved into a technical nightmare. <a href="https://www.ticketmaster.com" target="_blank" rel="noopener noreferrer">Ticketmaster's</a> website experienced widespread outages, prolonged queues that froze for hours, and other crippling issues under the immense strain of over 3.5 million system requests from fans—a staggering number that overwhelmed Ticketmaster's capabilities.

Hundreds of thousands were unceremoniously booted from queues without securing tickets. Two days later, Ticketmaster made the unprecedented move to cancel sales to the general public, citing "insufficient remaining ticket inventory" despite widespread reports of resale listings already appearing on secondary markets at exorbitant prices.

## The Monopoly Problem

The chaos reignited long-standing criticisms over Ticketmaster's monopolistic control of the live event ticketing industry and its purported abusive practices. Critics argue the debacle exemplified how the company's dominant market position enables it to treat consumers unfairly with little repercussions.

Ticketmaster, the primary ticket vendor for most major concert tours and venues in the United States, has faced accusations of anti-competitive behavior for decades. In 2010, it merged with Live Nation, the largest promoter of live events, creating a $28 billion behemoth. This vertical integration further strengthened Ticketmaster's dominance by bundling ticketing, venue operating rights, sponsorship, and promotion under one corporate umbrella.

Critics argue Ticketmaster has leveraged this unrivaled market power to impose exorbitant service fees on consumers, currently tacking on additional facility charges and processing fees of up to 78% of the base ticket price.

## Political Firestorm

The PR nightmare of the Swift ticketing situation swiftly escalated into the political arena, with numerous members of Congress calling Ticketmaster's monopolistic practices abusive and anti-competitive.

"This is a perfect example of how the Live Nation/Ticketmaster merger harms consumers by creating a monopoly," Representative Alexandra Ocasio-Cortez tweeted, adding the merged company should be broken up.

Senator Amy Klobuchar, who leads the Senate antitrust panel, stated the debacle was "a wake-up call" highlighting the need for strengthened enforcement of anti-monopoly laws. She questioned whether the Department of Justice was wise to allow Live Nation and Ticketmaster's merger in 2010.

## Senate Hearing

In January 2023, Klobuchar's panel held a Senate hearing to examine lack of competition in the ticketing industry. Senators grilled Live Nation President Joe Berchtold over the multiple competition concerns and allegations that the company deliberately allows bots and resellers to flourish, undercutting fans.

"To have a strong capitalist system, you have to have competition," remarked Senator Richard Blumenthal, accusing Live Nation of "forcing food down the mouths" of consumers.

## A Larger Movement

In many ways, the Ticketmaster-Taylor Swift controversy represents the tip of the iceberg in mounting public discontent over corporate consolidation, monopolistic market control, and perceived lack of competition across major sectors of the economy.

"Large companies are bleeding Americans dry through excessive fees, rising prices, and shady business practices enabled by lack of competition," stated Morgan Harper, policy lead at the American Economic Liberties Project.

The swift and intense bipartisan backlash over the Ticketmaster fiasco mirrors other recent high-profile antitrust battles taking aim at the monopolistic practices of dominant technology giants like Amazon, Google, and Apple.

## Conclusion

While Live Nation maintains its market dominance and fee structures are defensible, the company's public relations nightmare over Swift's tour has helped the critics arguing the company wields monopolistic power to the detriment of consumers. Whether this controversy will ultimately deal a death blow to Ticketmaster's market control remains to be seen, but it has certainly strengthened the political will to challenge monopolistic practices across industries—the live events space may be the next target.`
  },
  {
    slug: "the-history-of-technology-and-politechs",
    title: "The History of Technology in Politics",
    subtitle: "How the Two Fields Intersect in the 20th and 21st Centuries",
    description: "Tracing the evolution of technology's role in political systems throughout history.",
    category: "Technology & Society",
    publishedAt: "2024-04-13",
    authorSlug: "fangyuan-cao",
    readTime: "8 min read",
    hasFullContent: true,
    graphicColors: ["#3b82f6", "#8b5cf6"],
    graphicIcon: "📜",
    content: `The interaction of politics and technology is a dynamic and linked phenomenon, in which societal structures and individual behaviors both influence and are influenced by one another. The purpose of this essay is to investigate the historical relationship between politics and technology, using specific sources to demonstrate the breadth and depth of this interaction.

## Historical Evolution

Technology has always played a role in politics. The advent of the Internet and other information and communication technologies (ICTs) has significantly influenced political communication and participation. The rise of digital technology has fundamentally changed global politics. For instance, the televised debates between John F. Kennedy and Richard Nixon had a profound impact on that presidential race.

## The Mobile Revolution

The smartphone, a transformational communication tool, offers functions that include voice chat, text messaging, Internet access, electronic mail, faxing, images, video, and lots of other variety of applications. Mobile devices such as the phone are one of the key factors for the rise of political participation. Increased availability of mobile phones, and subsequent access to the public arena, has boosted individuals' and groups' ability to raise attention to and organize around specialized topics.

## Social Media Era

More recently, social media has emerged as one of the principal platforms for politics. Millions of users can learn about politicians' policies and statements, interact with political leaders, organize, and express their own opinions on political matters. Political campaigns are also using social media sites to contact voters using political advertising. There are also a broad variety of online tools that are meant to promote political participation and combat the spread of misinformation.

## Mixed Impact

However, technology's impact on politics is not always positive. According to the <a href="https://www.pewresearch.org" target="_blank" rel="noopener noreferrer">Pew Research Center</a>, an 11-country median of 44% say the increasing use of the internet has had a good impact on politics, but 28% feel that impact has been largely bad. A median of 72% say these technologies have made people easier to manipulate with rumors and false information.

## Policy and Governance

However, political actions have a huge impact on technological growth. Policymakers face scrutiny for both their decisions on how to control technology and their decisions on how and when to adopt it. Technology policy and governance must ensure that shared societal ideals endure and prosper.

## The AI Future

In the future, the effect of AI on our society will continue to increase. As the UK prime minister, Rishi Sunak, stated during his speech on AI: "I genuinely believe that technologies like AI will bring a transformation as far-reaching…as the industrial revolution, the coming of electricity, or the birth of the internet."

There are also downsides, however, to AI in politics. As Coby Mendoza, the head of TelumAI, states: "AI could raise questions about accountability, responsibility, and trust. Who is liable for the outcomes of AI decisions? How can we ensure that AI respects human rights and values? How can we prevent AI from being misused or manipulated for malicious purposes?"

## Conclusion

The connection between politics and technology is characterized by its dynamic and ever-changing nature. Given the fast advancement of technology, it is essential for policymakers to stay abreast of new advancements and guarantee that technology is applied in a manner that is advantageous to society as a whole. An investigation of the historical association between politics and technology offers major perspectives on the means by which this can be accomplished.`
  },
  {
    slug: "samsung-electronics",
    title: "Samsung Electronics Co, Ltd",
    subtitle: "The Tech Titan's Influence on the South Korean Government",
    description: "A featured perspective on the intersection of corporate power, technology, and political influence.",
    category: "Economics & Business",
    publishedAt: "2024-04-13",
    authorSlug: "vidmahi-tantry",
    readTime: "10 min read",
    hasFullContent: true,
    graphicColors: ["#ec4899", "#8b5cf6"],
    graphicIcon: "📱",
    content: `Samsung is a corporate titan that accounts for around one-fifth of South Korea's total exports and wields tremendous economic clout. The company's success and deep ties have translated into powerful influence over the South Korean government and policy making. This article examines the nature and extent of Samsung's impact on the South Korean government, including criticisms, controversies, and calls for reform.

## Historical Context

Samsung emerged from modest beginnings as a small trading company in 1938 to become a global tech behemoth through South Korea's export-driven economic boom. The South Korean government provided Samsung with tax incentives, subsidies, and other supportive policies as it grew into a marquee national champion company. Samsung leveraged its economic importance to build political connections and exert influence beyond just business matters.

## Samsung's Role in Governance

Samsung employs a formidable lobbying force and its executive leaders cultivate close ties with politicians and bureaucrats through personal relationships and generous donations. The company has been accused of shaping labor policies, regulations and government support to benefit its corporate interests. For example, activists claim Samsung unduly influenced the passage of labor reform bills in 2015-2016 that undermined worker protections and organizing rights.

## The Park Geun-hye Scandal

One of the biggest scandals highlighting Samsung's undue influence was the 2016 corruption case that ultimately led to the impeachment of former President Park Geun-hye. Samsung's Vice Chairman Lee Jae-yong was accused of paying $36 million in bribes to Park and her confidante Choi Soon-sil to secure government support for a controversial $8 billion merger of two Samsung affiliates.

Lee was initially convicted of bribery, embezzlement and other charges and sentenced to five years in prison. However, he was released after just one year when a retry appeal court suspended his sentence in 2018. The case was seen as a prime example of the cozy ties between political leaders and family-run conglomerates like Samsung facilitating corrupt backroom deals.

## Influencing Labor Reforms

Separate from the Park scandal, Samsung has long been accused of using influence peddling and lobbying to shape government policies in its favor. In 2015-2016, activists and labor groups claimed Samsung unduly swayed lawmakers to pass labor reform bills that severely restricted organizing rights and made it easier for companies to hire temporary workers.

## Recent Controversies

More recently in 2022, Samsung's de facto leader Lee Jae-yong was accused of orchestrating an audacious $8 billion stock manipulation scheme to cement his control over the company. While Lee was pardoned by the current president for this case, it again raised questions about unchecked corporate power and criminal conduct at the highest levels of South Korea's most prominent conglomerate.

## Criticisms and Public Opinion

There are long-standing allegations of Samsung executives engaging in bribery, cronyism, and other corrupt practices to gain unfair advantages over competitors and shape government policy. Critics argue Samsung's disproportionate influence allows it to skirt regulations on issues like labor rights and the environment, distorting fair market competition.

Opinion polls show many South Koreans are disillusioned with Samsung's dominance and undue sway, viewing the company as a symbol of the corrupt ties between government and big business.

## Reform Efforts

In the wake of scandals, South Korea has introduced some reforms like the Anti-Graft Act to limit private sector influence and increase transparency around corporate political activity. Activists and civil society groups continue advocating for stricter enforcement of anti-corruption laws, greater corporate accountability measures and reducing the dominance of family-run conglomerates like Samsung.

## Conclusion

Samsung has cultivated a privileged position of power and closeness with South Korea's government rooted in the country's economic development strategy. While Samsung's success contributed to South Korea's rise, its oversized political influence raises concerns over cronyism, corrupt practices and the health of the nation's democracy. Addressing corporate dominance in governance through reforms and accountability measures is crucial for restoring public trust and ethical capitalism in South Korea.`
  },
  {
    slug: "cc-signs-authoritarianism-expanding-national-guard",
    title: "Signs of Authoritarianism: Expanding Use of the National Guard",
    subtitle: "",
    description: "October 4, 2025  In under a year, Trump has federalized the National Guard in Los Angeles, the District of Columbia, Chicago, Portland, and Memphis. The rapid expansion of federal forces in major Amer...",
    category: "Policy & Governance",
    publishedAt: "2025-10-04",
    authorSlug: "samyak-duggirala",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#dc2626", "#f97316"],
    graphicIcon: "🔍",
    partnership: "Capitol Commentary",
    content: `In under a year, Trump has federalized the National Guard in Los Angeles, the District of Columbia, Chicago, Portland, and Memphis. The rapid expansion of federal forces in major American cities is both an infringement on the people's fundamental rights and a decline into autocracy. Today, Democratic Governor J.B. Pritzker claims Trump is planning to mobilize nearly 300 members of the National Guard into Illinois. The consequences of rampant federal action could be devastating for millions of people in marginalized communities. In Chicago, federal forces have already hurt protestors, people of color, and immigrants. Indeed, the Trump administration's abrasive actions must not escalate further.

Although Trump and his allies consistently claim their crackdown on crime is both necessary and effective, the evidence begs to differ. Take Portland, for example, President Trump called the city "war-ravaged" despite what city officials and residents see with their own eyes. In fact, the only instance of "chaos" is outside ICE facilities where non-violent protests take place. Yet, Trump's lies, underneath the deceit, have an ulterior motive. By painting a picture of "left-wing terrorism," Trump criminalizes dissent and decreases the general population's willingness to support resistance against harsh, inhumane immigration policy.

Throughout every city where federal troops have been deployed, the same playbook has been utilized. First comes the rhetoric, condemning dissent. Next comes dangerous action through the mobilization of hundreds of troops. As federal officers assist with Trump's immigration goals, the people of each city suffer at the hands of executive overreach. Instead of making our cities safer, the National Guard only adds fear to the lives of everyday citizens through severe policing. A D.C. judge describes the ongoing issue as a clear breach of constitutional rights with "people being arrested without cause, minor cases charged as felonies, and people left to suffer in jail for days or weeks."

Fortunately, local governments are fighting back in the courts. At the time of writing this article, a Portland federal judge has blocked President Trump's orders for the deployment of the National Guard. U.S. District Judge Karin J. Immergut, appointed by Trump, rationalized her decision by stating that recent protests have been largely peaceful. Moreover, the city of Portland, on Sept. 28th, filed a separate lawsuit against Trump's unlawful deployment. Combined, the state of Oregon is resisting against authoritarian moves made by the Trump administration. Moreover, wider attempts from cities all over the country are currently combating Trump's executive overreach through organized protests and free speech. Now more than ever, it is crucial to resist. Conceding demands, remaining complacent, and quitting dissent is exactly what authoritarians thrive on. Remember, resistance, in any way possible, is always the frontline defense against autocratic encroachment.

— Samyak Duggirala`
  },
  {
    slug: "examining-the-morality-and-ethics-of-genetic-engineering-in-humans",
    title: "Examining the Morality and Ethics of Genetic Engineering in Humans",
    subtitle: "Where the Boundaries of Morality Blur and the Essence of our Humanity Stands at the Precipice",
    description: "The ethical debates surrounding CRISPR, gene therapy, and human genetic modification.",
    category: "Science & Ethics",
    publishedAt: "2024-03-27",
    authorSlug: "kamila-toor",
    readTime: "8 min read",
    hasFullContent: true,
    graphicColors: ["#10b981", "#06b6d4"],
    graphicIcon: "🧪",
    content: `A huge leap for mankind: an experiment that consisted of inserting DNA from one bacteria to another, prompting the ability to prevent, treat, or cure various inherited genetic disorders—from asthma and anemia to sickle-cell disease and cystic fibrosis—but beneath one of the most revolutionary scientific discoveries lies unforeseen consequences that are now the subject of an endless debate that question the morality and the ethics of genetic engineering.

Genetic engineering, without stringent regulations, is ethically problematic due to concerns about social inequality, unforeseen consequences, and the ethical boundary of manipulating fundamental aspects of human nature, concurrent with the mass implication of genetic engineering.

## What is Genetic Engineering?

In 1973, two eccentric biochemists, Herbert Boyer and Stanley Cohen, developed the first model of genetic engineering by inserting the DNA of one bacteria into a second bacteria and essentially changing the biological makeup of the second bacteria. Nearly a decade later the first genetically modified product, using human insulin to treat diabetes, was approved and administered.

Genetic engineering is defined by the <a href="https://www.genome.gov/genetics-glossary/Genetic-Engineering" target="_blank" rel="noopener noreferrer">National Human Genome Research Institute</a> as "a process that uses laboratory-based technologies to alter the DNA makeup of an organism". This could involve altering a single base pair of genomes, deleting a region of DNA, or adding a new segment of DNA.

Genetic engineering holds promise in agriculture and medical fields, with potential solutions to disease resistance and the development of novel therapies; it also holds the capability to alter the characteristics of a child with gene editing, known as "designer babies", prompting various ethical concerns.

## Ethical Concerns

Genetic engineering holds various unpredictable and haphazard risks as well as ethical problematic potential. "Designer babies", with genetically engineered physical characteristics, can prospectively heighten and escalate existing social disparities and issues.

According to a study at the <a href="https://english.umd.edu/" target="_blank" rel="noopener noreferrer">University of Maryland</a> on the societal impact of gene editing, "Genetically engineered organisms pose an enormous risk to human society on a lethal and economic front."

Initially, genetic engineering technology requires advanced infrastructure and expertise, making it primarily available to wealthier and affluent individuals, even in healthcare use, widening the gap between the wealthy and the impoverished. With racial and ethnic discrimination and prejudice still prevalent in society, "designer babies" could increase the risk of discrimination and lead to employment discrimination and social stigmatization.

## A Balanced Approach

While the moral and ethical concerns surrounding genetic engineering in humans are undeniably valid and merit careful consideration, it's crucial to adopt a balanced approach that acknowledges both its potential benefits and challenges. It is imperative to recognize that ethical dilemmas are not insurmountable barriers but rather obstacles that can be navigated through regulation and responsible usage.

The prospective medical opportunities of genetic engineering are undeniably groundbreaking and have much potential to change the world and improve the lives of many. Through the implementation of stringent guidelines and educational initiatives, we can mitigate risks and ensure that genetic engineering upholds human dignity.

## Conclusion

As we grapple with the intricate realm of genetic engineering in humans, we stand at a crossroads where the boundaries of morality blur and the essence of our humanity hangs in the balance. While the allure of scientific progress offers us promises of revolutionary medical advancements, we must pause to consider the ethical concerns and complexities that accompany these pursuits.

By embracing a balanced perspective that acknowledges both the potential benefits and ethical challenges, we can chart a course towards responsible innovation that honors human dignity and preserves the integrity of our collective humanity. The scientific world in its quest to better the world must tread this path with reverence and mindfulness, guided by a steadfast commitment to ethical principles.`
  },
  {
    slug: "science-diplomacy",
    title: "Science Diplomacy",
    subtitle: "The Key To Navigating The Global Political Landscape",
    description: "How scientific collaboration serves as a bridge for international relations and peace-building.",
    category: "International Relations",
    publishedAt: "2024-03-14",
    authorSlug: "zaina-qureshi",
    readTime: "7 min read",
    hasFullContent: true,
    graphicColors: ["#06b6d4", "#3b82f6"],
    graphicIcon: "🤝",
    content: `The idea of science diplomacy often hangs in the shadows, yet it has such a monumental—albeit obscure—role in global affairs. Inherently, science diplomacy transcends political hostility, allowing scientists from adversarial states to work together without concern to current political relations.

Using this powerful tool, countries all around the globe have mitigated international tensions and worked in conjunction for greater scientific advancement and collaboration. Though highly influential, this paramount instrument has often been disregarded. International relations in science must be improved because science diplomacy fosters greater engagement in regard to scientific concerns and eases political tensions.

## The Need for Better Scientific Relations

Greater efforts need to be made towards improving international relations in science because they encourage greater engagement in regard to common scientific concerns. The COVID-19 pandemic was a prime example of how a lack of science diplomacy and international engagement can negatively affect less developed countries.

Speakers at a webinar about science diplomacy during the COVID-19 pandemic recognized "the failure of international diplomacy and science diplomacy during [the] pandemic period" and how a lack of science diplomacy forced less developed countries "to handle a health, social, and economic crisis of unparalleled magnitude."

## Workshops and Collaboration

With programs that are meant to improve science diplomacy around the world, less developed countries like Pakistan would be able to engage with other scientists on a global scale over common concerns without regard to the level of development of a country.

According to a news release by the <a href="https://www.aaas.org/" target="_blank" rel="noopener noreferrer">American Association for the Advancement of Science</a>, participants engaged in a workshop intended to cultivate scientific collaboration that would in turn advance diplomacy. A facet of the workshop highlighted how African scientists led by Jacquline McGlade, a former chief environmental scientist at the United Nations, and Maasai Mara of the University of Kenya were able to facilitate a negotiation simulation.

## Addressing Concerns About Technology Transfer

While science diplomacy has numerous benefits concerning international politics, there are fears that science diplomacy would give scientific and technological knowledge to adversarial states who would then abuse said information for their own, detrimental gain. Even though this is a valid concern, the fear present in this argument has been greatly exaggerated.

Historically, countries that have engaged in science diplomacy have mutually benefited; science diplomacy tends to ease political tensions and build bridges between countries rather than give one country an unfair advantage over the other in the global political sphere.

## Historical Example: The Cold War

The Cold War was a time in which tensions between the Soviet Union and the United States were at an all-time high. Dr. Peter Gluckman, the former New Zealand chief science advisor, researched how the United States President and the Soviet Premier established a scientific venture in order to reduce the detrimental tensions between them.

The organization, aptly named the International Institute of Applied Systems Analysis, proved to be successful; other additional collaborative efforts between the two countries, such as the endeavor to eradicate smallpox and polio, "[highlighted] how science was and can continue to be an important tool of both formal and informal global diplomacy."

While the various attempts made by both the United States and the Soviet Union didn't immediately thaw out tensions, the two countries were able to foster a foundation of communication; because the once bitter rivals used science diplomacy responsibly, they could "[build] an atmosphere of trust that influenced government policies."

## Conclusion

By improving science diplomacy between countries, a greater engagement towards scientific concerns can be cultivated and political tensions can be eased. The world is ever-changing and the global political landscape is becoming increasingly complicated to navigate. Science diplomacy is a mechanism that has historically proven its worth and may very well be the key to strengthening political relations in the present as well as the future.

By improving international relations in science, politicians, scientists, and even everyday citizens have the power to change the world—however, it is how humanity wields this powerful tool that determines if change is for better or for worse.`
  },
  {
    slug: "social-media-and-politics",
    title: "Social Media and Politics",
    subtitle: "Unveiling the Impact of Social Media and Prevalence of Technology on Modern Political Movements and Activism",
    description: "The transformative effect of social platforms on political campaigns and civic engagement.",
    category: "Media & Communication",
    publishedAt: "2024-03-14",
    authorSlug: "kamila-toor",
    readTime: "15 min read",
    hasFullContent: true,
    graphicColors: ["#ec4899", "#8b5cf6"],
    graphicIcon: "📱",
    content: `An indispensable tool for political activism, reshaping the landscape of social and political movements worldwide—yet behind it lies a dangerous opportunity for manipulation and misinformation. Social media, heralded as the democratizing force of the digital age, has revolutionized how individuals engage with politics, offering unprecedented opportunities for organizing, mobilizing, and advocating for change.

However, lurking beneath the surface of this digital revolution is a darker reality: the spread of misinformation, the amplification of polarizing narratives, and the co-optation of activism by corporate interests. With the consistent use of social media platforms, it becomes evident that while these platforms empower voices, they also bring forward significant risks that demand critical examination and reform.

## Echo Chambers and Polarization

Bakshy et al. argue that the engineering of social media algorithms prioritizes content resonating with users' current beliefs and preferences, thus constructing echo chambers where individuals encounter only information confirming their viewpoints. This strategic design not merely deepens ideological divisions; it also suppresses potential for constructive dialogue and compromise.

In their 2015 study published in the Proceedings of the National Academy of Sciences, Barbera et al. revealed a significant finding: Facebook users actively engage more with content aligned to their political leanings. Furthermore, Barbera et al. extended this investigation to Twitter: they found that exposure to politically homogeneous content on this platform directly correlates with increased polarization among its users.

## Misinformation and Disinformation

Allcott and Gentzkow (2017) unveil through their research that the viral spread of misinformation and disinformation on social media poses a significant threat to political activism's integrity as well as democratic discourse. False information not only proliferates faster but also more extensively than accurate data within these platforms.

The 2016 US presidential election, for instance, witnessed the rampant dissemination of false information; notably among these was the infamous "Pizzagate" conspiracy theory. This event underscored how potent misinformation can be in shaping public opinion and political discourse.

## Digital Divides and Access Issues

Robinson and Schulz (2020) underscore through their research that, far from fulfilling its potential to democratize information access and communication, social media frequently intensifies prevailing inequalities while marginalizing certain groups. Digital divides—rooted in socioeconomic status, race, geography, and language—constrain marginalized communities' capacity for online activism participation.

Take low-income individuals as an example: a scarcity of reliable internet connections or digital devices puts them at substantial disadvantage when it comes to accessing and contributing on online platforms (Hargittai 2010).

## Co-optation by Corporate Interests

Corporate interests and commercial agendas co-opt activist movements more easily, thanks to the social media platforms' commercialization. In this algorithm-driven digital landscape that prioritizes advertising revenue, branded content and corporate messaging often overshadow genuine grassroots activism.

Under the pretense of supporting social causes, corporations use their financial resources to promote their own agendas; this action dilutes the authenticity of grassroots activism. Klein (2000) observed this phenomenon: it blurs the boundaries between sincere advocacy and corporate marketing.

## Ethical Considerations

Society, grappling with ethical considerations and anticipating future challenges, must confront the negative ramifications of social media on political movements and activism. The issue of data privacy ranks among these concerns: users' personal information often undergoes collection; it is then analyzed—a process that frequently leads to exploitation for commercial or political purposes—all without their explicit consent.

Zuboff (2019) highlights in her seminal work on surveillance capitalism: this infringement not only undermines individual autonomy but also poses significant risks to democratic processes.

## Conclusion

In conclusion, we must acknowledge and confront the undeniable negative impact of social media on political movements; indeed, its influence extends to activism. These platforms—which exacerbate polarization, disseminate misinformation, perpetuate digital divides and fall prey to corporate co-optation—present formidable challenges that endanger the integrity as well as effectiveness of social and political campaigns.

Nevertheless—through rigorous examination coupled with advocating for ethical reform—we can endeavor toward cultivating a digital landscape that is more inclusive, equitable, and responsible. We can harness social media's transformative potential and uphold democratic principles by empowering grassroots activists, fostering genuine dialogue.`
  },
  {
    slug: "cc-the-government-shutdown-explained",
    title: "The Government Shutdown, Explained",
    subtitle: "",
    description: "October 1, 2025  Today, on October 21st at 12:01 AM EDT, after Congress failed to pass appropriations for the new fiscal year, the U.S. federal government shut down. Our political climate, marked by p...",
    category: "Policy & Governance",
    publishedAt: "2025-10-01",
    authorSlug: "omar-dahabra",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#7c3aed", "#3b82f6"],
    graphicIcon: "💡",
    partnership: "Capitol Commentary",
    content: `Today, on October 21st at 12:01 AM EDT, after Congress failed to pass appropriations for the new fiscal year, the U.S. federal government shut down. Our political climate, marked by partisanship, has collapsed into administrative unraveling.

This drastic context comes in the context of the Trump administration reworking the levels of executive powers and weakening checks to contain abuses. In January, Trump fired 17 inspectors generals who were tasked to maintain checks through federal oversight. Overall, the administration is starving independent bodies of resources, such as the Council of the Inspectors General on Integrity and Efficiency, jeopardizing what is left of accountability for the government.

The political climate that led to appropriations not being agreed upon stems from concerns over recent Trump administration actions. The admin has pulled away funding from crucial infrastructure in blue states, such as freezing billions in NYC transit initiatives. This action epitomizes the attacks based on polarization amid the shutdown. Beyond funding, Trump withdrew nominations for unqualified roles in the Bureau of Labor Statistics and the Commodity Futures Trading Commission, showing that he is even facing internal chaos over his actions, and showing the issues with politicizing agencies with tasks as mundane as publishing statistics. Together, these previously described actions reflect the broader ambition to centralize authority in Washington and explain why the political landscape has been so discontent with Trump.

But what about the consequences of the shutdown? Amid the shutdown, the administration is reshaping the federal workforce in arguably the most dramatic manner in history. Over 100,000 workers are expected to leave the government under a designated "deferred resignation" program, while forced retirements, firings, and buyouts could increase the number to over 275,000. In total, these reductions represent around 12 percent of the federal civilian workforce, eroding the credibility, capacity, and expertise of our government. The economic costs are also mounting. A memo from the White House estimates that each week the shutdown continues, \$15 billion in GDP could be lost. Inside the agencies, around 750,000 workers are being furloughed, with these workers losing around \$400 million per day, with many having to work without pay. Programs housing vulnerable populations, with programs such as food assistance and public health, are under threat, especially in states that operate under slim fiscal margins. In the long run, the shutdown is a negative for U.S. credit, undermining market confidence in our economy.

Beyond the economy, there are political consequences. Suspending funding, mass dismalls, and tight control create a strategy where the executive has sole control, sidelining Congress and the local government. The administration's attacks on oversight, as previously described, only create further cause for alarm. Deleting checks on the executive, especially at a time of crisis, creates a precedent of tyrannical authority. These collapsing institutions, beyond just eroding democracy, create a situation where it is much harder to respond to a crisis. Whether it be economic shock, natural disasters, or public health emergencies, the risk of failure is only growing as a result of Trump-induced partisanship. As a result of local governments suing the federal administration over funding concerns, or the overall political landscape in Congress being the most polarized, D.C. seems to be falling apart.

The events unfolding in Washington shouldn't be just looked at as a result of immediate consequences; what should be kept in mind is the events that caused them to occur. Unless checked, the partisanship and weak institutions that created this problem could mark the beginning of a structural collapse that forever breaks our government.

— Omar Dahabra`
  },
  {
    slug: "softbank-group-corp-sftby",
    title: "SoftBank Group Corp (SFTBY)",
    subtitle: "The Fervor of Foresight or Financial Roulette?",
    description: "Analyzing the tech conglomerate's influence on global technology investment and policy.",
    category: "Economics & Business",
    publishedAt: "2024-03-02",
    authorSlug: "ratul-chakraborty",
    readTime: "12 min read",
    hasFullContent: true,
    graphicColors: ["#f59e0b", "#ef4444"],
    graphicIcon: "📈",
    content: `SoftBank is a Japanese investment and holding company which controls assets in a variety of sectors, particularly telecommunications and media. Founder Masayoshi Son's vision, however, extends to investments in ecommerce, AI, and robotics, as well as many other burgeoning fields. SoftBank stock has suffered over the course of a two year period with the stock price falling to its current 22.90 from a high of 49.24 USD in February of 2021. Additionally, despite the company's aforementioned expansive long-term vision, its investments and bets can often prove to be incredibly risky to investors and the company itself. Due to this combination of factors, SoftBank is a sell.

## Company Overview

SoftBank has holdings in many different fields, with telecommunications and media being the primary businesses it operates. The company holds Yahoo Japan, the single most visited site in the country, as well as the Sprint Corporation, the fourth-largest telecommunications network in the United States.

The company also has multiple investments in robotics, prosthetic devices, as well as the development of artificial general intelligence through its vision fund, the venture capital arm of SoftBank, one of the largest in the world. The company also has a massive 14% stake in Chinese retail company <a href="https://www.alibaba.com" target="_blank" rel="noopener noreferrer">Alibaba</a>, which it acquired early in the latter's history in 2000, and fintech company PayPal.

## Industry Overview

The telecommunications industry is projected to grow at a CAGR of 6.2% in the forecast period from 2023-2030. The Japanese telecom market in particular is expected to grow at a CAGR of 4.8% in the same forecast period. This is quite low compared to the 8-12% CAGR for sustainable large companies and is especially low when compared to the 15-25% percent that is expected of high-risk companies like those of SoftBank.

I view the telecommunications industry as an incredibly complicated and interesting one. A combination of new technologies and innovation made telecom one of the fastest-growing services of the 1990s and 2000s. However, this almost exponential growth in internet penetration in many developed countries has put many companies within the industry at risk.

## Competitive Analysis

Since its inception, SoftBank has separated itself for a number of reasons. Firstly, the company has a unique ability to predict trends in a variety of fields. SoftBank's first big breakthrough came during the dot-com era, when the company invested heavily into Yahoo and over 250 other internet start-ups.

SoftBank was also one of the first big investors in Alibaba, a move that helped the company survive into the new millennium. This, along with strategic acquisitions in its core telecommunications market, such as Vodafone Japan and the Sprint Corporation, have positioned the company for seemingly great success.

## Key Catalysts

These factors, however, are not what may cause the greatest growth in SoftBank stock over the course of the next few years. Rather, SoftBank's many investments may prove to be the company's saving grace in the long-term. Since 2010, and especially since the launch of the company's Vision fund, SoftBank has put massive amounts of capital into a myriad of ventures, such as ByteDance, FlipKart, 10x Genomics, and Boston Dynamics to name a few.

Companies like the aforementioned ByteDance and FlipKart, as well as others like Uber and Doordash have had impressive growth and returns for SoftBank. The overall fund, however, has invested heavily and quite recklessly in these ventures.

## Risks and Concerns

Despite its predictive success and foresight in technology investing, SoftBank's massive losses have largely overshadowed its success and worried investors in many respects. First and foremost, a large number of SoftBank's investments have been very public failures, many of which the company's CEO Masayoshi Son admits to not having been careful enough with.

These investments include companies like WeWork, as well as a majority of SoftBank's pre-2000 holdings. From these assets alone, it is estimated that the company lost over 99% of its revenue over the course of a two-year period from 1999 to 2001 during the dot-com crash.

## Financials

SoftBank saw revenue increase by approximately 3.9% YoY to 41.38 billion USD in the fiscal year ending on March 31st, 2021. The majority of that increase came in the distribution sector of the company, with ICT related products and services. The company also saw operating income increase 9.8% YoY to nearly 7.42 billion USD in the same time period.

## Conclusion

SoftBank is Japan's largest telecommunications and media company and plays a key role in the venture capital sphere. In spite of their massive successes, including investments like Doordash and UBER, the company's high-profile losses bring forth a troubling implication: randomized eccentricity with the company's massive financial resources as an investing strategy. With a weakening economy, rising interest rates, and general skepticism about tech stocks writ large, SoftBank is not a sustainable long-term investment primarily because it exhibits worrying handlings of its assets.`
  },
  {
    slug: "terahertz-imaging",
    title: "Terahertz Imaging",
    subtitle: "A Potential to Stimulate International Cooperation in Combating Drugs",
    description: "The emerging technology and its applications in security, medicine, and beyond.",
    category: "Science & Ethics",
    publishedAt: "2024-02-12",
    authorSlug: "arthur-hu",
    readTime: "10 min read",
    hasFullContent: true,
    graphicColors: ["#10b981", "#06b6d4"],
    graphicIcon: "📡",
    content: `Each year, thousands of human mules deliver packages across international borders; however, only the cartel and the victimized carrier know that they have up to a kilogram of illicit substances wrapped and transiting in their stomachs after being ingested. In reaction to the increased domestic demand for illicit drugs, countries like the United States intensely monitor their borders. Consequently, cartels have been forced to adapt their forms of smuggling—human mules being a favorite for their cost-effectiveness.

In the case of the collapsing bilateral cooperation between the United States and Mexico, a new strategy is required to combat cartels and eliminate the use of human drug mules. A new technology, Terahertz Imaging, could be the key to revitalizing cooperation.

## The Plight of Drug Mules

It is recognized that although drug mules complete illegal tasks, they are not entirely responsible for the acts they commit. Apart from being a human trafficking victim, there are two key reasons for being coerced into becoming a drug mule: fear and substance abuse.

First, some individuals fear for their own life, as an interviewee from the <a href="https://www.unodc.org" target="_blank" rel="noopener noreferrer">United Nations Office on Drugs and Crime (UNODC)</a> expressed, "My master was right next to me and he continued to say that if I said anything he'd kill me." Others become drug mules in exchange for their families' safety. Second, cartels use drugs as a reward to manipulate people facing substance abuse.

## The Economics of Drug Mules

To cartels, drug mules are simply tools in transportation; they see mules from a purely economic standpoint. Instilling fear in drug mules is essentially free to powerful cartels; facilitating an addiction is also cheap. In 2013, the annual cost of cocaine addiction hovered around US$36,000, whereas the wholesale price of one kilogram of cocaine was US$28,750.

Without taking into account travel costs, usually not exceeding US$500, the cartels can "buy" a mule for the money earned from two trips from the victim. If the mules are caught, the cartels lose the human and a small number of drugs, but in comparison to other trafficking methods, such as submarines and trucks, human drug mules are the most cost-effective.

## Ineffective Solutions: A Drug War Case Study

American involvement in stopping drug trafficking within Mexico started in 2008 when President George W. Bush launched the Meridia Initiative. From 1990 to 2006 there was a fivefold increase in drug overdose deaths—26,400 deaths in 2006—giving President Bush a cause for action.

However, following the 2020 arrest of former Mexican defense minister General Salvador Cienfuegos Zepeda for drug trafficking by US officials, US–Mexico cooperation slowed. Mexico responded by restricting the power of Drug Enforcement Administration (DEA) agents in its borders.

## How Terahertz Imaging Works

Now that action against cartels is at a standstill, X-ray technology at security checkpoints remains the primary method for catching drug mules. Currently, security X-rays only scan through clothes, revealing hidden firearms, but not drugs inside the stomach.

Terahertz Imaging refers to the process in which terahertz waves, the waves between the microwave and infrared regions of the electromagnetic spectrum, interact with different materials. In a process known as terahertz spectroscopy, terahertz waves are emitted toward a material, and the intensity of the reflected or refracted waves are analyzed, as different materials provide unique responses.

Through this, Terahertz Imaging differentiates between drugs, human tissue, and other materials; contrary to X-rays which produce a basic image. In addition to its increased accuracy, Terahertz Imaging could be deployed worldwide due to its cost-effectiveness when compared to other methods.

## A Tool, Not a Solution

Powerful cartels cover all corners of the globe, furthering their reign with drug mules. These mules are prevalent in the United States and Mexico, but are present everywhere. Although Terahertz imaging is quickly becoming a viable tool to catch drug mules, it does not remove the need for joint cooperation between countries.

Consequently, cooperation must be present to increase efficiencies and share cost burdens, especially with new technology. With the increased use of Terahertz Imaging and the inherent growth of the number of captured drug mules, much-needed international cooperation could see a parallel rise, saving these seemingly ordinary victims from living as entrapped mules and not as human beings.`
  },
  {
    slug: "echo-chambers-and-algorithms",
    title: "Echo Chambers and Algorithms",
    subtitle: "An Oversight of Polarization through Social Media Algorithms",
    description: "How recommendation systems create information bubbles and polarize public discourse.",
    category: "Data & Privacy",
    publishedAt: "2024-02-12",
    authorSlug: "zaaviyar-malik",
    readTime: "8 min read",
    hasFullContent: true,
    graphicColors: ["#8b5cf6", "#ec4899"],
    graphicIcon: "🔄",
    content: `Envision a world filled with misinformed, violent, radical rioters who only accept aggression as responses. This describes the crowd which stormed the Capitol on January 6th, 2021. The January 6th attack is marked as one of the biggest events caused by radicalization on social media. Since its 3-year anniversary, radicalization has only seen a significant increase on social media.

Studies over content algorithms have proven that companies maximize profits by presenting users content that is accustomed and controversial which increments time-spent on platforms. Due to these flawed algorithms, many have filed lawsuits highlighting that platforms do not protect its users from any offensive content. These cases have led to the now-common verdict that companies are not liable under <a href="https://www.eff.org/issues/cda230" target="_blank" rel="noopener noreferrer">Section 230 of the Communication Decency Act (CDA)</a>.

## Technology's Significance

Because of how algorithms on social media are developed, many who desire to find communities with similar beliefs are able to do so and keep up with this content. Users are able to scroll upon platforms for hours—liking, posting, sharing content as they please to stay in the loop filled with their interests. The issue proposed with this is users with strong offensive beliefs are able to spread offensive ideals without any consequences.

An echo chamber is an environment where users are prone to encountering information that reinforce their beliefs. On social media, echo chambers have caused a loss of diversity within the political world. Echo chambers have played a significance to political polarization because many users are exposed to content that leads to confirmation bias.

With over 4.89 billion users, 100 million Instagram stories are used, 510,000 comments are posted every minute on Facebook, 456,000 posts are posted every minute on X. These mind-blowing statistics provide insight as to how much occurs on social media.

## The January 6th Connection

With such high numbers, users are prone to find communities and forums where they are able to access information and post content as they please. This content is not monitored and therefore can lead to extreme levels of radicalization.

Before the January 6th attack, users on TheDonald, Telegram, and Parler, had spread the message of Donald Trump, who posted a tweet to rally in Washington, but added a twist to it. They insisted on a violent attack against the Capitol.

## The Polarization of Political Parties

Political polarization is defined as the shift of political attitudes to the ideological extremes. Social media companies are not responsible for any political polarization, yet they exacerbate it. The algorithms created by Big Tech companies are designed to maximize profit.

The use of these algorithms are meant to allow users to share content similar to each other so that they stay on platforms for as long as they can. With this, many users are able to share lots of their beliefs on platforms such as Facebook, who exacerbate polarization through parties forming ideological differences.

## The Consequences

Proliferation of polarization is seen to be linked with social media as groups are able to spread ideals and create echo chambers on a basis of confirmation biases amongst users. In more recent years, many have seen groups such as Republicans, fall victim to echo chambers causing massive ideological extremes.

As political parties are pushed away from aligning agendas and following their partisanship, this has damaged policy making in the status quo. Many politicians start to disagree with one another due to misinformation spreading like wildfires. With the status quo being disrupted, this interrupts the flow of the country itself. The country will start to fall behind and not be able to compete because of a bipartisan political system turning into two political extremes with no cooperation.`
  },
  {
    slug: "cc-a-brief-history-of-false-flag-attacks",
    title: "A Brief History of False-Flag Attacks",
    subtitle: "",
    description: "December 9, 2025  A false flag is an attack designed to pin blame on a party while disguising the real actor responsible for the operation. For decades, the U.S has employed false flag operations in f...",
    category: "Policy & Governance",
    publishedAt: "2025-12-09",
    authorSlug: "samyak-duggirala",
    readTime: "4 min read",
    hasFullContent: true,
    graphicColors: ["#059669", "#10b981"],
    graphicIcon: "📰",
    partnership: "Capitol Commentary",
    content: `A false flag is an attack designed to pin blame on a party while disguising the real actor responsible for the operation. For decades, the U.S has employed false flag operations in foreign countries to galvanize public support for military adventurism. Whether it be in Cuba, Vietnam, Palestine, or in America itself, the U.S. imperial playbook has remained largely the same regardless of who is in charge.

**Operation Northwoods, Cuba**

Fidel Castro's control of Cuba spelled disaster for the U.S in the midst of the Cold War. The U.S. sought to overthrow Cuba's government for a couple of key reasons. First, Castro nationalized all U.S companies operating in Cuba, transferring ownership of sugar mills and oil refineries from the private sector to the public sector. Second, the adoption of socialist practices and rhetoric from a country ninety miles away from the U.S would send the wrong message during the Cold War. Altogether, the U.S needed to get rid of Castro's power in Cuba. In order to garner support, Operation Northwoods came across President Kennedy's desk. Declassified CIA documents reveal plans to "create an incident which will demonstrate convincingly that a Cuban aircraft has attacked and shot down a chartered civil airliner." The U.S. operation to murder Cuban and U.S. citizens alike was fortunately rejected by President Kennedy. However, the plan was approved by Kennedy's Joint Chiefs of Staff, the senior-most military officials in the U.S. Additionally, a failed U.S. invasion of Cuba still occurred. To this day, the U.S. remains hostile to Cuba through economic sanctions.

**Gulf of Tonkin, Vietnam**

No one knows who shot first. The U.S. entered the Vietnam War after the USS Maddox, stationed in the Gulf of Tonkin, was attacked by North Vietnamese boats. First, on August 2nd, then on August 4th. As declassified files from the NSA in the early 2000s prove, the U.S. greatly exaggerated the first attack while entirely fabricating the second one. The "attack" on August 4th was actually the result of poor equipment performance with faulty detection. Moreover, time logs were altered to make it appear as if attacks had occurred on the fourth. President Lyndon B. Johnson ran with the false narrative and utilized the Gulf of Tonkin incident to gain congressional approval for unilateral military action against Vietnam. As a result of the U.S. war, more than 3 million Vietnamese died with American casualties reaching 58,000.

**Lavon Affair, Palestine**

Israel has carried out many false flag operations to justify its occupation of Palestine. However, the Lavon affair is unique as its targets were U.S. institutions. The IDF had planted bombs in U.S civic buildings in Cairo, blaming attacks on the Egyptians. Fortunately, the Egyptian military prevented Israeli attacks. However, the attack's failure still led to a massive chain of events as Egypt sentenced two of the Egyptian Jewish agents who carried out the attacks to death. Consequently, Israel launched a military incursion into Gaza that killed 39 Egyptians. Even further, these tensions escalated directly into the Suez crisis as Egypt wrestled with Western powers.

As the U.S. continues to expand its military intervention across the globe, it is imperative to remember the false narratives the U.S. perpetuates to justify its illegal actions. Today, Venezuela appears to be the next victim of imperialist policy. As Venezuela holds the world's largest oil reserves, the U.S. motivation to cause conflict under the guise of "counter-narcotics" appears to be a lie. Just one month ago, Venezuelan authorities themselves claimed to have uncovered planned false flag operations by covert U.S. forces. As the USS Gravely occupies the coast of Venezuela, we must watch out for a possible false flag attack. Moreover, we must remain skeptical of the information the U.S. feeds us about Venezuela, just as the public remained skeptical of Cuba and Vietnam in the 20th century. False flag fabrications are too common in history. We have not uncovered all of them, but being aware of the strategy itself is important in order to spot the same patterns in modern-day conflicts.

— Samyak Duggirala`
  },
  {
    slug: "artificial-intelligence-as-a-mediator",
    title: "Artificial Intelligence as a Mediator",
    subtitle: "Navigating the Future of Political Conflict",
    description: "Exploring AI's potential role in conflict resolution and diplomatic negotiations.",
    category: "Technology & Society",
    publishedAt: "2024-01-23",
    authorSlug: "basma-milha",
    readTime: "9 min read",
    hasFullContent: true,
    graphicColors: ["#06b6d4", "#3b82f6"],
    graphicIcon: "🤖",
    content: `Artificial intelligence (AI) is assuming a growing function in the ever-changing global political landscape, going beyond traditional applications. One stimulating frontier is the potential for AI to act as a mediator in resolving political issues using machine learning. Consider a world where advanced algorithms help to navigate the maze of diplomatic disagreements and internal conflicts, delivering data-driven insights for more successful cures.

## The Need for Innovating Conflict Resolutions

Political conflicts, whether on a global scale or within the borders of a nation, can present complex difficulties demanding creative solutions. Traditional mediation procedures are laborious, highly resource-intensive, and occasionally inhibited by inherent human biases. This is where AI as a mediator enters the picture, providing a new viewpoint on dispute resolution.

## Introducing AI Mediation Mechanisms

**Data Analysis:** The ability to examine large datasets is fundamental to AI-mediated conflict resolution. Historical diplomatic conversations, media reports, social media sentiment, and pertinent historical precedents are all used as input by AI algorithms.

**Pattern Recognition:** Machine learning algorithms are excellent at spotting patterns and trends in massive datasets. In the context of political conflicts, these algorithms can reveal the underlying causes of the conflict and clarify the relationships between the parties involved.

**Predictive Modeling:** AI's predictive modeling features elevate dispute resolution to a new level. AI can forecast possible outcomes by simulating numerous situations using historical data and current inputs.

**Objective Analysis:** One significant advantage of AI as a mediator is its innate objectivity. Unlike humans, AI systems do not have inherent prejudices.

**Communication Enhancement:** Natural Language Processing (NLP) capabilities enhance AI's ability to resolve conflicts. Language translation systems can overcome communication gaps, allowing for more effective interaction.

**Continuous Learning:** Among AI's strengths, we find its capacity to learn and adapt constantly. As the mediator, AI engages in more disagreements and receives feedback, and its techniques evolve.

## Applications of AI-Mediated Conflict Resolution

**Diplomatic Resolutions:** Consider a scenario in which diplomats and negotiators have AI-driven insights about the preferences and priorities of opposing parties.

**Conflict Prevention:** AI can help avert conflict by examining historical data and detecting early warning signs. Early diagnosis of potential difficulties may enable preemptive responses before disputes worsen.

**Public Diplomacy:** Applying AI-powered communication tools into public diplomacy activities contributes to speeding up the creation of diplomatic statements.

**Humanitarian Crisis Response:** Throughout humanitarian catastrophes, AI could play a critical role in coordinating global responses.

## Challenges and Ethical Considerations

Although the prospective benefits of AI-mediated dispute resolution are intriguing, it is critical to address the obstacles and ethical concerns that accompany this method.

**Ethical Concerns:** The adoption of AI in conflict resolution highlights ethical concerns about openness, accountability, and the possibility of unexpected outcomes.

**Human Involvement:** AI should be considered as a supplementary tool rather than a substitute for human decision-making. Human engagement is still required for recognizing cultural nuances, comprehending the context of conflicts, and exercising moral judgment.

**Security and Privacy:** Protecting the confidentiality and privacy of sensitive diplomatic information is critical.

## Conclusion

As we look to the future of political conflict resolution, the use of AI as a mediator offers enormous promise. AI has numerous applications in this field, ranging from improving diplomatic conversations to preventing crises from escalating. However, it is critical to approach this potential paradigm shift with a clear understanding of the ethical implications and issues involved. By carefully handling these difficulties, we may be able to usher in a new era in which AI's power contributes to a more peaceful and diplomatic world.`
  },
  {
    slug: "structural-flaws-in-american-politics",
    title: "Structural Flaws in American Politics",
    subtitle: "How our political system is fundamentally designed to undermine democracy",
    description: "Examining systemic issues in the U.S. political system and potential reforms.",
    category: "Democracy & Policy",
    publishedAt: "2024-01-22",
    authorSlug: "aanya-ujjval",
    readTime: "10 min read",
    hasFullContent: true,
    graphicColors: ["#ef4444", "#f97316"],
    graphicIcon: "⚖️",
    content: `## Money

Throughout American history, those with money and influence often find themselves in positions of power. Money's influence in contemporary democracies like the United States has created financial battlegrounds in the wake of true democracy.

This economic imbalance skews the democratic process and causes a pay-to-win system. Access to the political system has become more and more exclusive, as the costs of advertisements and campaigning skyrocket with minimal resources from donations. Campaigns, without these substantial financial resources for essential components, are at an inherent disadvantage.

These candidates, often reliant on corporate funding or massive donations inevitably cause the politicians to become biased and beholden to their financial backers' interests, rather than what is best for the populace. One famous historical example is the Watergate scandal of the 1970s. The core of the issue revolved around secret contributions to Nixon's campaign.

In 2014, the US Supreme Court struck down all limits on how much any individual can contribute to any campaign in the case of <a href="https://www.oyez.org/cases/2013/12-536" target="_blank" rel="noopener noreferrer">McCutcheon v. Federal Election Commission</a>. In the 2022 US presidential election, outside financial backers and groups spent over 1.6 billion dollars to support Republican candidates. These rising costs of political elections have made access to running for office more and more competitive.

## Voter Suppression

Democracies are built upon the idea that all eligible citizens have access to an equal vote. Unfortunately, as a result of voter suppression and hurdles that certain voters have to jump through, access to this democratic ideal is limited for many.

Gerrymandering, the manipulation of electoral boundaries, presents a massive structural challenge that undermines democratic ideals and challenges the principles of a fair vote. By strategically redrawing boundaries and district lines, political parties can alter certain demographics' value and voting strength. This promotes a system in which politicians and officials choose their voters, the opposite of the democratic ideal of a right to a free and fair vote.

Gerrymandering occurs, in the modern day, in two ways. First is packing, in which voters are clustered together to reduce their power as individual voters. The other is known as cracking, which divides voter strength by making certain groups the minority in their districts.

Another method of voter suppression occurs via reduced polling locations. Officials can set up fewer booths in certain regions and districts to limit the civilians' access to political power. These practices disproportionately harm marginalized communities.

## Two-Party System

The two-party system, although successful in many ways, is a very rigid and burdensome process. Democracies like the US often grapple with the notion that the two-party system limits diversity and marginalizes certain political perspectives. The structural dominance of two major parties often stifles alternative voices, makes compromise difficult, increases polarization, and results in very few perspectives being heard.

The two parties don't represent most Americans. Many Americans don't agree fully with the platform of the party we align with. The nuanced opinions and differing perspectives are often lost, preventing important conversations and disagreements from occurring.

This political system substantially reduces the diversity of political ideologies that are available to voters. Citizens often may feel forced to align with one of the two majority parties. This kind of system stifles the success and representation of minorities and their diverse perspectives. Third parties often face difficulties that make it hard to compete on an equal footing and gain visibility.

## Conclusion

In conclusion, the contradicting notions within democracies, particularly in the context of political elections, money, voter suppression, gerrymandering, and the two-party system, underscore significant challenges to the foundational ideals of equal representation, fairness, and inclusivity. These challenges highlight the ongoing tension between democratic ideals and the practical realities of contemporary political systems. Addressing these issues requires thoughtful reforms and a commitment to enhancing fairness, inclusivity, and representation in the democratic process.`
  },
  {
    slug: "exploring-blockchain-as-a-potential-solution-for-voting-systems",
    title: "Exploring Blockchain as a Potential Solution for Voting Systems",
    subtitle: "The Intricate Landscape of Blockchain and its Potential Impact on the Electoral Process",
    description: "Can distributed ledger technology make elections more secure and transparent?",
    category: "Technology & Society",
    publishedAt: "2024-01-04",
    authorSlug: "eileen-cho",
    readTime: "9 min read",
    hasFullContent: true,
    graphicColors: ["#3b82f6", "#8b5cf6"],
    graphicIcon: "⛓️",
    content: `<a href="https://www.investopedia.com/terms/b/blockchain.asp" target="_blank" rel="noopener noreferrer">Blockchain</a> is a distributed ledger technology that enables secure, transparent, and tamper-proof transactions. Its potential impact on voting systems has been a topic of growing interest in recent years. The importance of having secure and efficient voting systems cannot be overstated, especially in a time where the validity of election results has come under question. Ultimately, it is necessary to determine whether blockchain can improve the integrity and efficiency of the electoral process.

## Arguments For Blockchain Voting

Advocates of blockchain technology tout its potential to address some of the fundamental challenges of traditional voting systems. Transparency, security, and efficiency are among the main advantages of implementing blockchain in voting systems.

By creating a transparent and immutable ledger, blockchain technology can allow for unprecedented transparency, making it incredibly difficult for malicious actors to alter or interfere with the results. Furthermore, distributed consensus algorithms enable secure authentication of votes, which can help eliminate fraud and hacking concerns.

Some successful implementations of blockchain-based voting systems have occurred in West Virginia, Switzerland, and Brazil, among others.

## Arguments Against Blockchain Voting

Despite the potential benefits of blockchain in voting systems, critics have raised concerns about the technology's vulnerabilities and limitations. Ethical considerations, privacy concerns, and the potential for corruption are some of the main criticisms of blockchain-based voting.

Technological challenges, including scalability and interoperability, pose significant obstacles to the implementation of blockchain technology in the electoral process. Case studies of blockchain-based voting systems have also revealed shortcomings, such as longer processing times and potential biases in the voting pool. These concerns must be addressed if blockchain-based voting is to be widely adopted.

## Comparison with Traditional Methods

Comparing blockchain-based voting systems with traditional methods reveals significant differences in security, efficiency, and transparency. Blockchain can address critical issues in traditional voting systems, such as interference, manipulation, and voter intimidation.

Moreover, it can allow for secure and verifiable voting without the need for costly intermediary processes. However, implementation challenges and limitations, such as its inability to accommodate non-digital voting, and its reliance on technology even in remote locations, hinder its applicability in certain contexts.

## Future Developments

Future developments in blockchain voting technology hold great promise for improving electoral integrity and efficiency. As technology advances, it is likely that blockchain-based voting will become increasingly secure, efficient, and accessible.

The widespread adoption of blockchain in voting systems is not without societal, political, and technological implications, however. Issues such as voter privacy, accessibility, and equity would need to be carefully considered in the design and implementation of such systems.

## Personal Assessment

In my opinion, the potential benefits of blockchain technology in voting systems outweigh the challenges and limitations associated with it. The transparency, security, and efficiency benefits of blockchain make it a compelling solution to address the inherent issues of traditional voting systems.

However, implementation would require careful consideration of social, political, and technological elements, and the technology would not be a panacea for all issues in the electoral process. Nonetheless, I believe that there is significant potential for blockchain to enhance the integrity and efficiency of the voting process and for it to be a viable solution in the future.

## Conclusion

In summary, the implementation of blockchain technology in voting systems has the potential to address some of the critical challenges in traditional voting systems, including security, transparency, and efficiency. Its widespread adoption, however, requires careful consideration of technology, political, and social aspects. The future of voting systems depends on investments in technological solutions that can improve transparency, efficiency, and security.`
  },
  {
    slug: "cc-the-08-recession-explained",
    title: "The '08 recession, explained",
    subtitle: "",
    description: "December 2, 2025  The Federal Reserve controls the direction of our entire economy through setting interest rates, managing the money supply, and lending money during economic hardship. But who contro...",
    category: "Policy & Governance",
    publishedAt: "2025-12-02",
    authorSlug: "samyak-duggirala",
    readTime: "3 min read",
    hasFullContent: true,
    graphicColors: ["#0891b2", "#6366f1"],
    graphicIcon: "⚖️",
    partnership: "Capitol Commentary",
    content: `The Federal Reserve controls the direction of our entire economy through setting interest rates, managing the money supply, and lending money during economic hardship. But who controls the Federal Reserve? The answer is the private sector. Specifically, the Federal Reserve operates through exclusive partnership with the country's leading financial institutions. The policymaking branch of the Fed, the Federal Open Market Committee (FOMC), includes board members hand-picked by banks. When the FOMC lowers the targeted interest rate, the private financial sector increases the amount of loans it gives out because it becomes cheaper to do so. Leading up to December 2007, banks and other financial institutions took advantage of the Fed's lower interest rates. Wall Street issued predatory, high-risk loans, with racial minorities disproportionately targeted. Soon after, economic chaos ensued.

**Regulation, or lack thereof**

In the U.S, multiple agencies are in charge of regulating the private sector's malicious activities. Yet, leading up to the '08 recession, these agencies neglected to take action against high-ranking financial institutions and their risky loans. In the housing market, banks gave loans to borrowers with no income, no job, and no assets. Analysis from the S.E.C. in 2013 found that 40% of Bank of America's mortgages did not meet the company's own standards. Unfortunately, the S.E.C. only investigated and regulated after the affair. Moreover, the FOMC consistently downplayed the housing bubble in meetings leading up to the 2008 crash. The transcripts of the FOMC meetings reveal that committee members viewed the housing sector as separate from the rest of the economy, rather than as an interconnected part of the overall economy. Eventually, the government ended up stepping in. However, government regulation would come in the form of bailouts for banks instead of harsh reprimands.

The congressional solution to the economic crisis was the Troubled Asset Relief Program (TARP). The policy would allow the U.S to purchase the toxic assets from the banks, relieving them of their troubles. Essentially, it granted welfare for the rich. MIT professor Deborah J. Lucas estimated the cost of the bank bailouts at \$498 billion. Indeed, the main winners were large, unsecured creditors of large financial institutions. The losers were taxpayers who directly subsidized the banks. The impact is larger than the economy; it was cultural. The results of the 2008 election promised change for the average consumer, but policies that subsidize the rich were a direct betrayal. Thus, our citizens became fed up with private interests controlling their livelihoods. The Occupy Wall Street movement kicked off, highlighting America's wealth inequality. A decade later, not much has changed.

Right now, banks and financial institutions are participating in the same fraudulent activities that caused the financial crash of 2008. Regulators back then didn't act fast enough. Similarly, today, regulators leave high-risk loans largely unaddressed. The IMF warns that the banking sector's vulnerabilities can spill over to the rest of the economy, just like in 2008. Every era has its economic issues. Our generation must prevent another economic catastrophe through legislation targeting the rich financial sector. By regulating the loans provided by banks and other financial institutions, we can better prevent future abuse. Indeed, the impacts of the last recession were catastrophic, with one-fourth of Americans losing 75% of their wealth.

— Samyak Duggirala`
  },
  {
    slug: "the-role-of-social-media-in-shaping-political-discourse",
    title: "The Role of Social Media in Shaping Political Discourse",
    subtitle: "An analysis of social media platforms on political conversations, information dissemination, and public opinion",
    description: "How platforms like Twitter, Facebook, and TikTok are changing political communication.",
    category: "Media & Communication",
    publishedAt: "2024-01-15",
    authorSlug: "shriya-sreeju",
    readTime: "15 min read",
    hasFullContent: true,
    graphicColors: ["#ec4899", "#8b5cf6"],
    graphicIcon: "💬",
    content: `Social media has become an integral part of modern society, influencing various aspects of human interaction, including political discourse. The role of social media in shaping political discourse is a complex and multifaceted phenomenon that has garnered significant attention from scholars, policymakers, and the general public. This article seeks to explore the various ways in which social media influences political discourse, including its impact on public opinion, political engagement, and the dissemination of information.

## The Evolution of Social Media

The introduction of social media has revolutionized the way people communicate and interact with one another. Over the years, social media platforms such as <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>, <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>, Instagram, and YouTube have not only become integral parts of people's lives but have also grown in prominence, transforming from mere social networking sites to influential spaces for political communication and engagement.

The Arab Spring in 2010 illustrated the power of social media as a catalyst for political change, with platforms such as Facebook and Twitter playing instrumental roles in organizing protests and disseminating information across the region. The 2016 U.S. presidential election, in particular, exemplified how social media could influence political discourse and shape public opinion.

## Social Media's Influence on Public Opinion

Social media platforms employ sophisticated algorithms that prioritize content based on users' interests and preferences. These algorithms determine what content users are exposed to, creating a personalized and often tailored user experience. While these algorithms aim to enhance user engagement by showing content that aligns with users' preferences, they inadvertently contribute to the formation of echo chambers and filter bubbles.

Echo chambers refer to a situation where individuals are only exposed to information and viewpoints that reinforce their existing beliefs, leading to a reinforcement of those views. On social media, people tend to follow and interact with like-minded individuals, leading to a homogenous flow of information.

Filter bubbles, on the other hand, occur when algorithms filter out content that does not align with users' preferences and interests. This further exacerbates the echo chamber effect, as users are shielded from encountering alternative viewpoints.

## Political Activism on Social Media

The advent of social media brings with it the expansion of online activism, creating virtual spaces for active engagement. Platforms such as <a href="https://www.change.org" target="_blank" rel="noopener noreferrer">Change.org</a> and Avaaz allow individuals to launch and sign petitions, contributing to the power of collective action.

Moreover, social media provides a platform for crowdfunding, allowing activists to raise funds for their causes through platforms like GoFundMe. Online activism breaks down geographic barriers, enabling a broader audience to participate in creating social change, regardless of their physical location.

## The Spread of Misinformation

While the rise of social media has undoubtedly brought several positive changes, it has also given rise to a troubling phenomenon—the proliferation of misinformation and disinformation. This has raised significant concerns about its impact on political discourse, as fake news, conspiracy theories, and propaganda have the potential to distort public perceptions and undermine democratic processes.

The consequences of misinformation on social media are far-reaching. Firstly, it undermines the public's trust in established institutions and experts. When false information is presented alongside legitimate news, it becomes increasingly difficult for users to distinguish between fact and fiction.

## Regulation of Social Media

Governments play a crucial role in ensuring the regulation and governance of social media platforms. As the guardians of the public interest, they have the responsibility to safeguard democratic values and protect citizens from harmful content that may incite violence, spread misinformation, or manipulate public sentiment.

Regulatory bodies act as intermediaries between governments and social media platforms, working to formulate and enforce policies that maintain a fair and safe digital environment. These bodies, such as the <a href="https://www.fcc.gov" target="_blank" rel="noopener noreferrer">Federal Communications Commission (FCC)</a> in the United States or the Office of Communications (Ofcom) in the United Kingdom, can provide guidance to social media companies regarding best practices for content moderation.

## Conclusion

In conclusion, the role of social media in shaping political discourse is a topic of immense significance and complexity. Social media has fundamentally transformed the landscape of political communication and engagement, presenting both opportunities and challenges for democratic societies. As the influence of social media continues to grow, it is essential to critically assess its impact and consider strategies for promoting informed, constructive, and inclusive political discourse in the digital age.`
  },
  {
    slug: "big-data-in-politics",
    title: "Big Data in Politics",
    subtitle: "The Dangerous Game of Information Manipulation",
    description: "Unpacking how data, algorithms, and targeted messaging are reshaping political power and civic life.",
    category: "Data & Privacy",
    publishedAt: "2024-01-10",
    authorSlug: "arya-miller",
    readTime: "10 min read",
    hasFullContent: true,
    graphicColors: ["#8b5cf6", "#ec4899"],
    graphicIcon: "📊",
    content: `Envision a political campaign trying to win you over, armed not just with slogans and promises but with your deepest fears, desires, and personal details harvested from your online activities. This scenario isn't a dystopian fiction; it's the harsh reality of big data in political campaigns today.

The concept of big data has become both a powerful tool and a source of contention within the ever-evolving landscape of political campaigns. While proponents argue that data-driven strategies enable more targeted and efficient outreach, a closer examination reveals a darker side—one that exploits personal information, manipulates public opinion, and undermines the very foundations of democratic participation.

At its core, big data in politics involves the collection and analysis of vast amounts of personal information to tailor political messages and advertisements. This practice raises significant ethical concerns, primarily regarding privacy and consent. Citizens often unknowingly surrender their data through social media interactions, online purchases, and even seemingly innocuous activities like taking online quizzes. This data is then aggregated, analyzed, and used to construct detailed profiles that predict political preferences and vulnerabilities.

The Cambridge Analytica scandal serves as a stark reminder of the potential for abuse in this realm. The firm harvested data from millions of Facebook users without their consent, using it to influence voter behavior in the 2016 U.S. presidential election and the Brexit referendum. This case exemplifies how personal data can be weaponized to manipulate democratic processes, targeting individuals with tailored messages designed to exploit their psychological profiles.

Beyond privacy concerns, the use of big data in politics exacerbates the problem of misinformation. Campaigns can use data analytics to identify and target susceptible individuals with misleading or false information, creating echo chambers that reinforce existing biases and further polarize the electorate. This manipulation not only distorts public discourse but also erodes trust in democratic institutions.

Moreover, the reliance on big data in political campaigns raises questions about equality and representation. Those with access to sophisticated data analytics tools gain a significant advantage, potentially drowning out the voices of grassroots movements and smaller parties. This creates an uneven playing field where financial resources and technological prowess can overshadow genuine policy debates and democratic engagement.

The regulatory landscape has struggled to keep pace with these developments. While some jurisdictions have implemented data protection laws, enforcement remains inconsistent, and many loopholes persist. The global nature of data flows further complicates efforts to regulate the use of personal information in political campaigns.

It is time we recognize the harmful implications of big data in politics and work towards reclaiming the integrity of our democratic processes.`
  },
  {
    slug: "private-sector-involvement-in-government-climate-initiatives",
    title: "Private Sector Involvement in Government Climate Change Initiatives",
    subtitle: "The Vital Roles of Governments, the Private Sector, and Capital Markets in Combatting Climate Change",
    description: "Analyzing how public–private collaboration and capital markets can accelerate climate action at scale.",
    category: "Climate & Environment",
    publishedAt: "2024-01-04",
    authorSlug: "arya-miller",
    readTime: "15 min read",
    hasFullContent: true,
    graphicColors: ["#10b981", "#06b6d4"],
    graphicIcon: "🌱",
    content: `Summarized by Nobel Prize winning economist William Nordhaus in a simple metaphor from Climate Change: The Ultimate Challenge for Economics, "Climate change is like a vast casino...we are rolling the climate dice, the outcome will produce surprises, and some of them are likely to be perilous" (Nordhaus, 2019). Within the 21st century, similar statements of the vitality of climate change action have increased dramatically around the world, backed by the increasing environmental havoc and following societal adaptation.

Take, for example, the steps being taken by the Tofina tribe, displayed within "How to Build a Resilient Future Using Ancient Wisdom" by Julia Watson. Developing the largest lake city within Africa, the houses are constructed upon stilts, and neighborhoods are navigated by canoes. However, these efforts will merely not be strong enough to escape Nordhaus's treacherous and high-cost "climate change casino" over time.

As society grapples with the overwhelming task of fighting climate change, it becomes clear that mankind currently stands unprepared and incapable. Only one industry contains the firepower to lead to mitigation and adaptation to climate change; the private sector. Yet, this group often lacks involvement. With many experts in the field raising awareness about this discrepancy, the question becomes: To what extent could promoting greater private sector investment into environmental initiatives impact global resilience against climate change? With greater analysis, it becomes clear that promoting greater private sector investment into environmental initiatives would do a great deal in strengthening global resilience against climate change.

## Background

The private sector can be defined as the segment of an economy run by individuals and corporations aimed at making profits, rather than under the control of governmental agencies. Controlling an estimated $143 trillion of wealth held within private banks alone (Goldstein et al., 2019) the private sector combined is among the most powerful and influential entities within modern society.

## Private Sector Funding

Among the biggest complications within current climate change initiatives is the lack of funding and access to capital. According to International Monetary Fund data, current global investment to address climate change sits at $630 billion (Public Sector Must Play Major Role in Catalyzing Private Climate Finance, 2022). While an impressive sum, the issue becomes discernible as the estimated overall monetary amount required to meet current international initiatives are presented.

Within the same study and analysis presented by the IMF, approximated costs in order to properly strengthen global climate change resilience are found to be within $3 trillion to $6 trillion per year until 2050. In comparison, data from The U.S Currency Education Program lists the current amount of U.S. currency in circulation at $2.2 trillion. Accounting for all physical capital flowing within the United States, this aggregate appears as an unfathomable sum from an individual viewpoint.

Data from The World Economic Forum's "Climate adaptation: the $2 trillion market the private sector cannot ignore" displays just this. According to the research, only 1.6% of climate adaptation investment funding is provided by the private sector, leaving large gaps public funding is left to fill.

## Development and Innovation

An additional support for the argument that private sector involvement and investment into climate change initiatives would beneficially impact worldwide resistance and resilience against climate change ties into modern technology and innovation. Throughout history, it is evident that society has the capability to adapt and overcome the environmental challenges it faces.

One specific showcase of the technological abilities society contains to combat environmental difficulties is the study discussing Daphnia microbes. The program enabled fleas to consume cyanobacteria, an organism that can severely overrun ponds. With an end result containing state-of-the-art water quality technology, it is small yet vital projects like these that society needs in order to build global climate change resilience.

## Private-Public Partnerships

A final benefit to promoting greater private sector investment into climate change initiatives is the encouragement of collaboration between the private and public sectors, a step indicative of project success over time. In the study led by Tina Schneider of the World Resources Institute, data is presented on the private sector connection into public sector climate action, focusing specifically on Germany.

A large part of this connection involves basic facilities, with the study listing that "80% of critical infrastructures are now privately owned." The Public Private Partnerships project failure rate is below four percent, with only 292 out of the 8295 projects between 1990-2020 failing.

## Conclusion

The future remains uncertain as society faces down an environmental catastrophe. With an empty canvas of numerous potential outcomes, taking action against climate change has never been more important. As risk and uncertainty grows, it becomes clear that society stands off guard for the challenges facing us. However, with research, it becomes clear that an intrinsic and influential player remains in the background: the private sector.

As displayed within the previous paragraphs, vast amounts of benefits would occur from the involvement of the private sector. This incorporates the steps towards adaptation and mitigation, such as financial, technological, and collaborative aspects. It becomes clear that promoting greater private sector investment into environmental initiatives would strengthen global resilience against climate change. Beneficial to all parties involved, initiative can be taken today to secure a greener future for all.`
  },
  {
    slug: "ensuring-democratic-integrity",
    title: "Ensuring Democratic Integrity",
    subtitle: "Advocating for Stricter Controls on Political Lobbying and Congressional Compensation",
    description: "Exploring how tightening regulations on lobbying and rethinking congressional pay can strengthen democratic accountability.",
    category: "Democracy & Policy",
    publishedAt: "2024-01-04",
    authorSlug: "arya-miller",
    readTime: "12 min read",
    hasFullContent: true,
    graphicColors: ["#3b82f6", "#8b5cf6"],
    graphicIcon: "🏛️",
    content: `In a nation founded upon the ideal of representation of all, the voice of the people should unequivocally resonate above the deep pockets of special interest groups. Yet, the pervasive influence of political lobbying and the questionable compensation practices of our elected representatives have clouded the once clear sanctity of our democratic processes. The implications of such an overhaul, both ethically and politically, demand immediate attention. I advocate for greater restrictions on lobbying and a reassessment of how members of Congress are compensated.

Political lobbying has grown into a potent force of political poison, often swaying public servants in alignment with interests of corporations and wealthy entities rather than their populace. This occurs in a manner that completely undermines the individuals in representative districts that expect their views properly and unwaveringly represented. Certainly, the right to petition the government is a cornerstone of free speech, but the unchecked power of money in politics has manufactured this freedom into a tool for a select few to tip the scales in their favor. This imbalance chips away at the foundation of justice and democracy, and drowns out the diverse, vital voices of ordinary people.

A prominent illustration of the ethical concerns that arise surrounding political lobbying is the case of the tobacco industry within the United States. From the 1950s to the 1990s, tobacco industries yielded tremendous power and influence over shaping public opinion on the health risks of tobacco. Despite long-running efforts by public health advocates, scientists, and those affected by tobacco products, both courts and Congress sided with the tobacco industry in policy and litigation.

Moreover, lobbying proved greatly successful in suppressing the placement of warning labels on tobacco products. The Federal Cigarette Labeling and Advertising Act (FCLAA) of 1965 originally required cigarette warning labels to include a warning of cancer, yet following significant pressure placed upon politicians, this was removed from the final bill.

The issue of compensation for members of Congress, which tipped the scale in the FCLAA bill discussed above, warrants scrutiny. The prevailing system, where lawmakers often benefit from lucrative post-office arrangements with corporations and interest groups, creates a conflict of interest. It blurs the line between public service and personal gain, potentially compromising lawmakers' commitment to representing the best interests of their constituents.

To restore integrity to our democratic processes, a series of measures need implementation. First and foremost, imposing stricter regulations on lobbying activities is imperative. Caps on campaign contributions, mandatory disclosure of lobbying activities, and stringent penalties for ethical violations are necessary steps to limit the undue influence of money in politics. Transparency should be non-negotiable, ensuring that the public can scrutinize the relationships between lobbyists and lawmakers.

Furthermore, reforming congressional compensation practices is equally vital. Implementing laws that restrict or outright prohibit members of Congress from receiving payment or gifts from lobbyists or corporations post-service is a crucial step. Instead, ensuring a reasonable, fixed salary during their tenure can mitigate conflicts of interest and maintain the focus on serving the public's interests.

Critics of such proposals often argue that they infringe upon free speech and the rights of individuals and groups to petition their government. However, it is essential to remember that the proposed reforms seek to balance these rights with the ethical responsibility of preserving the democratic process's integrity. Stricter controls do not inhibit free speech but rather curtail the disproportionate influence of moneyed interests, thereby amplifying the voices of all citizens.

Ultimately, advocating for tighter controls on lobbying and reforming congressional compensation is not about stifling voices but about amplifying the chorus of the people. It's about upholding the fundamental tenets of democracy—equality, fairness, and representation—while preventing undue influence that distorts these principles. As stewards of democracy, we owe it to ourselves and future generations to safeguard the integrity of our political processes by enacting these vital reforms.`
  }
];

// Helper functions
export function getArticlesByCategory(category: string): Article[] {
  if (category === "All") return articles;
  return articles.filter(article => article.category === category);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find(author => author.slug === slug);
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return articles.filter(article => article.authorSlug === authorSlug);
}

export function getAuthorForArticle(article: Article): Author | undefined {
  return authors.find(author => author.slug === article.authorSlug);
}
