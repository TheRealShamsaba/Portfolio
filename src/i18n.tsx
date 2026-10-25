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
  heroLiveWork: string
  heroGithub: string
  profileNoteLabel: string
  dripConsoleTitle: string
  dripSignals: string
  dripRoadmap: string
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
  projectsLead: string
  liveSite: string
  code: string
  labKicker: string
  labTitle: string
  labDesc: string
  viewProject: string
  podcastKicker: string
  podcastTitle: string
  missingEmbed: string
  listenLatest: string
  contactKicker: string
  contactTitle: string
  contactDesc: string
  sendEmail: string
  contactTelegram: string
  contactWhatsApp: string
  contactDirectMessage: string
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
  heroLiveWork: 'See Live Work',
  heroGithub: 'GitHub',
  profileNoteLabel: 'Available for focused builds',
  dripConsoleTitle: 'product console',
  dripSignals: 'Signals',
  dripRoadmap: 'Roadmap',
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
  projectsLead: 'Live sites first. The programming projects stay in the lab, but the shipped websites get the spotlight.',
  liveSite: 'Live Site',
  code: 'Code',
  labKicker: 'ENGINEERING LAB',
  labTitle: 'Other builds and experiments',
  labDesc: 'Smaller technical projects that show systems thinking, automation, ML practice, and backend logic.',
  viewProject: 'View Project',
  podcastKicker: 'VOICE',
  podcastTitle: 'Podcast',
  missingEmbed: 'Add `latestEpisodeUrl` in `src/content.ts` to show the embedded latest episode player.',
  listenLatest: 'Listen to Latest Episode',
  contactKicker: 'CONTACT',
  contactTitle: 'Let’s Build Something Good',
  contactDesc: 'If you think my style fits your team or project, message me. I’m always open to real work and good collaborations.',
  sendEmail: 'Send Me an Email',
  contactTelegram: 'Telegram',
  contactWhatsApp: 'WhatsApp',
  contactDirectMessage: 'Direct message',
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
  heroLiveWork: 'دیدن کارهای زنده',
  heroGithub: 'گیت‌هاب',
  profileNoteLabel: 'آماده برای پروژه‌های جدی',
  dripConsoleTitle: 'کنسول محصول',
  dripSignals: 'سیگنال‌ها',
  dripRoadmap: 'نقشه راه',
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
  projectsLead: 'اولویت با کارهای زنده است. پروژه‌های برنامه‌نویسی در بخش آزمایشگاه می‌مانند، اما سایت‌های منتشرشده در مرکز توجه هستند.',
  liveSite: 'مشاهده سایت',
  code: 'کد',
  labKicker: 'آزمایشگاه مهندسی',
  labTitle: 'ساخته‌ها و تجربه‌های دیگر',
  labDesc: 'پروژه‌های کوچک‌تر فنی که تفکر سیستمی، اتوماسیون، تمرین ML و منطق بک‌اند را نشان می‌دهند.',
  viewProject: 'دیدن پروژه',
  podcastKicker: 'پادکست',
  podcastTitle: 'The Reasonable Show',
  missingEmbed: 'برای نمایش آخرین قسمت، لینک `latestEpisodeUrl` را در `src/content.ts` اضافه کنید.',
  listenLatest: 'گوش دادن به آخرین قسمت',
  contactKicker: 'تماس',
  contactTitle: 'بیایید همکاری کنیم',
  contactDesc: 'اگر فکر می‌کنید دیدگاه و سبک کاری من به پروژه یا تیم شما می‌خورد، خوشحال می‌شوم صحبت کنیم.',
  sendEmail: 'ارسال ایمیل',
  contactTelegram: 'تلگرام',
  contactWhatsApp: 'واتساپ',
  contactDirectMessage: 'پیام مستقیم',
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
      role: 'بنیان‌گذار و توسعه‌دهنده فول‌استک در استانبول',
      intro: 'استراتژی زمانی ارزش دارد که به محصولی قابل لمس تبدیل شود.',
      about: 'ایده‌های اولیه را به سیستم‌های منسجم و واقعی تبدیل می‌کنم. اکنون Drip را می‌سازم، Real Co. را شکل می‌دهم و با مهندسی، طراحی و رسانه هر ایده را از اصول اولیه تا تجربه‌ای عمومی پیش می‌برم.'
    },
    skills: [
      { title: 'ساخت فرانت‌اند', items: 'React، TypeScript، Vite، رابط واکنش‌گرا' },
      { title: 'سلیقه محصول', items: 'چیدمان، تعامل، متن، سیستم بصری' },
      { title: 'نگاه سیستمی', items: 'اتوماسیون، پروژه‌های ML، معماری کاربردی' }
    ],
    featuredSites: portfolioContent.featuredSites.map((site) => {
      if (site.id === 'dress-right-in-public') {
        return {
          ...site,
          eyebrow: 'کار زنده شاخص',
          summary: 'یک سایت متمرکز بر مد که بیشتر شبیه دنیای برند عمل می‌کند تا یک فروشگاه ساده. جهت بصری آن ادیتوریال، جسور و به‌یادماندنی است.',
          role: 'توسعه فرانت‌اند، جهت‌دهی بصری، انتشار',
          tags: ['سایت زنده', 'تجربه برند', 'رابط واکنش‌گرا', 'Vercel'],
          highlights: [
            'تبدیل سایت به تجربه‌ای قوی‌تر برای حضور عمومی برند',
            'استفاده از جهت بصری تیزتر به جای حس قالب آماده',
            'انتشار سایت واقعی و آماده استفاده'
          ]
        }
      }

      if (site.id === 'delux-grup') {
        return {
          ...site,
          eyebrow: 'کار مشتری',
          summary: 'یک سایت تجاری ساده بر اساس خواسته مشتری: مستقیم، قابل فهم و راحت برای بازدیدکننده.',
          role: 'پیاده‌سازی مشتری، ساختاردهی، پولیش واکنش‌گرا',
          tags: ['کار مشتری', 'سایت تجاری', 'درخواست ساده', 'رابط واکنش‌گرا'],
          highlights: [
            'هماهنگ با درخواست مشتری برای حضور آنلاین ساده و کاربردی',
            'حفظ وضوح به جای اضافه کردن پیچیدگی غیرضروری',
            'تحویل سایت تجاری زنده با پولیش واکنش‌گرا'
          ]
        }
      }

      return site
    }),
    drip: {
      ...portfolioContent.drip,
      label: 'اپلیکیشن شخصی در حال ساخت',
      status: 'اپلیکیشن هوشمند مد و استایل',
      summary:
        'Drip محصول شخصی من است: اپلیکیشنی برای حافظه لباس‌ها، شناخت کمد و تصمیم‌های بهتر در استایل. Dress Right in Public دنیای عمومی این ایده است؛ Drip مغز محصولی است که پشت آن می‌سازم.',
      stack: ['React', 'TypeScript', 'طراحی محصول', 'جهت‌دهی AI', 'سیستم استایل'],
      signals: [
        'تمرکز روی زمینه لباس و کمد به جای توصیه‌های تصادفی مد',
        'سیستم برند و محصول با زبان بصری مستقل',
        'ساخته‌شده به عنوان مسیر واقعی محصول، نه فقط یک کانسپت نمونه‌کار'
      ],
      roadmap: ['جریان بتای خصوصی', 'ظاهرهای ذخیره‌شده', 'زمینه کمد', 'منطق پیشنهاددهی']
    },
    ventures: portfolioContent.ventures.map((venture) => {
      if (venture.id === 'drip') return {
        ...venture,
        label: '۰۱ / هوش مد و استایل',
        status: 'بتای خصوصی در حال توسعه',
        statement: 'کمد شخصی‌ای که به خاطر می‌سپارد.',
        description: 'Drip یک دستیار هوشمند کمد لباس است که بر زمینه واقعی تکیه می‌کند: چه دارید، چه می‌پوشید و هر موقعیت واقعاً چه می‌خواهد.',
        focus: ['کمد دیجیتال', 'بازخورد استایل', 'تصمیم خرید', 'زمینه شخصی'],
        linkLabel: 'دیدن دنیای برند'
      }
      if (venture.id === 'real-co') return {
        ...venture,
        label: '۰۲ / شرکت در حال شکل‌گیری',
        status: 'ساخت در سکوت',
        statement: 'خانه‌ای برای محصولاتی با دیدگاه مشخص.',
        description: 'لایه شرکتی پیرامون کارهایی که می‌سازم: محصولات، آزمایش‌ها و همکاری‌های منتخب با تفکر روشن، هویت قوی و اجرای مستقیم.',
        focus: ['ساخت کسب‌وکار', 'جهت محصول', 'فناوری خلاق', 'همکاری منتخب']
      }
      return {
        ...venture,
        label: '۰۳ / رسانه مستقل',
        status: 'در حال انتشار',
        statement: 'ایده‌هایی که با صدای بلند آزموده می‌شوند.',
        description: 'یک برنامه مستقل برای تبدیل ایده‌های فنی، فرهنگی و دشوار به گفت‌وگویی مستقیم، همراه با طنز و کنایه.',
        focus: ['گفت‌وگو', 'مصاحبه', 'دیدگاه', 'رسانه بصری'],
        linkLabel: 'دیدن آخرین قسمت'
      }
    }),
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
          built: 'من و BakerDmo این موتور شطرنج را با خودبازی، آموزش تکرارشونده و ارزیابی مستمر ساختیم.',
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
    document.documentElement.dir = 'ltr'
    document.documentElement.dataset.locale = locale
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
