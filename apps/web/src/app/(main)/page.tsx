import HeroSection from "@/components/home/hero";
import FeatureSection from "@/components/home/features";
import { PricingSection } from "@/components/home/pricing";
import { FaqsSection } from "@/components/home/faqs";
import TestimonialSection from "@/components/home/testimonial";

export const metadata = {
  title: "iDoc - Digital Document Library",
  description: "Access a world of knowledge with iDoc",
};

export default function Home() {
  return (
    <div className="pt-20 space-y-10 md:space-y-20">
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <TestimonialSection />
      <div className="border-t">
        <FaqsSection />
      </div>
    </div>
  );
}
