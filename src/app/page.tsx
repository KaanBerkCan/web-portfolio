import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { WorksSection } from "@/components/WorksSection";
import { EducationExperienceSection } from "@/components/EducationExperienceSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <WorksSection />
      <EducationExperienceSection />
      <ContactSection />
    </>
  );
}
