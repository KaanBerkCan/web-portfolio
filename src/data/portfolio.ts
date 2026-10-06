export type ProjectCategory =
  | "digital-games"
  | "tabletop"
  | "concepts"
  | "research";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  genre: string;
  role: string;
  status: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links?: { label: string; url: string }[];
}

export const site = {
  name: "Kaan Berk Can",
  title: "Game & System Design Portfolio",
  tagline: "Bridging engineering logic with creative system design",
  bio: "Industrial Engineer and Software Developer with 3 years on Turkish Airlines' crew planning systems, where I rewrote the crew assignment optimizer's constraint model for 20,000+ crew. Now completing an MSc in Game and Interaction Technologies at ITU and designing games the way I built those systems: with mathematical models, simulation and data. Seeking remote Game Design, Technical Design, Systems Design, Software or Analytics roles.",
  email: "kaanc5528@gmail.com",
  phone: "+90 530 308 29 40",
  linkedin: "https://www.linkedin.com/in/kaan-berk-can",
};

export const categories: {
  id: ProjectCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "digital-games",
    label: "Digital Games & Prototypes",
    description: "Playable demos, vertical slices, and system-driven digital experiences.",
  },
  {
    id: "tabletop",
    label: "System & Tabletop Design",
    description: "Cooperative board games, civic simulations, and tabletop RPG systems.",
  },
  {
    id: "concepts",
    label: "Game Concepts & Pitching",
    description: "Genre-blending concepts exploring narrative, horror, and mechanical tension.",
  },
  {
    id: "research",
    label: "Research & Mathematical Analytics",
    description: "Academic papers, economy modeling, and player-behavior analysis.",
  },
];

