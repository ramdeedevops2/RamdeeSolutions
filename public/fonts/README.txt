NEVERA — brand wordmark typeface
================================

The site is already wired to use Nevera for the "Ramdee Solutions" wordmark.
It is NOT bundled here: Nevera is free for PERSONAL USE ONLY and this is a
commercial site, so a licence must be purchased first.

  Buy a commercial licence:  https://circlefont.com/product/nevera/
  Designer contact:          circlefont@gmail.com

To install once licensed, drop the files into this folder as:

  public/fonts/Nevera.woff2     (preferred)
  public/fonts/Nevera.woff
  public/fonts/Nevera.otf

No code change is needed — the @font-face in src/index.css picks them up and
the wordmark switches over automatically. Until then it falls back to
Instrument Serif, which is open source (SIL OFL) and safe to ship.

Converting OTF to WOFF2 (smaller, faster) can be done at
https://cloudconvert.com/otf-to-woff2 or with `woff2_compress`.
