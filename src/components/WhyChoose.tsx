import { useState } from 'react';
import { Index, Kinetic } from './Ui';

const reasons = [
  {
    n: '01',
    title: 'Experienced developers',
    body: 'Certified professionals with years of production experience across the stacks we recommend. The people in the pitch are the people on the build.',
  },
  {
    n: '02',
    title: 'Secure infrastructure',
    body: 'Enterprise-grade security applied from the first commit — encrypted data paths, least-privilege access and audited dependencies as standard, not as an upsell.',
  },
  {
    n: '03',
    title: 'Scalable technology',
    body: 'Architecture that carries you from startup traffic to enterprise scale without a rewrite. We build for the second year, not just the launch.',
  },
  {
    n: '04',
    title: '24/7 support',
    body: 'Round-the-clock technical cover with a response window under two hours. Systems fail at inconvenient times; someone is always awake for it.',
  },
];

export default function WhyChoose() {
  const [open, setOpen] = useState('01');

  return (
    <section id="approach" className="py-[clamp(90px,14vh,190px)]">
      <div className="shell">
        {/* items-start: let each column size to its own content instead of
            stretching to the tallest, which left dead space under the accordion */}
        <div className="grid12 items-start gap-y-[clamp(40px,7vh,80px)]">
          {/* statement + studio image */}
          <div className="col-span-4 md:col-span-5">
            <Index n="03" label="The studio" />
            <h2 className="display mt-6 text-[clamp(36px,6.2vw,104px)]">
              <Kinetic text="Built to be" />
              <Kinetic text="handed over" base={0.12} className="font-display italic text-accent" />
            </h2>
            <p className="body-lg rise mt-8 max-w-[40ch] text-paper/70">
              Every engagement is documented, tested and transferable. You should never be hostage to
              the team that built your system — including us.
            </p>
          </div>

          {/* accordion */}
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <div className="rule">
              {reasons.map((r) => {
                const on = open === r.n;
                return (
                  <div key={r.n} className="border-b border-paper/15">
                    <button
                      onClick={() => setOpen(on ? '' : r.n)}
                      aria-expanded={on}
                      className="group flex w-full items-center gap-5 bg-transparent py-[clamp(18px,2.6vh,30px)] text-left"
                    >
                      <span className={`meta transition-colors duration-500 ${on ? 'text-accent' : ''}`}>
                        {r.n}
                      </span>
                      <span
                        className={`flex-1 font-display text-[clamp(21px,2.8vw,40px)] leading-[1.05] tracking-[-.03em] transition-all duration-[700ms] ease-swiss group-hover:translate-x-2 ${
                          on ? 'text-accent' : 'text-paper'
                        }`}
                      >
                        {r.title}
                      </span>
                      <span
                        aria-hidden
                        className={`relative h-3 w-3 flex-none transition-transform duration-[700ms] ease-swiss ${
                          on ? 'rotate-45' : ''
                        }`}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                        <span
                          className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-opacity duration-500 ${
                            on ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                      </span>
                    </button>

                    <div className={`acc ${on ? 'open' : ''}`}>
                      <div>
                        <p className="m-0 max-w-[52ch] pb-7 pl-[calc(1.6rem+8px)] text-[14px] leading-[1.6] text-paper/60">
                          {r.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