export const projects: Project[] = [
  {
    id: "harvey-park",
    slug: "harvey-park",
    title: "Harvey Park",
    category: "digital-games",
    genre: "Psychological Horror / Anomaly Detection",
    role: "Game Designer, Developer, Narrative Designer",
    status: "Alpha Playable Demo",
    summary:
      "A first-person psychological horror and anomaly detection game where you are trapped in a mental loop inside a futuristic mining tower. Observe rooms, restore power, and make life-or-death elevator decisions to escape the ancient entity named Echo.",
    highlights: [
      "Two-phase observation loop: memorize rooms in darkness, then detect anomalies when power returns.",
      "Dual-threat system with Red Echo (hidden timer) and White Echo (direct pursuer).",
      "16-floor tower progression culminating in a fusion-room memory boss encounter.",
    ],
    tags: ["Demo", "Ongoing Project", "Horror", "Anomaly"],
  },
  {
    id: "birth-of-miracle",
    slug: "birth-of-miracle",
    title: "Birth of Miracle",
    category: "digital-games",
    genre: "2.5D Cinematic Puzzle & Adventure",
    role: "Game Designer & Developer",
    status: "Playable Prototype",
    summary:
      "A 2.5D narrative platformer set in Sanctara, a surreal realm beyond time. Follow the Wanderer through shifting dimensions, environmental puzzles, and philosophical storytelling about the birth of curiosity.",
    highlights: [
      "Notebook system lets players choose how deeply they uncover lore and philosophical angles.",
      "Seamless puzzle integration with light Metroidvania progression through perception abilities.",
      "Inspired by Limbo, Inside, and Little Nightmares.",
    ],
    tags: ["Vertical Slice", "Miracle IP", "2.5D", "Puzzle-Platformer"],
  },
  {
    id: "miracle-born-dead",
    slug: "miracle-born-dead",
    title: "Miracle: Born & Dead",
    category: "digital-games",
    genre: "Turn-Based Strategy / Real-Time Tactics",
    role: "System Designer",
    status: "GDD Complete",
    summary:
      "A dual-phase strategy game bridging grand empire management with micro-level tactical combat across the metaphysical realm of Eden, featuring five deeply asymmetric factions.",
    highlights: [
      "Simultaneous turn resolution in the Camp Phase for unpredictable military encounters.",
      "Real-time isometric Battle Phase with Mount & Blade-inspired unit command.",
      "Engineers reshape battlefields; assassins exploit terrain for stealth strikes.",
    ],
    tags: ["Worldbuilding", "Miracle IP", "RTS", "TBS"],
  },
  {
    id: "dekrawler",
    slug: "dekrawler",
    title: "Dekrawler",
    category: "digital-games",
    genre: "Roguelike Dungeon Crawler / Card Game",
    role: "Solo Designer & Developer",
    status: "v0.4.0 on itch.io",
    summary:
      "A single-player roguelike where a deck of playing cards is the entire dungeon. Each suit is a verb, and your weapon degrades to the rank of whatever it last killed, so the order you fight in matters more than anything else. Built solo in Unity 6, with every graphic drawn in code and every sound synthesized at runtime, and released on itch.io.",
    highlights: [
      "Weapon degradation drives every decision: a kill locks the weapon to that enemy's rank, turning each room into a sequencing puzzle.",
      "Thirteen campaign tiers built from discrete rules rather than escalating stat multipliers, each rule introduced on its own before it is combined.",
      "Two designed suits beyond the standard deck: Oracle reads and manipulates the upcoming draw, serpents hide their face until you commit to the fight.",
      "Meta progression of 45 card-bound jokers, 15 rule-rewriting artifacts and 7 deck upgrades, bought with crystals; levels can be bought in any order.",
      "A Monte Carlo simulator drives the real game engine rather than a model of it, so balance is measured against the shipped rules.",
      "No art or audio files: the interface is drawn in code and the soundtrack's four layers fade in as the run gets more dangerous.",
    ],
    tags: ["Playable Build", "Roguelike", "Deck Building", "Unity 6"],
    links: [
      { label: "Play on itch.io", url: "https://graven5226.itch.io/dekrawler" },
    ],
  },
  {
    id: "miracle-board-game",
    slug: "miracle-board-game",
    title: "Miracle: Board & Game",
    category: "tabletop",
    genre: "1–6 Player Cooperative Board Game / Tabletop RPG",
    role: "Game Designer",
    status: "GDD Complete",
    summary:
      "Streamlines D&D depth into an accessible 13×13 grid board game where players roll a d12, clear enemy tiles, defeat minibosses, and summon the final boss through cooperative row combat.",
    highlights: [
      "Row Combat pulls all players on the same row into fights, eliminating downtime.",
      "Soldier army mechanic nerfs final boss HP based on exploration rewards.",
      "Charisma-based push-your-luck loot upgrades from Common to Mythical rarity.",
    ],
    tags: ["Completed", "Boardgame", "TabletopSimulator"],
  },
  {
    id: "moods-of-istanbul",
    slug: "moods-of-istanbul",
    title: "Moods of Istanbul",
    category: "tabletop",
    genre: "Scalable Civic Negotiation / Semi-Cooperative Board Game",
    role: "Game Designer",
    status: "Tabletop Simulator",
    summary:
      "A modular megagame where tables physically merge from 4 to 16+ players, simulating urban planning bureaucracy. Players negotiate policies under time pressure using real IPA statistical data.",
    highlights: [
      "Dynamic scaling: 4-player districts merge into larger councils with expanding maps.",
      "IPA Data Cards anchor subjective roleplay goals to objective city statistics.",
      "Faction-based scoring where multiple roles can win through pooled IPA points.",
    ],
    tags: ["Boardgame", "Completed", "TabletopSimulator"],
    links: [
      {
        label: "Tabletop Simulator Workshop",
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3617223490",
      },
    ],
  },
  {
    id: "mikapoly",
    slug: "mikapoly",
    title: "Mikapoly",
    category: "tabletop",
    genre: "2-Player Cooperative Tabletop / Resource Management",
    role: "Game Designer",
    status: "Completed",
    summary:
      "Transforms Monopoly's elimination mechanics into a cooperative experience where two players manage individual Time, Effort, and Trust resources to reach 100 Happiness before 100 Monotony ends the game.",
    highlights: [
      "Memory Zones replace properties, unlocked through individual sacrifice for shared happiness.",
      "Sharing Fee mechanic punishes resource drain without player elimination.",
      "Collecting a full set lets players share real memories to raise rent costs.",
    ],
    tags: ["Boardgame", "Completed"],
  },
  {
    id: "sown-in-silence",
    slug: "sown-in-silence",
    title: "Sown in Silence",
    category: "concepts",
    genre: "Narrative Adventure (Farming Sim + Metroidvania)",
    role: "Concept & System Designer",
    status: "Pitch",
    summary:
      "A genre-blend where cozy farming and dating sim loops by day collide with cosmic horror temple exploration by night, as forbidden knowledge from a Great Old One warps reality.",
    highlights: [
      "Dual-loop design: routine farming vs. revelation-driven temple exploration.",
      "Knowledge-as-power Metroidvania progression reveals hidden paths without physical keys.",
      "Entity communicates through abstract puzzles rather than traditional quest logs.",
    ],
    tags: ["Ideation", "Cosmic Horror", "Dating Sim", "Metroidvania"],
  },
  {
    id: "gears-of-behemoth",
    slug: "gears-of-behemoth",
    title: "Gears of Behemoth",
    category: "concepts",
    genre: "Third-Person Action / Boss-Rush / Adventure",
    role: "Concept & System Designer",
    status: "Pitch",
    summary:
      "In an industrial steampunk world, players chase and scale mechanical Colossi using specialized vehicles, dismantling internal components through momentum-based climbing and puzzle encounters.",
    highlights: [
      "Vehicle-to-Colossus loop: steam-bikes and grappling-tanks launch players onto moving targets.",
      "Colossi are moving environmental puzzles with internal sabotage objectives.",
      "Risk-reward scavenging during climbs for gear upgrades.",
    ],
    tags: ["Ideation", "Third Person", "Boss-Rush"],
  },
  {
    id: "dissonance-ward",
    slug: "dissonance-ward",
    title: "Dissonance Ward",
    category: "concepts",
    genre: "Procedural Horror / Puzzle",
    role: "Concept & System Designer",
    status: "Pitch",
    summary:
      "A hospital-set horror experience combining anomaly detection with a 5×5 procedural roguelike grid and a multi-personality mechanic that changes how the world is perceived.",
    highlights: [
      "5×5 procedural room grid with directional navigation based on environmental clues.",
      "Observation-based horror with no combat — memory and attention are your weapons.",
      "Personality shifts reveal different anomalies at the cost of phobias and hallucinations.",
    ],
    tags: ["Horror", "Ideation", "Anomaly", "First Person"],
  },
  {
    id: "idle-incrementation",
    slug: "idle-incrementation",
    title: "Idle Incrementation Analysis",
    category: "research",
    genre: "Idle / Incremental Game Economy",
    role: "Systems & Economy Designer",
    status: "Playable Build",
    summary:
      "A rigorous 15-minute progression simulation with exponentially scaling upgrade costs, comparing human delayed-gratification strategies against Python optimization algorithms.",
    highlights: [
      "Six-tier upgrade economy modeled with Cost = BaseCost × 1.1^N inflation formula.",
      "Human playtesters consistently outperformed greedy algorithms through macro-strategy waiting.",
      "Built with Excel modeling, Python testing, and Unity playable APK.",
    ],
    tags: ["Completed", "Analysis"],
  },
  {
    id: "human-vs-ai",
    slug: "human-vs-ai",
    title: "Human vs. AI: Creativity in Game Design",
    category: "research",
    genre: "Academic Paper (IEEE Format)",
    role: "Researcher & First Author",
    status: "Research Paper",
    summary:
      "Comparative analysis of creative outputs between human designers and generative AI in game mechanics and world-building, evaluating structural coherence, thematic resonance, and innovation.",
    highlights: [
      "Explores recombinational vs. transformational creativity in procedural game design.",
      "Identifies the 'intentionality gap' where AI lacks purposeful rule-breaking.",
      "Proposes co-creativity model: AI as force multiplier, human as emotional anchor.",
    ],
    tags: ["Research", "Ongoing"],
  },
  {
    id: "player-thoughts-review",
    slug: "player-thoughts-review",
    title:
      "A Review of Thoughts of People From Different Age, Gender and Gaming Frequency Groups",
    category: "research",
    genre: "Player Research / Survey Analysis",
    role: "Researcher & Author",
    status: "Academic Paper",
    summary:
      "Qualitative review examining how age, gender, and gaming frequency shape player perspectives and design implications for audience-targeted game development.",
    highlights: [
      "Cross-demographic analysis of player attitudes and preferences.",
      "Insights for designing inclusive experiences across gaming frequency segments.",
    ],
    tags: ["Research & Mathematical Analytics"],
  },
  {
    id: "settlers-of-catan",
    slug: "settlers-of-catan",
    title: "An Analysis of Settlers of Catan",
    category: "research",
    genre: "Board Game Design Analysis",
    role: "Researcher & Author",
    status: "Video Essay",
    summary:
      "Comprehensive MDA framework analysis of Catan covering narrative context, functional board design, probability-driven resource generation, trading dynamics, and component evolution.",
    highlights: [
      "Examines how randomized tile placement creates 'easy to learn, hard to master' depth.",
      "Analyzes the robber mechanic as an anti-hoarding and disruption system.",
      "Compares component quality across editions as manufacturing evolution case study.",
    ],
    tags: ["Analysis"],
    links: [
      {
        label: "Watch on YouTube",
        url: "https://youtu.be/oR9vTZPhRNk",
      },
    ],
  },
  {
    id: "bartle-poe",
    slug: "bartle-poe",
    title: "Bartle's Player Taxonomy: A Path of Exile Case Study",
    category: "research",
    genre: "Player Taxonomy Analysis",
    role: "Researcher & Author",
    status: "Video Essay",
    summary:
      "Applies Bartle's player taxonomy (Explorer, Achiever, Socializer, Killer) to Path of Exile, mapping how the ARPG's systems serve each player type differently.",
    highlights: [
      "Explorers engage with the massive passive tree and skill gem combinations.",
      "Socializers leverage co-op campaign and internal trading economy.",
      "Killers find outlet in PVP arenas and horde destruction gameplay.",
    ],
    tags: ["Analysis"],
    links: [
      {
        label: "Watch on YouTube",
        url: "https://www.youtube.com/watch?v=YNn5dXeQU1Q",
      },
    ],
  },
];

