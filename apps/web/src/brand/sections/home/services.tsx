import { Button, Section, ServicesIndex } from "@/components/ui";

/**
 * Chapter 01: all twelve services with their starting price. Desktop gets the
 * sticky frame with one photo per group (3 lazy images, not 12); phones get
 * the 2-up icon-and-price cards.
 */
export function HomeServices() {
  return (
    <Section
      id="services"
      number="01"
      eyebrow="Services"
      title="Twelve services, one house"
      lead="Weddings, corporate events and the production behind them. Every service shows its starting price."
      actions={
        <Button variant="text" href="/services" cta="home_all_services" location="home-services" arrow>
          All services
        </Button>
      }
    >
      <ServicesIndex items="all" grouped frame="groups" location="home-services" />
    </Section>
  );
}
