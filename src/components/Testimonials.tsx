import { useState } from 'react';
import { Index } from './Ui';

const quotes = [
  {
    n: '01',
    content:
      'We had been struggling with our servers for two years only. Ramdee shifted everything to cloud without any drama — not even one day of downtime. Very much satisfied.',
    name: 'Rajesh Malhotra',
    role: 'Director, Sharma Textiles',
  },
  {
    n: '02',
    content:
      'Honestly, we were expecting the usual delays. But they delivered before time itself, and the site is running very smooth. Full paisa vasool.',
    name: 'Priya Nair',
    role: 'Founder, Kirana Connect',
  },
  {
    n: '03',
    content:
      'Their automation work saved my team almost 20 hours every week. Whatever we ask, they explain properly in simple language — no fancy tech jargon.',
    name: 'Arjun Sethi',
    role: 'CTO, Vertex Logistics',
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const q = quotes[i];

  return (
    <section id="voices" className="py-[clamp(90px,14vh,190px)]">
      <div className="shell">
        <div className="grid12 items-start gap-y-10">
          <div className="col-span-4 md:col-span-3">
            <Index n="05" label="Clients" />
          </div>

          {/* the quote — large, editorial, swapped by index */}
          <div className="col-span-4 md:col-span-9">
            <blockquote
              key={q.n}
              className="m-0 font-display text-[clamp(26px,4.6vw,72px)] leading-[1.06] tracking-[-.032em]"
              style={{ animation: 'quoteIn .9s cubic-bezier(.16,1,.3,1) forwards' }}
            >
              <span className="text-accent">“</span>
              {q.content}
            </blockquote>

            <div className="rule mt-[clamp(32px,5vh,64px)] flex flex-wrap items-center justify-between gap-6 pt-6">
              <div
                key={`${q.n}-by`}
                style={{ animation: 'quoteIn .7s cubic-bezier(.16,1,.3,1) forwards' }}
              >
                <div className="text-[15px] font-medium tracking-[-.02em]">{q.name}</div>
                <div className="meta mt-1.5">{q.role}</div>
              </div>

              {/* numeric selector, not dots */}
              <div className="flex items-center gap-6">
                {quotes.map((t, idx) => (
                  <button
                    key={t.n}
                    onClick={() => setI(idx)}
                    aria-label={`Read testimonial ${t.n}`}
                    className={`meta relative bg-transparent transition-colors duration-500 ${
                      idx === i ? 'text-accent' : 'text-paper/40 hover:text-paper'
                    }`}
                  >
                    {t.n}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-700 ease-swiss ${
                        idx === i ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
