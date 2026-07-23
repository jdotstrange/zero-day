import {
  LandingHeader,
  HeroSection,
  DemosSection,
  FeaturesSection,
  WidgetsSection,
  TestimonialsSection,
  PricingSection,
  FaqSection,
  CtaSection,
  LandingFooter,
} from './sections'

/**
 * Home Page Component
 * Landing page for the admin template
 */
export function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <DemosSection />
      <FeaturesSection />
      <WidgetsSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
