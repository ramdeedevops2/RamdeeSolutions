import { Action, Kinetic } from './Ui';
import { useParallax } from '../hooks/useMotion';

const facts = [
  { k: 'Projects', v: '300+' },
  { k: 'Clients', v: '150+' },
  { k: 'Years', v: '08' },
  { k: 'Uptime', v: '98%' },
];

export default function Hero() {
  const par = useParallax();

  return (
    <header
      id="top"
      className="relative flex max-h-[1100px] min-h-svh flex-col justify-between pb-8 pt-[22vh]"
    >
      <div className="shell">
        {/* ---- top meta row ---- */}
        <div className="grid12 mb-[clamp(40px,7vh,90px)]">
          <div className="col-span-4 md:col-span-3">
            <span
              className="meta block opacity-0"
              style={{ animation: 'heroFade .9s cubic-bezier(.16,1,.3,1) 1.15s forwards' }}
            >
              Est. 2017 — Chandigarh
            </span>
          </div>
          <div className="col-span-4 md:col-span-4 md:col-start-9">
            <p
              className="body-lg m-0 text-paper/70 opacity-0"
              style={{ animation: 'heroFade .9s cubic-bezier(.16,1,.3,1) 1.25s forwards' }}
            >
              An engineering studio building web platforms, cloud systems and AI automation for
              companies that intend to grow.
            </p>
          </div>
        </div>

        {/* ---- the statement ---- */}
        <h1 className="display m-0 text-[clamp(52px,12.5vw,208px)]">
          <Kinetic text="Engineering" base={0.15} />
          <span className="flex flex-wrap items-baseline gap-x-[.22em]">
            <Kinetic text="the quiet" base={0.3} />
            <Kinetic text="advantage" base={0.45} className="font-display italic text-accent" />
          </span>
        </h1>
      </div>

      {/* ---- baseline: action + facts on the same rule ---- */}
      <div className="shell mt-[clamp(48px,9vh,110px)]">
        <div className="rule pt-6">
          <div className="grid12 items-end gap-y-8">
            <div
              className="col-span-4 opacity-0 md:col-span-4"
              style={{ animation: 'heroFade .9s cubic-bezier(.16,1,.3,1) 1.45s forwards' }}
            >
              <Action href="#contact">Start a project</Action>
            </div>

            <div
              className="col-span-4 opacity-0 md:col-span-6 md:col-start-7"
              style={{ animation: 'heroFade .9s cubic-bezier(.16,1,.3,1) 1.6s forwards' }}
            >
              <div ref={par(0.04)} className="grid grid-cols-4 gap-x-4">
                {facts.map((f) => (
                  <div key={f.k}>
                    <div className="font-display text-[clamp(26px,3.2vw,46px)] leading-none tracking-[-.03em]">
                      {f.v}
                    </div>
                    <div className="meta mt-2">{f.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
