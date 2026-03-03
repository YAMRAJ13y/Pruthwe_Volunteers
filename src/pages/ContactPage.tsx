import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube, MessageCircle, ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';
import { CONTACT, SOCIAL_LINKS } from '../constants';

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

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Volunteer Support',
  'Organiser / Partnership',
  'Press & Media',
  'Technical Support',
  'Summit 2026',
  'Sponsorship',
  'Other',
];

const FAQ = [
  {
    q: 'How do I register as a volunteer?',
    a: 'Click "Register Free" in the top right corner. Fill in your profile with skills, city, and availability. Registration takes under 2 minutes and is completely free.',
  },
  {
    q: 'I want to host an event. How do I get started?',
    a: 'Register as an organiser using the "For Organisers" form. Once your organisation is verified, you can create events using our 10-step wizard. Contact us at organiser@pruthwee.org for a walkthrough.',
  },
  {
    q: 'How long does it take to get a response?',
    a: 'We aim to respond to all enquiries within 24–48 business hours. Press and partnership enquiries are prioritised.',
  },
  {
    q: 'Can I visit the Pruthwee office?',
    a: 'Yes — our office in Ahmedabad is open Monday to Friday, 10am to 6pm. Please email us in advance to schedule a visit.',
  },
  {
    q: 'I am a journalist covering volunteering. Who do I contact?',
    a: 'Email press@pruthwee.org with your publication, story angle, and deadline. We will connect you with the right person.',
  },
];

