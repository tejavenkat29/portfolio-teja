import { Hero } from "@/components/hero/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { SystemDesign } from "@/components/sections/system-design";
import { Skills } from "@/components/sections/skills";
import { Stack } from "@/components/sections/stack";
import { Achievements } from "@/components/sections/achievements";
import { Github } from "@/components/sections/github";
import { Resume } from "@/components/sections/resume";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Experience />
      <Projects />
      <SystemDesign />
      <Skills />
      <Stack />
      <Achievements />
      <Github />
      <Resume />
      <Contact />
    </>
  );
}
