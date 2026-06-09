import { ContactSection } from "@/components/site/ContactSection";

function ContactPage({ selectedPlan, submitted, whatsappMessage, handleSubmit }) {
  return (
    <ContactSection
      selectedPlan={selectedPlan}
      submitted={submitted}
      whatsappMessage={whatsappMessage}
      handleSubmit={handleSubmit}
    />
  );
}

export default ContactPage;
