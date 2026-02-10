import React from 'react'
import { categoryMeta, portfolioContent } from './content'

export type Locale = 'en' | 'fa'

type UIStrings = {
  brand: string
  navAbout: string
  navPosters: string
  navWork: string
  navPodcast: string
  navContact: string
  langToggle: string
  introKicker: string
  posterPreviewKicker: string
  posterPreviewTitle: string
  posterPreviewDesc: string
  seeAllPosters: string
  caseStudiesKicker: string
  caseStudiesTitle: string
  caseStudiesDesc: string
  caseProblem: string
  caseBuilt: string
  caseStack: string
  caseResult: string
  openRepo: string
  projectsKicker: string
  projectsTitle: string
  viewProject: string
  podcastKicker: string
  podcastTitle: string
  missingEmbed: string
  listenLatest: string
  contactKicker: string
  contactTitle: string
  contactDesc: string
  sendEmail: string
  postersKicker: string
  postersTitle: string
  postersDesc: string
  postersAll: string
  postersScrollHint: string
  closeViewer: string
  previousPoster: string
  nextPoster: string
  closeBackdrop: string
  designWork: string
  loading: string
  loadingPosters: string
  footerBuiltWith: string
  categoryLabel: Record<'concept' | 'identity' | 'media' | 'satire', string>
}

type I18nValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: UIStrings
  content: typeof portfolioContent
  localizedCategoryMeta: Record<keyof typeof categoryMeta, { desc: string }>
}

const EN: UIStrings = {
  brand: 'Portfolio',
  navAbout: 'About',
  navPosters: 'Posters',
  navWork: 'Work',
  navPodcast: 'Podcast',
  navContact: 'Contact',
  langToggle: 'فارسی',
  introKicker: 'INTRODUCTION',
  posterPreviewKicker: 'POSTER PREVIEW',
  posterPreviewTitle: 'A few selected pieces',
  posterPreviewDesc: 'A quick sample from my full poster archive. For the full categorized showcase, open the posters page.',
  seeAllPosters: 'See All Posters',
  caseStudiesKicker: 'CASE STUDIES',
  caseStudiesTitle: 'How I Build',
  caseStudiesDesc: 'Two focused examples that show my process from problem to shipped implementation.',
  caseProblem: 'Problem',
  caseBuilt: 'Built',
  caseStack: 'Stack',
  caseResult: 'Result',
  openRepo: 'Open Repository',
  projectsKicker: 'PROGRAMMING WORK',
  projectsTitle: 'Projects',
  viewProject: 'View Project',
  podcastKicker: 'VOICE',
  podcastTitle: 'Podcast',
  missingEmbed: 'Add `latestEpisodeUrl` in `src/content.ts` to show the embedded latest episode player.',
  listenLatest: 'Listen to Latest Episode',
  contactKicker: 'CONTACT',
  contactTitle: 'Let’s Build Something Good',
  contactDesc: 'If you think my style fits your team or project, message me. I’m always open to real work and good collaborations.',
  sendEmail: 'Send Me an Email',
  postersKicker: 'DESIGN WORK',
  postersTitle: 'Posters',
  postersDesc: 'This is my poster archive. Click any piece to open it in gallery mode.',
  postersAll: 'All',
  postersScrollHint: 'Scroll sideways',
  closeViewer: 'Close viewer',
  previousPoster: 'Previous poster',
  nextPoster: 'Next poster',
  closeBackdrop: 'Close backdrop',
  designWork: 'DESIGN WORK',
  loading: 'LOADING',
  loadingPosters: 'Preparing Posters',
  footerBuiltWith: 'Built with React + Vite + Tailwind',
  categoryLabel: {
    concept: 'Concept',
    identity: 'Identity',
    media: 'Media',
    satire: 'Satire'
  }
}

