import React, { useState, useEffect } from "react";
import { Room, Booking, Review } from "./types";
import { KPI3DCard, MiniMeters } from "./components/DashboardWidgets";
import { CodeExplorer } from "./components/CodeExplorer";
import { CustomerPortal } from "./components/CustomerPortal";
import { HotelManagerPortal } from "./components/HotelManagerPortal";
import { AdminPortal } from "./components/AdminPortal";
import { AiConcierge } from "./components/AiConcierge";
import { NotificationConsole } from "./components/NotificationConsole";
import { 
  Building2, 
  Sparkles, 
  MessageSquare, 
  FolderGit2, 
  Users, 
  Clock, 
  CloudSun, 
  ArrowRight, 
  DollarSign, 
  Percent,
  Compass, 
  LogOut, 
  Layers,
  Wrench,
  ChevronRight,
  BellRing
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Domain States (Simulated live database, keeps local copies)
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // App UI Controller states
  const [activePortal, setActivePortal] = useState<"customer" | "manager" | "admin" | "code">("customer");
  const [showAiConcierge, setShowAiConcierge] = useState(false);
  const [themeStyle, setThemeStyle] = useState<"silver-blue" | "golden-sand" | "emerald-reef">("silver-blue");
  
  // Telemetry logs state
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);

  // Toast Queue States
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "info" | "success" | "warning" }>>([]);

  // Load initial rooms & bookings from server
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const roomsRes = await fetch("/api/rooms");
      const rData = await roomsRes.json();
      setRooms(rData);

      const bookingsRes = await fetch("/api/bookings");
      const bData = await bookingsRes.json();
      setBookings(bData);

      const reviewsRes = await fetch("/api/reviews");
      const revData = await reviewsRes.json();
      setReviews(revData);

      addTelemetryLog("SQL_Server", "Established secure connection to SQL Server instance.", "info");
      addTelemetryLog("SQL_Server", "Successfully seeded luxury rooms & bookings dataset via migrations.", "success");
    } catch (err) {
      console.error(err);
      // Fallback local init if server connection error
      setRooms([
        { id: "rm-101", number: "101", type: "Suite Room", price: 450, status: "Available", floor: 1, amenities: ["Ocean View", "King Bed", "Private Pool"], image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" },
        { id: "rm-102", number: "102", type: "Deluxe Room", price: 280, status: "Available", floor: 1, amenities: ["City View", "Queen Bed", "Mini-bar"], image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39" },
        { id: "rm-201", number: "201", type: "Family Room", price: 340, status: "Occupied", floor: 2, amenities: ["Gardens View", "Double Beds"], image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a" }
      ]);
    }
  };

  const addTelemetryLog = (source: string, message: string, type: "info" | "success" | "critical" | "warning" = "info") => {
    const timeStr = new Date().toLocaleTimeString();
    setTelemetryLogs(prev => [
      { timestamp: timeStr, source, message, type },
      ...prev.slice(0, 30) // Cap at 30 entries
    ]);
  };

  const showToast = (message: string, type: "info" | "success" | "warning" = "info") => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Operations procedures
  const handleAddNewBooking = async (bData: any) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bData)
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => [data.booking, ...prev]);
        
        // Refresh local room cache to reflect 'Occupied' changes
        fetchData();
        
        showToast(`Successfully booked Suite room ${bData.roomNumber}! QR Code generated.`, "success");
        addTelemetryLog("Stripe", `Stripe Charge of $${bData.cost} approved. IntentId: pi_prestige_${data.booking.id}`, "success");
        addTelemetryLog("SignalR", `[SignalR Socket] Broadcasted Event: [Booking Booked] - Guest ${bData.guestName} settled check-in.`, "info");
      }
    } catch (err) {
      console.error(err);
      showToast("Booking gateway timeout. Please retry.", "warning");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "Cancelled", paymentStatus: "Refunded" } : b));
        
        // Refresh room cache to free occupied room
        fetchData();
        
        showToast(`Booking ${bookingId} cancelled. Funds reversed via Stripe.`, "info");
        addTelemetryLog("Stripe", `Initiated full refund of booking references ${bookingId} on Stripe balances.`, "warning");
        addTelemetryLog("SignalR", `[SignalR Socket] Broadcasted Event: [Booking Cancelled] - Reservation ${bookingId} cancelled.`, "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (bookingId: string, rating: number, comment: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, rating, review: comment } : b));
        
        // Reload reviews collection
        const revRes = await fetch("/api/reviews");
        const revData = await revRes.json();
        setReviews(revData);

        showToast("Feedback cataloged! Awaiting general moderation approval.", "success");
        addTelemetryLog("SQL_Server", `Triggered Stored Procedure: [InsertGuestReview] - BookingID: ${bookingId}`, "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerateReview = async (revId: string, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch(`/api/reviews/${revId}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === revId ? { ...r, status } : r));
        showToast(`Review moderate flag set as: ${status}`, "info");
        addTelemetryLog("SQL_Server", `Audit Log: Review ID ${revId} moderated flag verified by Admin as [${status}].`, "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRoom = async (roomData: any) => {
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => [...prev, data.room]);
        showToast(`Suite Room ${roomData.number} registered safely into system repository.`, "success");
        addTelemetryLog("SQL_Server", `Executed SQL: INSERT INTO dbo.Rooms (RoomNumber, BasePrice) VALUES ('${roomData.number}', ${roomData.price})`, "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRoom = async (roomId: string, updateData: any) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...updateData } : r));
        showToast("Suite details updated successfully.", "info");
        addTelemetryLog("SQL_Server", `Executed SQL: UPDATE dbo.Rooms SET Status/Price for Room ID: ${roomId}`, "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => prev.filter(r => r.id !== roomId));
        showToast("Suite deleted safely.", "info");
        addTelemetryLog("SQL_Server", `Executed SQL: DELETE FROM dbo.Rooms WHERE RoomId = ${roomId}`, "warning");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Aesthetic color picker computed CSS values
  const themeColors = {
    "silver-blue": {
      gradient: "from-blue-600 to-sky-500",
      accentBg: "bg-blue-600 hover:bg-blue-500",
      accentText: "text-blue-600",
      pillBg: "bg-blue-50 text-blue-800 border-blue-200"
    },
    "golden-sand": {
      gradient: "from-amber-600 to-yellow-500",
      accentBg: "bg-amber-600 hover:bg-amber-500",
      accentText: "text-amber-600",
      pillBg: "bg-amber-50 text-amber-800 border-amber-200"
    },
    "emerald-reef": {
      gradient: "from-emerald-600 to-teal-500",
      accentBg: "bg-emerald-600 hover:bg-emerald-500",
      accentText: "text-emerald-600",
      pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200"
    }
  };

  const colors = themeColors[themeStyle];

  // Dynamic resort weather conditions configuration list based on current selection
  const liveWeather = {
    temp: "29°C",
    climate: "Sunny Sky",
    humidity: "62%",
    wind: "11 km/h"
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-500/10 select-none flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">
      
      {/* Toast notifications rendering block */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3.5 px-5 rounded-3xl border shadow-xl flex items-center gap-3 backdrop-blur-md max-w-sm font-sans text-xs font-semibold ${
                toast.type === 'success' ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200 shadow-emerald-100' :
                toast.type === 'warning' ? 'bg-amber-50/90 text-amber-800 border-amber-200 shadow-amber-100 animate-bounce' :
                'bg-slate-900/95 text-white border-slate-800 shadow-slate-950/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'warning' ? 'bg-amber-500' : 'bg-sky-400'}`} />
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Side Concierge Panel Trigger (Aura Concierge) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setShowAiConcierge(!showAiConcierge)}
          className={`p-4 rounded-full text-white shadow-2xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${colors.accentBg}`}
        >
          <MessageSquare className="animate-pulse" size={18} />
          <span className="text-xs font-extrabold uppercase tracking-widest leading-none pr-1">AURA Concierge</span>
        </button>
      </div>

      {/* Actual AI Concierge Drawer */}
      <AnimatePresence>
        {showAiConcierge && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] bg-white border-r border-slate-200/80 shadow-2xl flex flex-col justify-between"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white select-none">
              <span className="text-xs font-bold uppercase tracking-wider">AURA Concierge Drawer</span>
              <button
                onClick={() => setShowAiConcierge(false)}
                className="p-1 px-3 bg-white/10 rounded-lg text-white hover:bg-white/20 text-xs font-mono font-bold font-semibold cursor-pointer"
              >
                CLOSE
              </button>
            </div>
            
            <div className="flex-1 overflow-auto">
              <AiConcierge />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className="w-64 h-full bg-white border-r border-slate-200 hidden lg:flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-450 to-blue-600 rounded-xl shadow-lg shadow-sky-100 flex items-center justify-center text-white">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
              Prestige<span className="text-sky-500 underline decoration-2 underline-offset-4 ml-0.5">Luxe</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono block mt-1 font-semibold uppercase">SaaS v2026.1</span>
          </div>
        </div>
        
        {/* Navigation Portal list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] text-slate-400 font-bold uppercase px-3 mb-2 tracking-widest">Dashboards</p>
          <button
            onClick={() => setActivePortal("customer")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-xs text-left cursor-pointer ${
              activePortal === "customer"
                ? "bg-sky-50 text-sky-700 border border-sky-100/60"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Compass size={16} />
            <span>Customer Portal</span>
          </button>
          <button
            onClick={() => setActivePortal("manager")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-xs text-left cursor-pointer ${
              activePortal === "manager"
                ? "bg-sky-50 text-sky-700 border border-sky-100/60"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Wrench size={16} />
            <span>Hotel Management</span>
          </button>
          <button
            onClick={() => setActivePortal("admin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-xs text-left cursor-pointer ${
              activePortal === "admin"
                ? "bg-sky-50 text-sky-700 border border-sky-100/60"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Layers size={16} />
            <span>Admin Cockpit</span>
          </button>
          <button
            onClick={() => setActivePortal("code")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-xs text-left cursor-pointer ${
              activePortal === "code"
                ? "bg-sky-50 text-sky-700 border border-sky-100/60"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <FolderGit2 size={16} />
            <span>Source Explorer</span>
          </button>

          <div className="pt-8 space-y-3 px-3">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Style Settings</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-medium">Palette:</span>
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setThemeStyle("silver-blue")}
                  title="Silver Maldives Indigo"
                  className={`w-3.5 h-3.5 rounded-full bg-blue-600 transition-all cursor-pointer ${themeStyle === "silver-blue" ? "ring-2 ring-slate-900 ring-offset-1 scale-110" : "opacity-80"}`}
                />
                <button
                  onClick={() => setThemeStyle("golden-sand")}
                  title="Golden Horizon Sand"
                  className={`w-3.5 h-3.5 rounded-full bg-amber-600 transition-all cursor-pointer ${themeStyle === "golden-sand" ? "ring-2 ring-slate-900 ring-offset-1 scale-110" : "opacity-80"}`}
                />
                <button
                  onClick={() => setThemeStyle("emerald-reef")}
                  title="Emerald Atoll Lagoon"
                  className={`w-3.5 h-3.5 rounded-full bg-emerald-600 transition-all cursor-pointer ${themeStyle === "emerald-reef" ? "ring-2 ring-slate-900 ring-offset-1 scale-110" : "opacity-80"}`}
                />
              </div>
            </div>
            
            <div className="pt-2 text-[10px] text-slate-400 font-medium leading-relaxed">
              <span className="font-bold text-slate-500 uppercase block mb-1">Local Maldives Weather</span>
              <p>{liveWeather.temp} • {liveWeather.climate}</p>
              <p>Humidity: {liveWeather.humidity} • Wind: {liveWeather.wind}</p>
            </div>
          </div>
        </nav>

        {/* Enterprise Upgrade Box at the bottom */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20 text-white">
              <Sparkles size={18} />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Account Status</p>
            <p className="text-white font-extrabold text-sm leading-tight">Enterprise Core Plan</p>
            <button
              type="button"
              onClick={() => showToast("Account is already at maximum Enterprise level. License managed by SQL db.", "success")}
              className="mt-3 w-full bg-sky-500 hover:bg-sky-400 text-white py-2 rounded-lg text-xs font-bold shadow-lg shadow-sky-900/40 transition cursor-pointer"
            >
              Enterprise Verified
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area Container - Right Side */}
      <main className="flex-1 flex flex-col overflow-y-auto lg:h-screen lg:overflow-y-auto">
        
        {/* Responsive Mobile Header & Navigation Top bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 lg:relative">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="lg:hidden w-8 h-8 bg-gradient-to-tr from-sky-450 to-blue-600 rounded-lg shadow-md flex items-center justify-center text-white">
                <Building2 size={16} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] sm:text-xs font-medium">Welcome back, Administrator</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">Prestige Operations Center</h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-semibold">+12.4% ARR</span>
                </div>
              </div>
            </div>

            {/* Weather status indicator on small screens */}
            <div className="sm:hidden text-right">
              <span className="text-xs font-bold text-slate-800">{liveWeather.temp}</span>
              <p className="text-[10px] text-slate-400">{liveWeather.climate}</p>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3 w-full sm:w-auto">
            {/* Quick switcher buttons list on mobile/tablet */}
            <div className="flex flex-wrap lg:hidden gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActivePortal("customer")}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all ${
                  activePortal === "customer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setActivePortal("manager")}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all ${
                  activePortal === "manager" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Manager
              </button>
              <button
                onClick={() => setActivePortal("admin")}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all ${
                  activePortal === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setActivePortal("code")}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all ${
                  activePortal === "code" ? "bg-slate-950 text-white shadow-sm" : "text-slate-500"
                }`}
              >
                Code
              </button>
            </div>

            {/* Enterprise indicator */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-xs font-mono font-bold bg-white px-3 py-1.5 border border-slate-100 rounded-xl leading-none">
                <span className={`${colors.accentText} uppercase`}>{activePortal} Mode</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-white shadow-sm"></div>
            </div>
          </div>
        </header>

        {/* Scrollable grid area holding general dashboards or specific panels */}
        <div className="flex-1 p-6 sm:p-8 space-y-8 select-none">
          
          {/* 3D KPI Dashboard Widget layout visible on Core SaaS views */}
          {activePortal !== "code" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
              <KPI3DCard
                title="Maldives Resort Occupancy"
                value="82.4%"
                change="12.4%"
                isPositive={true}
                icon={<Building2 size={18} />}
                gradient={colors.gradient}
              />
              <KPI3DCard
                title="Daily Room Turnover"
                value="$12,490"
                change="14.2%"
                isPositive={true}
                icon={<DollarSign size={18} />}
                gradient={colors.gradient}
              />
              <KPI3DCard
                title="Average Loyalty Multipl."
                value="0.85x"
                change="Active"
                isPositive={true}
                icon={<Percent size={18} />}
                gradient={colors.gradient}
              />
              <KPI3DCard
                title="VIP Reviews Approval"
                value="98.2%"
                change="4.9"
                isPositive={true}
                icon={<Sparkles size={18} />}
                gradient={colors.gradient}
              />
            </div>
          )}

          {/* Inner Content Render Box with animations */}
          <div className="min-h-[480px]">
            <AnimatePresence mode="wait">
              {activePortal === "customer" && (
                <motion.div
                  key="customer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <CustomerPortal
                    rooms={rooms}
                    bookings={bookings}
                    onAddBooking={handleAddNewBooking}
                    onCancelBooking={handleCancelBooking}
                    onAddReview={handleAddReview}
                  />
                </motion.div>
              )}

              {activePortal === "manager" && (
                <motion.div
                  key="manager"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <HotelManagerPortal
                    rooms={rooms}
                    onAddRoom={handleAddRoom}
                    onUpdateRoom={handleUpdateRoom}
                    onDeleteRoom={handleDeleteRoom}
                  />
                </motion.div>
              )}

              {activePortal === "admin" && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <AdminPortal
                    bookings={bookings}
                    reviews={reviews}
                    onModerateReview={handleModerateReview}
                  />
                </motion.div>
              )}

              {activePortal === "code" && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <CodeExplorer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Supplementary Systems widgets (Visible on Dashboard Views) */}
          {activePortal !== "code" && (
            <div className="space-y-6">
              <MiniMeters />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <NotificationConsole logs={telemetryLogs} />
                </div>
                
                <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex flex-col justify-between font-sans">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Architecture Info</h4>
                    <strong className="text-sm text-slate-800 leading-tight block">SQL Server Relationships</strong>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Entity Framework core links users to bookings through UserId (1:N), and rooms to bookings via RoomId (1:N). Booking validations enforce check-out constraints. Official Maldives servers synced in high-availability setup.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePortal("code")}
                    className="mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Explore Clean Architecture Source</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Custom Layout Footer */}
        <footer className="bg-white border-t border-slate-100 px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 select-none">
          <div className="flex gap-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Systems synced
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">PRESTIGE v2.0.26 Build</span>
          </div>
          <div className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">
            MADE BY MUHAMMAD WAIZ
          </div>
        </footer>
      </main>

    </div>
  );
}
