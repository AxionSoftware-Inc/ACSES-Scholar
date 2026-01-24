import { Hero } from "../components/sections/Hero";
import { Services } from "../components/sections/Services";
import { Ecosystem } from "../components/sections/Ecosystem";
import { CTA } from "../components/sections/CTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Ecosystem />
      <CTA />
    </main>
  );
}
