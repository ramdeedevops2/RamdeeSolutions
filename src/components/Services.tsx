import { useRef, useState } from 'react';
import { Index, Kinetic } from './Ui';
import HoverMedia from './HoverMedia';
import type { MediaItem } from './HoverMedia';

const px = (id: string, w = 700) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const services: {
  n: string;
  title: string;
  desc: string;
  tags: string[];
  media: MediaItem[];
}[] = [
  {
    n: '01',
    title: 'Web Development',
    desc: 'Custom web applications on modern stacks — engineered for performance, accessibility and the traffic you have not hit yet.',
    tags: ['React', 'Next.js', 'Laravel', 'Node'],
    // three bubbles, spread wide
    media: [
      { src: px('11035380'), size: 210, dx: 0.14, dy: -0.16, ease: 0.1 },
      { src: px('270348'), size: 150, dx: 0.26, dy: 0.1, ease: 0.07 },
      { src: px('160107'), size: 120, dx: 0.05, dy: 0.19, ease: 0.055 },
    ],
  },
  {
    n: '02',
    title: 'Cloud Solutions',
    desc: 'Scalable infrastructure and migrations that move you off fragile servers without a weekend of downtime.',
    tags: ['AWS', 'Docker', 'CI/CD', 'Terraform'],
    // single large bubble
    media: [{ src: px('325229'), size: 250, dx: 0.2, dy: -0.02, ease: 0.09 }],
  },
  {
    n: '03',
    title: 'AI Automation',
    desc: 'Intelligent workflows that remove the repetitive middle of your operation.',
    tags: ['LLM', 'RAG', 'Pipelines', 'Agents'],
    // two, tight cluster
    media: [
      { src: px('8386440'), size: 200, dx: 0.17, dy: -0.13, ease: 0.1 },
      { src: px('17485657'), size: 140, dx: 0.28, dy: 0.12, ease: 0.06 },
    ],
  },
  {
    n: '04',
    title: 'Mobile Apps',
    desc: 'Native and cross-platform products that feel native because they behave like it.',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    media: [
      { src: px('147413'), size: 165, dx: 0.13, dy: -0.17, ease: 0.095 },
      { src: px('50614'), size: 215, dx: 0.25, dy: 0.09, ease: 0.065 },
      { src: px('404280'), size: 115, dx: 0.05, dy: 0.2, ease: 0.05 },
    ],
  },
  {
    n: '05',
    title: 'Cybersecurity',
    desc: 'Hardening, monitoring and response that protects the business, not just the servers.',
    tags: ['Audits', 'Pen-test', 'SOC', 'Compliance'],
    media: [
      { src: px('60504'), size: 230, dx: 0.19, dy: -0.06, ease: 0.1 },
      { src: px('5380642'), size: 130, dx: 0.3, dy: 0.14, ease: 0.06 },
    ],
  },
  {
    n: '06',
    title: 'IT Consulting',
    desc: 'Straight technical judgement that ties every initiative back to a business objective.',
    tags: ['Strategy', 'Architecture', 'Roadmaps'],
    media: [{ src: px('3184291'), size: 235, dx: 0.21, dy: -0.04, ease: 0.085 }],
  },
];

export default function Services() {
  const [active, setActive] = useState<string | null>(null);
  const list = useRef<HTMLDivElement | null>(null);

  return (
    <section id="services" className="py-[clamp(90px,14vh,190px)]">
      {/* floating hover media — one layer per row, only the active one is
          visible, and every bubble is clipped to the list box */}
      {services.map((s) => (
        <HoverMedia key={`m-${s.n}`} items={s.media} active={active === s.n} bounds={list} />
      ))}

      <div className="shell">
        {/* section head on the grid */}
        <div className="grid12 mb-[clamp(48px,8vh,110px)] items-end gap-y-8">
          <div className="col-span-4 md:col-span-5">
            <Index n="02" label="Capabilities" />
            <h2 className="display mt-6 text-[clamp(36px,6.2vw,104px)]">
              <Kinetic text="What we" />
              <Kinetic text="build" base={0.12} className="font-display italic text-accent" />
            </h2>
          </div>
          <div className="col-span-4 md:col-span-4 md:col-start-9">
            <p className="body-lg rise rise-r m-0 text-paper/70">
              No handoffs between agencies. Strategy, engineering and security sit in the same room,
              on the same schedule.
            </p>
          </div>
        </div>

        {/* the index list — hover expands, no cards */}
        <div ref={list} className="rule">
          {services.map((s) => {
            const on = active === s.n;
            return (
              <div
                key={s.n}
                onPointerEnter={() => setActive(s.n)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(s.n)}
                onBlur={() => setActive(null)}
                className="group relative border-b border-paper/15"
              >
                {/* accent rule sweeps across on hover */}
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-accent transition-transform duration-[900ms] ease-swiss group-hover:origin-left group-hover:scale-x-100"
                  aria-hidden
                />

                <div
                  className="rise grid12 relative cursor-pointer items-baseline py-[clamp(18px,2.6vh,34px)]"
                  style={{ transitionDelay: `${services.indexOf(s) * 0.06}s` }}
                >
                  <span
                    className={`meta col-span-1 transition-colors duration-500 ${
                      on ? 'text-accent' : ''
                    }`}
                  >
                    {s.n}
                  </span>

                  <h3
                    className={`col-span-3 m-0 font-display text-[clamp(24px,4.4vw,64px)] leading-[.95] tracking-[-.035em] transition-all duration-[700ms] ease-swiss group-hover:translate-x-3 md:col-span-6 ${
                      on ? 'italic text-accent' : ''
                    }`}
                  >
                    {s.title}
                  </h3>

                  <div className="col-span-4 mt-3 md:col-span-5 md:mt-0">
                    <p
                      className={`m-0 max-w-[46ch] text-[13.5px] leading-[1.55] transition-colors duration-700 ease-swiss ${
                        on ? 'text-paper/80' : 'text-paper/45'
                      }`}
                    >
                      {s.desc}
                    </p>
                    <div
                      className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 transition-all duration-700 ease-swiss ${
                        on ? 'max-h-16 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                      }`}
                    >
                      {s.tags.map((t) => (
                        <span key={t} className="meta text-paper/50">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
