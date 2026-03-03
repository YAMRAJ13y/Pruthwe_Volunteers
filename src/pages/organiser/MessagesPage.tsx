import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mail, MessageSquare, Users, CheckCircle, Clock,
  ChevronDown, Filter, Plus, Eye, AlertCircle, Megaphone,
} from 'lucide-react';
import { OrgHeader } from './OrgHeader';
import { MOCK_EVENTS, MOCK_REGISTRATIONS } from './_shared';

// ── MOCK SENT MESSAGES ────────────────────────
type SentMessage = {
  id:        string;
  subject:   string;
  body:      string;
  channel:   'email' | 'sms';
  audience:  string;
  sentAt:    string;
  delivered: number;
  opened:    number;
  total:     number;
};

const SENT_MESSAGES: SentMessage[] = [
  { id: 'm1', subject: 'You are confirmed for Sabarmati River Clean-Up!', body: 'Dear volunteer, your registration has been confirmed. Please report to Riverfront West at 06:30. Full mission plan attached.', channel: 'email', audience: 'All Approved', sentAt: 'Mar 5, 2026 · 10:14am', delivered: 47, opened: 38, total: 47 },
  { id: 'm2', subject: 'Reminder: Event is tomorrow — 15 March 2026',    body: 'Quick reminder that the Sabarmati River Clean-Up is tomorrow. Please bring gloves and wear old clothes. Assembly at 06:30.',       channel: 'email', audience: 'All Confirmed',  sentAt: 'Mar 14, 2026 · 9:00am',  delivered: 47, opened: 41, total: 47 },
  { id: 'm3', subject: 'SMS: Clean-Up tmrw 6:30am Riverfront West',       body: 'Pruthwee: River Clean-Up tmrw 6:30am Riverfront West. Bring gloves. Reply HELP for info.',                                             channel: 'sms',   audience: 'All Confirmed',  sentAt: 'Mar 14, 2026 · 9:05am',  delivered: 45, opened: 45, total: 47 },
];

const AUDIENCE_OPTIONS = [
  { id: 'all_approved',   label: 'All Approved Volunteers' },
  { id: 'all_confirmed',  label: 'All Confirmed Volunteers' },
  { id: 'all_pending',    label: 'All Pending Volunteers' },
  { id: 'all_registered', label: 'All Registered (Any Status)' },
  { id: 'sector_s1',      label: 'Sector: River Collection' },
  { id: 'sector_s2',      label: 'Sector: Logistics' },
  { id: 'sector_s3',      label: 'Sector: Medical Support' },
  { id: 'sector_s4',      label: 'Sector: Media & Photography' },
];

const TEMPLATES = [
  { id: 'confirm',  label: 'Registration Confirmed',   subject: 'You are confirmed for {event}!',                body: 'Dear {name},\n\nYour registration for {event} has been confirmed. Your assignment details will be sent separately.\n\nThank you for volunteering!\n\nPruthwe volunteers team' },
  { id: 'reminder', label: 'Day Before Reminder',       subject: 'Reminder: {event} is tomorrow!',                body: 'Dear {name},\n\nThis is a reminder that {event} is tomorrow. Please report on time to the assembly point. Check your mission plan for full details.\n\nSee you tomorrow!\n\nPruthwe volunteers team' },
  { id: 'thankyou', label: 'Post-Event Thank You',      subject: 'Thank you for volunteering at {event}!',        body: 'Dear {name},\n\nThank you for volunteering at {event}. Your hours have been logged and your certificate will be issued within 48 hours.\n\nWith gratitude,\nPruthwe volunteers team' },
  { id: 'custom',   label: 'Custom Message',            subject: '',                                               body: '' },
];

