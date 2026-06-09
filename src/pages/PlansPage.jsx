import { PricingSection } from "@/components/site/PricingSection";

function PlansPage({ selectedPlan, setSelectedPlan }) {
  return (
    <PricingSection
      selectedPlan={selectedPlan}
      setSelectedPlan={setSelectedPlan}
    />
  );
}

export default PlansPage;
