import { ArrowRight, CalendarDays, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brand } from "@/data/siteData";
import { createWhatsAppUrl } from "@/utils/whatsapp";
import "./ContactSection.css";

function ContactSection({ selectedPlan, submitted, whatsappMessage, handleSubmit }) {
  const quickWhatsappMessage =
    whatsappMessage || `Hi ${brand.name}, I want to book a trial for the ${selectedPlan} plan.`;

  return (
    <section id="contact" className="section-block">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Badge variant="success" appearance="light">
              Trial booking
            </Badge>
            <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
              Start with a coach-led assessment.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Share your goal and preferred plan. The team will confirm your first session slot.
            </p>

            <div className="mt-8 grid gap-4">
              <ContactItem icon={MapPin} title="Location" value={brand.location} />
              <ContactItem icon={Phone} title="Phone" value={brand.phone} />
              <ContactItem icon={Mail} title="Email" value={brand.email} />
              <ContactItem icon={CalendarDays} title="Hours" value={brand.hours} />
            </div>

            <div className="contact-whatsapp-stack">
              {brand.whatsappNumbers.map((whatsappNumber) => (
                <Button key={whatsappNumber.number} asChild variant="outline">
                  <a
                    href={createWhatsAppUrl(whatsappNumber.number, quickWhatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp {whatsappNumber.label}
                    <MessageCircle />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <Card className="contact-card">
            <CardHeader>
              <CardHeading>
                <CardTitle>Book a trial</CardTitle>
                <CardDescription>Selected membership: {selectedPlan}</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent>
              <form className="contact-form grid gap-4" onSubmit={handleSubmit}>
                <input type="hidden" name="membership" value={selectedPlan} readOnly />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="trial-name">Full name</label>
                    <Input id="trial-name" name="name" placeholder="Full name" autoComplete="name" required />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="trial-phone">Phone number</label>
                    <Input id="trial-phone" name="phone" placeholder="Phone number" autoComplete="tel" required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="trial-email">Email address</label>
                    <Input id="trial-email" name="email" type="email" placeholder="Email address" autoComplete="email" required />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="trial-goal">Primary goal</label>
                    <Input id="trial-goal" name="goal" placeholder="Primary goal" />
                  </div>
                </div>
                <label className="sr-only" htmlFor="trial-notes">Preferred time or training history</label>
                <textarea
                  id="trial-notes"
                  name="notes"
                  className="contact-textarea"
                  placeholder="Preferred time or training history"
                />
                <Button type="submit" size="lg">
                  Request Trial
                  <ArrowRight />
                </Button>
                {submitted && (
                  <div className="contact-success">
                    <div role="status">
                      Thanks - your {selectedPlan} trial details are ready in WhatsApp. Tap send to share it with the gym.
                    </div>
                    <div className="contact-success-actions" aria-label="Send trial details on WhatsApp">
                      {brand.whatsappNumbers.map((whatsappNumber) => (
                        <Button key={whatsappNumber.number} asChild size="sm" variant="outline">
                          <a
                            href={createWhatsAppUrl(whatsappNumber.number, quickWhatsappMessage)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Send to {whatsappNumber.label}
                            <MessageCircle />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, title, value }) {
  return (
    <div className="contact-item flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="contact-item-value text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}

export { ContactSection };
