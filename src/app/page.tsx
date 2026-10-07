import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Disclaimer } from "@/components/landing/disclaimer";
import { ExperiencePreview } from "@/components/landing/experience-preview";
import { TrustStrip } from "@/components/landing/trust-strip";
import { VerificationTypes } from "@/components/landing/verification-types";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <VerificationTypes />
        <ExperiencePreview />
        <Disclaimer />
      </main>
      <Footer />
    </>
  );
}
