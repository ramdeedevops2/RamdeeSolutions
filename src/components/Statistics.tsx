import { useCountUp } from '../hooks/useMotion';

const stats = [
  { label: 'Projects completed', value: 300, suffix: '+' },
  { label: 'Happy clients', value: 150, suffix: '+' },
  { label: 'Years experience', value: 8, suffix: '' },
  { label: 'Team members', value: 25, suffix: '+' },
];

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: current } = useCountUp(value);
  return (
    <div className="col-span-2 border-t border-paper/15 pt-5 md:col-span-3">
      <div className="font-display text-[clamp(44px,7vw,116px)] leading-[.9] tracking-[-.04em]">
        <span ref={ref}>{current}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="meta mt-4">{label}</div>
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-[clamp(70px,10vh,140px)]">
      <div className="shell">
        <div className="grid12 gap-y-10">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
