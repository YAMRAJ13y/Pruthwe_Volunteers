import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '../../constants';

const DISCOVER_LINKS = [
  { label: 'Events', to: '/events' },
  // Summit link kept for future release
  // { label: 'Summit 2026', to: '/summit-2026' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'News & Blog', to: '/news' },
  { label: 'Newsletter', to: '/newsletter' },
];

const ORGANISATION_LINKS = [
  { label: 'About Pruthwee', to: '/about' },
  { label: 'Partners', to: '/partners' },
  { label: 'Contact', to: '/contact' },
  { label: 'For Volunteers', to: '/for-volunteers' },
  { label: 'For Organisers', to: '/for-organisers' },
];

const PORTAL_LINKS = [
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'My Assignments', to: '/dashboard/assignments' },
  { label: 'My Certificates', to: '/dashboard/certificates' },
  { label: 'My Groups', to: '/dashboard/groups' },
  { label: 'My Profile', to: '/profile' },
];

const socialItems = [
  { label: 'Instagram', href: SOCIAL_LINKS.instagram, icon: Instagram },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: Linkedin },
  { label: 'YouTube', href: SOCIAL_LINKS.youtube, icon: Youtube },
  { label: 'WhatsApp', href: SOCIAL_LINKS.whatsapp, icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer className="bg-[#0C0C0C] border-t border-[rgba(204,255,0,0.1)]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 w-fit mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#888800] flex items-center justify-center">
                <span className="text-[#0C0C0C] font-display font-black text-base">P</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-[#F2F2F2] tracking-wide">PRUTHWEE</span>
                <span className="font-mono text-[#CCFF00] text-[9px] tracking-[3px] uppercase">Volunteers</span>
              </div>
            </Link>

            <p className="font-sans text-[#888888] text-sm mb-5">India's structured volunteer platform</p>

            <div className="flex items-center gap-2.5 mb-5">
              {socialItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#F2F2F2] hover:border-[rgba(204,255,0,0.45)] flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            <p className="font-sans text-[#888888] text-sm">© 2026 Pruthwe volunteers trust</p>
          </div>

          <div>
            <h3 className="font-display font-black text-[#CCFF00] uppercase tracking-[2px] text-xs mb-4">Discover</h3>
            <ul className="space-y-2.5">
              {DISCOVER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="font-sans text-[#888888] text-sm hover:text-[#F2F2F2] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-black text-[#CCFF00] uppercase tracking-[2px] text-xs mb-4">Organisation</h3>
            <ul className="space-y-2.5">
              {ORGANISATION_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="font-sans text-[#888888] text-sm hover:text-[#F2F2F2] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-black text-[#CCFF00] uppercase tracking-[2px] text-xs mb-4">Volunteer Portal</h3>
            <ul className="space-y-2.5">
              {PORTAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="font-sans text-[#888888] text-sm hover:text-[#F2F2F2] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(204,255,0,0.1)]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link to="/contact" className="font-sans text-[#888888] text-sm hover:text-[#F2F2F2] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="font-sans text-[#888888] text-sm hover:text-[#F2F2F2] transition-colors">
              Terms of Use
            </Link>
          </div>
          {/* Made with Gujarat line kept for future use */}
          {/* <p className="font-sans text-[#888888] text-sm">Made with ♥ in Gujarat, India</p> */}
        </div>
      </div>
    </footer>
  );
}