// ═════════════════════════════════════════════
//  CONTACT PAGE
// ═════════════════════════════════════════════
export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', type: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.email && form.message) setSubmitted(true);
  }

  const contactCards = [
    {
      icon: <Mail size={22} className="text-[#54ACBF]" />,
      label: 'General',
      value: CONTACT.email,
      href:  `mailto:${CONTACT.email}`,
    },
    {
      icon: <Phone size={22} className="text-[#54ACBF]" />,
      label: 'Phone',
      value: CONTACT.phone,
      href:  `tel:${CONTACT.phone}`,
    },
    {
      icon: <MapPin size={22} className="text-[#54ACBF]" />,
      label: 'Address',
      value: CONTACT.address,
      href:  CONTACT.maps,
    },
  ];

  const socialLinks = [
    { icon: <Instagram size={19} />, label: 'Instagram', href: SOCIAL_LINKS.instagram, color: '#E1306C' },
    { icon: <Linkedin  size={19} />, label: 'LinkedIn',  href: SOCIAL_LINKS.linkedin,  color: '#0A66C2' },
    { icon: <Youtube   size={19} />, label: 'YouTube',   href: SOCIAL_LINKS.youtube,   color: '#FF0000' },
    { icon: <MessageCircle size={19} />, label: 'WhatsApp', href: SOCIAL_LINKS.whatsapp, color: '#25D366' },
  ];

  return (
    <div className="bg-[#011C40] overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40]" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Reach Out</span>
            <h1
              className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(52px, 9vw, 110px)' }}
            >
              Get in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]">
                Touch
              </span>
            </h1>
            <p className="font-sans text-[#8BBFCC] text-lg max-w-xl">
              Questions, partnerships, press, or just want to say hello —
              we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN GRID ── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12">

            {/* LEFT — Contact form */}
            <SR>
              {submitted ? (
                <div className="bg-[rgba(110,224,122,0.06)] border border-[rgba(110,224,122,0.25)] rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="text-5xl mb-5">✉️</div>
                  <h3 className="font-display font-black text-[#6EE07A] text-3xl uppercase tracking-wide mb-3">
                    Message Sent!
                  </h3>
                  <p className="font-sans text-[#8BBFCC] text-base max-w-sm">
                    Thank you for reaching out. We will get back to you within 24–48 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', type: '', subject: '', message: '' }); }}
                    className="btn-outline mt-6 text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.15)] rounded-2xl p-8">
                  <h2 className="font-display font-black text-[#F0FAFB] text-2xl uppercase tracking-wide mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label">Full Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                          required
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Email *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="your@email.com"
                          required
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+91 XXXXX XXXXX"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Enquiry Type</label>
                        <div className="relative">
                          <select
                            value={form.type}
                            onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                            className="input appearance-none cursor-pointer"
                          >
                            <option value="">Select type...</option>
                            {ENQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="label">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        placeholder="Brief subject line"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        rows={5}
                        placeholder="Tell us how we can help..."
                        required
                        className="input resize-none"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                      Send Message <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              )}
            </SR>

            {/* RIGHT — Contact info */}
            <div className="space-y-5">

              {/* Contact cards */}
              <SR delay={0.1}>
                <div className="space-y-3">
                  {contactCards.map((card) => (
                    <a
                      key={card.label}
                      href={card.href}
                      target={card.label === 'Address' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl p-5 hover:border-[rgba(84,172,191,0.35)] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[rgba(84,172,191,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(84,172,191,0.15)] transition-colors">
                        {card.icon}
                      </div>
                      <div>
                        <div className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[2px] mb-0.5">
                          {card.label}
                        </div>
                        <div className="font-sans text-[#F0FAFB] text-sm leading-snug group-hover:text-[#A7EBF2] transition-colors">
                          {card.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </SR>

              {/* Dept emails */}
              <SR delay={0.15}>
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl p-5">
                  <h3 className="font-display font-black text-[#A7EBF2] text-sm uppercase tracking-[2px] mb-4">
                    Department Contacts
                  </h3>
                  <div className="space-y-3">
                    {[
                      { dept: 'Volunteers',    email: 'volunteers@pruthwee.org' },
                      { dept: 'Organisers',    email: 'organiser@pruthwee.org'  },
                      { dept: 'Partnerships',  email: 'partners@pruthwee.org'   },
                      { dept: 'Press & Media', email: 'press@pruthwee.org'      },
                      { dept: 'Summit 2026',   email: 'summit@pruthwee.org'     },
                    ].map((d) => (
                      <div key={d.dept} className="flex items-center justify-between">
                        <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide">
                          {d.dept}
                        </span>
                        <a
                          href={`mailto:${d.email}`}
                          className="font-mono text-[#54ACBF] text-xs hover:text-[#A7EBF2] transition-colors"
                        >
                          {d.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </SR>

              {/* Social links */}
              <SR delay={0.2}>
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl p-5">
                  <h3 className="font-display font-black text-[#A7EBF2] text-sm uppercase tracking-[2px] mb-4">
                    Follow Us
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[rgba(84,172,191,0.12)] hover:border-[rgba(84,172,191,0.35)] transition-all group"
                      >
                        <span className="text-[#8BBFCC] group-hover:text-[#A7EBF2] transition-colors">
                          {s.icon}
                        </span>
                        <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide group-hover:text-[#A7EBF2] transition-colors">
                          {s.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </SR>

              {/* Office hours */}
              <SR delay={0.25}>
                <div className="bg-[rgba(84,172,191,0.05)] border border-[rgba(84,172,191,0.15)] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#6EE07A] animate-pulse" />
                    <span className="font-display font-bold text-[#6EE07A] text-xs uppercase tracking-[2px]">
                      Office Hours
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { days: 'Mon – Fri', time: '10:00 AM – 6:00 PM' },
                      { days: 'Saturday',  time: '10:00 AM – 2:00 PM' },
                      { days: 'Sunday',    time: 'Closed'              },
                    ].map((row) => (
                      <div key={row.days} className="flex justify-between">
                        <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide">{row.days}</span>
                        <span className="font-sans text-[#8BBFCC] text-xs">{row.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SR>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#023859] border-t border-[rgba(84,172,191,0.1)]">
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <SR>
            <div className="text-center mb-12">
              <span className="section-label">Quick Answers</span>
              <h2
                className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
              >
                Common{' '}
                <span className="text-[#54ACBF]">Questions</span>
              </h2>
            </div>
          </SR>

          <SR delay={0.1}>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-xl overflow-hidden hover:border-[rgba(84,172,191,0.25)] transition-colors"
                >
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide leading-tight">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#54ACBF] flex-shrink-0 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: faqOpen === i ? 'auto' : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-[rgba(84,172,191,0.1)]">
                      <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed pt-4">{item.a}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </SR>
        </div>
      </section>
    </div>
  );
}