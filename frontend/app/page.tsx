import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import ExclusiveDeals from "@/components/home/ExclusiveDeals";
import PopularCategories from "@/components/home/PopularCategories";
import PopularRestaurants from "@/components/home/PopularRestaurants";
import AppDownload from "@/components/home/AppDownload";
import PartnerSection from "@/components/home/PartnerSection";
import FAQSection from "@/components/home/FAQSection";
import StatsBar from "@/components/home/StatsBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <ExclusiveDeals />
        <PopularCategories />
        <PopularRestaurants />
        <AppDownload />
        <PartnerSection />
        <FAQSection />
        <StatsBar />
      </main>

      <Footer />
    </div>
  );
}
