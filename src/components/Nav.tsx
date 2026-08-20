import { Wordmark, ThemeToggle } from './Ui';
import { useScrolled, useClock } from '../hooks/useMotion';

const links = [
  { href: '#services', label: 'Index' },
  { href: '#approach', label: 'Studio' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const stuck = useScrolled(40);
  const time = useClock();

  return (
    <nav className="fixed inset-x-0 top-0 z-[150]">
      <div
        className={`transition-colors duration-700 ease-swiss ${
          stuck ? 'bg-ink/80 backdrop-blur-md' : ''
        }`}
      >
        <div className="shell">
          <div className="grid12 items-center py-4">
            <div className="col-span-2 md:col-span-3">
              <Wordmark />
            </div>

            <div className="col-span-2 hidden md:col-span-6 md:flex md:justify-center md:gap-10">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="ul meta text-paper/70 no-underline transition-colors duration-500 hover:text-paper"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="col-span-2 flex items-center justify-end gap-5 md:col-span-3">
              <span className="meta hidden items-center gap-2 text-paper/60 md:flex">
                <span className="h-1 w-1 animate-blink rounded-full bg-accent" />
                CHD {time}
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className={`rule transition-opacity duration-700 ${stuck ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </nav>
  );
}
