import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import StatsCounter from "@/components/StatsCounter";
import SpatialServices from "@/components/SpatialServices";
import Pricing from "@/components/Pricing";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";
import TeamSection from "@/components/TeamSection";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import DesignPanel from "@/components/DesignPanel";
import LogoOptionSwitch from "@/components/LogoOptionSwitch";
import { DesignProvider } from "@/lib/design";

export default function Home() {
  return (
    <DesignProvider>
      <Navbar />
      <main>
        <Hero3D />
        <StatsCounter />
        <SpatialServices />
        <ShowcaseCarousel />
        <TeamSection />
        <Pricing />
        <BookingSection />
      </main>
      <Footer />
      <DesignPanel />
      <LogoOptionSwitch current="a" />
    </DesignProvider>
  );
}
