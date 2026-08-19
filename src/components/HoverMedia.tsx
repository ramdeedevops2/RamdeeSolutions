import { useEffect, useRef } from 'react';

export type MediaItem = {
  src: string;
  /** diameter in px */
  size: number;
  /** offset from the cursor, as a fraction of viewport width/height */
  dx: number;
  dy: number;
  /** how much this bubble lags the cursor — lower = floatier */
  ease: number;
};

/**
 * Floating circular images that trail the cursor while a row is hovered.
 * Rendered in a fixed layer so they can overflow the row freely.
 */
export default function HoverMedia({
  items,
  active,
  bounds,
}: {
  items: MediaItem[];
  active: boolean;
  /** element the bubbles must stay inside — they are clipped to its box */
  bounds?: React.RefObject<HTMLElement>;
}) {
  const layer = useRef<HTMLDivElement | null>(null);
  const nodes = useRef<HTMLDivElement[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef<{ x: number; y: number }[]>([]);
  const raf = useRef<number | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (reduced || !fine) return;

    pos.current = items.map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));

    /** keep the fixed layer aligned with the bounding element, and clip to it */
    const syncClip = () => {
      const l = layer.current;
      const el = bounds?.current;
      if (!l || !el) return;
      const b = el.getBoundingClientRect();
      l.style.clipPath = `inset(${b.top}px ${window.innerWidth - b.right}px ${
        window.innerHeight - b.bottom
      }px ${b.left}px)`;
    };

    const onMove = (e: PointerEvent) => {
      // first sighting: drop every bubble at the cursor so the group
      // blooms outward instead of flying in from off-screen
      if (!seeded.current) {
        seeded.current = true;
        pos.current.forEach((p) => {
          p.x = e.clientX;
          p.y = e.clientY;
        });
      }
      target.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      syncClip();
      if (!seeded.current) {
        raf.current = requestAnimationFrame(loop);
        return;
      }
      nodes.current.forEach((n, i) => {
        if (!n) return;
        const it = items[i];
        const p = pos.current[i];
        if (!p) return;
        const tx = target.current.x + it.dx * window.innerWidth;
        const ty = target.current.y + it.dy * window.innerHeight;
        p.x += (tx - p.x) * it.ease;
        p.y += (ty - p.y) * it.ease;
        n.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      });
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    syncClip();
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [items, bounds]);

  return (
    <div ref={layer} aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden lg:block">
      {items.map((it, i) => (
        <div
          key={it.src + i}
          ref={(el) => {
            if (el) nodes.current[i] = el;
          }}
          className="absolute left-0 top-0 -translate-x-[200vw] overflow-hidden rounded-full will-change-transform"
          style={{
            width: it.size,
            height: it.size,
            opacity: active ? 1 : 0,
            transition: `opacity .5s cubic-bezier(.16,1,.3,1) ${
              active ? i * 0.06 : 0
            }s, scale .7s cubic-bezier(.16,1,.3,1) ${active ? i * 0.06 : 0}s`,
            scale: active ? '1' : '0.55',
          }}
        >
          <img
            src={it.src}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              const el = e.currentTarget.parentElement;
              if (el) el.style.display = 'none';
            }}
          />
        </div>
      ))}
    </div>
  );
}
