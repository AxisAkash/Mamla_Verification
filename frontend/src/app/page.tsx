import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Disclaimer } from "@/components/landing/disclaimer";
import { ExperiencePreview } from "@/components/landing/experience-preview";
import { FinalCta } from "@/components/landing/final-cta";
import { HumanControl } from "@/components/landing/human-control";
import { NoticeVsLaw } from "@/components/landing/notice-vs-law";
import { PrivacyTrust } from "@/components/landing/privacy-trust";
import { ResultStates } from "@/components/landing/result-states";
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
        <NoticeVsLaw />
        <ResultStates />
        <HumanControl />
        <ExperiencePreview />
        <PrivacyTrust />
        <Disclaimer />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
