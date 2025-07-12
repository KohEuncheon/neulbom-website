import { Header } from "@/components/website/Header";
import { BannerSlide } from "@/components/website/BannerSlide";
import { VideoSection } from "@/components/website/VideoSection";
import { CalendarSection } from "@/components/website/CalendarSection";
import { ContactSection } from "@/components/website/ContactSection";
import { Footer } from "@/components/website/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="pt-20">
        <BannerSlide />

        <VideoSection />
        <CalendarSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
