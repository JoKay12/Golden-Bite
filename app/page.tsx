import { BasketProvider } from "@/components/basket/BasketProvider";
import { MenuSection } from "@/components/menu/MenuSection";
import {
  Announcement,
  Catering,
  Footer,
  Hero,
  HowToOrder,
  Payment,
  ServiceStrip,
  SiteHeader,
} from "@/components/sections";
import { StructuredData } from "@/components/StructuredData";
import { WelcomeTour } from "@/components/WelcomeTour";

export default function Home() {
  return (
    <BasketProvider>
      <a className="skip-link" href="#menu">
        Skip to menu
      </a>
      <Announcement />
      <SiteHeader />
      <main>
        <Hero />
        <ServiceStrip />
        <MenuSection />
        <HowToOrder />
        <Payment />
        <Catering />
      </main>
      <Footer />
      <StructuredData />
      <WelcomeTour />
    </BasketProvider>
  );
}
