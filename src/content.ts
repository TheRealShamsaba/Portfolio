export interface SkillGroup {
  title: string
  items: string
}

export interface Poster {
  id: string
  title: string
  image: string
  category: 'concept' | 'identity' | 'media' | 'satire'
  tags: string[]
  explicit: boolean
  description: string
}

export interface Project {
  id: number
  title: string
  description: string
  desc: string
  link: string
  liveUrl?: string
  repoUrl?: string
  image?: string
  role?: string
  note?: string
  tags: string[]
}

export interface FeaturedSite {
  id: string
  title: string
  eyebrow: string
  summary: string
  liveUrl: string
  repoUrl?: string
  image?: string
  role: string
  year: string
  tags: string[]
  highlights: string[]
}

export interface DripProduct {
  name: string
  label: string
  logo: string
  status: string
  summary: string
  stack: string[]
  signals: string[]
  roadmap: string[]
}

export interface Venture {
  id: string
  name: string
  label: string
  status: string
  statement: string
  description: string
  focus: string[]
  link?: string
  linkLabel?: string
  accent: 'acid' | 'orange' | 'ice'
}

export interface CaseStudy {
  id: number
  title: string
  problem: string
  built: string
  stack: string[]
  result: string
  link: string
}

export const categoryMeta = {
  concept: {
    desc: 'Posters about ideas, thinking, relationships, and reflection.'
  },
  identity: {
    desc: 'Posters about personal growth, values, culture, and self-expression.'
  },
  media: {
    desc: 'Platform visuals for YouTube and podcast content, including covers and thumbnails.'
  },
  satire: {
    desc: 'Posters that use critique, humor, and commentary through irony.'
  }
} as const