export interface ExperienceRole {
  title: string;
  period: string;
  description: string;
}

export interface ExperienceEntry {
  organization: string;
  period: string;
  roles: ExperienceRole[];
}

export interface EducationEntry {
  institution: string;
  program: string;
  period: string;
  detail?: string;
}

export const experience: ExperienceEntry[] = [
  {
    organization: "Independent Game Development & MSc Research",
    period: "2024 — Present",
    roles: [
      {
        title: "Game Designer & Developer / MSc Researcher",
        period: "2024 — Present",
        description:
          "I design and build games solo and as team lead (Dekrawler, Harvey Park, Birth of Miracle). My MSc thesis extracts procedural game mechanics from a given text and simulates them to test whether the text's emotional load can be conveyed through mechanics alone.",
      },
    ],
  },
  {
    organization: "Turkish Airlines",
    period: "August 2022 — July 2025",
    roles: [
      {
        title: "Administrator / System Developer",
        period: "October 2024 — July 2025",
        description:
          "I developed and maintained the Jeppesen crew suite (Pairing, Rostering, Tracking, Manpower) alongside system and machine management with Bash, Oracle and MS SQL, and took part in the team's migration from Mercurial to Git.",
      },
      {
        title: "System Developer",
        period: "April 2023 — October 2024",
        description:
          "I rewrote the crew assignment optimizer's format and constraints from scratch (10–25% faster runs, fewer rule violations and manual corrections) and built Rave rules, Python tooling and SQL / Power BI reporting for 20,000+ cockpit and cabin crew, working directly with crew planners.",
      },
      {
        title: "Intern Developer",
        period: "August 2022 — April 2023",
        description:
          "I worked part-time on developments and also completed the internships required for my degree.",
      },
    ],
  },
  {
    organization: "Kuzey Technic Metal Processing Inc.",
    period: "June 2022 — August 2022",
    roles: [
      {
        title: "Workshop Intern",
        period: "June 2022 — August 2022",
        description:
          "I successfully completed my workshop internship by working with CNC machines.",
      },
    ],
  },
];

export const education: EducationEntry[] = [
  {
    institution: "Istanbul Technical University",
    program: "Game and Interaction Technologies — Master's Degree Program",
    period: "2024 — Present (expected December 2026)",
  },
  {
    institution: "Yıldız Technical University",
    program: "Industrial Engineering (English) — Bachelor's Degree",
    period: "2019 — 2023",
    detail: "GPA: 3.46 / 4.00",
  },
  {
    institution: "Vefa High School",
    program: "High School",
    period: "2014 — 2019",
  },
];

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
