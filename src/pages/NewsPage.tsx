import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag, Search } from 'lucide-react';
import { NewsPageSkeleton } from '../components/ui/Skeletons';
import { useDebounce } from '../hooks';

function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

type ArticleCategory = 'news' | 'story' | 'update' | 'guide';

type Article = {
  slug:      string;
  title:     string;
  excerpt:   string;
  category:  ArticleCategory;
  date:      string;
  readTime:  string;
  author:    string;
  image:     string;
  featured:  boolean;
  tags:      string[];
};

const ARTICLES: Article[] = [
  {
    slug:     'pruthwee-summit-2026-announced',
    title:    'Pruthwee Summit 2026 Announced — 500 Volunteers Expected in Gandhinagar',
    excerpt:  'India\'s largest volunteer gathering returns for its fourth edition. Registration opens today for delegates, volunteers, and press.',
    category: 'news',
    date:     'Feb 15, 2026',
    readTime: '4 min',
    author:   'Pruthwee Team',
    image:    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
    featured: true,
    tags:     ['Summit', 'Announcement', 'Gandhinagar'],
  },
  {
    slug:     'v3-platform-launch',
    title:    'Pruthwee v3.0 Platform Launches — MQ Scores, Auto-Certificates, Group Registration',
    excerpt:  'The most comprehensive update in our history brings the Swiss volunteer management model fully to India. Here\'s what\'s new.',
    category: 'update',
    date:     'Jan 20, 2026',
    readTime: '6 min',
    author:   'Tech Team',
    image:    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=700&q=80',
    featured: false,
    tags:     ['Platform', 'Tech', 'New Features'],
  },
  {
    slug:     'sabarmati-cleanup-2025-recap',
    title:    '60 Volunteers Remove 2.4 Tonnes of Waste from Sabarmati River',
    excerpt:  'The annual Sabarmati River Clean-Up exceeded all previous records. Here\'s a full photo story from the day.',
    category: 'story',
    date:     'Dec 10, 2025',
    readTime: '5 min',
    author:   'Arjun Patel',
    image:    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80',
    featured: false,
    tags:     ['Ahmedabad', 'Environment', 'Story'],
  },
  {
    slug:     'how-to-maximise-your-volunteer-profile',
    title:    'How to Build a Volunteer Profile That Gets You Allocated to Your Top Sector',
    excerpt:  'A complete guide to filling your Pruthwee profile so the MQ matching engine scores you highest for the events you care about.',
    category: 'guide',
    date:     'Nov 28, 2025',
    readTime: '8 min',
    author:   'Community Team',
    image:    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80',
    featured: false,
    tags:     ['Guide', 'Tips', 'Profile'],
  },
  {
    slug:     'niti-aayog-partnership-2025',
    title:    'NITI Aayog Renews Strategic Partnership with Pruthwee Volunteers',
    excerpt:  'The partnership renewal ensures Pruthwee\'s volunteer data feeds directly into India\'s national development planning framework.',
    category: 'news',
    date:     'Nov 5, 2025',
    readTime: '3 min',
    author:   'Pruthwee Team',
    image:    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700&q=80',
    featured: false,
    tags:     ['Partnership', 'Government', 'NITI Aayog'],
  },
  {
    slug:     'priya-sharma-gold-volunteer',
    title:    '\'I Never Expected Volunteering to Shape My Career\' — Priya Sharma, Gold Volunteer',
    excerpt:  'Priya from Ahmedabad crossed 200 volunteer hours this year. We sat down with her to hear how Pruthwee changed her life.',
    category: 'story',
    date:     'Oct 22, 2025',
    readTime: '7 min',
    author:   'Editorial Team',
    image:    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=700&q=80',
    featured: false,
    tags:     ['Story', 'Volunteer', 'Gold Tier'],
  },
  {
    slug:     'coastal-cleanup-jamnagar-2025',
    title:    'Jamnagar Coastal Clean-Up: 80 Volunteers, 3km of Coastline, One Day',
    excerpt:  'Sea Care India and Pruthwee teamed up for Gujarat\'s largest single-day coastal clean-up. Full photo report inside.',
    category: 'story',
    date:     'Oct 5, 2025',
    readTime: '5 min',
    author:   'Sea Care India',
    image:    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=700&q=80',
    featured: false,
    tags:     ['Jamnagar', 'Environment', 'Coastal'],
  },
  {
    slug:     'organiser-guide-sector-system',
    title:    'The Complete Organiser Guide to Pruthwee\'s 4-Level Sector System',
    excerpt:  'Step-by-step walkthrough of Sectors → Sub-sectors → Tasks → Assignments. Everything an event admin needs to know.',
    category: 'guide',
    date:     'Sep 18, 2025',
    readTime: '12 min',
    author:   'Platform Team',
    image:    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=80',
    featured: false,
    tags:     ['Guide', 'Organiser', 'Sectors'],
  },
  {
    slug:     '12000-volunteers-milestone',
    title:    'Pruthwee Reaches 12,000 Registered Volunteers Across 48 Cities',
    excerpt:  'A major milestone — and a reflection on what it means for the future of volunteering in India.',
    category: 'news',
    date:     'Sep 1, 2025',
    readTime: '4 min',
    author:   'Pruthwee Team',
    image:    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=80',
    featured: false,
    tags:     ['Milestone', 'Growth', 'Community'],
  },
];

