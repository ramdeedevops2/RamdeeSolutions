import { useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

/* Where enquiries go.
   - With VITE_WEB3FORMS_KEY set (free key from https://web3forms.com), the form
     posts straight to Web3Forms, which emails the enquiry to the key's inbox.
   - Without it, submitting opens the visitor's mail app with everything
     pre-filled, addressed to CONTACT_EMAIL — so the form is never a dead end.
   The address is never rendered on the page. */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const CONTACT_EMAIL = 'ramdeesolutions@icloud.com';

const services = [
  'Web Development',
  'Cloud Solutions',
  'AI Automation',
  'Mobile Apps',
  'Cybersecurity',
  'IT Consulting',
];
const budgets = ['< ₹2L', '₹2L – ₹5L', '₹5L – ₹15L', '₹15L +', 'Not sure yet'];

type Fields = { name: string; email: string; phone: string; company: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const empty: Fields = { name: '', email: '', phone: '', company: '', message: '' };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email';
  if (f.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(f.phone.trim())) e.phone = 'Check the number';
  if (f.message.trim().length < 10) e.message = 'A sentence or two, please';
  return e;
}

/* ---------- a single underlined field ---------- */
function Field({
  id,
  label,
  optional,
  error,
  children,
  className = '',
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  /* the error shares the label's line (replacing "Optional"), so showing it
     never pushes the form taller — keeps the whole form inside one screen */
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="meta">
          {label}
        </label>
        <span
          id={`${id}-err`}
          role={error ? 'alert' : undefined}
          className={`truncate text-right text-[12px] ${error ? 'text-accent' : 'meta text-paper/30'}`}
        >
          {error || (optional ? 'Optional' : '')}
        </span>
      </div>
      {children}
    </div>
  );
}

const inputCls = (bad?: string) =>
  `field mt-1 block w-full border-0 border-b bg-transparent px-0 py-2 text-[clamp(15px,1.15vw,18px)] tracking-[-.015em] text-paper placeholder:text-paper/25 outline-none transition-colors duration-500 ease-swiss focus:border-accent ${
    bad ? 'border-accent' : 'border-paper/25 hover:border-paper/50'
  }`;

/* ---------- pill toggles for service / budget ---------- */
function Chips({
  legend,
  options,
  value,
  onToggle,
}: {
  legend: string;
  options: string[];
  value: string[];
  onToggle: (o: string) => void;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="meta mb-3 p-0">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] tracking-[-.01em] transition-all duration-500 ease-swiss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                on
                  ? 'border-accent bg-accent text-ink'
                  : 'border-paper/20 text-paper/70 hover:border-paper/60 hover:text-paper'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function ContactForm() {
  const [f, setF] = useState<Fields>(empty);
  const [picked, setPicked] = useState<string[]>([]);
  const [budget, setBudget] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const form = useRef<HTMLFormElement | null>(null);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    // once the visitor has tried to submit, re-validate live so errors clear as they fix them
    if (touched) setErrors(validate(next));
  };

  const toggle = (o: string) =>
    setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);

    // honeypot: real people never see or fill this
    const trap = (e.currentTarget.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked;
    if (trap) return;

    const errs = validate(f);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`#cf-${first}`)?.focus();
      return;
    }

    const details = [
      `Name: ${f.name.trim()}`,
      `Email: ${f.email.trim()}`,
      f.phone.trim() ? `Phone: ${f.phone.trim()}` : '',
      f.company.trim() ? `Company: ${f.company.trim()}` : '',
      picked.length ? `Interested in: ${picked.join(', ')}` : '',
      budget.length ? `Budget: ${budget[0]}` : '',
    ].filter(Boolean);
    const summary = `${details.join('\n')}\n\n${f.message.trim()}`;

    if (!WEB3FORMS_KEY) {
      const subject = `Project enquiry — ${f.name.trim()}${f.company.trim() ? `, ${f.company.trim()}` : ''}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New enquiry from ${f.name.trim()} — ramdeesolutions website`,
          from_name: 'Ramdee Solutions website',
          replyto: f.email.trim(),
          name: f.name.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          company: f.company.trim(),
          services: picked.join(', '),
          budget: budget[0] ?? '',
          message: f.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || 'Request failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setF(empty);
    setPicked([]);
    setBudget([]);
    setErrors({});
    setTouched(false);
    setStatus('idle');
  };

  /* ---------- sent ---------- */
  if (status === 'sent') {
    return (
      <div
        className="flex min-h-[420px] flex-col justify-center"
        style={{ animation: 'quoteIn .9s cubic-bezier(.16,1,.3,1) forwards' }}
        role="status"
      >
        <span className="meta text-accent">Enquiry {WEB3FORMS_KEY ? 'received' : 'ready to send'}</span>
        <p className="m-0 mt-5 font-display text-[clamp(30px,4vw,60px)] leading-[1.02] tracking-[-.03em]">
          Thank you, {f.name.trim().split(' ')[0]}.
          <br />
          <span className="italic text-paper/60">
            {WEB3FORMS_KEY
              ? 'We will be in touch shortly.'
              : 'Your mail app should open with the details filled in.'}
          </span>
        </p>
        <p className="mt-6 max-w-[46ch] text-[14px] leading-[1.6] text-paper/55">
          {WEB3FORMS_KEY ? (
            <>
              Our reply will come to <span className="text-paper/80">{f.email.trim()}</span>.
            </>
          ) : (
            'Send the email from your mail app to complete the enquiry.'
          )}
        </p>
        <button
          type="button"
          onClick={reset}
          className="ul meta mt-8 w-fit bg-transparent text-paper/70 transition-colors hover:text-accent"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  /* ---------- form ---------- */
  return (
    <form id="enquiry" ref={form} noValidate onSubmit={onSubmit} aria-label="Project enquiry" className="grid gap-y-6">
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <Field id="cf-name" label="Your name" error={errors.name}>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            value={f.name}
            onChange={set('name')}
            placeholder="Full name"
            aria-invalid={!!errors.name}
            aria-describedby="cf-name-err"
            className={inputCls(errors.name)}
          />
        </Field>
        <Field id="cf-email" label="Email" error={errors.email}>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={f.email}
            onChange={set('email')}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby="cf-email-err"
            className={inputCls(errors.email)}
          />
        </Field>
        <Field id="cf-phone" label="Phone" optional error={errors.phone}>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={f.phone}
            onChange={set('phone')}
            placeholder="+91"
            aria-invalid={!!errors.phone}
            aria-describedby="cf-phone-err"
            className={inputCls(errors.phone)}
          />
        </Field>
        <Field id="cf-company" label="Company" optional>
          <input
            id="cf-company"
            name="company"
            autoComplete="organization"
            value={f.company}
            onChange={set('company')}
            placeholder="Where you work"
            className={inputCls()}
          />
        </Field>
      </div>

      <Chips legend="What do you need?" options={services} value={picked} onToggle={toggle} />
      <Chips
        legend="Approximate budget"
        options={budgets}
        value={budget}
        onToggle={(o) => setBudget((b) => (b[0] === o ? [] : [o]))}
      />

      <Field id="cf-message" label="About the project" error={errors.message}>
        <textarea
          id="cf-message"
          name="message"
          rows={3}
          value={f.message}
          onChange={set('message')}
          placeholder="What are you building, and where are you stuck?"
          aria-invalid={!!errors.message}
          aria-describedby="cf-message-err"
          className={`${inputCls(errors.message)} resize-none leading-[1.5]`}
        />
      </Field>

      {/* honeypot — hidden from people and assistive tech */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 opacity-0"
        style={{ left: '-9999px' }}
      />

      <div className="flex flex-wrap items-center justify-between gap-6">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex items-center gap-3 bg-transparent text-paper disabled:cursor-wait disabled:opacity-60"
        >
          <span className="relative text-[clamp(15px,1.3vw,19px)] tracking-[-.02em]">
            {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-paper transition-transform duration-700 ease-swiss group-hover:origin-right group-hover:scale-x-0" />
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform delay-[120ms] duration-700 ease-swiss group-hover:origin-left group-hover:scale-x-100" />
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-paper/20 transition-all duration-700 ease-swiss group-hover:border-accent group-hover:bg-accent">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform duration-700 ease-swiss group-hover:rotate-45 ${
                status === 'sending' ? 'animate-pulse' : ''
              }`}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>

        <p className="meta m-0 max-w-[36ch] text-paper/40">
          {status === 'error' ? (
            <span className="text-accent" role="alert">
              Could not send — please try again in a moment
            </span>
          ) : (
            'Your details are used only to reply to you'
          )}
        </p>
      </div>
    </form>
  );
}
