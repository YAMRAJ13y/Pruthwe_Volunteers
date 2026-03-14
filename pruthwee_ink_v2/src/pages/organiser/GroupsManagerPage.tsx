import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ChevronDown, ChevronUp, Download, Search,
  CheckCircle, Hash, X, Filter,
} from 'lucide-react';
import { OrgHeader } from './OrgHeader';
import { MOCK_EVENTS, MOCK_REGISTRATIONS } from './_shared';

type OrgGroup = {
  id:      string;
  name:    string;
  token:   string;
  leader:  string;
  size:    number;
  members: { name: string; initials: string; color: string; mqScore: number; tier: string; tierColor: string }[];
  sectorPref: string;
  status:  'pending' | 'approved' | 'allocated';
};

const MOCK_GROUPS: OrgGroup[] = [
  {
    id:    'g1', name: 'GU Eco Club',       token: 'GUE-2026-ECOX1',
    leader: 'Priya Sharma', size: 3, sectorPref: 'River Collection', status: 'allocated',
    members: [
      { name: 'Priya Sharma',  initials: 'PS', color: '#FCD34D', mqScore: 94, tier: 'Gold',     tierColor: '#FFD700' },
      { name: 'Arjun Patel',   initials: 'AP', color: '#CCFF00', mqScore: 88, tier: 'Silver',   tierColor: '#C0C0C0' },
      { name: 'Karan Bhatt',   initials: 'KB', color: '#C4B5FD', mqScore: 89, tier: 'Gold',     tierColor: '#FFD700' },
    ],
  },
  {
    id:    'g2', name: 'Surat Greens',       token: 'SGR-2026-GRNS5',
    leader: 'Mihir Joshi',  size: 2, sectorPref: 'Logistics',        status: 'approved',
    members: [
      { name: 'Mihir Joshi',   initials: 'MJ', color: '#E5E4E2', mqScore: 97, tier: 'Platinum', tierColor: '#E5E4E2' },
      { name: 'Tanvi Patel',   initials: 'TP', color: '#FCA5A5', mqScore: 65, tier: 'Bronze',   tierColor: '#CD7F32' },
    ],
  },
  {
    id:    'g3', name: 'Vadodara Youth',     token: 'VYA-2026-YUTH3',
    leader: 'Nita Shah',    size: 2, sectorPref: 'Medical Support',  status: 'pending',
    members: [
      { name: 'Nita Shah',     initials: 'NS', color: '#93C5FD', mqScore: 81, tier: 'Silver',   tierColor: '#C0C0C0' },
      { name: 'Rohan Shah',    initials: 'RS', color: '#6EE07A', mqScore: 61, tier: 'Volunteer', tierColor: '#6EE07A' },
    ],
  },
];

const STATUS_COLORS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  allocated: { label: 'Allocated', color: '#6EE07A', bg: 'rgba(110,224,122,0.1)',  border: 'rgba(110,224,122,0.3)'  },
  approved:  { label: 'Approved',  color: '#CCFF00', bg: 'rgba(204,255,0,0.1)', border: 'rgba(204,255,0,0.3)' },
  pending:   { label: 'Pending',   color: '#FCD34D', bg: 'rgba(252,211,77,0.1)',   border: 'rgba(252,211,77,0.3)'   },
};

