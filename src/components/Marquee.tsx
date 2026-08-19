const items = [
  'Web Development',
  'Cloud Solutions',
  'AI Automation',
  'Mobile Apps',
  'Cybersecurity',
  'IT Consulting',
];

function Track() {
  return (
    <div className="flex min-w-full flex-none animate-marquee items-center" style={{ gap: 'var(--gap)' }}>
      {items.map((item) => (
        <span key={item} className="flex items-center" style={{ gap: 'var(--gap)' }}>
          <span className="meta whitespace-nowrap text-paper/70">{item}</span>
          <span className="h-1 w-1 flex-none rounded-full bg-accent" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      aria-hidden
      className="mq-mask flex overflow-hidden border-y border-paper/15 py-4"
      style={{ '--gap': '40px', gap: 'var(--gap)' } as React.CSSProperties}
    >
      <Track />
      <Track />
    </div>
  );
}
