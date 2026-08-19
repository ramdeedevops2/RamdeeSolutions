import { Index } from './Ui';
import { usePinnedRail } from '../hooks/useMotion';

const projects = [
  {
    n: '01',
    title: 'Shopbix',
    category: 'Marketplace',
    year: '2024',
    desc: 'Item selling and business listing platform built to help users buy, sell and discover local businesses.',
    scope: ['Platform', 'Search', 'Payments'],
    logo: 'https://shopbix-admin.happyhomez.in/storage/settings/688dc2aa9c5f62.926327791754120874.svg',
    site: 'https://shopbix-admin.happyhomez.in',
  },
  {
    n: '02',
    title: 'HappyHomez',
    category: 'Proptech',
    year: '2023',
    desc: 'Properties platform focused on helping users explore and connect with the right property opportunities.',
    scope: ['Listings', 'CRM', 'Mobile'],
    logo: 'https://happyhomez.in/images/new-logo.png',
    site: 'https://happyhomez.in',
  },
  {
    n: '03',
    title: 'Bricksgenie',
    category: 'Real Estate',
    year: '2023',
    desc: 'Property dealers and real estate agency services in Chandigarh, built for trusted property guidance.',
    scope: ['Brand', 'Web', 'SEO'],
    logo: 'https://bricksgenie.com/assets/img/65127f2a23da3.png',
    site: 'https://bricksgenie.com',
  },
];

export default function Portfolio() {
  const { outer, track } = usePinnedRail();

  return (
    <section id="work" className="relative">
      {/* header stays on the vertical flow */}
      <div className="shell pt-[clamp(90px,14vh,190px)]">
        <div className="grid12 items-end gap-y-8 pb-[clamp(36px,6vh,72px)]">
          <div className="col-span-4 md:col-span-6">
            <Index n="02" label="Selected work" />
            <h2 className="display mt-6 text-[clamp(36px,6.2vw,104px)]">
              Platforms in
              <br />
              <em className="font-display italic text-accent">production</em>
            </h2>
          </div>
          <div className="col-span-4 md:col-span-3 md:col-start-10">
            <p className="body-lg rise m-0 text-paper/70">
              Three of the products we designed, built and continue to maintain.
            </p>
            <span className="meta mt-6 hidden items-center gap-2 lg:flex">
              Scroll
              <span className="h-px w-10 bg-accent" />
            </span>
          </div>
        </div>
      </div>

      {/* pinned rail: vertical scroll drives horizontal travel on desktop */}
      <div ref={outer} className="relative lg:h-auto">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:overflow-hidden">
          <div
            ref={track}
            className="rail flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(16px,3.2vw,56px)] pb-6 lg:snap-none lg:overflow-visible lg:pb-0"
          >
            {projects.map((p) => (
              <article
                key={p.n}
                className="group relative flex w-[82vw] flex-none snap-start flex-col justify-between border-t border-paper/15 pt-6 sm:w-[64vw] lg:w-[46vw] lg:min-w-[520px]"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="meta text-accent">{p.n}</span>
                  <span className="meta">{p.year}</span>
                </div>

                {/* the plate: client logo, wiped to accent on hover */}
                <a
                  href={p.site}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-6 block aspect-[4/3] w-full overflow-hidden bg-grey-3/40 no-underline"
                >
                  {/* resting state — logo on the dark plate */}
                  <span className="absolute inset-0 grid place-items-center p-[14%]">
                    <img
                      src={p.logo}
                      alt={`${p.title} logo`}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain brightness-0 invert transition-transform duration-[900ms] ease-swiss group-hover:scale-[1.04]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement
                          ?.querySelector('[data-fallback]')
                          ?.classList.remove('hidden');
                      }}
                    />
                    <span
                      data-fallback
                      className="hidden font-display text-[clamp(44px,7vw,104px)] leading-none tracking-[-.04em] text-paper/90"
                    >
                      {p.title}
                    </span>
                  </span>

                  {/* hover wipe */}
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-[800ms] ease-swiss group-hover:origin-top group-hover:scale-y-100" />
                  <span className="absolute inset-0 grid place-items-center p-[14%] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <img
                      src={p.logo}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="max-h-full max-w-full object-contain brightness-0"
                    />
                  </span>

                  {/* view cue */}
                  <span className="meta absolute bottom-4 right-4 z-10 text-paper/60 opacity-0 transition-all duration-500 group-hover:text-ink group-hover:opacity-100">
                    View site ↗
                  </span>
                </a>

                <div className="mt-6 flex items-start justify-between gap-8 border-t border-paper/15 pt-5">
                  <div>
                    <h3 className="m-0 text-[15px] font-medium tracking-[-.02em]">{p.category}</h3>
                    <p className="m-0 mt-2 max-w-[38ch] text-[13.4px] leading-[1.55] text-paper/55">
                      {p.desc}
                    </p>
                  </div>
                  <div className="hidden flex-none text-right sm:block">
                    {p.scope.map((s) => (
                      <span key={s} className="meta block leading-[1.9]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
