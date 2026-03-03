/**
 * Skeleton loaders for Events, Dashboard, and News pages.
 *
 * Usage:
 *   import { EventsPageSkeleton, DashboardSkeleton, NewsPageSkeleton } from '../components/ui/Skeletons';
 *
 *   const [loading, setLoading] = useState(true);
 *   useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);
 *   if (loading) return <EventsPageSkeleton />;
 */

// ── BASE SHIMMER BLOCK ─────────────────────────
function Sk({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton rounded-xl ${className}`} style={style} />;
}

// ── PULSE DOT (for badges) ─────────────────────
function SkBadge({ w = 60 }: { w?: number }) {
  return <Sk className="h-5 rounded-full" style={{ width: w }} />;
}

// ═════════════════════════════════════════════
//  EVENTS PAGE SKELETON
// ═════════════════════════════════════════════
function EventCardSk() {
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl overflow-hidden">
      {/* Banner */}
      <Sk className="h-44 w-full rounded-none" />
      {/* Content */}
      <div className="p-5 space-y-3">
        <Sk className="h-3 w-20" />
        <Sk className="h-5 w-4/5" />
        <Sk className="h-4 w-3/5" />
        <div className="flex items-center gap-2 pt-1">
          <Sk className="h-3 w-16" />
          <Sk className="h-3 w-16" />
        </div>
        <div className="pt-2 border-t border-[rgba(84,172,191,0.08)] flex justify-between items-center">
          <Sk className="h-3 w-24" />
          <Sk className="h-1.5 flex-1 mx-4 rounded-full" />
          <Sk className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

function FeaturedCardSk() {
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.15)] rounded-2xl overflow-hidden">
      <Sk className="h-52 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <SkBadge w={50} />
          <SkBadge w={80} />
        </div>
        <Sk className="h-6 w-4/5" />
        <div className="flex gap-3">
          <Sk className="h-3 w-20" />
          <Sk className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function EventsPageSkeleton() {
  return (
    <div className="bg-[#011C40] min-h-screen">
      {/* Hero bar */}
      <div className="bg-[#023859] border-b border-[rgba(84,172,191,0.1)] py-12 px-5 md:px-10">
        <div className="max-w-7xl mx-auto space-y-4">
          <Sk className="h-4 w-28" />
          <Sk className="h-10 w-80" />
          <Sk className="h-4 w-56" />
          {/* Search bar */}
          <div className="flex gap-3 mt-6">
            <Sk className="h-12 flex-1 max-w-lg" />
            <Sk className="h-12 w-28" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        {/* Filter chips */}
        <div className="flex gap-2 mb-8 overflow-hidden">
          {[80, 100, 90, 110, 75, 95].map((w, i) => (
            <SkBadge key={i} w={w} />
          ))}
        </div>

        {/* Featured row */}
        <div className="mb-3">
          <Sk className="h-4 w-32 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map(i => <FeaturedCardSk key={i} />)}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-[rgba(84,172,191,0.08)]" />

        {/* All events label */}
        <div className="flex items-center justify-between mb-5">
          <Sk className="h-4 w-24" />
          <Sk className="h-4 w-32" />
        </div>

        {/* Event grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <EventCardSk key={i} />)}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
//  DASHBOARD SKELETON
// ═════════════════════════════════════════════
function StatCardSk() {
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Sk className="h-3 w-20" />
        <Sk className="w-8 h-8 rounded-xl" />
      </div>
      <Sk className="h-8 w-16" />
      <Sk className="h-2 w-full rounded-full" />
    </div>
  );
}

function AssignmentCardSk() {
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl overflow-hidden flex">
      <Sk className="w-24 flex-shrink-0 rounded-none" />
      <div className="flex-1 p-4 space-y-2">
        <Sk className="h-3 w-20" />
        <Sk className="h-5 w-3/4" />
        <Sk className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Sk className="h-4 w-16 rounded-full" />
          <Sk className="h-4 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="bg-[#011C40] min-h-screen">
      {/* Header band */}
      <div className="bg-[#02294D] border-b border-[rgba(84,172,191,0.1)] px-5 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Sk className="w-14 h-14 rounded-xl flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Sk className="h-3 w-20" />
              <Sk className="h-7 w-48" />
              <div className="flex gap-2">
                <SkBadge w={70} />
                <SkBadge w={90} />
              </div>
            </div>
            {/* Tier progress */}
            <div className="hidden md:block w-56 space-y-2">
              <div className="flex justify-between">
                <Sk className="h-3 w-20" />
                <Sk className="h-3 w-12" />
              </div>
              <Sk className="h-2 w-full rounded-full" />
              <Sk className="h-3 w-28" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-10 py-8">
        {/* Stat cards */}
        <Sk className="h-4 w-28 mb-5" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[0, 1, 2, 3].map(i => <StatCardSk key={i} />)}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <Sk className="h-4 w-36 mb-1" />
            {[0, 1, 2].map(i => <AssignmentCardSk key={i} />)}
          </div>

          {/* Side column */}
          <div className="space-y-5">
            {/* Activity feed */}
            <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl p-5">
              <Sk className="h-4 w-28 mb-4" />
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-3">
                    <Sk className="w-8 h-8 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Sk className="h-3 w-full" />
                      <Sk className="h-2.5 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl p-5">
              <Sk className="h-4 w-28 mb-4" />
              <div className="space-y-2">
                {[0, 1, 2].map(i => <Sk key={i} className="h-10 w-full" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
//  NEWS PAGE SKELETON
// ═════════════════════════════════════════════
function ArticleCardSk() {
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl overflow-hidden">
      <Sk className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2 items-center">
          <SkBadge w={60} />
          <Sk className="h-3 w-20" />
        </div>
        <Sk className="h-5 w-full" />
        <Sk className="h-5 w-4/5" />
        <Sk className="h-4 w-full" />
        <Sk className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Sk className="w-6 h-6 rounded-full" />
            <Sk className="h-3 w-20" />
          </div>
          <Sk className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

function FeaturedArticleSk() {
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.15)] rounded-2xl overflow-hidden lg:flex">
      <Sk className="h-56 lg:h-auto lg:w-1/2 rounded-none flex-shrink-0" />
      <div className="p-7 space-y-4 flex-1">
        <div className="flex gap-2">
          <SkBadge w={55} />
          <SkBadge w={75} />
        </div>
        <Sk className="h-7 w-full" />
        <Sk className="h-6 w-4/5" />
        <Sk className="h-4 w-full" />
        <Sk className="h-4 w-3/4" />
        <Sk className="h-4 w-2/3" />
        <div className="flex items-center gap-3 pt-2">
          <Sk className="w-8 h-8 rounded-full" />
          <div className="space-y-1.5">
            <Sk className="h-3 w-24" />
            <Sk className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsPageSkeleton() {
  return (
    <div className="bg-[#011C40] min-h-screen">
      {/* Hero */}
      <div className="bg-[#023859] border-b border-[rgba(84,172,191,0.1)] py-14 px-5 md:px-10">
        <div className="max-w-6xl mx-auto space-y-4 text-center">
          <Sk className="h-3 w-20 mx-auto" />
          <Sk className="h-10 w-72 mx-auto" />
          <Sk className="h-4 w-56 mx-auto" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        {/* Category filters */}
        <div className="flex gap-2 mb-8">
          {[65, 55, 75, 65, 80].map((w, i) => (
            <Sk key={i} className="h-9 rounded-xl" style={{ width: w }} />
          ))}
        </div>

        {/* Featured article */}
        <div className="mb-10">
          <Sk className="h-4 w-32 mb-5" />
          <FeaturedArticleSk />
        </div>

        {/* Article grid */}
        <div className="mb-3">
          <Sk className="h-4 w-24 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ArticleCardSk key={i} />)}
          </div>
        </div>

        {/* Newsletter band */}
        <div className="mt-12 bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <Sk className="h-6 w-56" />
            <Sk className="h-4 w-72" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Sk className="h-12 flex-1 md:w-64" />
            <Sk className="h-12 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
//  EVENT DETAIL SKELETON
// ═════════════════════════════════════════════
export function EventDetailSkeleton() {
  return (
    <div className="bg-[#011C40] min-h-screen">
      {/* Banner */}
      <Sk className="h-72 md:h-96 w-full rounded-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="flex gap-2">
                <SkBadge w={80} />
                <SkBadge w={65} />
              </div>
              <Sk className="h-9 w-full" />
              <Sk className="h-8 w-3/4" />
              <div className="flex flex-wrap gap-4 pt-2">
                <Sk className="h-4 w-32" />
                <Sk className="h-4 w-28" />
                <Sk className="h-4 w-36" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[rgba(84,172,191,0.1)] pb-0">
              {[80, 90, 75, 85].map((w, i) => (
                <Sk key={i} className="h-9 rounded-t-lg rounded-b-none" style={{ width: w }} />
              ))}
            </div>

            {/* Body text */}
            <div className="space-y-3">
              {[100, 95, 100, 80, 100, 88, 72].map((w, i) => (
                <Sk key={i} className="h-4" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-[#023859] border border-[rgba(84,172,191,0.15)] rounded-2xl p-6 space-y-4">
              <div className="flex justify-between">
                <Sk className="h-4 w-24" />
                <Sk className="h-5 w-16 rounded-full" />
              </div>
              <Sk className="h-2.5 w-full rounded-full" />
              <div className="space-y-2">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <Sk className="w-4 h-4 rounded flex-shrink-0 mt-0.5" />
                    <Sk className="h-4 flex-1" />
                  </div>
                ))}
              </div>
              <Sk className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}