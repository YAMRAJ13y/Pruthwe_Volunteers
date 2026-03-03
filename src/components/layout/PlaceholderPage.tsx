// Temporary placeholder — will be replaced with full page
export default function PlaceholderPage({ title }: { title?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-[#54ACBF] text-sm tracking-widest uppercase mb-3">
          Coming Soon
        </p>
        <h1 className="font-display text-4xl font-bold text-[#F0FAFB]">
          {title ?? 'Page'}
        </h1>
        <p className="text-[#8BBFCC] mt-3 text-sm">
          This page is being built. Check back soon.
        </p>
      </div>
    </div>
  );
}
