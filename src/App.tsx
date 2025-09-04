import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";

// Import admin components
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminSchedule from "./pages/admin/AdminSchedule";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
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
              
              {/* Routes allemandes */}
              <Route path="/de" element={<IndexDe />} />
              <Route path="/de/reservation" element={<ReservationDe />} />
              <Route path="/de/login" element={<LoginDe />} />
              
              {/* Routes anglaises */}
              <Route path="/en" element={<IndexEn />} />
              <Route path="/en/reservation" element={<ReservationEn />} />
              <Route path="/en/login" element={<LoginEn />} />
              
              {/* Routes admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="schedule" element={<AdminSchedule />} />
              </Route>
              
              {/* Anciennes routes - redirection vers français */}
              <Route path="/login" element={<LoginFr />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </BrowserRouter>
      )}
    </QueryClientProvider>
  );
};

export default App;