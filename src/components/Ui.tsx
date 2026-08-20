import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useMagnetic, useKinetic } from '../hooks/useMotion';
import { useTheme } from '../hooks/useTheme';
import { jumpToTop } from '../hooks/useJumpTop';

/* ---------------- wordmark ---------------- */
export function Wordmark() {
  const label = 'Ramdee Solutions';
  const ref = useRef<HTMLSpanElement | null>(null);
  const raf = useRef<number | null>(null);

  /* Scramble: each character resolves at its own moment, and the resolve
     point sweeps forward then back, so the word keeps churning rather than
     settling left-to-right once. */
  const scramble = () => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // letters only: symbol glyphs have very different widths in Nevera and
    // would make the wordmark jitter as it churns
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const chars = Array.from(label);
    const DURATION = 1100;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // sweep the resolve front forward (0 -> 1) then back (1 -> 0)
      const front = t < 0.5 ? t * 2 : (1 - t) * 2;

      el.textContent = chars
        .map((c, i) => {
          if (c === ' ') return ' ';
          const at = i / chars.length;
          // resolved when the front has passed this character
          const settled = t >= 0.999 || at < front - 0.12;
          if (settled) return c;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        el.textContent = label;
      }
    };

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };

  /* Fire on its own at irregular intervals, so the wordmark keeps churning
     without needing to be hovered. Pauses while the tab is hidden. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: number;
    const schedule = () => {
      // 3.5–8s apart, so it never feels metronomic
      const wait = 3500 + Math.random() * 4500;
      timer = window.setTimeout(() => {
        if (!document.hidden) scramble();
        schedule();
      }, wait);
    };
    schedule();

    return () => {
      window.clearTimeout(timer);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <a
      href="#top"
      onClick={jumpToTop}
      onMouseEnter={scramble}
      onFocus={scramble}
      className="group flex items-center gap-2.5 text-paper no-underline"
    >
      <img
        src="/ramdee-mark.png"
        alt=""
        aria-hidden
        width={28}
        height={28}
        className="h-7 w-7 flex-none object-contain transition-transform duration-700 ease-swiss group-hover:rotate-90"
      />
      {/* Nevera is caps-only and runs wide, so it sits smaller than a
          lowercase face would at the same optical weight */}
      <span
        ref={ref}
        className="whitespace-pre font-brand text-[15px] leading-none tracking-[.06em]"
      >
        {label}
      </span>
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

/* ---------------- theme toggle ---------------- */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span className="disc" aria-hidden />
    </button>
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
