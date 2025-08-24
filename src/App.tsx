import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

import IndexFr from "./pages/fr/Index";
import IndexDe from "./pages/de/Index";
import IndexEn from "./pages/en/Index";
import ReservationFr from "./pages/fr/Reservation";
import ReservationDe from "./pages/de/Reservation";
import ReservationEn from "./pages/en/Reservation";
import LoginFr from "./pages/fr/Login";
import LoginDe from "./pages/de/Login";
import LoginEn from "./pages/en/Login";
import DashboardFr from "./pages/fr/Dashboard";
import DashboardDe from "./pages/de/Dashboard";
import DashboardEn from "./pages/en/Dashboard";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading ? (
          <Loader onComplete={handleLoaderComplete} />
        ) : (
          <BrowserRouter>
            <LanguageProvider>
              <Routes>
                {/* Redirection par défaut vers français */}
                <Route path="/" element={<IndexFr />} />
                
                {/* Routes françaises */}
                <Route path="/fr" element={<IndexFr />} />
                <Route path="/fr/reservation" element={<ReservationFr />} />
                <Route path="/fr/login" element={<LoginFr />} />
                <Route path="/fr/dashboard" element={<DashboardFr />} />
                
                {/* Routes allemandes */}
                <Route path="/de" element={<IndexDe />} />
                <Route path="/de/reservation" element={<ReservationDe />} />
                <Route path="/de/login" element={<LoginDe />} />
                <Route path="/de/dashboard" element={<DashboardDe />} />
                
                {/* Routes anglaises */}
                <Route path="/en" element={<IndexEn />} />
                <Route path="/en/reservation" element={<ReservationEn />} />
                <Route path="/en/login" element={<LoginEn />} />
                <Route path="/en/dashboard" element={<DashboardEn />} />
                
                {/* Anciennes routes - redirection vers français */}
                <Route path="/reservation" element={<ReservationFr />} />
                <Route path="/login" element={<LoginFr />} />
                <Route path="/dashboard" element={<DashboardFr />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LanguageProvider>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;