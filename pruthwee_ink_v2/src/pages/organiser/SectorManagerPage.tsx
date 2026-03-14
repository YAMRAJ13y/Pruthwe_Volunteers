import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Users, MapPin, CheckCircle,
  AlertCircle, ChevronDown, Save, X, Zap,
} from 'lucide-react';
import { OrgHeader } from './OrgHeader';
import { MOCK_EVENTS, MOCK_SECTORS, type Sector } from './_shared';

// ── FILL BAR ──────────────────────────────────
function FillBar({ need, allocated }: { need: number; allocated: number }) {
  const pct   = need > 0 ? Math.min(Math.round((allocated / need) * 100), 100) : 0;
  const color = pct >= 100 ? '#6EE07A' : pct >= 60 ? '#FCD34D' : '#FCA5A5';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-xs tabular-nums w-12 text-right" style={{ color }}>
        {allocated}/{need}
      </span>
    </div>
  );
}

// ── TYPES FOR MODAL ───────────────────────────
type DraftAssignment = { id: string; time: string; need: number };
type DraftTask       = { id: string; name: string; assignments: DraftAssignment[] };

// ── ADD/EDIT SECTOR MODAL ─────────────────────
function SectorModal({ sector, onSave, onClose }: {
  sector: Partial<Sector> | null; onSave: (s: Partial<Sector>) => void; onClose: () => void;
}) {
  const [name,     setName]     = useState(sector?.name     ?? '');
  const [location, setLocation] = useState(sector?.location ?? '');

  // Seed tasks from existing sector or start with one blank task
  const [tasks, setTasks] = useState<DraftTask[]>(() => {
    if (sector?.tasks && sector.tasks.length > 0) {
      return sector.tasks.map(t => ({
        id: t.id,
        name: t.name,
        assignments: t.assignments.map(a => ({ id: a.id, time: a.time, need: a.need })),
      }));
    }
    return [{ id: `t${Date.now()}`, name: '', assignments: [{ id: `a${Date.now()}`, time: '', need: 1 }] }];
  });

  function addTask() {
    setTasks(prev => [...prev, { id: `t${Date.now()}`, name: '', assignments: [{ id: `a${Date.now()}`, time: '', need: 1 }] }]);
  }
  function removeTask(tid: string) {
    setTasks(prev => prev.filter(t => t.id !== tid));
  }
  function updateTaskName(tid: string, val: string) {
    setTasks(prev => prev.map(t => t.id === tid ? { ...t, name: val } : t));
  }
  function addAssignment(tid: string) {
    setTasks(prev => prev.map(t => t.id === tid
      ? { ...t, assignments: [...t.assignments, { id: `a${Date.now()}`, time: '', need: 1 }] }
      : t));
  }
  function removeAssignment(tid: string, aid: string) {
    setTasks(prev => prev.map(t => t.id === tid
      ? { ...t, assignments: t.assignments.filter(a => a.id !== aid) }
      : t));
  }
  function updateAssignment(tid: string, aid: string, field: 'time' | 'need', val: string | number) {
    setTasks(prev => prev.map(t => t.id === tid
      ? { ...t, assignments: t.assignments.map(a => a.id === aid ? { ...a, [field]: val } : a) }
      : t));
  }

  function handleSave() {
    if (!name.trim()) return;
    const builtTasks = tasks
      .filter(t => t.name.trim())
      .map(t => ({
        id: t.id,
        name: t.name.trim(),
        assignments: t.assignments
          .filter(a => a.time.trim())
          .map(a => ({ id: a.id, time: a.time.trim(), need: Math.max(1, Number(a.need) || 1), allocated: 0 })),
      }));
    onSave({ ...sector, name: name.trim(), location: location.trim(), tasks: builtTasks });
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative bg-[#02294D] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-xl flex flex-col max-h-[90vh]"
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(204,255,0,0.1)] flex-shrink-0">
          <h2 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase tracking-wide text-lg">
            {sector?.id ? 'Edit Sector' : 'New Sector'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#888888] hover:text-[#F2F2F2] transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Sector info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Sector Name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. River Collection" className="input w-full mt-1" />
            </div>
            <div>
              <label className="label">Location / Zone</label>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Riverfront West" className="input w-full mt-1" />
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label">Tasks &amp; Assignments</label>
              <button onClick={addTask}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#CCFF00] hover:bg-[rgba(255,255,255,0.08)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
                <Plus size={11} /> Add Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl">
                <p className="font-sans text-[#888888] text-xs">No tasks yet. Click "Add Task" to define work areas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, ti) => (
                  <div key={task.id} className="bg-[rgba(12,12,12,0.5)] border border-[rgba(204,255,0,0.1)] rounded-xl p-4 space-y-3">
                    {/* Task name row */}
                    <div className="flex items-center gap-2">
                      <input value={task.name} onChange={e => updateTaskName(task.id, e.target.value)}
                        placeholder={`Task ${ti + 1} name, e.g. Waste Collection Team A`}
                        className="input flex-1 text-sm" />
                      <button onClick={() => removeTask(task.id)}
                        className="p-2 rounded-lg border border-[rgba(252,165,165,0.15)] text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.08)] transition-colors flex-shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Assignments */}
                    <div className="space-y-2">
                      {task.assignments.map((asgn, ai) => (
                        <div key={asgn.id} className="flex items-center gap-2">
                          <input value={asgn.time} onChange={e => updateAssignment(task.id, asgn.id, 'time', e.target.value)}
                            placeholder="Time slot, e.g. 07:00–09:00"
                            className="input flex-1 text-xs h-9" />
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wide">Need</span>
                            <input type="number" min={1} max={500}
                              value={asgn.need} onChange={e => updateAssignment(task.id, asgn.id, 'need', parseInt(e.target.value) || 1)}
                              className="input w-16 text-xs h-9 text-center" />
                          </div>
                          {task.assignments.length > 1 && (
                            <button onClick={() => removeAssignment(task.id, asgn.id)}
                              className="p-2 rounded-lg border border-[rgba(252,165,165,0.12)] text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.08)] transition-colors flex-shrink-0">
                              <X size={11} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button onClick={() => addAssignment(task.id)}
                      className="text-[#CCFF00] hover:text-[#CCFF00] font-display font-bold text-[10px] uppercase tracking-wide transition-colors flex items-center gap-1">
                      <Plus size={10} /> Add Time Slot
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[rgba(204,255,0,0.1)] flex-shrink-0">
          <button onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={!name.trim()}
            className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-40">
            <Save size={14} /> Save Sector
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── SECTOR ROW ────────────────────────────────
function SectorRow({ sector, onEdit, onDelete }: {
  sector: Sector; onEdit: () => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const totalNeed  = sector.tasks.reduce((s, t) => s + t.assignments.reduce((ss, a) => ss + a.need, 0), 0);
  const totalAlloc = sector.tasks.reduce((s, t) => s + t.assignments.reduce((ss, a) => ss + a.allocated, 0), 0);
  const filled     = totalNeed > 0 && totalAlloc >= totalNeed;

  return (
    <div className="bg-[#141414] border border-[rgba(204,255,0,0.1)] rounded-2xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${filled ? 'bg-[#6EE07A]' : 'bg-[#FCD34D]'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide">{sector.name}</h3>
            {filled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(110,224,122,0.1)] border border-[rgba(110,224,122,0.3)] font-display font-bold text-[10px] uppercase text-[#6EE07A]">
                <CheckCircle size={9} /> Full
              </span>
            )}
          </div>
          <p className="font-sans text-[#888888] text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={10} />{sector.location}
          </p>
        </div>
        <FillBar need={totalNeed} allocated={totalAlloc} />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onEdit} className="p-2 rounded-lg border border-[rgba(255,255,255,0.07)] text-[#888888] hover:text-[#CCFF00] transition-colors">
            <Edit2 size={13} />
          </button>
          <button onClick={onDelete} className="p-2 rounded-lg border border-[rgba(252,165,165,0.12)] text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.08)] transition-colors">
            <Trash2 size={13} />
          </button>
          <button onClick={() => setOpen(o => !o)} className="p-2 rounded-lg border border-[rgba(255,255,255,0.07)] text-[#888888] hover:text-[#F2F2F2] transition-colors">
            <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tasks expand */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-[rgba(204,255,0,0.08)]">
            <div className="p-4 space-y-3">
              {sector.tasks.map(task => (
                <div key={task.id} className="bg-[rgba(204,255,0,0.04)] border border-[rgba(204,255,0,0.08)] rounded-xl p-3">
                  <p className="font-display font-bold text-[#CCFF00] text-xs uppercase tracking-wide mb-2">{task.name}</p>
                  <div className="space-y-2">
                    {task.assignments.map(asgn => (
                      <div key={asgn.id} className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[#888888] text-xs">{asgn.time}</span>
                        <FillBar need={asgn.need} allocated={asgn.allocated} />
                        <span className="font-mono text-[#888888] text-[10px] hidden sm:block">
                          {asgn.need} needed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════
export default function SectorManagerPage() {
  const { id: eventId = 'e1' } = useParams();
  const event = MOCK_EVENTS.find(e => e.id === eventId) ?? MOCK_EVENTS[0];

  const [sectors, setSectors]   = useState<Sector[]>(MOCK_SECTORS);
  const [modal, setModal]       = useState<Partial<Sector> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const totalNeed  = sectors.reduce((s, sec) => s + sec.tasks.reduce((ss, t) => ss + t.assignments.reduce((sss, a) => sss + a.need, 0), 0), 0);
  const totalAlloc = sectors.reduce((s, sec) => s + sec.tasks.reduce((ss, t) => ss + t.assignments.reduce((sss, a) => sss + a.allocated, 0), 0), 0);
  const totalTasks = sectors.reduce((s, sec) => s + sec.tasks.length, 0);

  function openNew() { setModal({ tasks: [] }); setShowModal(true); }
  function openEdit(s: Sector) { setModal(s); setShowModal(true); }
  function handleDelete(id: string) { setSectors(prev => prev.filter(s => s.id !== id)); }

  function handleSave(data: Partial<Sector>) {
    if (data.id) {
      setSectors(prev => prev.map(s => s.id === data.id ? { ...s, ...data, tasks: data.tasks ?? s.tasks } as Sector : s));
    } else {
      const newSector: Sector = {
        id: `s${Date.now()}`, name: data.name ?? '', location: data.location ?? '', tasks: data.tasks ?? [],
      };
      setSectors(prev => [...prev, newSector]);
    }
    setShowModal(false);
  }

  return (
    <div className="bg-[#0C0C0C] min-h-screen">
      <OrgHeader title="Sectors" eventId={eventId} eventTitle={event.title} />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Sectors',    value: sectors.length, color: '#CCFF00', icon: <Zap size={16} /> },
            { label: 'Tasks',      value: totalTasks,     color: '#CCFF00', icon: <Users size={16} /> },
            { label: 'Slots Need', value: `${totalAlloc}/${totalNeed}`, color: totalAlloc >= totalNeed ? '#6EE07A' : '#FCD34D', icon: <CheckCircle size={16} /> },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] border border-[rgba(204,255,0,0.1)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[#888888] text-[10px] uppercase tracking-[2px]">{s.label}</span>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <p className="font-display font-black leading-none" style={{ fontSize: 'clamp(22px,3vw,32px)', color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Header + add button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px]">Sectors & Tasks</p>
            <p className="font-sans text-[#888888] text-sm mt-0.5">Define volunteer work areas for this event</p>
          </div>
          <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus size={14} /> Add Sector
          </button>
        </div>

        {/* Sector list */}
        <div className="space-y-3">
          {sectors.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl">
              <Zap size={32} className="text-[#CCFF00] mx-auto mb-3 opacity-40" />
              <p className="font-display font-bold text-[#888888] text-sm uppercase tracking-wide mb-3">No sectors yet</p>
              <button onClick={openNew} className="btn-primary text-sm">Add First Sector</button>
            </div>
          ) : (
            sectors.map(s => (
              <SectorRow key={s.id} sector={s}
                onEdit={() => openEdit(s)}
                onDelete={() => handleDelete(s.id)} />
            ))
          )}
        </div>

        {/* Warning if any unfilled */}
        {totalNeed > totalAlloc && sectors.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-[rgba(252,211,77,0.06)] border border-[rgba(252,211,77,0.2)] rounded-xl">
            <AlertCircle size={16} className="text-[#FCD34D] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-bold text-[#FCD34D] text-sm uppercase tracking-wide">
                {totalNeed - totalAlloc} volunteer slots unfilled
              </p>
              <p className="font-sans text-[#888888] text-xs mt-0.5">
                Go to Allocations to assign approved volunteers to open slots.
              </p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <SectorModal sector={modal} onSave={handleSave} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}