const FA: UIStrings = {
  brand: 'نمونه‌کار',
  navAbout: 'درباره',
  navPosters: 'پوسترها',
  navWork: 'کارها',
  navPodcast: 'پادکست',
  navContact: 'تماس',
  langToggle: 'EN',
  introKicker: 'معرفی',
  posterPreviewKicker: 'منتخب پوسترها',
  posterPreviewTitle: 'چند کار انتخابی',
  posterPreviewDesc: 'نمونه‌ای کوتاه از آرشیو پوسترها. برای دیدن مجموعه کامل و دسته‌بندی‌شده، وارد صفحه پوسترها شوید.',
  seeAllPosters: 'مشاهده همه',
  caseStudiesKicker: 'مطالعات موردی',
  caseStudiesTitle: 'فرآیند کار من',
  caseStudiesDesc: 'دو نمونه واقعی که نشان می‌دهد از مسئله چگونه به راه‌حل می‌رسم.',
  caseProblem: 'مسئله',
  caseBuilt: 'راه‌حل',
  caseStack: 'تکنولوژی',
  caseResult: 'خروجی',
  openRepo: 'مشاهده کد',
  projectsKicker: 'برنامه‌نویسی',
  projectsTitle: 'پروژه‌ها',
  viewProject: 'دیدن پروژه',
  podcastKicker: 'پادکست',
  podcastTitle: 'The Reasonable Show',
  missingEmbed: 'برای نمایش آخرین قسمت، لینک `latestEpisodeUrl` را در `src/content.ts` اضافه کنید.',
  listenLatest: 'گوش دادن به آخرین قسمت',
  contactKicker: 'تماس',
  contactTitle: 'بیایید همکاری کنیم',
  contactDesc: 'اگر فکر می‌کنید دیدگاه و سبک کاری من به پروژه یا تیم شما می‌خورد، خوشحال می‌شوم صحبت کنیم.',
  sendEmail: 'ارسال ایمیل',
  postersKicker: 'طراحی',
  postersTitle: 'پوسترها',
  postersDesc: 'آرشیو پوسترهای طراحی‌شده توسط من. برای مشاهده هر اثر در حالت گالری، روی آن کلیک کنید.',
  postersAll: 'همه',
  postersScrollHint: 'اسکرول کنید',
  closeViewer: 'بستن',
  previousPoster: 'قبلی',
  nextPoster: 'بعدی',
  closeBackdrop: 'بستن',
  designWork: 'کارهای طراحی',
  loading: 'در حال بارگذاری',
  loadingPosters: 'در حال آماده‌سازی پوسترها',
  footerBuiltWith: 'ساخته‌شده با React، Vite و Tailwind',
  categoryLabel: {
    concept: 'مفهومی',
    identity: 'هویت',
    media: 'رسانه',
    satire: 'انتقادی'
  }
}

const I18nContext = React.createContext<I18nValue | null>(null)

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const q = new URLSearchParams(window.location.search).get('lang')
  if (q === 'fa' || q === 'en') return q

  const saved = window.localStorage.getItem('portfolio_lang')
  if (saved === 'fa' || saved === 'en') return saved

  return 'en'
}

