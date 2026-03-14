import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, XCircle, Clock, Filter,
  ChevronDown, Users, Zap, MapPin, Mail, Download,
} from 'lucide-react';
import { OrgHeader } from './OrgHeader';
import { MOCK_EVENTS, MOCK_REGISTRATIONS, REG_STATUS_META, type Registration, type RegistrationStatus } from './_shared';

function mqColor(s: number) { return s >= 90 ? '#6EE07A' : s >= 70 ? '#FCD34D' : '#FCA5A5'; }

function VolunteerRow({
  reg, selected, onToggle, onApprove, onReject,
}: {
  reg: Registration; selected: boolean;
  onToggle: () => void; onApprove: () => void; onReject: () => void;
}) {
  const meta = REG_STATUS_META[reg.status];
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr className={`border-b border-[rgba(204,255,0,0.07)] transition-colors ${selected ? 'bg-[rgba(255,255,255,0.04)]' : 'hover:bg-[rgba(204,255,0,0.03)]'}`}>
        <td className="py-3 pl-4 pr-2">
          <input type="checkbox" checked={selected} onChange={onToggle}
            className="w-4 h-4 rounded accent-[#CCFF00] cursor-pointer" />
        </td>
        <td className="py-3 px-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-xs text-[#0C0C0C] flex-shrink-0"
              style={{ background: reg.tierColor + '99' }}>
              {reg.name.split(' ').map(p => p[0]).join('').slice(0,2)}
            </div>
            <div>
              <p className="font-display font-bold text-[#F2F2F2] text-sm">{reg.name}</p>
              <p className="font-sans text-[#888888] text-xs flex items-center gap-1">
                <MapPin size={10} />{reg.city}
              </p>
            </div>
          </div>
        </td>
        <td className="py-3 px-3 hidden md:table-cell">
          <span className="font-sans text-[#888888] text-xs flex items-center gap-1">
            <Mail size={10} />{reg.email}
          </span>
        </td>
        <td className="py-3 px-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.07)] rounded-full max-w-[48px]">
              <div className="h-full rounded-full" style={{ width: `${reg.mqScore}%`, background: mqColor(reg.mqScore) }} />
            </div>
            <span className="font-mono text-xs tabular-nums" style={{ color: mqColor(reg.mqScore) }}>{reg.mqScore}</span>
          </div>
        </td>
        <td className="py-3 px-3 hidden sm:table-cell">
          <span className="font-display font-bold text-xs" style={{ color: reg.tierColor }}>{reg.tier}</span>
        </td>
        <td className="py-3 px-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-display font-bold text-[10px] uppercase tracking-wide"
            style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}>
            {reg.status === 'approved' ? <CheckCircle size={10} /> : reg.status === 'rejected' ? <XCircle size={10} /> : <Clock size={10} />}
            {meta.label}
          </span>
        </td>
        <td className="py-3 pl-2 pr-4">
          <div className="flex items-center gap-1.5">
            {reg.status !== 'approved' && (
              <button onClick={onApprove}
                className="px-2.5 py-1.5 rounded-lg bg-[rgba(110,224,122,0.1)] border border-[rgba(110,224,122,0.25)] text-[#6EE07A] hover:bg-[rgba(110,224,122,0.18)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
                Approve
              </button>
            )}
            {reg.status !== 'rejected' && (
              <button onClick={onReject}
                className="px-2.5 py-1.5 rounded-lg bg-[rgba(252,165,165,0.08)] border border-[rgba(252,165,165,0.2)] text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.15)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
                Reject
              </button>
            )}
            <button onClick={() => setExpanded(e => !e)}
              className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.07)] text-[#888888] hover:text-[#F2F2F2] transition-colors">
              <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={7} className="p-0">
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden bg-[rgba(204,255,0,0.04)] border-b border-[rgba(204,255,0,0.08)]">
                <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wide mb-1">Email</p><p className="font-sans text-[#F2F2F2] text-sm">{reg.email}</p></div>
                  <div><p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wide mb-1">City</p><p className="font-sans text-[#F2F2F2] text-sm">{reg.city}</p></div>
                  <div><p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wide mb-1">Tier</p><p className="font-display font-bold text-sm" style={{ color: reg.tierColor }}>{reg.tier}</p></div>
                  <div><p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wide mb-1">MQ Score</p><p className="font-mono text-sm" style={{ color: mqColor(reg.mqScore) }}>{reg.mqScore} / 100</p></div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function RegistrationsPage() {
  const { id: eventId = 'e1' } = useParams();
  const event = MOCK_EVENTS.find(e => e.id === eventId) ?? MOCK_EVENTS[0];

  const [regs, setRegs]       = useState(MOCK_REGISTRATIONS);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() =>
    regs.filter(r =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => b.mqScore - a.mqScore),
  [regs, search, statusFilter]);

  const counts = {
    all: regs.length,
    pending:  regs.filter(r => r.status === 'pending').length,
    approved: regs.filter(r => r.status === 'approved').length,
    rejected: regs.filter(r => r.status === 'rejected').length,
  };

  function setStatus(id: string, status: RegistrationStatus) {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  function bulkApprove() {
    setRegs(prev => prev.map(r => selected.has(r.id) ? { ...r, status: 'approved' } : r));
    setSelected(new Set());
  }
  function bulkReject() {
    setRegs(prev => prev.map(r => selected.has(r.id) ? { ...r, status: 'rejected' } : r));
    setSelected(new Set());
  }

  const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id));
  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  }

  return (
    <div className="bg-[#0C0C0C] min-h-screen">
      <OrgHeader title="Registrations" eventId={eventId} eventTitle={event.title} />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Approved', value: counts.approved, color: '#6EE07A' },
            { label: 'Pending',  value: counts.pending,  color: '#FCD34D' },
            { label: 'Rejected', value: counts.rejected, color: '#FCA5A5' },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] border border-[rgba(204,255,0,0.1)] rounded-2xl p-4 text-center">
              <p className="font-display font-black leading-none mb-1" style={{ fontSize: 'clamp(24px,3vw,36px)', color: s.color }}>{s.value}</p>
              <p className="font-mono text-[#888888] text-[10px] uppercase tracking-[2px]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl border font-display font-bold text-[10px] uppercase tracking-wide transition-all ${
                  statusFilter === s
                    ? 'bg-[rgba(255,255,255,0.08)] border-[#CCFF00] text-[#CCFF00]'
                    : 'border-[rgba(255,255,255,0.07)] text-[#888888] hover:border-[rgba(255,255,255,0.15)]'
                }`}>
                {s} <span className="opacity-60 ml-0.5">{counts[s]}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCFF00]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…"
                className="input h-9 pl-8 text-sm w-full" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[rgba(255,255,255,0.08)] text-[#888888] hover:text-[#F2F2F2] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl">
              <span className="font-display font-bold text-[#CCFF00] text-xs uppercase tracking-wide">{selected.size} selected</span>
              <button onClick={bulkApprove} className="px-3 py-1.5 rounded-lg bg-[rgba(110,224,122,0.12)] border border-[rgba(110,224,122,0.3)] text-[#6EE07A] hover:bg-[rgba(110,224,122,0.2)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
                Approve All
              </button>
              <button onClick={bulkReject} className="px-3 py-1.5 rounded-lg bg-[rgba(252,165,165,0.08)] border border-[rgba(252,165,165,0.2)] text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.15)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
                Reject All
              </button>
              <button onClick={() => setSelected(new Set())} className="ml-auto text-[#888888] hover:text-[#F2F2F2] transition-colors font-sans text-xs">Clear</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-[#141414] border border-[rgba(204,255,0,0.1)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(204,255,0,0.1)]">
                  <th className="py-3 pl-4 pr-2 w-8">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll}
                      className="w-4 h-4 rounded accent-[#CCFF00] cursor-pointer" />
                  </th>
                  {['Volunteer', 'Email', 'MQ Score', 'Tier', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`py-3 px-3 text-left font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] ${h === 'Email' ? 'hidden md:table-cell' : h === 'Tier' ? 'hidden sm:table-cell' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <Users size={28} className="text-[#CCFF00] mx-auto mb-2 opacity-40" />
                    <p className="font-display font-bold text-[#888888] text-sm uppercase tracking-wide">No registrations found</p>
                  </td></tr>
                ) : filtered.map(reg => (
                  <VolunteerRow key={reg.id} reg={reg}
                    selected={selected.has(reg.id)}
                    onToggle={() => setSelected(prev => { const n = new Set(prev); n.has(reg.id) ? n.delete(reg.id) : n.add(reg.id); return n; })}
                    onApprove={() => setStatus(reg.id, 'approved')}
                    onReject={() => setStatus(reg.id, 'rejected')}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[rgba(204,255,0,0.07)] flex items-center justify-between">
            <p className="font-sans text-[#888888] text-xs">Showing {filtered.length} of {regs.length} registrations</p>
            <div className="flex items-center gap-1">
              <Filter size={11} className="text-[#CCFF00]" />
              <span className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wide">Sorted by MQ Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}