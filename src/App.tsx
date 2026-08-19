import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import WhyChoose from './components/WhyChoose';
import Testimonials from './components/Testimonials';
import Statistics from './components/Statistics';
import CTA from './components/CTA';
import { useReveal } from './hooks/useMotion';

function App() {
  useReveal();

  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <main>
        <Hero />
        <Marquee />
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
