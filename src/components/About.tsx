import { Index, Kinetic } from './Ui';
import { useParallax } from '../hooks/useMotion';

const facts = [
  { k: 'Founded', v: '2017' },
  { k: 'Based in', v: 'Mohali, Punjab' },
  { k: 'Team', v: '25+ engineers' },
  { k: 'Disciplines', v: 'Web · Cloud · AI · Security' },
];

const principles = [
  {
    n: 'A',
    title: 'Senior by default',
    body: 'The engineers who scope your project are the ones who build it. No bait-and-switch, no juniors learning on your budget.',
  },
  {
    n: 'B',
    title: 'Plain language',
    body: 'We explain trade-offs in business terms, not jargon — so decisions get made by the people who own the outcome.',
  },
  {
    n: 'C',
    title: 'Own the result',
    body: 'Launch is the midpoint, not the finish. We measure ourselves on what the system does in its second year.',
  },
];

export default function About() {
  const par = useParallax();

  return (
    <section id="about" className="py-[clamp(90px,14vh,190px)]">
      <div className="shell">
        {/* ---- head: statement left, story right ---- */}
        <div className="grid12 items-start gap-y-10">
          <div className="col-span-4 md:col-span-6">
            <Index n="01" label="About us" />
            <h2 className="display mt-6 text-[clamp(36px,6.2vw,104px)]">
              <Kinetic text="A small studio" />
              <Kinetic text="with long memory" base={0.12} className="font-display italic text-accent" />
            </h2>
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8 md:pt-[clamp(40px,6vh,72px)]">
            <p className="body-lg rise rise-r m-0 text-paper/80">
              Ramdee Solutions started in the Chandigarh tricity in 2017 with a simple idea: growing companies
              deserve the same engineering discipline as the giants — without the overhead.
            </p>
            <p className="rise mt-6 max-w-[52ch] text-[14.5px] leading-[1.65] text-paper/60">
              Eight years and 300+ projects later, we are a team of engineers, architects and security
              specialists who build, migrate and run the systems businesses depend on. We stay
              deliberately small so every client works directly with the people doing the work.
            </p>
          </div>
        </div>

        {/* ---- image + fact sheet ---- */}
        <div className="grid12 mt-[clamp(56px,9vh,120px)] items-end gap-y-10">
          <div className="col-span-4 md:col-span-7">
            <div className="wipe relative aspect-[16/10] overflow-hidden bg-grey-3">
              <img
                ref={par(-0.06, 60)}
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="The Ramdee Solutions team working together in the studio"
                loading="lazy"
                className="absolute inset-[-8%_0] h-[116%] w-full object-cover grayscale transition-[filter] duration-[1200ms] ease-swiss hover:grayscale-0"
              />
            </div>
          </div>

          <dl className="col-span-4 m-0 md:col-span-4 md:col-start-9">
            {facts.map((f) => (
              <div
                key={f.k}
                className="rise flex items-baseline justify-between gap-6 border-t border-paper/15 py-4 [&:nth-child(4)]:border-b"
              >
                <dt className="meta">{f.k}</dt>
                <dd className="m-0 text-right font-display text-[clamp(18px,1.7vw,26px)] leading-tight tracking-[-.02em]">
                  {f.v}
                </dd>
              </div>
            ))}

            {/* registered principal place of business */}
            <div className="rise mt-8">
              <dt className="meta">Studio</dt>
              <dd className="m-0 mt-3">
                <address className="text-[14.5px] not-italic leading-[1.65] text-paper/70">
                  Office No. 208, Plot No. D-229
                  <br />
                  Industrial Area, Phase VIII-B
                  <br />
                  Mohali, SAS Nagar, Punjab 160070
                </address>
              </dd>
            </div>
          </dl>
        </div>

        {/* ---- principles ---- */}
        <div className="grid12 mt-[clamp(64px,10vh,140px)] gap-y-10">
          {principles.map((p, i) => (
            <div
              key={p.n}
              className="rise col-span-4 border-t border-paper/15 pt-6"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="meta text-accent">{p.n}</span>
              <h3 className="m-0 mt-4 font-display text-[clamp(24px,2.6vw,38px)] leading-[1.05] tracking-[-.03em]">
                {p.title}
              </h3>
              <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.6] text-paper/60">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
