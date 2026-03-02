import { Hero } from "@/app/components/sections/Hero";
import { Services } from "@/app/components/sections/Services";
import { Ecosystem } from "@/app/components/sections/Ecosystem";
import { CTA } from "@/app/components/sections/CTA";

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
