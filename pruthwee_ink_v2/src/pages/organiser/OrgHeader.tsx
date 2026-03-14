import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight } from 'lucide-react';

interface OrgHeaderProps {
  title: string;
  eventId: string;
  eventTitle: string;
}

const NAV_ITEMS = [
  { label: 'Sectors', path: 'sectors' },
  { label: 'Registrations', path: 'registrations' },
  { label: 'Allocations', path: 'allocations' },
  { label: 'Messages', path: 'messages' },
  { label: 'Groups', path: 'groups' },
  { label: 'Close', path: 'close' },
] as const;

export function OrgHeader({ title, eventId, eventTitle }: OrgHeaderProps) {
  return (
    <div className="bg-[#0C0C0C] border-b border-[rgba(255,255,255,0.07)] sticky top-[72px] z-30">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link to="/organiser/dashboard" className="font-sans text-[#888888] hover:text-[#F2F2F2] transition-colors">
            Organiser Dashboard
          </Link>
          <ChevronRight size={12} className="text-[#CCFF00]" />
          <span className="font-sans text-[#CCFF00]">{eventTitle}</span>
          <ChevronRight size={12} className="text-[#CCFF00]" />
          <span className="font-sans text-[#CCFF00]">{title}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px]">Event Workspace</p>
            <h1 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase tracking-wide text-lg line-clamp-1">{eventTitle}</h1>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={`/organiser/events/${eventId}/${item.path}`}
                className="flex-shrink-0 px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#888888] hover:text-[#F2F2F2] hover:border-[rgba(204,255,0,0.35)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={`/events/${eventId}`}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#F2F2F2] transition-colors font-display font-bold text-[10px] uppercase tracking-wide"
            >
              <CalendarDays size={12} />
              Public Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
