import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { CalendarSection } from "@/components/website/CalendarSection";

export default function ReservationStatus() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            <span>HOME</span> &gt; <span>예약 현황 달력</span>
          </div>

          <CalendarSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
