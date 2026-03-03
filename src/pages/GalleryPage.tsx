import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';

// ── SCROLL REVEAL ─────────────────────────────
function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── DATA ──────────────────────────────────────
type GalleryPhoto = {
  id:       string;
  url:      string;
  thumb:    string;
  title:    string;
  event:    string;
  city:     string;
  year:     string;
  category: string;
  span:     'normal' | 'wide' | 'tall';
};

const PHOTOS: GalleryPhoto[] = [
  { id: '1',  url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80', title: 'Sabarmati River Clean-Up',        event: 'Sabarmati Clean-Up 2024',   city: 'Ahmedabad',  year: '2024', category: 'environment', span: 'wide'   },
  { id: '2',  url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80', title: 'Volunteer Team Huddle',           event: 'Tree Plantation Drive 2024', city: 'Gandhinagar', year: '2024', category: 'environment', span: 'normal' },
  { id: '3',  url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', title: 'Community Outreach',              event: 'Health Camp 2024',          city: 'Vadodara',   year: '2024', category: 'health',       span: 'tall'   },
  { id: '4',  url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80', title: 'Distributing Supplies',          event: 'Flood Relief 2023',         city: 'Surat',      year: '2023', category: 'health',       span: 'normal' },
  { id: '5',  url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80', title: 'Donation Collection',            event: 'Relief Drive 2023',         city: 'Ahmedabad',  year: '2023', category: 'health',       span: 'wide'   },
  { id: '6',  url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', title: 'Tree Saplings Ready',            event: 'Tree Plantation 2024',      city: 'Gandhinagar', year: '2024', category: 'environment', span: 'normal' },
  { id: '7',  url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', title: 'Youth Education Workshop',       event: 'Education Camp 2024',       city: 'Surat',      year: '2024', category: 'education',    span: 'tall'   },
  { id: '8',  url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', title: 'Pruthwee Summit Stage',          event: 'Pruthwee Summit 2023',      city: 'Gandhinagar', year: '2023', category: 'summit',       span: 'wide'   },
  { id: '9',  url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', title: 'Heritage Site Restoration',      event: 'Heritage Walk 2024',        city: 'Ahmedabad',  year: '2024', category: 'cultural',     span: 'normal' },
  { id: '10', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', title: 'Marathon Volunteer Crew',        event: 'Mumbai Marathon 2024',      city: 'Mumbai',     year: '2024', category: 'sports',       span: 'normal' },
  { id: '11', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', title: 'Coastal Debris Removal',         event: 'Coastal Clean-Up 2024',     city: 'Jamnagar',   year: '2024', category: 'environment', span: 'wide'   },
  { id: '12', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600&q=80', title: 'Mangrove Nursery Work',          event: 'Mangrove Day 2024',         city: 'Surat',      year: '2024', category: 'environment', span: 'normal' },
  { id: '13', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', title: 'Free Medical Camp',              event: 'Health Awareness 2023',     city: 'Rajkot',     year: '2023', category: 'health',       span: 'tall'   },
  { id: '14', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', title: 'Digital Literacy Class',         event: 'Tech for India 2023',       city: 'Rajkot',     year: '2023', category: 'education',    span: 'normal' },
  { id: '15', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=85',    thumb: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',    title: 'Volunteer Award Ceremony',       event: 'Annual Awards 2023',        city: 'Gandhinagar', year: '2023', category: 'summit',       span: 'wide'   },
  { id: '16', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80', title: 'Folk Festival Volunteers',       event: 'Lok Mela 2023',             city: 'Gandhinagar', year: '2023', category: 'cultural',     span: 'normal' },
];

const CATEGORIES = [
  { id: 'all',         label: 'All Photos',  color: '#A7EBF2' },
  { id: 'environment', label: 'Environment', color: '#6EE07A' },
  { id: 'health',      label: 'Health',      color: '#FCA5A5' },
  { id: 'education',   label: 'Education',   color: '#93C5FD' },
  { id: 'cultural',    label: 'Cultural',    color: '#C4B5FD' },
  { id: 'sports',      label: 'Sports',      color: '#FCD34D' },
  { id: 'summit',      label: 'Summit',      color: '#54ACBF' },
];

const YEARS = ['All Years', '2024', '2023'];

// ═════════════════════════════════════════════
//  GALLERY PAGE
// ═════════════════════════════════════════════
export default function GalleryPage() {
  const [category, setCategory] = useState('all');
  const [year,     setYear]     = useState('All Years');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = PHOTOS.filter(p =>
    (category === 'all' || p.category === category) &&
    (year === 'All Years' || p.year === year)
  );

  const openLightbox = useCallback((id: string) => {
    const idx = filtered.findIndex(p => p.id === id);
    setLightbox(idx);
  }, [filtered]);

  const prevPhoto = () => setLightbox(i => (i !== null ? Math.max(0, i - 1) : null));
  const nextPhoto = () => setLightbox(i => (i !== null ? Math.min(filtered.length - 1, i + 1) : null));

  // Keyboard nav
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'Escape')     setLightbox(null);
  }, []);

  const activeCat = CATEGORIES.find(c => c.id === category)!;

  return (
    <div className="bg-[#011C40] overflow-x-hidden" onKeyDown={handleKey} tabIndex={0}>

      {/* ── HERO ── */}
      <section className="relative pt-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40]" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">From The Field</span>
            <h1
              className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(52px, 9vw, 110px)' }}
            >
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]">
                Gallery
              </span>
            </h1>
            <p className="font-sans text-[#8BBFCC] text-lg max-w-xl">
              {PHOTOS.length} photos from {new Set(PHOTOS.map(p => p.event)).size} events across{' '}
              {new Set(PHOTOS.map(p => p.city)).size} cities. Every moment tells a story.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            {[
              { num: `${PHOTOS.length}`, label: 'Photos' },
              { num: `${new Set(PHOTOS.map(p => p.event)).size}`, label: 'Events' },
              { num: `${new Set(PHOTOS.map(p => p.city)).size}`, label: 'Cities' },
              { num: `${new Set(PHOTOS.map(p => p.year)).size}`, label: 'Years' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.15)] rounded-xl px-4 py-2.5">
                <span className="font-display font-black text-[#A7EBF2] text-xl">{s.num}</span>
                <span className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[2px]">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <div className="sticky top-16 z-30 bg-[rgba(1,28,64,0.9)] backdrop-blur-md border-b border-[rgba(84,172,191,0.1)] py-4">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                    category === cat.id
                      ? 'border-current'
                      : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[#54ACBF] hover:text-[#A7EBF2]'
                  }`}
                  style={category === cat.id ? {
                    color:       cat.color,
                    borderColor: cat.color,
                    background:  `${cat.color}15`,
                  } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Year filter + count */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-mono text-[#54ACBF] text-xs tracking-wider">
                {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                {YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`px-3 py-1.5 rounded-lg border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                      year === y
                        ? 'bg-[rgba(84,172,191,0.12)] border-[#54ACBF] text-[#A7EBF2]'
                        : 'border-[rgba(84,172,191,0.12)] text-[#8BBFCC] hover:border-[#54ACBF]'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MASONRY GRID ── */}
      <section className="py-10 pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-10">

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">
                No Photos Found
              </h3>
            </div>
          ) : (
            <motion.div
              layout
              className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-0"
            >
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="break-inside-avoid mb-4"
                >
                  <div
                    onClick={() => openLightbox(photo.id)}
                    className="relative group cursor-zoom-in rounded-xl overflow-hidden"
                  >
                    <img
                      src={photo.thumb}
                      alt={photo.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ aspectRatio: photo.span === 'tall' ? '3/4' : photo.span === 'wide' ? '4/3' : '1/1' }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011C40]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <div className="w-8 h-8 rounded-full bg-[rgba(1,28,64,0.8)] flex items-center justify-center">
                          <ZoomIn size={14} className="text-[#A7EBF2]" />
                        </div>
                      </div>
                      <div>
                        <div className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide leading-tight">
                          {photo.title}
                        </div>
                        <div className="font-mono text-[#54ACBF] text-[10px] mt-0.5 tracking-wider">
                          {photo.city} · {photo.year}
                        </div>
                      </div>
                    </div>

                    {/* Category dot */}
                    <div
                      className="absolute top-2 left-2 w-2 h-2 rounded-full opacity-80"
                      style={{ background: CATEGORIES.find(c => c.id === photo.category)?.color ?? '#54ACBF' }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-[rgba(1,28,64,0.95)] backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[rgba(2,56,89,0.8)] border border-[rgba(84,172,191,0.2)] flex items-center justify-center text-[#8BBFCC] hover:text-[#F0FAFB] transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Prev */}
            {lightbox > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-[rgba(2,56,89,0.8)] border border-[rgba(84,172,191,0.2)] flex items-center justify-center text-[#8BBFCC] hover:text-[#F0FAFB] transition-colors z-10"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Next */}
            {lightbox < filtered.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-[rgba(2,56,89,0.8)] border border-[rgba(84,172,191,0.2)] flex items-center justify-center text-[#8BBFCC] hover:text-[#F0FAFB] transition-colors z-10"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Image + info */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox].url}
                alt={filtered[lightbox].title}
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />

              {/* Caption */}
              <div className="flex items-start justify-between mt-4 px-2">
                <div>
                  <div className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">
                    {filtered[lightbox].title}
                  </div>
                  <div className="font-sans text-[#8BBFCC] text-sm mt-1">
                    {filtered[lightbox].event} · {filtered[lightbox].city} · {filtered[lightbox].year}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="w-9 h-9 rounded-lg bg-[rgba(2,56,89,0.8)] border border-[rgba(84,172,191,0.2)] flex items-center justify-center text-[#8BBFCC] hover:text-[#A7EBF2] transition-colors">
                    <Share2 size={15} />
                  </button>
                  <a
                    href={filtered[lightbox].url}
                    download
                    className="w-9 h-9 rounded-lg bg-[rgba(2,56,89,0.8)] border border-[rgba(84,172,191,0.2)] flex items-center justify-center text-[#8BBFCC] hover:text-[#A7EBF2] transition-colors"
                  >
                    <Download size={15} />
                  </a>
                </div>
              </div>

              {/* Photo counter */}
              <div className="text-center mt-3">
                <span className="font-mono text-[#54ACBF] text-xs tracking-[2px]">
                  {lightbox + 1} / {filtered.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}