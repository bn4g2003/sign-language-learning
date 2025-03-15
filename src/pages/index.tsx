import MainLayout from "@/components/MainLayout";
import Navbar from '@/components/Navbar';
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div>
      <Navbar />
      <MainLayout>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <Footer />
      </MainLayout>
    </div>
  );
}