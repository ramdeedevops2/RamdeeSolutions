import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import WhyChoose from './components/WhyChoose';
import Testimonials from './components/Testimonials';
import Statistics from './components/Statistics';
import CTA from './components/CTA';
import { useReveal } from './hooks/useMotion';
import { useAnchorScroll } from './hooks/useAnchorScroll';

function App() {
  useReveal();
  useAnchorScroll();

  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Portfolio />
        <WhyChoose />
        <Testimonials />
        <Statistics />
        <CTA />
      </main>
    </div>
  );
}

export default App;
