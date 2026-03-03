import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Download, Share2, X, Eye, Award, Calendar, Clock, CheckCircle, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
  );
}

type Certificate = {
  id:      string;
  event:   string;
  org:     string;
  date:    string;
  hours:   number;
  certNo:  string;
  type:    'participation' | 'completion' | 'excellence';
  year:    string;
  color:   string;
};

const CERTIFICATES: Certificate[] = [
  { id: 'c1', event: 'Health Camp – Rajkot 2026',            org: 'Arogya Sewa Trust',    date: 'Jan 5, 2026',   hours: 6.5, certNo: 'PRU-2026-001847', type: 'completion',    year: '2026', color: '#54ACBF' },
  { id: 'c2', event: 'Coastal Clean-Up – Jamnagar 2025',    org: 'Sea Care India',        date: 'Dec 14, 2025',  hours: 5,   certNo: 'PRU-2025-008213', type: 'participation', year: '2025', color: '#A7EBF2' },
  { id: 'c3', event: 'Education Drive – Surat 2025',         org: 'Shiksha Foundation',   date: 'Nov 20, 2025',  hours: 4,   certNo: 'PRU-2025-007341', type: 'participation', year: '2025', color: '#93C5FD' },
  { id: 'c4', event: 'Mangrove Planting – Surat 2025',      org: 'Sea Care India',        date: 'Oct 12, 2025',  hours: 4,   certNo: 'PRU-2025-006022', type: 'participation', year: '2025', color: '#6EE07A' },
  { id: 'c5', event: 'Heritage Walk – Ahmedabad 2025',       org: 'Heritage Foundation',  date: 'Sep 7, 2025',   hours: 4,   certNo: 'PRU-2025-004911', type: 'participation', year: '2025', color: '#C4B5FD' },
  { id: 'c6', event: 'Pruthwee Summit 2025 – Crew',          org: 'Pruthwe volunteers',  date: 'Apr 13, 2025',  hours: 14,  certNo: 'PRU-2025-002001', type: 'excellence',    year: '2025', color: '#FCD34D' },
];

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  participation: { label: 'Participation', color: '#A7EBF2', bg: 'rgba(167,235,242,0.1)' },
  completion:    { label: 'Completion',    color: '#6EE07A', bg: 'rgba(110,224,122,0.1)'  },
  excellence:    { label: 'Excellence',    color: '#FCD34D', bg: 'rgba(252,211,77,0.1)'   },
};

