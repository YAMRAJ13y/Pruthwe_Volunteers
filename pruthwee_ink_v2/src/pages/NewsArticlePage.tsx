import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Twitter, Linkedin, Link as LinkIcon, CheckCircle, ChevronUp, Tag } from 'lucide-react';

// ── TYPES ─────────────────────────────────────
type ArticleSection = {
  id:    string;
  title: string;
  body:  React.ReactNode;
};

// ── MOCK ARTICLE DATA ─────────────────────────
// In production this comes from Supabase by slug.
// We render the same layout for all slugs; swap content per slug.
const ARTICLE = {
  slug:    'pruthwee-summit-2026-announced',
  title:   'Pruthwee Summit 2026 Announced — 500 Volunteers Expected in Gandhinagar',
  excerpt: 'India\'s largest volunteer gathering returns for its fourth edition. Registration opens today for delegates, volunteers, and press.',
  category:{ label: 'News', color: '#CCFF00' },
  date:    'February 15, 2026',
  readTime:'4 min',
  author:  { name: 'Pruthwee Editorial Team', role: 'Communications' },
  image:   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85',
  tags:    ['Summit', 'Announcement', 'Gandhinagar', '2026'],
  sections: [
    {
      id:    'overview',
      title: 'What is Pruthwee Summit?',
      body: (
        <>
          <p>The Pruthwee Summit is India's largest annual gathering dedicated to volunteerism, environmental action, and community service. Now in its fourth edition, the Summit brings together volunteers, NGO leaders, corporate CSR teams, government officials, and social entrepreneurs for two days of inspiration, learning, and networking.</p>
          <p>Previous editions have drawn attendees from 22+ states and led directly to new NGO partnerships, volunteer recruitment drives, and policy initiatives at the state level. Summit 2026 is expected to be the largest yet — with over 500 expected attendees and 20+ exhibiting organisations.</p>
        </>
      ),
    },
    {
      id:    'dates-venue',
      title: 'Dates, Venue & Format',
      body: (
        <>
          <p><strong className="text-[#CCFF00]">Dates:</strong> 12–13 April 2026 (Saturday and Sunday)</p>
          <p><strong className="text-[#CCFF00]">Venue:</strong> Mahatma Mandir Convention Centre, Sector 13, Gandhinagar — 382016, Gujarat. India's premier convention facility with a capacity of 2,000, located 30 minutes from Ahmedabad International Airport.</p>
          <p>The two-day programme includes keynote addresses, panel discussions, hands-on workshops, the Community Solutions Expo (featuring 20+ NGO exhibitors), and the Pruthwee Volunteer Awards Ceremony — recognising India's top volunteers of 2025.</p>
        </>
      ),
    },
    {
      id:    'programme-highlights',
      title: 'Programme Highlights',
      body: (
        <>
          <ul>
            <li><strong className="text-[#CCFF00]">Opening Ceremony:</strong> Chief guest address from Ministry of Environment representative.</li>
            <li><strong className="text-[#CCFF00]">Keynote: The Future of Volunteering in India</strong> — national data, trends, and the road to 2030.</li>
            <li><strong className="text-[#CCFF00]">Panel: NGO + Corporate + Government Partnerships</strong> — how structured volunteering bridges the three sectors.</li>
            <li><strong className="text-[#CCFF00]">Pruthwee v3.0 Platform Launch</strong> — live demonstration of all new features including MQ scores and auto-certificates.</li>
            <li><strong className="text-[#CCFF00]">Volunteer Awards Ceremony</strong> — honouring the top volunteers across all seven status tiers.</li>
            <li><strong className="text-[#CCFF00]">Volunteer Oath Ceremony</strong> — collective reaffirmation of the Pruthwee volunteer pledge.</li>
          </ul>
          <p>Full programme details are available on the Summit 2026 page. Workshop schedule will be released in March 2026.</p>
        </>
      ),
    },
    {
      id:    'registration',
      title: 'Registration Categories',
      body: (
        <>
          <p>Four registration categories are available:</p>
          <ul>
            <li><strong className="text-[#CCFF00]">Delegate (₹1,500):</strong> NGO leaders, corporate CSR managers, government officials. Full access to all sessions, expo, and meals.</li>
            <li><strong className="text-[#CCFF00]">Volunteer (Free):</strong> Registered Pruthwe volunteers who wish to serve at the summit itself. Apply via your dashboard.</li>
            <li><strong className="text-[#CCFF00]">Press (Free):</strong> Journalists and media professionals. Press pass with media room access and speaker interview slots.</li>
            <li><strong className="text-[#CCFF00]">Student (₹500):</strong> Full-time students with valid college ID. Subsidised entry to all sessions.</li>
          </ul>
          <p>Payment details for paid categories will be shared in the registration confirmation email. All registrations must be completed by 5 April 2026.</p>
        </>
      ),
    },
    {
      id:    'how-to-register',
      title: 'How to Register',
      body: (
        <>
          <p>Registration is open now at the Pruthwee Summit 2026 page. The process takes under 3 minutes:</p>
          <ol>
            <li>Choose your registration category.</li>
            <li>Fill in your name, email, phone, and organisation.</li>
            <li>Add dietary requirements and submit.</li>
            <li>Receive confirmation within 48 hours.</li>
          </ol>
          <p>Volunteers wishing to work at the summit (not just attend) should select the Volunteer category. Assignments will be allocated via the standard Pruthwee platform flow in March 2026.</p>
        </>
      ),
    },
    {
      id:    'quote',
      title: 'A Note from the Team',
      body: (
        <>
          <blockquote>
            "The Pruthwee Summit is where the community comes alive. After three years of watching volunteers, organisers, government officials, and NGO leaders connect and inspire each other — we are more certain than ever that this gathering creates ripples that last the entire year. Summit 2026 will be our biggest, most impactful edition yet. We can't wait to see you in Gandhinagar."
          </blockquote>
          <p className="!mt-2 !mb-0 font-sans text-[#CCFF00] text-sm">— Pruthwe volunteers team</p>
        </>
      ),
    },
  ] as ArticleSection[],
};

