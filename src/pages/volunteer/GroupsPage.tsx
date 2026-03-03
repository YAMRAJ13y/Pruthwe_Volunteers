import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Users, Plus, ChevronDown, ChevronUp, Copy, CheckCircle,
  ArrowRight, Calendar, Hash, LogOut, X, Search,
} from 'lucide-react';

function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
  );
}

type GroupMember = { name: string; initials: string; color: string; role: 'leader' | 'member' };
type Group = {
  id:       string;
  name:     string;
  org:      string;
  event:    string;
  eventDate:string;
  token:    string;
  role:     'leader' | 'member';
  members:  GroupMember[];
  status:   'active' | 'completed';
  color:    string;
};

const MY_GROUPS: Group[] = [
  {
    id:        'g1',
    name:      'Paryavaran Youth Squad',
    org:       'Paryavaran Trust',
    event:     'Sabarmati River Clean-Up 2026',
    eventDate: 'Mar 15, 2026',
    token:     'PYS-2026-XTRM4',
    role:      'leader',
    status:    'active',
    color:     '#6EE07A',
    members: [
      { name: 'Arjun Patel',    initials: 'AP', color: '#A7EBF2', role: 'leader' },
      { name: 'Priya Shah',     initials: 'PS', color: '#FCD34D', role: 'member' },
      { name: 'Rohan Mehta',    initials: 'RM', color: '#C4B5FD', role: 'member' },
      { name: 'Kavya Desai',    initials: 'KD', color: '#6EE07A', role: 'member' },
      { name: 'Nikhil Joshi',   initials: 'NJ', color: '#FCA5A5', role: 'member' },
    ],
  },
  {
    id:        'g2',
    name:      'Summit Volunteer Crew',
    org:       'Pruthwe volunteers',
    event:     'Pruthwee Summit 2026',
    eventDate: 'Apr 12–13, 2026',
    token:     'SVC-2026-SMMT9',
    role:      'member',
    status:    'active',
    color:     '#54ACBF',
    members: [
      { name: 'Sneha Rathi',    initials: 'SR', color: '#A7EBF2', role: 'leader' },
      { name: 'Arjun Patel',    initials: 'AP', color: '#54ACBF', role: 'member' },
      { name: 'Dev Sharma',     initials: 'DS', color: '#C4B5FD', role: 'member' },
      { name: 'Fatima Sheikh',  initials: 'FS', color: '#FCD34D', role: 'member' },
      { name: 'Harsh Trivedi',  initials: 'HT', color: '#6EE07A', role: 'member' },
      { name: 'Ishaan Nair',    initials: 'IN', color: '#FCA5A5', role: 'member' },
      { name: 'Janhvi Modi',    initials: 'JM', color: '#A7EBF2', role: 'member' },
    ],
  },
];

