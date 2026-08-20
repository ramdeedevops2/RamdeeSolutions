import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'ramdee-theme';

/** Read the stored preference, else follow the OS. */
function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}


export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  /* The <html> attribute is the single source of truth for what is painted —
     `toggle` writes it directly so the spread overlay can commit it.
     This effect only mirrors it on mount and keeps storage in step; it must
     not re-assert the attribute afterwards, or it would fight the toggle. */
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute('data-theme') !== theme) {
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
    }
    window.localStorage.setItem(KEY, theme);
  }, [theme]);

  // stay in step if another instance of the hook flips the theme
  useEffect(() => {
    const root = document.documentElement;
    const mo = new MutationObserver(() => {
      const attr = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme((prev) => (prev === attr ? prev : attr));
    });
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  /**
   * Toggle with a circular colour spread originating at the click point.
   * The incoming colour grows from the click point as a circular overlay.
   */
  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const root = document.documentElement;

    // Read the live attribute rather than closed-over state: the commit
    // happens a moment later, so a stale closure would make
    // alternate clicks compute the same target and appear to do nothing.
    const current: Theme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next: Theme = current === 'dark' ? 'light' : 'dark';

    /** the single source of truth for what the page looks like */
    const paint = () => {
      root.setAttribute('data-theme', next);
      root.style.colorScheme = next;
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      paint();
      setTheme(next);
      return;
    }

    // centre the reveal on the button (or the viewport centre)
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    // radius reaching the furthest corner, so the colour covers everything
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    /* Paint the incoming theme onto an overlay disc that grows from the
       button, then commit the real theme underneath once it covers the
       screen. This runs everywhere, rather than depending on the View
       Transitions API, so the spread is never silently skipped. */
    const veil = document.createElement('div');
    veil.className = 'theme-veil';
    veil.setAttribute('data-theme', next);
    veil.style.setProperty('--tx', `${x}px`);
    veil.style.setProperty('--ty', `${y}px`);
    veil.style.setProperty('--tr', `${r}px`);
    document.body.appendChild(veil);

    // force a frame so the starting clip is applied before we grow it
    void veil.offsetWidth;
    veil.classList.add('grow');

    const DURATION = 820;
    window.setTimeout(() => {
      paint();
      setTheme(next);
      // let the real page show through, then drop the overlay
      requestAnimationFrame(() => {
        veil.classList.add('done');
        window.setTimeout(() => veil.remove(), 220);
      });
    }, DURATION);
  }, []);

  return { theme, toggle };
}