// ── CERTIFICATE PREVIEW ───────────────────────
function CertPreview({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard?.writeText(`https://pruthwee.org/verify/${cert.certNo}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tm = TYPE_META[cert.type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[rgba(1,28,64,0.92)] backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="max-w-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Certificate design */}
        <div className="relative rounded-2xl overflow-hidden border-2 p-1"
          style={{ borderColor: cert.color }}>
          {/* Certificate body */}
          <div className="bg-[#011C40] rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 grid-overlay opacity-20" />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl opacity-40" style={{ borderColor: cert.color }} />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr opacity-40" style={{ borderColor: cert.color }} />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl opacity-40" style={{ borderColor: cert.color }} />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br opacity-40" style={{ borderColor: cert.color }} />

            <div className="relative z-10">
              {/* Logo / header */}
              <p className="font-mono text-[10px] uppercase tracking-[4px] mb-1"
                style={{ color: cert.color }}>Pruthwe volunteers trust</p>
              <p className="font-display font-black text-[#8BBFCC] text-xs uppercase tracking-[3px] mb-6">
                Certificate of {TYPE_META[cert.type].label}
              </p>

              {/* Main text */}
              <p className="font-sans text-[#8BBFCC] text-sm mb-2">This certifies that</p>
              <h2 className="font-display font-black text-[#F0FAFB] uppercase mb-2"
                style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}>
                Arjun Patel
              </h2>
              <p className="font-sans text-[#8BBFCC] text-sm mb-1">has successfully volunteered at</p>
              <h3 className="font-display font-black uppercase mb-1"
                style={{ color: cert.color, fontSize: 'clamp(16px, 2.5vw, 24px)' }}>
                {cert.event}
              </h3>
              <p className="font-sans text-[#8BBFCC] text-xs mb-6">Organised by {cert.org}</p>

              {/* Details row */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[2px] mb-0.5" style={{ color: cert.color }}>Date</div>
                  <div className="font-display font-bold text-[#F0FAFB] text-sm uppercase">{cert.date}</div>
                </div>
                <div className="w-px h-8 bg-[rgba(84,172,191,0.2)]" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[2px] mb-0.5" style={{ color: cert.color }}>Hours</div>
                  <div className="font-display font-bold text-[#F0FAFB] text-sm uppercase">{cert.hours}h</div>
                </div>
                <div className="w-px h-8 bg-[rgba(84,172,191,0.2)]" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[2px] mb-0.5" style={{ color: cert.color }}>Cert No.</div>
                  <div className="font-display font-bold text-[#F0FAFB] text-xs">{cert.certNo}</div>
                </div>
              </div>

              {/* Verify URL */}
              <p className="font-mono text-[#54ACBF] text-[10px] tracking-wider">
                Verify at pruthwee.org/verify/{cert.certNo}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons below preview */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(84,172,191,0.12)] border border-[rgba(84,172,191,0.3)] text-[#A7EBF2] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(84,172,191,0.2)] transition-all">
            <Download size={14} /> Download PDF
          </button>
          <a href={`https://twitter.com/intent/tweet?text=I+volunteered+at+${encodeURIComponent(cert.event)}+with+%40pruthwee`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(84,172,191,0.15)] text-[#8BBFCC] font-display font-bold text-xs uppercase tracking-wide hover:border-[rgba(84,172,191,0.35)] hover:text-[#A7EBF2] transition-all">
            <Twitter size={14} /> Share
          </a>
          <button onClick={copyLink}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(84,172,191,0.15)] text-[#8BBFCC] font-display font-bold text-xs uppercase tracking-wide hover:border-[rgba(84,172,191,0.35)] hover:text-[#A7EBF2] transition-all">
            {copied ? <CheckCircle size={14} className="text-[#6EE07A]" /> : <LinkIcon size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(84,172,191,0.15)] text-[#8BBFCC] font-display font-bold text-xs uppercase tracking-wide hover:text-[#FCA5A5] hover:border-[rgba(252,165,165,0.3)] transition-all">
            <X size={14} /> Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════
export default function CertificatesPage() {
  const [preview, setPreview] = useState<Certificate | null>(null);
  const [filter,  setFilter]  = useState<'all' | 'participation' | 'completion' | 'excellence'>('all');

  const filtered = filter === 'all' ? CERTIFICATES : CERTIFICATES.filter(c => c.type === filter);
  const totalHours = CERTIFICATES.reduce((s, c) => s + c.hours, 0);

  return (
    <div className="bg-[#011C40] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* Header */}
        <SR>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Link to="/dashboard" className="flex items-center gap-1 font-mono text-[#54ACBF] text-xs tracking-[2px] uppercase mb-2 hover:text-[#A7EBF2] transition-colors">
                ← Dashboard
              </Link>
              <h1 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                My <span className="text-[#54ACBF]">Certificates</span>
              </h1>
            </div>
          </div>
        </SR>

        {/* Stats */}
        <SR delay={0.07}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Certificates', value: CERTIFICATES.length, color: '#A7EBF2' },
              { label: 'Total Hours',         value: `${totalHours}h`,    color: '#6EE07A' },
              { label: 'Excellence Awards',   value: CERTIFICATES.filter(c => c.type === 'excellence').length, color: '#FCD34D' },
            ].map(s => (
              <div key={s.label} className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 text-center">
                <div className="font-display font-black leading-none mb-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: s.color }}>{s.value}</div>
                <div className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase tracking-[2px]">{s.label}</div>
              </div>
            ))}
          </div>
        </SR>

        {/* Filter pills */}
        <SR delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {(['all', 'participation', 'completion', 'excellence'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                  filter === f
                    ? f === 'all'
                      ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]'
                      : 'border-current'
                    : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[rgba(84,172,191,0.35)]'
                }`}
                style={filter === f && f !== 'all' ? {
                  color: TYPE_META[f].color,
                  borderColor: TYPE_META[f].color,
                  background: TYPE_META[f].bg,
                } : {}}
              >
                {f === 'all' ? 'All' : TYPE_META[f].label}
              </button>
            ))}
          </div>
        </SR>

        {/* Certificates grid */}
        <SR delay={0.13}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((cert, i) => {
              const tm = TYPE_META[cert.type];
              return (
                <motion.div key={cert.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  className="bg-[rgba(2,56,89,0.4)] border rounded-2xl overflow-hidden group cursor-pointer hover:shadow-card transition-all duration-200"
                  style={{ borderColor: `${cert.color}30` }}
                  onClick={() => setPreview(cert)}
                >
                  {/* Certificate mini preview */}
                  <div className="relative h-36 p-5 text-center flex flex-col items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, rgba(1,28,64,0.9), ${cert.color}12)` }}>
                    {/* Corner accents */}
                    <div className="absolute top-2 left-2 w-5 h-5 border-t border-l opacity-40" style={{ borderColor: cert.color }} />
                    <div className="absolute top-2 right-2 w-5 h-5 border-t border-r opacity-40" style={{ borderColor: cert.color }} />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l opacity-40" style={{ borderColor: cert.color }} />
                    <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r opacity-40" style={{ borderColor: cert.color }} />

                    <Award size={22} className="mb-2 opacity-70" style={{ color: cert.color }} />
                    <p className="font-mono text-[9px] uppercase tracking-[2px] mb-1" style={{ color: cert.color }}>
                      Pruthwe volunteers
                    </p>
                    <p className="font-display font-black text-[#F0FAFB] text-xs uppercase tracking-wide text-center leading-tight line-clamp-2">
                      {cert.event}
                    </p>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[rgba(1,28,64,0.7)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="w-9 h-9 rounded-full bg-[rgba(84,172,191,0.2)] border border-[rgba(84,172,191,0.4)] flex items-center justify-center text-[#A7EBF2] hover:bg-[rgba(84,172,191,0.35)] transition-all">
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); }}
                        className="w-9 h-9 rounded-full bg-[rgba(84,172,191,0.2)] border border-[rgba(84,172,191,0.4)] flex items-center justify-center text-[#A7EBF2] hover:bg-[rgba(84,172,191,0.35)] transition-all">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-4 border-t" style={{ borderColor: `${cert.color}20` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border"
                        style={{ color: tm.color, borderColor: `${tm.color}40`, background: tm.bg }}>
                        {tm.label}
                      </span>
                      <span className="font-sans text-[#8BBFCC] text-[11px]">{cert.year}</span>
                    </div>
                    <p className="font-sans text-[#8BBFCC] text-xs">By {cert.org}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 font-sans text-[#8BBFCC] text-[11px]">
                        <Calendar size={10} className="text-[#54ACBF]" />{cert.date}
                      </span>
                      <span className="flex items-center gap-1 font-sans text-[#6EE07A] text-[11px] font-bold">
                        <Clock size={10} />{cert.hours}h
                      </span>
                    </div>
                    <p className="font-mono text-[#54ACBF] text-[9px] tracking-wider mt-2 truncate">{cert.certNo}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SR>

        {/* Verify info */}
        <SR delay={0.18}>
          <div className="bg-[rgba(84,172,191,0.05)] border border-[rgba(84,172,191,0.15)] rounded-2xl p-5 flex items-start gap-4">
            <CheckCircle size={20} className="text-[#54ACBF] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide mb-1">
                Certificate Verification
              </h3>
              <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">
                Every Pruthwee certificate is publicly verifiable. Anyone can check the authenticity of your
                certificate at <span className="font-mono text-[#54ACBF]">pruthwee.org/verify/[CERT-NO]</span>.
                Share the verification link with employers, NGOs, or universities as proof of volunteer service.
              </p>
            </div>
          </div>
        </SR>

      </div>

      {/* Certificate preview modal */}
      <AnimatePresence>
        {preview && <CertPreview cert={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}