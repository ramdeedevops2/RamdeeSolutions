import { Kinetic, Wordmark, Magnetic } from './Ui';

const marqueeItems = ['Start a project', 'Start a project', 'Start a project', 'Start a project'];

const footerCols = [
  {
    head: 'Services',
    links: ['Web Development', 'Cloud Solutions', 'AI Automation', 'Cybersecurity'],
    href: '#services',
  },
  { head: 'Studio', links: ['Approach', 'Work', 'Clients', 'Contact'], href: '#approach' },
];

export default function CTA() {
  return (
    <>
      {/* ---------- contact ---------- */}
      <section id="contact" className="relative overflow-hidden pt-[clamp(90px,14vh,190px)]">
        <div className="shell">
          <div className="grid12 items-end gap-y-10 pb-[clamp(50px,8vh,100px)]">
            <div className="col-span-4 md:col-span-8">
              <h2 className="display m-0 text-[clamp(40px,9vw,150px)]">
                <Kinetic text="Let's build" />
                <Kinetic text="something" base={0.12} className="font-display italic text-accent" />
              </h2>
            </div>
            <div className="col-span-4 md:col-span-3 md:col-start-10">
              <p className="body-lg rise m-0 text-paper/70">
                Tell us where you are stuck. We will tell you what it takes.
              </p>
            </div>
          </div>

          <div className="rule" />
        </div>

        {/* giant marquee CTA */}
        <a href="mailto:contact@ramdee.com" className="mt-[clamp(50px,8vh,110px)] block no-underline">
          <div
            className="mq-mask flex overflow-hidden py-6"
            style={{ '--gap': '48px', gap: 'var(--gap)' } as React.CSSProperties}
          >
            {[0, 1].map((t) => (
              <div
                key={t}
                className="flex min-w-full flex-none animate-marquee items-center"
                style={{ gap: 'var(--gap)' }}
              >
                {marqueeItems.map((m, i) => (
                  <span key={i} className="flex items-center" style={{ gap: 'var(--gap)' }}>
                    <span className="whitespace-nowrap font-display text-[clamp(46px,9vw,150px)] leading-none tracking-[-.04em] text-paper transition-colors duration-500 hover:text-accent">
                      {m}
                    </span>
                    <span className="text-[clamp(20px,3vw,50px)] text-accent">✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </a>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="pb-8 pt-[clamp(50px,8vh,100px)]">
        <div className="shell">
          <div className="rule grid12 gap-y-10 pt-8">
            <div className="col-span-4 md:col-span-4">
              <Wordmark />
              <p className="mt-5 max-w-[30ch] text-[13.4px] leading-[1.6] text-paper/50">
                An engineering studio for web platforms, cloud infrastructure, AI automation and
                security.
              </p>
            </div>

            {footerCols.map((col) => (
              <div key={col.head} className="col-span-2 md:col-span-2">
                <div className="meta mb-4">{col.head}</div>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href={col.href}
                    className="ul mb-2 block w-fit text-[13.4px] text-paper/60 no-underline transition-colors duration-500 hover:text-paper"
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}

            <div className="col-span-4 md:col-span-2 md:col-start-11 md:text-right">
              <div className="meta mb-4">Elsewhere</div>
              {['LinkedIn', 'Instagram', 'GitHub'].map((s) => (
                <Magnetic
                  key={s}
                  href="#contact"
                  className="ul mb-2 block w-fit text-[13.4px] text-paper/60 no-underline transition-colors duration-500 hover:text-paper md:ml-auto"
                >
                  {s}
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="rule mt-[clamp(40px,7vh,80px)] flex flex-wrap items-center justify-between gap-4 pt-5">
            <span className="meta">© {new Date().getFullYear()} Ramdee Solutions</span>
            <a href="#top" className="ul meta no-underline transition-colors hover:text-accent">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