const CATEGORY_META: Record<ArticleCategory, { label: string; color: string }> = {
  news:   { label: 'News',    color: '#A7EBF2' },
  story:  { label: 'Story',   color: '#6EE07A' },
  update: { label: 'Update',  color: '#FCD34D' },
  guide:  { label: 'Guide',   color: '#C4B5FD' },
};

// ═════════════════════════════════════════════
export default function NewsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const featured = ARTICLES.find(a => a.featured)!;
  const rest = useMemo(() =>
    ARTICLES.filter(a => !a.featured &&
      (activeCategory === 'all' || a.category === activeCategory) &&
      (!debouncedSearch || a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || a.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase()))
    ), [activeCategory, debouncedSearch]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <NewsPageSkeleton />;

  return (
    <div className="bg-[#011C40] overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40]" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">Stories & Updates</span>
            <h1 className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(52px, 9vw, 110px)' }}>
              News &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]">Blog</span>
            </h1>
            <p className="font-sans text-[#8BBFCC] text-lg max-w-xl">
              Event recaps, volunteer stories, platform updates, and guides for
              getting the most out of Pruthwee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-0">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SR>
            <Link to={`/news/${featured.slug}`} className="block group">
              <div className="relative rounded-2xl overflow-hidden border border-[rgba(84,172,191,0.15)] hover:border-[rgba(84,172,191,0.4)] transition-all duration-300">
                <div className="relative h-[50vh] md:h-[55vh] overflow-hidden">
                  <img src={featured.image} alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011C40] via-[#011C40]/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge" style={{ color: CATEGORY_META[featured.category].color, background: `${CATEGORY_META[featured.category].color}18`, borderColor: `${CATEGORY_META[featured.category].color}40` }}>
                      Featured · {CATEGORY_META[featured.category].label}
                    </span>
                    <span className="font-mono text-[#54ACBF] text-[10px] tracking-wider">{featured.date}</span>
                  </div>
                  <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-tight group-hover:text-[#A7EBF2] transition-colors"
                    style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>
                    {featured.title}
                  </h2>
                  <p className="font-sans text-[#8BBFCC] text-base mt-3 max-w-2xl leading-relaxed hidden md:block">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-4 font-display font-bold text-[#54ACBF] text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </SR>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-5 md:px-10">

          {/* Filter bar */}
          <SR>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
              {/* Category pills */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-full border font-display font-bold text-xs uppercase tracking-wide transition-all ${
                    activeCategory === 'all'
                      ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]'
                      : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[#54ACBF]'
                  }`}
                >All</button>
                {(Object.keys(CATEGORY_META) as ArticleCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full border font-display font-bold text-xs uppercase tracking-wide transition-all ${
                      activeCategory === cat ? 'border-current' : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[#54ACBF]'
                    }`}
                    style={activeCategory === cat ? { color: CATEGORY_META[cat].color, borderColor: CATEGORY_META[cat].color, background: `${CATEGORY_META[cat].color}15` } : {}}
                  >
                    {CATEGORY_META[cat].label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="input pl-9 h-10 text-sm"
                />
              </div>
            </div>
          </SR>

          {/* Article grid */}
          {rest.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📰</div>
              <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">No articles found</h3>
            </div>
          ) : (
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden" animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {rest.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const catMeta = CATEGORY_META[article.category];
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
    >
      <Link to={`/news/${article.slug}`} className="block group h-full">
        <div className="h-full flex flex-col bg-[#023859] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden hover:border-[rgba(84,172,191,0.4)] hover:-translate-y-1.5 transition-all duration-250 hover:shadow-card">

          {/* Image */}
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            <img src={article.image} alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#023859] via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="badge text-[10px]"
                style={{ color: catMeta.color, background: `${catMeta.color}18`, borderColor: `${catMeta.color}40` }}>
                {catMeta.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 font-sans text-[#8BBFCC] text-xs">
                <Calendar size={11} className="text-[#54ACBF]" /> {article.date}
              </div>
              <div className="flex items-center gap-1.5 font-sans text-[#8BBFCC] text-xs">
                <Clock size={11} className="text-[#54ACBF]" /> {article.readTime} read
              </div>
            </div>

            <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide leading-tight mb-2 flex-1 group-hover:text-[#A7EBF2] transition-colors">
              {article.title}
            </h3>
            <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed mb-4 line-clamp-2">
              {article.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className="font-mono text-[#54ACBF] text-[9px] tracking-[1.5px] uppercase border border-[rgba(84,172,191,0.15)] px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[rgba(84,172,191,0.1)]">
              <span className="font-sans text-[#8BBFCC] text-xs">{article.author}</span>
              <span className="flex items-center gap-1 font-display font-bold text-[#54ACBF] text-xs uppercase tracking-wide group-hover:gap-2 transition-all group-hover:text-[#A7EBF2]">
                Read <ArrowRight size={11} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}