// ═════════════════════════════════════════════
export default function GroupsManagerPage() {
  const { id } = useParams();
  const event  = MOCK_EVENTS.find(e => e.id === id) ?? MOCK_EVENTS[0];

  const [expanded, setExpanded] = useState<string | null>('g1');
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'approved' | 'allocated'>('all');

  const filtered = MOCK_GROUPS.filter(g =>
    (filter === 'all' || g.status === filter) &&
    (!search || g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.leader.toLowerCase().includes(search.toLowerCase()))
  );

  const totalInGroups = MOCK_GROUPS.reduce((s, g) => s + g.size, 0);
  const allocated = MOCK_GROUPS.filter(g => g.status === 'allocated').length;
  const avgMQ = Math.round(
    MOCK_GROUPS.flatMap(g => g.members).reduce((s, m) => s + m.mqScore, 0) /
    MOCK_GROUPS.flatMap(g => g.members).length
  );

  return (
    <div className="bg-[#0C0C0C] min-h-screen">
      <OrgHeader title="Groups" eventId={id ?? 'e1'} eventTitle={event.title} />

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
              Group <span className="text-[#CCFF00]">Management</span>
            </h2>
            <p className="font-sans text-[#888888] text-sm mt-1">{event.title}</p>
          </div>
          <button className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2">
            <Download size={13} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Groups',     value: MOCK_GROUPS.length,  color: '#CCFF00' },
            { label: 'In Groups',        value: totalInGroups,        color: '#CCFF00' },
            { label: 'Groups Allocated', value: allocated,            color: '#6EE07A' },
            { label: 'Avg Group MQ',     value: avgMQ,                color: '#FCD34D' },
          ].map(s => (
            <div key={s.label} className="bg-[rgba(20,20,20,0.5)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-4 text-center">
              <div className="font-display font-black leading-none mb-1"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: s.color }}>{s.value}</div>
              <div className="font-display font-bold text-[#888888] text-[10px] uppercase tracking-[2px]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="flex items-start gap-3 bg-[rgba(204,255,0,0.05)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
          <Users size={16} className="text-[#CCFF00] mt-0.5 flex-shrink-0" />
          <p className="font-sans text-[#888888] text-sm leading-relaxed">
            Groups are registered together and will be preferentially allocated to the same sector.
            Solo registrants not in a group are listed separately in Registrations.
            Approve pending groups before running allocations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl p-1">
            {(['all', 'pending', 'approved', 'allocated'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg font-display font-bold text-xs uppercase tracking-wide transition-all ${
                  filter === f ? 'bg-[rgba(255,255,255,0.08)] text-[#CCFF00]' : 'text-[#888888] hover:text-[#CCFF00]'
                }`}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCFF00]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search groups..." className="input h-10 pl-9 text-sm" />
          </div>
        </div>

        {/* Group cards */}
        <div className="space-y-3">
          {filtered.map((group) => {
            const sc = STATUS_COLORS[group.status];
            const isOpen = expanded === group.id;
            const avgGroupMQ = Math.round(group.members.reduce((s, m) => s + m.mqScore, 0) / group.members.length);

            return (
              <div key={group.id}
                className="bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden hover:border-[rgba(255,255,255,0.1)] transition-colors">

                {/* Row */}
                <button onClick={() => setExpanded(isOpen ? null : group.id)}
                  className="w-full flex items-center gap-4 p-5 text-left">
                  {/* Group avatar */}
                  <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center flex-shrink-0">
                    <Users size={20} className="text-[#CCFF00]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide">{group.name}</span>
                      <span className="text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border"
                        style={{ color: sc.color, borderColor: sc.border, background: sc.bg }}>{sc.label}</span>
                    </div>
                    <p className="font-sans text-[#888888] text-xs">
                      Leader: {group.leader} · {group.size} members · Pref: {group.sectorPref}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex -space-x-1.5">
                        {group.members.slice(0, 4).map((m, mi) => (
                          <div key={mi} className="w-5 h-5 rounded-full flex items-center justify-center text-[#0C0C0C] text-[9px] font-black border border-[#0C0C0C]"
                            style={{ background: m.color, zIndex: 4 - mi }}>
                            {m.initials[0]}
                          </div>
                        ))}
                      </div>
                      <span className="font-mono text-[#CCFF00] text-[10px]">Avg MQ: {avgGroupMQ}</span>
                    </div>
                  </div>

                  {/* Status actions */}
                  {group.status === 'pending' && (
                    <button
                      onClick={e => e.stopPropagation()}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(110,224,122,0.1)] border border-[rgba(110,224,122,0.3)] text-[#6EE07A] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(110,224,122,0.18)] transition-all">
                      <CheckCircle size={12} /> Approve
                    </button>
                  )}

                  {isOpen ? <ChevronUp size={15} className="text-[#CCFF00] flex-shrink-0" /> : <ChevronDown size={15} className="text-[#CCFF00] flex-shrink-0" />}
                </button>

                {/* Expanded */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      transition={{ duration: 0.22 }} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-[rgba(204,255,0,0.1)] pt-4 space-y-4">

                        {/* Token */}
                        <div className="flex items-center gap-3 bg-[rgba(12,12,12,0.5)] border border-[rgba(204,255,0,0.1)] rounded-xl px-4 py-3">
                          <Hash size={13} className="text-[#CCFF00]" />
                          <span className="font-mono text-[#CCFF00] text-sm tracking-widest flex-1">{group.token}</span>
                          <span className="font-mono text-[#CCFF00] text-[10px] tracking-wider">Group Token</span>
                        </div>

                        {/* Members table */}
                        <div>
                          <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] mb-2">Members</p>
                          <div className="space-y-1.5">
                            {group.members.map(m => (
                              <div key={m.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[rgba(12,12,12,0.4)] border border-[rgba(204,255,0,0.06)]">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#0C0C0C] text-xs font-black flex-shrink-0"
                                  style={{ background: m.color }}>{m.initials}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-display font-bold text-[#F2F2F2] text-xs uppercase tracking-wide truncate">{m.name}</p>
                                </div>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0"
                                  style={{ color: m.tierColor, borderColor: `${m.tierColor}40` }}>{m.tier}</span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <div className="w-10 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full">
                                    <div className="h-full rounded-full" style={{ width: `${m.mqScore}%`, background: m.mqScore >= 90 ? '#6EE07A' : m.mqScore >= 70 ? '#FCD34D' : '#FCA5A5' }} />
                                  </div>
                                  <span className="font-mono text-xs" style={{ color: m.mqScore >= 90 ? '#6EE07A' : m.mqScore >= 70 ? '#FCD34D' : '#FCA5A5' }}>{m.mqScore}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}