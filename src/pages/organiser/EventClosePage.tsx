import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, AlertCircle, Clock, Award, Download,
  ChevronDown, ArrowRight, FileText, Users, Zap,
} from 'lucide-react';
import { OrgHeader } from './OrgHeader';
import { MOCK_EVENTS, MOCK_REGISTRATIONS, MOCK_SECTORS } from './_shared';

type AttendanceRow = {
  regId:   string;
  name:    string;
  sector:  string;
  task:    string;
  time:    string;
  planned: number;
  actual:  number;
  attended:boolean;
};

function buildRows(): AttendanceRow[] {
  const approved = MOCK_REGISTRATIONS.filter(r => r.status === 'approved');
  return approved.map((r, i) => {
    const sector = MOCK_SECTORS[i % MOCK_SECTORS.length];
    const task   = sector.tasks[0];
    const asgn   = task.assignments[0];
    return {
      regId:    r.id,
      name:     r.name,
      sector:   sector.name,
      task:     task.name,
      time:     asgn.time,
      planned:  5,
      actual:   5,
      attended: true,
    };
  });
}

const CLOSE_STEPS = [
  { id: 1, label: 'Mark Attendance',  icon: <Users size={16} />,   color: '#A7EBF2' },
  { id: 2, label: 'Log Hours',        icon: <Clock size={16} />,   color: '#54ACBF' },
  { id: 3, label: 'Issue Certs',      icon: <Award size={16} />,   color: '#FCD34D' },
  { id: 4, label: 'Close Event',      icon: <CheckCircle size={16}/>,color: '#6EE07A' },
];

