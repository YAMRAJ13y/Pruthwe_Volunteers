import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Users, ChevronDown, ChevronUp, CheckCircle, AlertCircle,
  ArrowRight, RefreshCw, Filter, Search, Layers, Send, X,
} from 'lucide-react';
import { OrgHeader } from './OrgHeader';
import {
  MOCK_REGISTRATIONS, MOCK_SECTORS, MOCK_EVENTS,
  REG_STATUS_META, type Registration,
} from './_shared';

// ── TYPES ─────────────────────────────────────
type AllocatedMap = Record<string, string>; // regId → assignmentId

// ── HELPERS ───────────────────────────────────
function mqBar(score: number) {
  const color = score >= 90 ? '#6EE07A' : score >= 70 ? '#FCD34D' : '#FCA5A5';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[rgba(84,172,191,0.15)] rounded-full max-w-[60px]">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-xs tabular-nums" style={{ color }}>{score}</span>
    </div>
  );
}

// ── ASSIGNMENT ROW ─────────────────────────────
function AssignmentSlot({
  assignment,
  sectorName,
  taskName,
  allocatedRegs,
  onAllocate,
  onDeallocate,
}: {
  assignment:    { id: string; time: string; need: number; allocated: number };
  sectorName:    string;
  taskName:      string;
  allocatedRegs: Registration[];
  onAllocate:    (regId: string, assignId: string) => void;
  onDeallocate:  (regId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch]     = useState('');

  const available = MOCK_REGISTRATIONS.filter(r =>
    r.status === 'approved' &&
    !allocatedRegs.find(ar => ar.id === r.id)
  );

  const filteredAvail = available.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.mqScore - a.mqScore);

  const filled   = allocatedRegs.length;
  const needed   = assignment.need;
  const pct      = Math.min((filled / needed) * 100, 100);
  const barColor = pct >= 100 ? '#6EE07A' : pct >= 60 ? '#FCD34D' : '#FCA5A5';

  return (
    <div className="border border-[rgba(84,172,191,0.12)] rounded-xl overflow-hidden mb-3">
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-3.5 bg-[rgba(1,28,64,0.5)] text-left hover:bg-[rgba(1,28,64,0.7)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">{taskName}</span>
            <span className="font-mono text-[#54ACBF] text-[10px] tracking-wide">{assignment.time}</span>
          </div>
          <p className="font-sans text-[#8BBFCC] text-xs mt-0.5">{sectorName}</p>
        </div>

        {/* Fill indicator */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="font-mono text-[10px] tracking-wide" style={{ color: barColor }}>
                {filled}/{needed} filled
              </span>
            </div>
            <div className="w-24 h-1.5 bg-[rgba(84,172,191,0.15)] rounded-full">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
            </div>
          </div>
          {expanded ? <ChevronUp size={15} className="text-[#54ACBF]" /> : <ChevronDown size={15} className="text-[#54ACBF]" />}
        </div>
      </button>

      {/* Expanded allocation panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden"
          >
            <div className="p-4 bg-[rgba(2,56,89,0.3)] grid md:grid-cols-2 gap-4">

              {/* Currently allocated */}
              <div>
                <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-2">
                  Allocated ({filled})
                </p>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {allocatedRegs.length === 0 ? (
                    <p className="font-sans text-[#8BBFCC] text-xs italic">No one allocated yet.</p>
                  ) : allocatedRegs.map(r => (
                    <div key={r.id} className="flex items-center gap-3 bg-[rgba(110,224,122,0.06)] border border-[rgba(110,224,122,0.2)] rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[#F0FAFB] text-xs uppercase tracking-wide truncate">{r.name}</p>
                        <div className="mt-0.5">{mqBar(r.mqScore)}</div>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0"
                        style={{ color: r.tierColor, borderColor: `${r.tierColor}40` }}>{r.tier}</span>
                      <button onClick={() => onDeallocate(r.id)}
                        className="text-[#FCA5A5] hover:text-[#FCA5A5] opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available to allocate */}
              <div>
                <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-2">
                  Available — sorted by MQ
                </p>
                <div className="relative mb-2">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Filter by name..." className="input h-8 text-xs pl-8" />
                </div>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {filteredAvail.length === 0 ? (
                    <p className="font-sans text-[#8BBFCC] text-xs italic">No more approved volunteers.</p>
                  ) : filteredAvail.map(r => (
                    <button key={r.id} onClick={() => filled < needed && onAllocate(r.id, assignment.id)}
                      disabled={filled >= needed}
                      className="w-full flex items-center gap-3 bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.1)] rounded-lg px-3 py-2 text-left hover:border-[rgba(84,172,191,0.35)] hover:bg-[rgba(84,172,191,0.06)] transition-all disabled:opacity-40 disabled:cursor-not-allowed group">
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[#F0FAFB] text-xs uppercase tracking-wide truncate">{r.name}</p>
                        <div className="mt-0.5">{mqBar(r.mqScore)}</div>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0"
                        style={{ color: r.tierColor, borderColor: `${r.tierColor}40` }}>{r.tier}</span>
                      <ArrowRight size={11} className="text-[#54ACBF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════
export default function AllocationToolPage() {
  const { id } = useParams();
  const event  = MOCK_EVENTS.find(e => e.id === id) ?? MOCK_EVENTS[0];

  // Allocation state: regId → assignmentId
  const [allocated,    setAllocated]    = useState<AllocatedMap>({});
  const [activated,    setActivated]    = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  // Suggested auto-fill (by MQ)
  function autoFill() {
    const approved = [...MOCK_REGISTRATIONS.filter(r => r.status === 'approved')]
      .sort((a, b) => b.mqScore - a.mqScore);
    const newMap: AllocatedMap = {};
    let volIdx = 0;
    MOCK_SECTORS.forEach(sector => {
      sector.tasks.forEach(task => {
        task.assignments.forEach(asgn => {
          for (let i = 0; i < asgn.need; i++) {
            const v = approved[volIdx++];
            if (v) newMap[v.id] = asgn.id;
          }
        });
      });
    });
    setAllocated(newMap);
  }

  function handleAllocate(regId: string, assignId: string) {
    setAllocated(p => ({ ...p, [regId]: assignId }));
  }

  function handleDeallocate(regId: string) {
    setAllocated(p => { const next = { ...p }; delete next[regId]; return next; });
  }

  // Stats
  const approvedCount  = MOCK_REGISTRATIONS.filter(r => r.status === 'approved').length;
  const allocatedCount = Object.keys(allocated).length;
  const totalNeeded    = MOCK_SECTORS.reduce((s, sec) =>
    s + sec.tasks.reduce((t, task) =>
      t + task.assignments.reduce((a, asgn) => a + asgn.need, 0), 0), 0);

  return (
    <div className="bg-[#011C40] min-h-screen">
      <OrgHeader title="Allocations" eventId={id ?? 'e1'} eventTitle={event.title} />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 space-y-6">

        {/* Header + actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
              Allocation <span className="text-[#54ACBF]">Tool</span>
            </h2>
            <p className="font-sans text-[#8BBFCC] text-sm mt-1">{event.title}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAllocated({})}
              className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2">
              <RefreshCw size={13} /> Reset
            </button>
            <button onClick={autoFill}
              className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
              <Zap size={13} /> Auto-Fill by MQ
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Approved Volunteers', value: approvedCount,                    color: '#A7EBF2' },
            { label: 'Allocated',           value: allocatedCount,                    color: '#6EE07A' },
            { label: 'Unallocated',         value: approvedCount - allocatedCount,    color: '#FCD34D' },
            { label: 'Slots Needed',        value: totalNeeded,                       color: '#54ACBF' },
          ].map(s => (
            <div key={s.label} className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 text-center">
              <div className="font-display font-black leading-none mb-1"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: s.color }}>{s.value}</div>
              <div className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase tracking-[2px]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-bold text-[#F0FAFB] text-sm uppercase tracking-wide">Overall Fill Progress</span>
            <span className="font-display font-black text-[#6EE07A] text-lg">{Math.round((allocatedCount / totalNeeded) * 100)}%</span>
          </div>
          <div className="h-3 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-[#54ACBF] to-[#6EE07A] rounded-full"
              animate={{ width: `${Math.min((allocatedCount / totalNeeded) * 100, 100)}%` }}
              transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* MQ explanation */}
        <div className="flex items-start gap-3 bg-[rgba(110,224,122,0.05)] border border-[rgba(110,224,122,0.15)] rounded-xl p-4">
          <Zap size={16} className="text-[#6EE07A] mt-0.5 flex-shrink-0" />
          <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">
            <span className="text-[#6EE07A] font-bold">Auto-Fill by MQ</span> sorts all approved volunteers by their Matching Quotient score
            and fills assignments from highest to lowest. You can then adjust manually by expanding any assignment below.
          </p>
        </div>

        {/* Sector / assignment slots */}
        <div className="space-y-6">
          {MOCK_SECTORS.map(sector => (
            <div key={sector.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-6 rounded-full bg-[#54ACBF]" />
                <div>
                  <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide">{sector.name}</h3>
                  <p className="font-sans text-[#8BBFCC] text-xs">{sector.location}</p>
                </div>
              </div>

              {sector.tasks.map(task =>
                task.assignments.map(asgn => {
                  const allocatedRegs = Object.entries(allocated)
                    .filter(([, aId]) => aId === asgn.id)
                    .map(([rId]) => MOCK_REGISTRATIONS.find(r => r.id === rId)!)
                    .filter(Boolean);

                  return (
                    <AssignmentSlot
                      key={asgn.id}
                      assignment={asgn}
                      sectorName={sector.name}
                      taskName={task.name}
                      allocatedRegs={allocatedRegs}
                      onAllocate={handleAllocate}
                      onDeallocate={handleDeallocate}
                    />
                  );
                })
              )}
            </div>
          ))}
        </div>

        {/* Activate bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-[rgba(84,172,191,0.1)]">
          {activated ? (
            <div className="flex items-center gap-3 px-5 py-3 bg-[rgba(110,224,122,0.08)] border border-[rgba(110,224,122,0.3)] rounded-xl w-full justify-between flex-wrap">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#6EE07A] flex-shrink-0" />
                <div>
                  <p className="font-display font-black text-[#6EE07A] text-sm uppercase tracking-wide">Allocations Activated</p>
                  <p className="font-sans text-[#8BBFCC] text-xs mt-0.5">{allocatedCount} volunteers notified of their assignments.</p>
                </div>
              </div>
              <Link to={`/organiser/events/${id ?? 'e1'}/messages`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[rgba(84,172,191,0.1)] border border-[rgba(84,172,191,0.2)] text-[#54ACBF] hover:text-[#A7EBF2] transition-colors font-display font-bold text-xs uppercase tracking-wide">
                <Send size={12} /> Send Follow-up Message
              </Link>
            </div>
          ) : (
            <>
              <p className="font-sans text-sm">
                {allocatedCount < totalNeeded
                  ? <span className="text-[#FCD34D]">⚠ {totalNeeded - allocatedCount} slot{totalNeeded - allocatedCount !== 1 ? 's' : ''} still unfilled</span>
                  : <span className="text-[#6EE07A]">✓ All {totalNeeded} slots filled</span>}
              </p>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={allocatedCount === 0}
                className="btn-primary px-8 py-3 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                <CheckCircle size={15} /> Activate &amp; Notify Volunteers
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
            <motion.div className="relative bg-[#02294D] border border-[rgba(84,172,191,0.25)] rounded-2xl w-full max-w-md p-7 space-y-5"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">Activate Allocations</h3>
                  <p className="font-sans text-[#8BBFCC] text-sm mt-1">This will notify all allocated volunteers. Cannot be undone.</p>
                </div>
                <button onClick={() => setShowConfirm(false)}
                  className="p-1.5 rounded-lg border border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:text-[#F0FAFB] transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="bg-[rgba(84,172,191,0.05)] border border-[rgba(84,172,191,0.12)] rounded-xl p-4 space-y-2.5">
                {[
                  { label: 'Volunteers to notify',   value: allocatedCount,                 color: '#6EE07A' },
                  { label: 'Unallocated (no notif)', value: approvedCount - allocatedCount, color: '#FCD34D' },
                  { label: 'Slots filled',           value: `${allocatedCount} / ${totalNeeded}`, color: '#A7EBF2' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="font-sans text-[#8BBFCC] text-sm">{s.label}</span>
                    <span className="font-display font-black text-sm" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">
                Each allocated volunteer receives an email + SMS with their sector, task, time slot, and venue.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="btn-outline flex-1 py-3 text-sm">Cancel</button>
                <button onClick={() => { setActivated(true); setShowConfirm(false); }}
                  className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2">
                  <Send size={14} /> Confirm &amp; Notify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}