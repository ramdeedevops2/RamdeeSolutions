import { useEffect } from 'react';

/**
 * Precise in-page anchor scrolling.
 *
 * The browser's default lands a section's *box* under the nav, but every
 * section opens with generous top padding, so the heading ended up ~150px
 * lower than expected. Instead we align the section's first piece of content
 * (its index label or heading) a fixed gap below the fixed nav, measured live
 * so it stays right at every viewport size.
 *
 * Applies to every `<a href="#...">` on the page. `#top` is left alone — the
 * back-to-top links have their own veiled jump.
 */
const GAP = () => Math.round(Math.min(48, Math.max(24, window.innerHeight * 0.045)));

function anchorFor(target: HTMLElement): HTMLElement {
  if (target.tagName !== 'SECTION') return target;
  return target.querySelector<HTMLElement>('.meta, h2, h1') ?? target;
}

function destination(target: HTMLElement) {
  const nav = document.querySelector('nav');
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
  const el = anchorFor(target);
  const y = el.getBoundingClientRect().top + window.pageYOffset - navBottom - GAP();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(y, max));
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToAnchor(target: HTMLElement) {
  const behavior: ScrollBehavior = reduced() ? 'auto' : 'smooth';
  window.scrollTo({ top: destination(target), behavior });

  // Re-check once the scroll settles: anything that changed height on the way
  // (late images, the pinned rail measuring itself) is corrected here.
  let last = -1;
  let still = 0;
  const settle = () => {
    const y = window.pageYOffset;
    still = Math.abs(y - last) < 1 ? still + 1 : 0;
    last = y;
    if (still < 6) {
      requestAnimationFrame(settle);
      return;
    }
    const want = destination(target);
    if (Math.abs(want - y) > 2) window.scrollTo({ top: want, behavior });
  };
  requestAnimationFrame(settle);
}

export function useAnchorScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute('href') ?? '';
      if (hash.length < 2 || hash === '#top') return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      e.preventDefault();
      scrollToAnchor(target);
      if (location.hash !== hash) history.pushState(null, '', hash);
    };

    // landing on the page with a hash (shared link, refresh)
    const initial = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
    let t: number | undefined;
    if (initial) {
      t = window.setTimeout(() => {
        window.scrollTo({ top: destination(initial), behavior: 'auto' });
      }, 120);
    }

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      if (t) window.clearTimeout(t);
    };
  }, []);
}