// ═════════════════════════════════════════════
export default function EventClosePage() {
  const { id } = useParams();
  const event  = MOCK_EVENTS.find(e => e.id === id) ?? MOCK_EVENTS[0];

  const [step,       setStep]       = useState(1);
  const [rows,       setRows]       = useState<AttendanceRow[]>(buildRows);
  const [certsIssued, setCertsIssued] = useState(false);
  const [closed,      setClosed]      = useState(false);
  const [notes,       setNotes]       = useState('');

  function toggleAttended(regId: string) {
    setRows(prev => prev.map(r => r.regId === regId ? { ...r, attended: !r.attended } : r));
  }

  function setActualHours(regId: string, val: number) {
    setRows(prev => prev.map(r => r.regId === regId ? { ...r, actual: val } : r));
  }

  const attended = rows.filter(r => r.attended);
  const totalHours = attended.reduce((s, r) => s + r.actual, 0);

  return (
    <div className="bg-[#011C40] min-h-screen">
      <OrgHeader title="Close Event" eventId={id ?? 'e1'} eventTitle={event.title} />

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-8 space-y-8">

        {/* Page title */}
        <div>
          <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
            style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
            Close <span className="text-[#54ACBF]">Event</span>
          </h2>
          <p className="font-sans text-[#8BBFCC] text-sm mt-1">{event.title}</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-0">
          {CLOSE_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button onClick={() => step > s.id - 1 && setStep(s.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all flex-shrink-0 ${
                  step === s.id
                    ? 'border-current text-current'
                    : step > s.id
                    ? 'border-[rgba(110,224,122,0.4)] text-[#6EE07A] bg-[rgba(110,224,122,0.06)]'
                    : 'border-[rgba(84,172,191,0.12)] text-[#8BBFCC]'
                }`}
                style={step === s.id ? { color: s.color, borderColor: s.color, background: `${s.color}12` } : {}}>
                {step > s.id ? <CheckCircle size={14} className="text-[#6EE07A]" /> : s.icon}
                <span className="hidden sm:block">{s.label}</span>
                <span className="sm:hidden">{s.id}</span>
              </button>
              {i < CLOSE_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${step > s.id ? 'bg-[#6EE07A]' : 'bg-[rgba(84,172,191,0.15)]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: ATTENDANCE ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">Mark Attendance</h3>
                <p className="font-sans text-[#8BBFCC] text-sm mt-1">
                  {attended.length} / {rows.length} volunteers marked as attended.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setRows(p => p.map(r => ({ ...r, attended: true })))}
                  className="btn-outline text-xs py-2 px-3">Mark All</button>
                <button onClick={() => setRows(p => p.map(r => ({ ...r, attended: false })))}
                  className="text-xs py-2 px-3 rounded-lg border border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:text-[#FCA5A5] transition-colors">Clear All</button>
              </div>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {rows.map(row => (
                <div key={row.regId}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
                    row.attended
                      ? 'bg-[rgba(110,224,122,0.06)] border-[rgba(110,224,122,0.2)]'
                      : 'bg-[rgba(1,28,64,0.5)] border-[rgba(84,172,191,0.08)]'
                  }`}>
                  <button onClick={() => toggleAttended(row.regId)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      row.attended ? 'bg-[#6EE07A] border-[#6EE07A]' : 'border-[rgba(84,172,191,0.4)] hover:border-[#54ACBF]'
                    }`}>
                    {row.attended && <CheckCircle size={12} className="text-[#011C40]" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">{row.name}</p>
                    <p className="font-sans text-[#8BBFCC] text-xs">{row.sector} · {row.task} · {row.time}</p>
                  </div>
                  <span className={`font-mono text-xs tracking-wide ${row.attended ? 'text-[#6EE07A]' : 'text-[#8BBFCC]'}`}>
                    {row.attended ? '✓ Attended' : '— Absent'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setStep(2)} className="btn-primary px-8 py-3 text-sm flex items-center gap-2">
                Next: Log Hours <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: HOURS ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">Log Hours</h3>
              <p className="font-sans text-[#8BBFCC] text-sm mt-1">
                Set actual hours for each volunteer who attended. Total: <span className="text-[#6EE07A] font-bold">{totalHours}h</span>
              </p>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {attended.map(row => (
                <div key={row.regId} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.1)]">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">{row.name}</p>
                    <p className="font-sans text-[#8BBFCC] text-xs">{row.sector} · {row.time}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-sans text-[#8BBFCC] text-xs">Planned: {row.planned}h</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setActualHours(row.regId, Math.max(0, row.actual - 0.5))}
                        className="w-6 h-6 rounded bg-[rgba(84,172,191,0.1)] text-[#54ACBF] hover:bg-[rgba(84,172,191,0.2)] transition-colors font-bold text-sm">−</button>
                      <span className="font-display font-black text-[#A7EBF2] text-base w-10 text-center">{row.actual}h</span>
                      <button onClick={() => setActualHours(row.regId, row.actual + 0.5)}
                        className="w-6 h-6 rounded bg-[rgba(84,172,191,0.1)] text-[#54ACBF] hover:bg-[rgba(84,172,191,0.2)] transition-colors font-bold text-sm">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="btn-outline text-xs py-2.5 px-5">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary px-8 py-3 text-sm flex items-center gap-2">
                Next: Issue Certificates <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: CERTIFICATES ── */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">Issue Certificates</h3>
              <p className="font-sans text-[#8BBFCC] text-sm mt-1">
                {attended.length} certificates will be generated and sent to volunteers.
              </p>
            </div>

            {/* Certificate preview */}
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6">
              <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-4">Certificate Preview</p>
              <div className="bg-[#011C40] border-2 border-[rgba(84,172,191,0.3)] rounded-xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[rgba(84,172,191,0.3)]" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[rgba(84,172,191,0.3)]" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[rgba(84,172,191,0.3)]" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[rgba(84,172,191,0.3)]" />
                <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[3px] mb-1">Pruthwe volunteers trust</p>
                <p className="font-display font-black text-[#8BBFCC] text-xs uppercase tracking-[3px] mb-4">Certificate of Participation</p>
                <p className="font-sans text-[#8BBFCC] text-sm mb-1">This certifies that</p>
                <p className="font-display font-black text-[#F0FAFB] text-2xl uppercase mb-1">[Volunteer Name]</p>
                <p className="font-sans text-[#8BBFCC] text-sm mb-1">has successfully volunteered at</p>
                <p className="font-display font-black text-[#A7EBF2] text-lg uppercase mb-1">{event.title}</p>
                <p className="font-sans text-[#8BBFCC] text-xs">Organised by Paryavaran Trust · {event.date}</p>
              </div>
            </div>

            {/* Cert options */}
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5 space-y-3">
              <p className="font-display font-black text-[#A7EBF2] text-xs uppercase tracking-[2px]">Certificate Options</p>
              {[
                { label: 'Include volunteer hours on certificate', checked: true },
                { label: 'Include sector and task assignment',     checked: true },
                { label: 'Send certificate via email immediately', checked: true },
                { label: 'Also push to volunteer dashboard',      checked: true },
              ].map((opt, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <div className="w-4 h-4 rounded border-2 border-[#54ACBF] bg-[rgba(84,172,191,0.1)] flex items-center justify-center flex-shrink-0">
                    {opt.checked && <CheckCircle size={10} className="text-[#54ACBF]" />}
                  </div>
                  <span className="font-sans text-[#8BBFCC] text-sm">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} className="btn-outline text-xs py-2.5 px-5">← Back</button>
              <button onClick={() => { setCertsIssued(true); setStep(4); }}
                className="btn-primary px-8 py-3 text-sm flex items-center gap-2">
                <Award size={15} /> Issue {attended.length} Certificates <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: CLOSE ── */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">Close Event</h3>
              <p className="font-sans text-[#8BBFCC] text-sm mt-1">Final review before permanently closing this event.</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Attended',      value: attended.length,   color: '#6EE07A' },
                { label: 'Total Hours',   value: `${totalHours}h`,  color: '#A7EBF2' },
                { label: 'Certs Issued',  value: certsIssued ? attended.length : 0, color: '#FCD34D' },
                { label: 'Absent',        value: rows.length - attended.length, color: '#FCA5A5' },
              ].map(s => (
                <div key={s.label} className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 text-center">
                  <div className="font-display font-black leading-none mb-1"
                    style={{ fontSize: 28, color: s.color }}>{s.value}</div>
                  <div className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase tracking-[2px]">{s.label}</div>
                </div>
              ))}
            </div>

            <div>
              <label className="label mb-2 block">Closing Notes (Optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                rows={3} placeholder="Any notes about how the event went, issues, or feedback for the Pruthwee team..."
                className="input resize-none" />
            </div>

            {closed ? (
              <div className="bg-[rgba(110,224,122,0.08)] border border-[rgba(110,224,122,0.3)] rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-display font-black text-[#6EE07A] text-2xl uppercase tracking-wide mb-2">Event Closed!</h3>
                <p className="font-sans text-[#8BBFCC] text-sm mb-5">
                  Hours logged, certificates issued, event status updated to Closed.
                </p>
                <Link to="/organiser/dashboard" className="btn-primary inline-flex">
                  Back to Dashboard <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="flex justify-between pt-2">
                <button onClick={() => setStep(3)} className="btn-outline text-xs py-2.5 px-5">← Back</button>
                <button onClick={() => setClosed(true)}
                  className="bg-[#6EE07A] text-[#011C40] font-display font-black text-sm uppercase tracking-wide px-8 py-3 rounded-xl flex items-center gap-2 hover:brightness-110 transition-all">
                  <CheckCircle size={15} /> Confirm & Close Event
                </button>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}