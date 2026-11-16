import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import StatsCounter from "@/components/StatsCounter";
import SpatialServices from "@/components/SpatialServices";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero3D />
        <StatsCounter />
        <SpatialServices />
        <ShowcaseCarousel />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