function localizeContent(locale: Locale): typeof portfolioContent {
  if (locale === 'en') return portfolioContent

  return {
    ...portfolioContent,
    profile: {
      ...portfolioContent.profile,
      role: 'دانشجوی مهندسی کامپیوتر در استانبول',
      intro: 'روی ساخت محصولات وب، طراحی بصری و پروژه‌های مهندسی تمرکز دارم.',
      about: 'من دانشجوی مهندسی کامپیوتر در استانبول هستم. وب‌اپلیکیشن می‌سازم، پوستر طراحی می‌کنم و به پروژه‌ها با نگاه مهندسی و سیستم‌محور نزدیک می‌شوم. میزبان پادکست The Reasonable Show هستم؛ جایی برای بررسی ایده‌ها، تجربه‌ها و فکرهای واقعی بدون اغراق. به هوش مصنوعی، تفکر سیستمی و ساختن چیزهای کاربردی علاقه دارم.'
    },
    skills: [
      { title: 'توسعه وب', items: 'React، TypeScript، Vite، ساختاردهی رابط کاربری' },
      { title: 'مهندسی و سیستم', items: 'تفکر سیستمی، مبانی نرم‌افزار، علاقه‌مند به AI' },
      { title: 'طراحی بصری', items: 'پوستر، هویت بصری، محتوای رسانه‌ای' }
    ],
    projects: portfolioContent.projects.map((project) => {
      const map: Record<number, string> = {
        1: 'موتور شطرنج مبتنی بر یادگیری تقویتی برای بررسی تصمیم‌گیری و بهبود تدریجی مدل.',
        2: 'خزنده وب برای جمع‌آوری و فیلتر داده‌های مفید با خروجی ساخت‌یافته.',
        3: 'سیستم پیشنهاددهنده فیلم بر اساس ورودی کاربر و شباهت محتوا.',
        4: 'محیط آزمایشی یادگیری ماشین برای پردازش تصویر و تست مدل‌ها.',
        5: 'مجموعه کامل پروژه‌ها و آزمایش‌ها در گیت‌هاب.'
      }

      const desc = map[project.id] ?? project.desc
      return { ...project, desc, description: desc }
    }),
    caseStudies: portfolioContent.caseStudies.map((study) => {
      if (study.id === 1) {
        return {
          ...study,
          problem: 'بررسی این‌که یک سیستم تصمیم‌گیری چگونه می‌تواند با داده و بازخورد به‌مرور بهتر شود.',
          built: 'پیاده‌سازی موتور شطرنج با خودبازی، آموزش تکرارشونده و ارزیابی مستمر.',
          result: 'درک عملی از چرخه آموزش، تنظیم مدل و ساخت پروژه‌های یادگیری ماشین.'
        }
      }

      if (study.id === 2) {
        return {
          ...study,
          problem: 'نیاز به ابزاری که محتوای مفید وب را به‌صورت خودکار جمع‌آوری و تفکیک کند.',
          built: 'طراحی یک خط پردازش برای خزیدن، فیلتر و آماده‌سازی داده‌ها.',
          result: 'ایجاد پایه‌ای قابل استفاده مجدد برای پروژه‌های داده‌محور و AI.'
        }
      }

      return study
    }),
    podcast: {
      ...portfolioContent.podcast,
      title: 'پادکست',
      desc: 'The Reasonable Show فضایی برای گفت‌وگو درباره ایده‌ها، تجربه‌ها و واقعیت‌هاست؛ ساده، مستقیم و بدون نمایش.',
      latestEpisodeTitle: 'آخرین قسمت',
      platforms: 'در Spotify، Apple Podcasts و YouTube در دسترس است.'
    }
  }
}

function localizeCategoryMeta(locale: Locale): Record<keyof typeof categoryMeta, { desc: string }> {
  if (locale === 'en') return categoryMeta

  return {
    concept: { desc: 'پوسترهایی با تمرکز بر ایده‌ها و مفاهیم.' },
    identity: { desc: 'آثاری درباره هویت، نگاه شخصی و رشد.' },
    media: { desc: 'طراحی‌های رسانه‌ای برای پلتفرم‌ها و محتوا.' },
    satire: { desc: 'پوسترهای انتقادی با لحن مینیمال.' }
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [locale, setLocale] = React.useState<Locale>(() => getInitialLocale())

  React.useEffect(() => {
    window.localStorage.setItem('portfolio_lang', locale)

    const params = new URLSearchParams(window.location.search)
    if (locale === 'en') {
      params.delete('lang')
    } else {
      params.set('lang', 'fa')
    }

    const nextSearch = params.toString()
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`
    window.history.replaceState({}, '', nextUrl)

    document.documentElement.lang = locale === 'fa' ? 'fa' : 'en'
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
  }, [locale])

  const value = React.useMemo<I18nValue>(() => ({
    locale,
    setLocale,
    t: locale === 'fa' ? FA : EN,
    content: localizeContent(locale),
    localizedCategoryMeta: localizeCategoryMeta(locale)
  }), [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return ctx
}
