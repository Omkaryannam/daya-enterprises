import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import FeaturedLED from "@/components/FeaturedLED";
import FeaturedCCTV from "@/components/FeaturedCCTV";
import FeaturedRoadSafety from "@/components/FeaturedRoadSafety";
import FeaturedStrip from "@/components/FeaturedStrip";
import WhyChooseUs from "@/components/WhyChooseUs";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Industries from "@/components/Industries";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <FeaturedLED />
        <FeaturedCCTV />
        <FeaturedRoadSafety />
        <FeaturedStrip />
        <WhyChooseUs />
        <Projects />
        <Process />
        <Industries />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
