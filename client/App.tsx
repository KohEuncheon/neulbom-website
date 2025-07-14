import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminIndex from "./pages/AdminIndex";
import AdminReservations from "./pages/AdminReservations";
import About from "./pages/About";
import MCs from "./pages/MCs";
import MCDetail from "./pages/MCDetail";
import Reservation from "./pages/Reservation";
import ReservationStatus from "./pages/ReservationStatus";
import Promotion from "./pages/Promotion";
import PromotionEditor from "./pages/PromotionEditor";
import Guidance from "./pages/Guidance";
import Facilities from "./pages/Facilities";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 전역 오류 핸들러 추가
window.addEventListener('error', (event) => {
  console.error('전역 오류:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('처리되지 않은 Promise 거부:', event.reason);
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/mcs" element={<MCs />} />
          <Route path="/mcs/:id" element={<MCDetail />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation-status" element={<ReservationStatus />} />
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/promotion/editor" element={<PromotionEditor />} />
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/facilities" element={<Facilities />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