const RELATED = [
  {
    slug:    'v3-platform-launch',
    title:   'Pruthwee v3.0 Platform Launches — MQ Scores, Auto-Certificates, Group Registration',
    date:    'Jan 20, 2026',
    image:   'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
    readTime:'6 min',
    category:{ label: 'Update', color: '#FCD34D' },
  },
  {
    slug:    '12000-volunteers-milestone',
    title:   'Pruthwee Reaches 12,000 Registered Volunteers Across 48 Cities',
    date:    'Sep 1, 2025',
    image:   'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80',
    readTime:'4 min',
    category:{ label: 'News', color: '#CCFF00' },
  },
  {
    slug:    'niti-aayog-partnership-2025',
    title:   'NITI Aayog Renews Strategic Partnership with Pruthwe volunteers',
    date:    'Nov 5, 2025',
    image:   'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80',
    readTime:'3 min',
    category:{ label: 'News', color: '#CCFF00' },
  },
];

// ─────────────────────────────────────────────
//  SCROLL PROGRESS
// ─────────────────────────────────────────────
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-[#CCFF00] z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// ─────────────────────────────────────────────
//  SHARE MENU
// ─────────────────────────────────────────────
function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#CCFF00] hover:border-[rgba(255,255,255,0.18)] font-display font-bold text-xs uppercase tracking-wide transition-all"
      >
        <Share2 size={14} /> Share
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute right-0 top-10 bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-card p-2 min-w-[160px] z-20"
        >
          {[
            {
              icon: <Twitter size={14} />,
              label: 'Twitter / X',
              href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
            },
            {
              icon: <Linkedin size={14} />,
              label: 'LinkedIn',
              href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
            },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#888888] hover:text-[#F2F2F2] hover:bg-[rgba(255,255,255,0.05)] font-display font-bold text-xs uppercase tracking-wide transition-all"
            >
              {item.icon} {item.label}
            </a>
          ))}
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#888888] hover:text-[#F2F2F2] hover:bg-[rgba(255,255,255,0.05)] font-display font-bold text-xs uppercase tracking-wide transition-all"
          >
            {copied ? <CheckCircle size={14} className="text-[#6EE07A]" /> : <LinkIcon size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  TABLE OF CONTENTS
// ─────────────────────────────────────────────
function TableOfContents({ sections, activeSection }: { sections: ArticleSection[]; activeSection: string }) {
  return (
    <nav className="bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
      <p className="font-display font-black text-[#CCFF00] text-xs uppercase tracking-[3px] mb-4">
        In This Article
      </p>
      <ul className="space-y-2">
        {sections.map(s => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wide transition-colors py-1 ${
                activeSection === s.id ? 'text-[#CCFF00]' : 'text-[#888888] hover:text-[#CCFF00]'
              }`}
            >
              <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${activeSection === s.id ? 'bg-[#CCFF00]' : 'bg-[rgba(204,255,0,0.3)]'}`} />
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ═════════════════════════════════════════════
//  NEWS ARTICLE PAGE
// ═════════════════════════════════════════════
export default function NewsArticlePage() {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState(ARTICLE.sections[0].id);
  const [showScrollTop, setShowScrollTop]  = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShowScrollTop(y > 600);
  });

  // Intersection observer for TOC highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ARTICLE.sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#0C0C0C] min-h-screen">
      <ReadingProgress />

      {/* Hero image */}
      <div className="relative h-[55vh] overflow-hidden">
        <img src={ARTICLE.image} alt={ARTICLE.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link to="/news"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(12,12,12,0.7)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#F2F2F2] font-display font-bold text-sm uppercase tracking-wide transition-all">
            <ArrowLeft size={15} /> All Articles
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-10 pb-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge" style={{ color: ARTICLE.category.color, background: `${ARTICLE.category.color}18`, borderColor: `${ARTICLE.category.color}40` }}>
                {ARTICLE.category.label}
              </span>
            </div>
            <h1 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-tight"
              style={{ fontSize: 'clamp(24px, 4vw, 52px)' }}>
              {ARTICLE.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article meta bar */}
      <div className="bg-[#141414] border-b border-[rgba(255,255,255,0.07)]">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2 text-[#888888] text-sm font-sans">
                <Calendar size={14} className="text-[#CCFF00]" /> {ARTICLE.date}
              </div>
              <div className="flex items-center gap-2 text-[#888888] text-sm font-sans">
                <Clock size={14} className="text-[#CCFF00]" /> {ARTICLE.readTime} read
              </div>
              <div className="font-sans text-[#888888] text-sm">
                By <span className="text-[#CCFF00]">{ARTICLE.author.name}</span>
              </div>
            </div>
            <ShareMenu title={ARTICLE.title} />
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
        <div className="grid lg:grid-cols-[1fr_240px] gap-12">

          {/* Main content */}
          <article>
            {/* Excerpt */}
            <p className="font-sans text-[#CCFF00] text-xl leading-relaxed mb-10 border-l-2 border-[#CCFF00] pl-5">
              {ARTICLE.excerpt}
            </p>

            {/* Sections */}
            {ARTICLE.sections.map(section => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
                <h2 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase tracking-wide mb-5"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 30px)' }}>
                  {section.title}
                </h2>
                <div className="prose-pruthwee">
                  {section.body}
                </div>
              </section>
            ))}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-[rgba(255,255,255,0.07)] mt-10">
              {ARTICLE.tags.map(tag => (
                <span key={tag}
                  className="flex items-center gap-1 font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-full hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors cursor-default">
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </div>

            {/* Author card */}
            <div className="mt-10 bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#888800] flex items-center justify-center flex-shrink-0">
                <span className="font-display font-black text-[#0C0C0C] text-xl">P</span>
              </div>
              <div>
                <div className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide">{ARTICLE.author.name}</div>
                <div className="font-sans text-[#CCFF00] text-sm">{ARTICLE.author.role} · Pruthwe volunteers</div>
              </div>
            </div>

            {/* CTA banner */}
            <div className="mt-10 bg-gradient-to-r from-[#141414] to-[#0C0C0C] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 text-center">
              <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-xl uppercase tracking-wide mb-2">
                Ready to Join Summit 2026?
              </h3>
              <p className="font-sans text-[#888888] text-sm mb-5">
                Register now — free for volunteers, ₹500 for students, ₹1,500 for delegates.
              </p>
              {/* Summit CTA kept for future release */}
              {/* <Link to="/summit-2026#register" className="btn-primary inline-flex">
                Register for Summit <ArrowRight size={15} />
              </Link> */}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-24 space-y-5">
              <TableOfContents sections={ARTICLE.sections} activeSection={activeSection} />

              {/* Share */}
              <div className="bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
                <p className="font-display font-black text-[#CCFF00] text-xs uppercase tracking-[3px] mb-3">Share</p>
                <div className="space-y-2">
                  {[
                    { icon: <Twitter size={13} />, label: 'Twitter / X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(ARTICLE.title)}` },
                    { icon: <Linkedin size={13} />, label: 'LinkedIn',   href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
                  ].map(item => (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.07)] text-[#888888] hover:text-[#CCFF00] hover:border-[rgba(255,255,255,0.15)] font-display font-bold text-xs uppercase tracking-wide transition-all">
                      {item.icon} {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter mini */}
              <NewsletterMini />
            </div>
          </aside>
        </div>

        {/* Related articles */}
        <div className="mt-16 pt-10 border-t border-[rgba(255,255,255,0.07)]">
          <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-xl uppercase tracking-wide mb-7">
            Related Articles
          </h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {RELATED.map((r, i) => (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/news/${r.slug}`} className="block group">
                  <div className="bg-[#141414] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden hover:border-[rgba(204,255,0,0.35)] hover:-translate-y-1 transition-all">
                    <div className="relative h-32 overflow-hidden">
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 left-2">
                        <span className="badge text-[10px]" style={{ color: r.category.color, background: `${r.category.color}18`, borderColor: `${r.category.color}40` }}>
                          {r.category.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide leading-tight mb-2 group-hover:text-[#CCFF00] transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[#888888] text-xs font-sans">
                        <span className="flex items-center gap-1"><Calendar size={10} className="text-[#CCFF00]" />{r.date}</span>
                        <span className="flex items-center gap-1"><Clock size={10} className="text-[#CCFF00]" />{r.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          <div />
          <Link to="/news/v3-platform-launch"
            className="flex items-center justify-end gap-3 bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.15)] transition-all group text-right">
            <div>
              <div className="font-mono text-[#CCFF00] text-[10px] tracking-[2px] uppercase mb-1">Next Article</div>
              <div className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide group-hover:text-[#CCFF00] transition-colors">
                Pruthwee v3.0 Platform Launches
              </div>
            </div>
            <ArrowRight size={18} className="text-[#CCFF00] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-[#141414] border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-[#CCFF00] hover:text-[#CCFF00] hover:border-[#CCFF00] transition-all shadow-card"
        >
          <ChevronUp size={18} />
        </motion.button>
      )}

      {/* Prose styles */}
      <style>{`
        .prose-pruthwee p {
          font-family: var(--font-body);
          color: #888888;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .prose-pruthwee ul,
        .prose-pruthwee ol {
          margin-bottom: 1rem;
          padding-left: 1.25rem;
        }
        .prose-pruthwee li {
          font-family: var(--font-body);
          color: #888888;
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }
        .prose-pruthwee ul li { list-style-type: disc; }
        .prose-pruthwee ol li { list-style-type: decimal; }
        .prose-pruthwee blockquote {
          border-left: 3px solid #CCFF00;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-family: var(--font-display);
          font-weight: 700;
          color: #CCFF00;
          font-size: 18px;
          line-height: 1.5;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
//  NEWSLETTER MINI (sidebar)
// ─────────────────────────────────────────────
function NewsletterMini() {
  const [email, setEmail] = useState('');
  const [done,  setDone]  = useState(false);

  return (
    <div className="bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
      <p className="font-display font-black text-[#CCFF00] text-xs uppercase tracking-[3px] mb-1">Newsletter</p>
      <p className="font-sans text-[#888888] text-xs mb-4 leading-snug">New events & articles in your inbox.</p>
      {done ? (
        <div className="flex items-center gap-2 text-[#6EE07A] font-display font-bold text-xs uppercase tracking-wide">
          <CheckCircle size={13} /> Subscribed!
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="input text-sm h-9"
          />
          <button type="submit" className="btn-primary w-full justify-center py-2 text-xs">
            Subscribe <ArrowRight size={12} />
          </button>
        </form>
      )}
    </div>
  );
}