export const portfolioContent = {
  profile: {
    name: 'Arian Shamsabadi',
    role: 'Founder / Full-Stack Developer based in Istanbul.',
    avatar: '/profile.webp',
    intro:
      'Strategy is only useful when it becomes a product people can touch.',
    about:
      'I turn early ideas into structured, working systems. Right now I am building Drip, shaping Real Co., and using engineering, design, and media to move each idea from first principles to a real public experience.',
    email: 'arianshamsabadi@gmail.com',
    telegram: 'https://t.me/Therealshamsaba',
    whatsapp: 'https://wa.me/message/Z6P4QVVV2MIOC1',
    socialLink: 'https://github.com/TheRealShamsaba'
  },
  skills: [
    { title: 'Product', items: 'Strategy, architecture, experience, launch' },
    { title: 'Technology', items: 'Applied AI, software systems, web and mobile' },
    { title: 'Brand', items: 'Positioning, visual direction, content and voice' }
  ] as SkillGroup[],
  ventures: [
    {
      id: 'drip',
      name: 'Drip',
      label: '01 / Fashion intelligence',
      status: 'Private beta in development',
      statement: 'A personal wardrobe that remembers.',
      description: 'Drip is an AI-powered wardrobe assistant built around real closet context: what you own, what you wear, and what a moment actually calls for. The product spans iOS, API, web, storage, and recommendation workflows.',
      focus: ['Digital closet', 'Outfit feedback', 'Purchase decisions', 'Personal context'],
      link: 'https://dressrightinpublic.com/',
      linkLabel: 'Explore the brand world',
      accent: 'acid'
    },
    {
      id: 'real-co',
      name: 'Real Co.',
      label: '02 / Company in formation',
      status: 'Building quietly',
      statement: 'A home for products with a point of view.',
      description: 'The company layer around the work I am building: products, experiments, and selective collaborations shaped by clear thinking, strong identity, and hands-on execution.',
      focus: ['Venture building', 'Product direction', 'Creative technology', 'Selective partnerships'],
      accent: 'orange'
    },
    {
      id: 'reasonable-show',
      name: 'The Reasonable Show',
      label: '03 / Independent media',
      status: 'Publishing',
      statement: 'Ideas tested out loud.',
      description: 'An independent show where technical, cultural, and uncomfortable ideas get translated into direct conversation—with enough comedy and sarcasm to keep it honest.',
      focus: ['Conversations', 'Interviews', 'Commentary', 'Visual media'],
      link: 'https://youtu.be/9iLwSkk9k6U?si=rIaMDLzxdY-eHTSO',
      linkLabel: 'Watch the latest episode',
      accent: 'ice'
    }
  ] as Venture[],
  featuredSites: [
    {
      id: 'dress-right-in-public',
      title: 'Dress Right in Public',
      eyebrow: 'Flagship live build',
      summary: 'A fashion-focused website built to feel more like a brand world than a plain storefront. The direction leans editorial, bold, and memorable.',
      liveUrl: 'https://dressrightinpublic.com/',
      image: '/projects/dressrightinpublic.png',
      role: 'Frontend development, visual direction, deployment',
      year: '2026',
      tags: ['Live Website', 'Brand Experience', 'Responsive UI', 'Vercel'],
      highlights: [
        'Turned the site into a stronger public-facing brand experience',
        'Used a sharper visual direction instead of a generic template feel',
        'Shipped the production website and live deployment'
      ]
    },
    {
      id: 'delux-grup',
      title: 'Delux Grup',
      eyebrow: 'Multilingual automotive platform',
      summary: 'A Persian, Turkish, and English vehicle platform connecting inventory, car details, financing, sales leads, and location-driven discovery.',
      liveUrl: 'https://deluxgrup.com.tr/',
      image: '/projects/deluxgrup.png',
      role: 'Product structure, frontend, multilingual flows',
      year: '2026',
      tags: ['Multilingual', 'Automotive', 'Admin System', 'Responsive UI'],
      highlights: [
        'Structured inventory, vehicle detail, installment, sell, contact, and local SEO flows',
        'Designed admin workflows for listings, leads, statuses, translations, and analytics',
        'Delivered a production-facing experience in Persian, Turkish, and English'
      ]
    }
  ] as FeaturedSite[],
  drip: {
    name: 'Drip',
    label: 'Own app in progress',
    logo: '/projects/drip-logo.png',
    status: 'Fashion intelligence app',
    summary:
      'Drip is my own product: a fashion intelligence app for outfit memory, wardrobe context, and sharper style decisions. Dress Right in Public is the public-facing world around the idea; Drip is the product brain I am building behind it.',
    stack: ['React', 'TypeScript', 'Product Design', 'AI Direction', 'Style Systems'],
    signals: [
      'Outfit and wardrobe context instead of random fashion advice',
      'A brand/product system with its own visual language',
      'Built as a real app direction, not only a portfolio concept'
    ],
    roadmap: ['Private beta flow', 'Saved looks', 'Closet context', 'Recommendation logic']
  } as DripProduct,
  posters: [
    {
      id: 'concept-greatness-and-honor',
      title: 'Greatness and Honor',
      image: '/posters/concept-greatness-and-honor.webp',
      category: 'concept',
      tags: ['values', 'legacy', 'discipline', 'character', 'mindset'],
      explicit: false,
      description: 'I made this to explore how values shape character over time. The visual focus is discipline and long-term standards.'
    },
    {
      id: 'concept-impermanence',
      title: 'Impermanence',
      image: '/posters/concept-impermanence.webp',
      category: 'concept',
      tags: ['change', 'time', 'reflection', 'philosophy', 'adaptation'],
      explicit: false,
      description: 'I made this around the idea that everything changes. It is about using impermanence as a practical way to think and decide.'
    },
    {
      id: 'concept-many-answers-one-choice',
      title: 'Many Answers One Choice',
      image: '/posters/concept-many-answers-one-choice.webp',
      category: 'concept',
      tags: ['decision making', 'strategy', 'priorities', 'tradeoffs', 'focus'],
      explicit: false,
      description: 'This one is about decision pressure when many answers seem right. The message is choosing one direction and owning it.'
    },
    {
      id: 'concept-perspective',
      title: 'Perspective',
      image: '/posters/concept-perspective.webp',
      category: 'concept',
      tags: ['viewpoint', 'context', 'interpretation', 'critical thinking', 'analysis'],
      explicit: false,
      description: 'I designed this around perspective and context. It shows how the same situation can look different from each angle.'
    },
    {
      id: 'concept-small-steps-big-mountains',
      title: 'Small Steps Big Mountains',
      image: '/posters/concept-small-steps-big-mountains.webp',
      category: 'identity',
      tags: ['growth', 'consistency', 'progress', 'discipline', 'long term'],
      explicit: false,
      description: 'This piece reflects how I think about growth: small steps repeated over time. Big results come from consistency, not shortcuts.'
    },
    {
      id: 'concept-teamwork',
      title: 'Teamwork',
      image: '/posters/concept-teamwork.webp',
      category: 'concept',
      tags: ['collaboration', 'coordination', 'roles', 'trust', 'shared goals'],
      explicit: false,
      description: 'I made this to represent real teamwork: clear roles, trust, and shared goals. It is about execution, not just motivation.'
    },
    {
      id: 'concept-think-think',
      title: 'Think Think',
      image: '/posters/concept-think-think.webp',
      category: 'concept',
      tags: ['reasoning', 'logic', 'reflection', 'problem solving', 'clarity'],
      explicit: false,
      description: 'This is about slowing down and thinking clearly before acting. The structure is meant to reflect organized problem solving.'
    },
    {
      id: 'identity-be-the-man-you-want',
      title: 'Be the Person You Want',
      image: '/posters/identity-be-the-man-you-want.webp',
      category: 'identity',
      tags: ['self development', 'character', 'intentional living', 'discipline', 'identity'],
      explicit: false,
      description: 'I made this around personal standards and self-discipline. It is about becoming the person you say you want to be.'
    },
    {
      id: 'identity-embrace-duality',
      title: 'Embrace Duality',
      image: '/posters/identity-embrace-duality.webp',
      category: 'identity',
      tags: ['balance', 'complexity', 'self awareness', 'contrast', 'identity'],
      explicit: false,
      description: 'This poster explores the different sides of identity. The idea is that duality can be a strength when it is understood.'
    },
    {
      id: 'identity-loyalty',
      title: 'Loyalty',
      image: '/posters/identity-loyalty.webp',
      category: 'identity',
      tags: ['values', 'trust', 'commitment', 'integrity', 'relationships'],
      explicit: false,
      description: 'I designed this as a statement about loyalty and consistency. It focuses on matching actions with words.'
    },
    {
      id: 'identity-persian-thought',
      title: 'Persian Thought',
      image: '/posters/identity-persian-thought.webp',
      category: 'identity',
      tags: ['culture', 'heritage', 'identity', 'history', 'expression'],
      explicit: false,
      description: 'This piece is based on Persian cultural identity. I wanted to present heritage in a modern and clean visual language.'
    },
    {
      id: 'identity-stay-close',
      title: 'Stay Close',
      image: '/posters/identity-stay-close.webp',
      category: 'concept',
      tags: ['connection', 'relationships', 'support', 'proximity', 'empathy'],
      explicit: false,
      description: 'I made this around connection and emotional closeness. The message is to stay present with people who matter.'
    },
    {
      id: 'identity-every-photo-has-a-story',
      title: 'Every Photo Has a Story',
      image: '/posters/identity-every-photo-has-a-story.webp',
      category: 'identity',
      tags: ['identity', 'memory', 'storytelling', 'emotion', 'self expression'],
      explicit: false,
      description: 'I made this around memory and personal perspective. The poster frames identity through the way we remember moments.'
    },
    {
      id: 'identity-life-sometimes-too-late',
      title: 'Sometimes It Is Too Late',
      image: '/posters/identity-life-sometimes-too-late.webp',
      category: 'identity',
      tags: ['identity', 'regret', 'reflection', 'choices', 'personal growth'],
      explicit: false,
      description: 'This piece is about regret and late realization in personal growth. I designed it as a direct reflection on choices and timing.'
    },
    {
      id: 'identity-rooted-in-adventure',
      title: 'Rooted in Adventure',
      image: '/posters/identity-rooted-in-adventure.jpg.png',
      category: 'identity',
      tags: ['identity', 'exploration', 'growth', 'direction', 'self expression'],
      explicit: false,
      description: 'This piece is about staying grounded while exploring new paths. I designed it as a visual balance between roots and movement.'
    },
    {
      id: 'media-reasonable-show-cover-01',
      title: 'Reasonable Show Cover One',
      image: '/posters/media-reasonable-show-cover-01.webp',
      category: 'media',
      tags: ['podcast cover', 'series identity', 'brand consistency', 'cover art', 'platform design'],
      explicit: false,
      description: 'This is one of my cover directions for the Reasonable Show. It establishes the baseline look for the series.'
    },
    {
      id: 'media-reasonable-show-cover-02',
      title: 'Reasonable Show Cover Two',
      image: '/posters/media-reasonable-show-cover-02.webp',
      category: 'media',
      tags: ['podcast cover', 'variant design', 'series identity', 'cover art', 'platform design'],
      explicit: false,
      description: 'This is an alternate cover option for the same show. I kept the brand recognizable while changing the mood.'
    },
    {
      id: 'media-reasonable-show-episode-0-2',
      title: 'Reasonable Show Episode Art',
      image: '/posters/media-reasonable-show-episode-0-2.webp',
      category: 'media',
      tags: ['episode thumbnail', 'podcast artwork', 'distribution asset', 'episode branding', 'media design'],
      explicit: false,
      description: 'I designed this as episode-specific art for the Reasonable Show. It extends the core brand into one focused release.'
    },
    {
      id: 'media-reasonable-show-portrait',
      title: 'Reasonable Show Portrait',
      image: '/posters/media-reasonable-show-portrait.webp',
      category: 'media',
      tags: ['host portrait', 'show branding', 'media profile', 'content identity', 'platform asset'],
      explicit: false,
      description: 'This portrait asset supports the show profile and promotions. It is part of the same visual system as the covers.'
    },
    {
      id: 'satire-handle-with-care',
      title: 'Handle With Care',
      image: '/posters/satire-handle-with-care.webp',
      category: 'satire',
      tags: ['irony', 'social commentary', 'warning metaphor', 'dark humor', 'critical tone'],
      explicit: false,
      description: 'I used irony here to critique fragile social behavior. The warning style is intentional and part of the satire.'
    },
    {
      id: 'satire-maximum-effort',
      title: 'Maximum Effort',
      image: '/posters/satire-maximum-effort.webp',
      category: 'satire',
      tags: ['irony', 'performance culture', 'expectations', 'dark humor', 'commentary'],
      explicit: false,
      description: 'This one critiques performative effort culture. The slogan is used as irony against what happens in reality.'
    },
    {
      id: 'satire-searching-for-an-answer',
      title: 'Searching for an Answer',
      image: '/posters/satire-searching-for-an-answer.webp',
      category: 'satire',
      tags: ['irony', 'uncertainty', 'social critique', 'dark humor', 'questioning'],
      explicit: false,
      description: 'I made this around the idea of endless searching without clarity. It comments on uncertainty as a social pattern.'
    }
  ] as Poster[],
  homePosterIds: [
    'identity-rooted-in-adventure',
    'concept-impermanence',
    'concept-greatness-and-honor',
    'concept-small-steps-big-mountains',
    'identity-stay-close',
    'concept-teamwork'
  ] as string[],
  projects: [
    {
      id: 1,
      title: 'KnightVision',
      description: 'A custom reinforcement-learning chess engine with legal move generation, policy/value heads, self-play, data pipelines, and Stockfish evaluation.',
      desc: 'A custom reinforcement-learning chess engine with legal move generation, policy/value heads, self-play, data pipelines, and Stockfish evaluation.',
      link: 'https://github.com/TheRealShamsaba/KnightVision',
      tags: ['Python', 'Reinforcement Learning', 'Neural Networks', 'Chess Engine']
    },
    {
      id: 2,
      title: 'Spider',
      description: 'A web crawler project that collects and filters useful pages so I can test practical automation and content pipelines.',
      desc: 'A web crawler project that collects and filters useful pages so I can test practical automation and content pipelines.',
      link: 'https://github.com/TheRealShamsaba/Spider',
      tags: ['Python', 'Web Crawler', 'Automation', 'Data Collection']
    },
    {
      id: 3,
      title: 'Movie Recommender System',
      description: 'A MovieLens recommendation system using collaborative filtering, item-based KNN, cross-validation, and RMSE/MAE benchmarking.',
      desc: 'A MovieLens recommendation system using collaborative filtering, item-based KNN, cross-validation, and RMSE/MAE benchmarking.',
      link: 'https://github.com/TheRealShamsaba/Movie-Recommender-system',
      tags: ['Python', 'Machine Learning', 'Recommendation System', 'Jupyter']
    },
    {
      id: 4,
      title: 'ML School',
      description: 'A machine-learning workspace for experimenting with image-processing and core model workflows in a structured repo.',
      desc: 'A machine-learning workspace for experimenting with image-processing and core model workflows in a structured repo.',
      link: 'https://github.com/TheRealShamsaba/ML-school',
      tags: ['Python', 'Machine Learning', 'Image Processing', 'Jupyter']
    },
    {
      id: 5,
      title: 'GitHub Profile',
      description: 'View all projects and experiments on GitHub.',
      desc: 'View all projects and experiments on GitHub.',
      link: 'https://github.com/TheRealShamsaba',
      tags: ['GitHub', 'Projects', 'Experiments']
    }
  ] as Project[],
  caseStudies: [
    {
      id: 1,
      title: 'KnightVision',
      problem: 'I wanted to learn how decision systems improve over time, not just train a one-off model.',
      built: 'BakerDmo and I built a reinforcement-learning chess engine with self-play, training scripts, and repeatable experiments.',
      stack: ['Python', 'Reinforcement Learning', 'Neural Networks', 'Chess Engine'],
      result: 'It gave me hands-on practice with long-loop iteration, tuning, and structured ML project setup.',
      link: 'https://github.com/TheRealShamsaba/KnightVision'
    },
    {
      id: 2,
      title: 'Spider',
      problem: 'I needed a real tool to collect and filter web pages instead of manually searching and saving links.',
      built: 'I built a crawler pipeline that discovers pages, filters useful content, and prepares data for later use.',
      stack: ['Python', 'Web Crawler', 'Automation', 'Data Collection'],
      result: 'Now I have a reusable base for automation tasks and cleaner inputs for future AI and tooling work.',
      link: 'https://github.com/TheRealShamsaba/Spider'
    }
  ] as CaseStudy[],
  podcast: {
    title: 'Featured Episode',
    desc: 'The Reasonable Show is where I test ideas out loud with comedy and sarcasm. I made it to cut through polished noise and say what I actually think.',
    latestEpisodeTitle: 'Latest Episode',
    latestEpisodeUrl: 'https://youtu.be/9iLwSkk9k6U?si=rIaMDLzxdY-eHTSO',
    listenLink: 'https://open.spotify.com/episode/2adhHCDFZ9iIxywqPvW77Q?si=GtB_150BTmCVPC1jGKzGuA',
    platforms: 'You can find it on Spotify, Apple Podcasts, and YouTube.'
  }
}
