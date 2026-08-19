import { useEffect, useRef, useState } from 'react';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Parallax. Each layer is measured once with its transform cleared, so the
 * transform we write never feeds back into the next read. Clamped, and
 * off-screen layers are skipped.
 */
export function useParallax() {
  const layers = useRef<{ el: HTMLElement; speed: number; cap: number; mid: number; h: number }[]>([]);

  const register = (speed: number, cap = 160) => (el: HTMLElement | null) => {
    if (!el || layers.current.some((l) => l.el === el)) return;
    layers.current.push({ el, speed, cap, mid: 0, h: 0 });
  };

  useEffect(() => {
    if (reduced() || !layers.current.length) return;
    let ticking = false;

    const measure = () =>
      layers.current.forEach((l) => {
        const prev = l.el.style.transform;
        l.el.style.transform = 'none';
        const b = l.el.getBoundingClientRect();
        l.mid = b.top + window.pageYOffset + b.height / 2;
        l.h = b.height;
        l.el.style.transform = prev;
      });

    const apply = () => {
      const y = window.pageYOffset;
      const vh = window.innerHeight;
      layers.current.forEach((l) => {
        if (l.mid + l.h / 2 < y - 300 || l.mid - l.h / 2 > y + vh + 300) return;
        let o = (y + vh / 2 - l.mid) * l.speed;
        o = Math.max(-l.cap, Math.min(l.cap, o));
        l.el.style.transform = `translate3d(0,${o.toFixed(2)}px,0)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    layers.current.forEach((l) => (l.el.style.willChange = 'transform'));
    measure();
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
    };
  }, []);

  return register;
}

/**
 * Adds `.in` to any `.rise` / `.wipe` element as it enters the viewport.
 *
 * Re-scans on mutation and on resize: `.wipe` elements hold their full layout
 * height while clipped, so any element the observer misses would leave a
 * block of dead space on the page. A safety pass also force-reveals anything
 * still hidden but already on screen.
 */
export function useReveal() {
  useEffect(() => {
    const seen = new WeakSet<Element>();

    const revealAll = () =>
      document.querySelectorAll<HTMLElement>('.rise, .wipe').forEach((e) => e.classList.add('in'));

    if (reduced() || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>('.rise, .wipe').forEach((el) => {
        if (seen.has(el) || el.classList.contains('in')) return;
        seen.add(el);
        io.observe(el);
        // already within the viewport at scan time — reveal immediately
        const b = el.getBoundingClientRect();
        if (b.top < window.innerHeight && b.bottom > 0) el.classList.add('in');
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', scan, { passive: true });
    window.addEventListener('load', scan);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', scan);
      window.removeEventListener('load', scan);
    };
  }, []);
}

/**
 * Splits text into per-character spans and plays a masked rise when the
 * element scrolls into view. `stagger` spaces each character.
 */
export function useKinetic(text: string, stagger = 0.022, base = 0) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.textContent = text;
      return;
    }

    el.innerHTML = '';
    Array.from(text).forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.animationDelay = `${base + i * stagger}s`;
      el.appendChild(s);
    });

    if (!('IntersectionObserver' in window)) {
      el.classList.add('play');
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('play');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, stagger, base]);

  return ref;
}

/**
 * Pins a section and converts vertical scroll into horizontal travel.
 * Returns refs for the outer (tall) section and the inner moving track.
 */
export function usePinnedRail() {
  const outer = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const o = outer.current;
    const t = track.current;
    if (!o || !t) return;

    // On small screens the rail scrolls natively instead.
    const mq = window.matchMedia('(min-width: 1024px)');
    let ticking = false;

    const apply = () => {
      const distance = t.scrollWidth - window.innerWidth;
      if (!mq.matches || reduced() || distance <= 0) {
        t.style.transform = '';
        o.style.height = '';
        ticking = false;
        return;
      }
      // total scrollable height = viewport + horizontal distance
      o.style.height = `${window.innerHeight + distance}px`;
      const box = o.getBoundingClientRect();
      const progress = Math.min(Math.max(-box.top / distance, 0), 1);
      t.style.transform = `translate3d(${-progress * distance}px,0,0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    };

    t.style.willChange = 'transform';
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply, { passive: true });
    window.addEventListener('load', apply);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', apply);
      window.removeEventListener('load', apply);
    };
  }, []);

  return { outer, track };
}

/** Magnetic hover — element leans toward the cursor, then springs back. */
export function useMagnetic<T extends HTMLElement>(strength = 0.32) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const leave = () => {
      el.style.transform = 'translate(0,0)';
    };

    el.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);

  return ref;
}

/** Counts up once in view. */
export function useCountUp(target: number, duration = 1800) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || !('IntersectionObserver' in window)) {
      setValue(target);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          let start: number | null = null;
          const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { ref, value };
}

/** True once the page has scrolled past `offset`. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > offset);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}

/** Live clock for the nav status strip. */
export function useClock() {
  const [now, setNow] = useState('');
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  return now;
}
