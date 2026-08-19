import type { ReactNode } from 'react';
import { useMagnetic, useKinetic } from '../hooks/useMotion';

/* ---------------- wordmark ---------------- */
export function Wordmark() {
  return (
    <a href="#top" className="group flex items-center gap-2.5 text-paper no-underline">
      <img
        src="/ramdee-mark.png"
        alt="Ramdee Solutions"
        width={28}
        height={28}
        className="h-7 w-7 flex-none object-contain transition-transform duration-700 ease-swiss group-hover:rotate-90"
      />
      <span className="text-[15px] font-medium tracking-[-.03em]">Ramdee</span>
    </a>
  );
}

/* ---------------- magnetic link/button ---------------- */
export function Magnetic({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  );
}

/* ---------------- primary action: underline, not a pill ---------------- */
export function Action({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Magnetic href={href} className="group inline-flex items-center gap-3 text-paper no-underline">
      <span className="relative text-[clamp(15px,1.3vw,19px)] tracking-[-.02em]">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-paper transition-transform duration-700 ease-swiss group-hover:origin-right group-hover:scale-x-0" />
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform delay-[120ms] duration-700 ease-swiss group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <span className="grid h-9 w-9 place-items-center rounded-full border border-paper/20 transition-all duration-700 ease-swiss group-hover:border-accent group-hover:bg-accent">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="transition-transform duration-700 ease-swiss group-hover:rotate-45"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </Magnetic>
  );
}

/* ---------------- section index label ---------------- */
export function Index({ n, label }: { n: string; label: string }) {
  return (
    <div className="meta flex items-center gap-3 whitespace-nowrap">
      <span className="text-accent">{n}</span>
      <span className="h-px w-8 flex-none bg-paper/20" />
      <span>{label}</span>
    </div>
  );
}

/* ---------------- kinetic heading ---------------- */
export function Kinetic({
  text,
  className = '',
  stagger,
  base,
}: {
  text: string;
  className?: string;
  stagger?: number;
  base?: number;
}) {
  const ref = useKinetic(text, stagger, base);
  return (
    <span className={`kin ${className}`}>
      <span ref={ref} />
    </span>
  );
}