// ── JOIN GROUP MODAL ──────────────────────────
function JoinModal({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState('');
  const [done,  setDone]  = useState(false);
  const [error, setError] = useState('');

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (token.length < 6) { setError('Invalid token. Check the token and try again.'); return; }
    setDone(true);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[rgba(1,28,64,0.92)] backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        className="bg-[#023859] border border-[rgba(84,172,191,0.25)] rounded-2xl p-8 w-full max-w-sm"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">Join a Group</h3>
          <button onClick={onClose} className="text-[#8BBFCC] hover:text-[#FCA5A5] transition-colors"><X size={18} /></button>
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h4 className="font-display font-black text-[#6EE07A] text-xl uppercase tracking-wide mb-2">Joined!</h4>
            <p className="font-sans text-[#8BBFCC] text-sm mb-5">You've been added to the group. Your group leader will be notified.</p>
            <button onClick={onClose} className="btn-primary w-full justify-center">Done</button>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">
              Enter the group token shared by your group leader. Tokens look like <span className="font-mono text-[#A7EBF2]">XXX-YYYY-ZZZZZ</span>.
            </p>
            <div>
              <label className="label">Group Token</label>
              <input type="text" value={token} onChange={e => { setToken(e.target.value.toUpperCase()); setError(''); }}
                placeholder="e.g. PYS-2026-XTRM4" className="input font-mono tracking-wider" />
              {error && <p className="font-sans text-[#FCA5A5] text-xs mt-1">{error}</p>}
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Join Group <ArrowRight size={14} />
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── CREATE GROUP MODAL ────────────────────────
function CreateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [done, setDone] = useState(false);
  const generatedToken = `${name.slice(0,3).toUpperCase().replace(/\s/g,'X')}-2026-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (name && event) setDone(true);
  }

  function copyToken() {
    navigator.clipboard?.writeText(generatedToken);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[rgba(1,28,64,0.92)] backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        className="bg-[#023859] border border-[rgba(84,172,191,0.25)] rounded-2xl p-8 w-full max-w-sm"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">Create Group</h3>
          <button onClick={onClose} className="text-[#8BBFCC] hover:text-[#FCA5A5] transition-colors"><X size={18} /></button>
        </div>

        {done ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <h4 className="font-display font-black text-[#6EE07A] text-xl uppercase tracking-wide mb-1">Group Created!</h4>
              <p className="font-sans text-[#8BBFCC] text-sm mb-4">Share the token below with your group members.</p>
            </div>
            <div className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.15)] rounded-xl p-4 flex items-center justify-between gap-3">
              <span className="font-mono text-[#A7EBF2] text-base tracking-widest">{generatedToken}</span>
              <button onClick={copyToken} className="text-[#54ACBF] hover:text-[#A7EBF2] transition-colors flex-shrink-0">
                <Copy size={16} />
              </button>
            </div>
            <button onClick={onClose} className="btn-primary w-full justify-center">Done</button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Group Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Paryavaran Youth Squad" className="input" required />
            </div>
            <div>
              <label className="label">Event</label>
              <input type="text" value={event} onChange={e => setEvent(e.target.value)}
                placeholder="Event name" className="input" required />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Create Group <ArrowRight size={14} />
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════
export default function GroupsPage() {
  const [joinOpen,   setJoinOpen]   = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [expanded,   setExpanded]   = useState<string | null>('g1');
  const [copied,     setCopied]     = useState<string | null>(null);

  function copyToken(token: string) {
    navigator.clipboard?.writeText(token);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-[#011C40] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* Header */}
        <SR>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Link to="/dashboard" className="flex items-center gap-1 font-mono text-[#54ACBF] text-xs tracking-[2px] uppercase mb-2 hover:text-[#A7EBF2] transition-colors">
                ← Dashboard
              </Link>
              <h1 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                My <span className="text-[#54ACBF]">Groups</span>
              </h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setJoinOpen(true)} className="btn-outline text-xs py-2.5 px-5">
                Join with Token
              </button>
              <button onClick={() => setCreateOpen(true)} className="btn-primary text-xs py-2.5 px-5">
                <Plus size={13} /> Create Group
              </button>
            </div>
          </div>
        </SR>

        {/* Stats */}
        <SR delay={0.07}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Groups',          value: MY_GROUPS.length,                                       color: '#A7EBF2' },
              { label: 'Leading',         value: MY_GROUPS.filter(g => g.role === 'leader').length,       color: '#FCD34D' },
              { label: 'Total Members',   value: MY_GROUPS.reduce((s, g) => s + g.members.length, 0),     color: '#6EE07A' },
            ].map(s => (
              <div key={s.label} className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 text-center">
                <div className="font-display font-black leading-none mb-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: s.color }}>{s.value}</div>
                <div className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase tracking-[2px]">{s.label}</div>
              </div>
            ))}
          </div>
        </SR>

        {/* How groups work */}
        <SR delay={0.09}>
          <div className="bg-[rgba(84,172,191,0.05)] border border-[rgba(84,172,191,0.15)] rounded-2xl p-5 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '👥', title: 'Create or Join',  desc: 'Create a group for your team or join an existing group using a token.' },
              { icon: '📋', title: 'Register Together', desc: 'Group members get registered together for the same event with matching availability.' },
              { icon: '📍', title: 'Same Assignment',  desc: 'The system tries to allocate group members to the same sector or nearby tasks.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-display font-black text-[#A7EBF2] text-xs uppercase tracking-wide mb-1">{item.title}</div>
                  <div className="font-sans text-[#8BBFCC] text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </SR>

        {/* Group cards */}
        <SR delay={0.11}>
          {MY_GROUPS.length === 0 ? (
            <div className="text-center py-16 bg-[rgba(2,56,89,0.3)] rounded-2xl border border-[rgba(84,172,191,0.1)]">
              <Users size={36} className="text-[#54ACBF] mx-auto mb-3 opacity-50" />
              <h3 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide mb-1">No Groups Yet</h3>
              <p className="font-sans text-[#8BBFCC] text-sm">Create a group or join one with a token.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {MY_GROUPS.map((group, i) => {
                const isOpen = expanded === group.id;
                return (
                  <motion.div key={group.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden hover:border-[rgba(84,172,191,0.2)] transition-colors"
                  >
                    {/* Card header */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : group.id)}
                      className="w-full flex items-center gap-5 p-5 text-left"
                    >
                      {/* Group icon */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${group.color}18`, border: `1px solid ${group.color}40` }}>
                        <Users size={20} style={{ color: group.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide">
                            {group.name}
                          </h3>
                          <span className="text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border"
                            style={{ color: group.color, borderColor: `${group.color}40`, background: `${group.color}12` }}>
                            {group.role}
                          </span>
                          <span className={`text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border ${
                            group.status === 'active'
                              ? 'text-[#6EE07A] border-[rgba(110,224,122,0.3)] bg-[rgba(110,224,122,0.08)]'
                              : 'text-[#8BBFCC] border-[rgba(84,172,191,0.2)]'
                          }`}>
                            {group.status}
                          </span>
                        </div>
                        <p className="font-sans text-[#8BBFCC] text-xs line-clamp-1">
                          {group.event} · {group.eventDate}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 5).map((m, mi) => (
                              <div key={mi} className="w-6 h-6 rounded-full flex items-center justify-center text-[#011C40] text-[9px] font-black border border-[#011C40]"
                                style={{ background: m.color, zIndex: 5 - mi }}>
                                {m.initials}
                              </div>
                            ))}
                          </div>
                          <span className="font-sans text-[#8BBFCC] text-[11px]">
                            {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {isOpen ? <ChevronUp size={16} className="text-[#54ACBF] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#54ACBF] flex-shrink-0" />}
                    </button>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-[rgba(84,172,191,0.1)] space-y-5 pt-4">

                            {/* Token (leader only) */}
                            {group.role === 'leader' && (
                              <div>
                                <label className="label mb-2 block">Group Token</label>
                                <div className="flex items-center gap-3 bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.15)] rounded-xl px-4 py-3">
                                  <Hash size={14} className="text-[#54ACBF]" />
                                  <span className="font-mono text-[#A7EBF2] text-sm tracking-widest flex-1">{group.token}</span>
                                  <button onClick={() => copyToken(group.token)}
                                    className="text-[#54ACBF] hover:text-[#A7EBF2] transition-colors">
                                    {copied === group.token ? <CheckCircle size={15} className="text-[#6EE07A]" /> : <Copy size={15} />}
                                  </button>
                                </div>
                                <p className="font-sans text-[#54ACBF] text-[11px] mt-1">
                                  Share this token with your team members so they can join this group.
                                </p>
                              </div>
                            )}

                            {/* Members list */}
                            <div>
                              <label className="label mb-3 block">
                                Members ({group.members.length})
                              </label>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {group.members.map((member) => (
                                  <div key={member.name}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[rgba(1,28,64,0.4)] border border-[rgba(84,172,191,0.08)]">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[#011C40] text-xs font-black"
                                      style={{ background: member.color }}>
                                      {member.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-display font-bold text-[#F0FAFB] text-xs uppercase tracking-wide truncate">
                                        {member.name}
                                      </p>
                                      <p className="font-mono text-[#54ACBF] text-[9px] uppercase tracking-[1px]">
                                        {member.role}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              <Link to={`/events/1`}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(84,172,191,0.1)] border border-[rgba(84,172,191,0.25)] text-[#A7EBF2] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(84,172,191,0.18)] transition-all">
                                <Calendar size={13} /> View Event
                              </Link>
                              {group.role === 'member' && (
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(252,165,165,0.2)] text-[#FCA5A5] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(252,165,165,0.06)] transition-all">
                                  <LogOut size={13} /> Leave Group
                                </button>
                              )}
                              {group.role === 'leader' && (
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(252,165,165,0.2)] text-[#FCA5A5] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(252,165,165,0.06)] transition-all">
                                  <X size={13} /> Disband Group
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </SR>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {joinOpen && <JoinModal onClose={() => setJoinOpen(false)} />}
        {createOpen && <CreateModal onClose={() => setCreateOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}