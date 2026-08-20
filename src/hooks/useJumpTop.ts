/**
 * Back to top: fade the page out, hop instantly, fade back in — the document
 * must never be seen scrolling.
 *
 * `scroll-behavior: smooth` on <html> would animate the hop, so it is
 * suppressed for the whole jump and only restored once the scroll position
 * has actually landed (verified, not assumed after one frame).
 */
export function jumpToTop(e?: { preventDefault(): void }) {
  e?.preventDefault();

  const root = document.documentElement;

  const hop = () => {
    root.classList.add('no-smooth');
    window.scrollTo(0, 0);
    // belt and braces: some engines ignore scrollTo while smooth is pending
    document.body.scrollTop = 0;
    root.scrollTop = 0;
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hop();
    root.classList.remove('no-smooth');
    return;
  }

  const veil = document.createElement('div');
  veil.className = 'page-veil';
  document.body.appendChild(veil);

  void veil.offsetWidth; // commit the transparent start state
  veil.classList.add('on'); // fade to opaque

  window.setTimeout(() => {
    hop();

    // Wait until we are genuinely at the top before restoring smooth
    // scrolling, otherwise the browser can resume animating the tail of
    // the jump and the page visibly slides.
    let guard = 0;
    const settle = () => {
      if (window.pageYOffset > 0 && guard < 30) {
        guard += 1;
        hop();
        requestAnimationFrame(settle);
        return;
      }
      root.classList.remove('no-smooth');
      veil.classList.remove('on');
      window.setTimeout(() => veil.remove(), 620);
    };
    requestAnimationFrame(settle);
  }, 420);
}