// ═════════════════════════════════════════════
export default function MessagesPage() {
  const { id } = useParams();
  const event  = MOCK_EVENTS.find(e => e.id === id) ?? MOCK_EVENTS[0];

  const [channel,    setChannel]    = useState<'email' | 'sms'>('email');
  const [audience,   setAudience]   = useState('all_approved');
  const [template,   setTemplate]   = useState('custom');
  const [subject,    setSubject]    = useState('');
  const [body,       setBody]       = useState('');
  const [preview,    setPreview]    = useState<SentMessage | null>(null);
  const [sending,    setSending]    = useState(false);
  const [sent,       setSent]       = useState(false);

  const approvedCount = MOCK_REGISTRATIONS.filter(r => r.status === 'approved').length;
  const confirmedCount = MOCK_REGISTRATIONS.filter(r => r.status === 'approved').length; // same in mock
  const audienceCount = audience === 'all_registered' ? MOCK_REGISTRATIONS.length : approvedCount;

  function loadTemplate(id: string) {
    const t = TEMPLATES.find(t => t.id === id)!;
    setTemplate(id);
    setSubject(t.subject.replace('{event}', event.title));
    setBody(t.body.replace(/\{event\}/g, event.title).replace(/\{name\}/g, '[Volunteer Name]'));
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  }

  return (
    <div className="bg-[#011C40] min-h-screen">
      <OrgHeader title="Messages" eventId={id ?? 'e1'} eventTitle={event.title} />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 space-y-6">

        {/* Page title */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
              Volunteer <span className="text-[#54ACBF]">Messaging</span>
            </h2>
            <p className="font-sans text-[#8BBFCC] text-sm mt-1">{event.title}</p>
          </div>
          <div className="flex items-center gap-2 bg-[rgba(84,172,191,0.06)] border border-[rgba(84,172,191,0.15)] rounded-xl px-4 py-2">
            <Users size={14} className="text-[#54ACBF]" />
            <span className="font-display font-bold text-[#A7EBF2] text-sm uppercase tracking-wide">{MOCK_REGISTRATIONS.length} volunteers</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">

          {/* ── COMPOSE FORM ── */}
          <div className="space-y-5">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-[rgba(110,224,122,0.06)] border border-[rgba(110,224,122,0.25)] rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">📬</div>
                <h3 className="font-display font-black text-[#6EE07A] text-2xl uppercase tracking-wide mb-2">Message Sent!</h3>
                <p className="font-sans text-[#8BBFCC] text-sm mb-2">
                  Your {channel.toUpperCase()} was dispatched to {audienceCount} volunteers.
                </p>
                <p className="font-mono text-[#54ACBF] text-xs">{new Date().toLocaleString()}</p>
                <button onClick={() => { setSent(false); setSubject(''); setBody(''); setTemplate('custom'); }}
                  className="btn-outline mt-6 text-xs px-6">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSend} className="space-y-5">
                {/* Channel picker */}
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5">
                  <label className="label mb-3 block">Channel</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['email', 'sms'] as const).map(ch => (
                      <button key={ch} type="button" onClick={() => setChannel(ch)}
                        className={`flex items-center gap-3 p-4 rounded-xl border font-display font-bold text-sm uppercase tracking-wide transition-all ${
                          channel === ch
                            ? 'bg-[rgba(84,172,191,0.12)] border-[#54ACBF] text-[#A7EBF2]'
                            : 'border-[rgba(84,172,191,0.12)] text-[#8BBFCC] hover:border-[rgba(84,172,191,0.3)]'
                        }`}>
                        {ch === 'email' ? <Mail size={18} /> : <MessageSquare size={18} />}
                        {ch.toUpperCase()}
                        {channel === ch && <CheckCircle size={14} className="ml-auto text-[#6EE07A]" />}
                      </button>
                    ))}
                  </div>
                  {channel === 'sms' && (
                    <p className="font-sans text-[#FCD34D] text-xs mt-3 flex items-center gap-1.5">
                      <AlertCircle size={12} /> SMS limited to 160 chars. Up to 70% discount applies via Communication Measures.
                    </p>
                  )}
                </div>

                {/* Audience */}
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5">
                  <label className="label mb-3 block">Audience</label>
                  <div className="relative">
                    <select className="input appearance-none cursor-pointer pr-8"
                      value={audience} onChange={e => setAudience(e.target.value)}>
                      {AUDIENCE_OPTIONS.map(o => (
                        <option key={o.id} value={o.id}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
                  </div>
                  <p className="font-sans text-[#54ACBF] text-xs mt-2">
                    → <span className="font-bold text-[#A7EBF2]">{audienceCount}</span> volunteers will receive this message.
                  </p>
                </div>

                {/* Template picker */}
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5">
                  <label className="label mb-3 block">Template</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATES.map(t => (
                      <button key={t.id} type="button" onClick={() => loadTemplate(t.id)}
                        className={`px-3 py-2 rounded-lg border text-left font-display font-bold text-xs uppercase tracking-wide transition-all ${
                          template === t.id
                            ? 'bg-[rgba(84,172,191,0.12)] border-[#54ACBF] text-[#A7EBF2]'
                            : 'border-[rgba(84,172,191,0.12)] text-[#8BBFCC] hover:border-[rgba(84,172,191,0.25)]'
                        }`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compose */}
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5 space-y-4">
                  <label className="label">Compose Message</label>
                  {channel === 'email' && (
                    <div>
                      <label className="label text-[10px]">Subject Line</label>
                      <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                        placeholder="Email subject..." required={channel === 'email'} className="input" />
                    </div>
                  )}
                  <div>
                    <label className="label text-[10px]">Message Body</label>
                    <textarea value={body} onChange={e => setBody(e.target.value)}
                      rows={channel === 'email' ? 8 : 3}
                      placeholder={channel === 'sms' ? 'SMS text (160 chars max)...' : 'Email body...'}
                      maxLength={channel === 'sms' ? 160 : undefined}
                      required className="input resize-none" />
                    {channel === 'sms' && (
                      <p className={`font-mono text-xs mt-1 text-right ${body.length > 140 ? 'text-[#FCA5A5]' : 'text-[#54ACBF]'}`}>
                        {body.length}/160
                      </p>
                    )}
                  </div>
                  <p className="font-sans text-[#8BBFCC] text-xs">
                    Use <span className="font-mono text-[#A7EBF2]">{'{name}'}</span> to personalise with each volunteer's name.
                  </p>
                </div>

                <button type="submit" disabled={!body || sending}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                  {sending
                    ? <><RefreshCwIcon /> Sending...</>
                    : <><Send size={16} /> Send to {audienceCount} Volunteers</>}
                </button>
              </form>
            )}
          </div>

          {/* ── SENT HISTORY ── */}
          <div className="space-y-4">
            <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide">
              Sent History
            </h3>

            {SENT_MESSAGES.map(msg => (
              <div key={msg.id}
                className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl p-4 hover:border-[rgba(84,172,191,0.25)] transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.channel === 'email' ? 'bg-[rgba(84,172,191,0.1)]' : 'bg-[rgba(196,181,253,0.1)]'}`}>
                    {msg.channel === 'email' ? <Mail size={14} className="text-[#54ACBF]" /> : <MessageSquare size={14} className="text-[#C4B5FD]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-[#F0FAFB] text-xs uppercase tracking-wide leading-tight line-clamp-2">
                      {msg.subject}
                    </p>
                    <p className="font-mono text-[#54ACBF] text-[10px] mt-1">{msg.sentAt}</p>
                  </div>
                </div>

                {/* Delivery stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Sent',      value: msg.total,     color: '#A7EBF2' },
                    { label: 'Delivered', value: msg.delivered, color: '#6EE07A' },
                    { label: 'Opened',    value: msg.opened,    color: '#FCD34D' },
                  ].map(s => (
                    <div key={s.label} className="text-center bg-[rgba(1,28,64,0.4)] rounded-lg py-2">
                      <div className="font-display font-black text-base leading-none" style={{ color: s.color }}>{s.value}</div>
                      <div className="font-mono text-[#8BBFCC] text-[9px] uppercase tracking-[1px] mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setPreview(msg)}
                  className="flex items-center gap-1.5 font-display font-bold text-[#54ACBF] text-[10px] uppercase tracking-wide hover:text-[#A7EBF2] transition-colors">
                  <Eye size={11} /> View Message
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[rgba(1,28,64,0.92)] backdrop-blur-sm flex items-center justify-center p-5"
            onClick={() => setPreview(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#023859] border border-[rgba(84,172,191,0.25)] rounded-2xl p-7 max-w-lg w-full"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide">Message Preview</h3>
                <button onClick={() => setPreview(null)} className="text-[#8BBFCC] hover:text-[#FCA5A5] transition-colors text-xl leading-none">×</button>
              </div>
              {preview.channel === 'email' && (
                <div className="mb-3 pb-3 border-b border-[rgba(84,172,191,0.1)]">
                  <span className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px]">Subject: </span>
                  <span className="font-sans text-[#F0FAFB] text-sm">{preview.subject}</span>
                </div>
              )}
              <pre className="font-sans text-[#8BBFCC] text-sm leading-relaxed whitespace-pre-wrap">{preview.body}</pre>
              <div className="mt-4 pt-4 border-t border-[rgba(84,172,191,0.1)] flex items-center gap-3">
                <span className="font-mono text-[#54ACBF] text-[10px] tracking-wider">{preview.sentAt}</span>
                <span className="font-mono text-[#8BBFCC] text-[10px]">→ {preview.audience}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RefreshCwIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
}