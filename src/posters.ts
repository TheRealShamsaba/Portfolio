// My posters: the originals, with what each one is about, in my words.

export interface Poster {
  id: string
  title: string
  image: string
  category: 'concept' | 'identity' | 'media' | 'satire'
  tags: string[]
  explicit: boolean
  description: string
}

export const posters: Poster[] = [
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
    image: '/posters/identity-rooted-in-adventure.webp',
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
]
