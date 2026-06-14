import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Star, ShieldAlert, Sparkles, Receipt, CheckCircle, Download, Trash, Heart } from "lucide-react";
import { Room, Booking } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CustomerPortalProps {
  rooms: Room[];
  bookings: Booking[];
  onAddBooking: (bookingData: any) => void;
  onCancelBooking: (bookingId: string) => void;
  onAddReview: (bookingId: string, rating: number, comment: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  rooms,
  bookings,
  onAddBooking,
  onCancelBooking,
  onAddReview
}) => {
  // Search and Filters States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(["rm-302"]);

  // AI Recommendation Engine States
  const [aiPrefs, setAiPrefs] = useState("");
  const [aiTravelType, setAiTravelType] = useState("Couples Retreat");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Booking states
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState("2026-06-18");
  const [checkOut, setCheckOut] = useState("2026-06-22");
  const [paymentMethod, setPaymentMethod] = useState<"Stripe" | "PayPal">("Stripe");
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingSuccessData, setBookingSuccessData] = useState<Booking | null>(null);

  // Reviews trigger state
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const allAmenities = ["Ocean View", "King Bed", "Mini-bar", "Jacuzzi Deck", "Rain Shower", "Private Pool", "Espresso Bar", "Marble Bath", "Butlers Service"];

  // Filter logic
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.amenities.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "All" || room.type === selectedType;
    const matchesPrice = room.price <= maxPrice;
    const matchesAmenities = selectedAmenities.every(amenity => room.amenities.includes(amenity));
    return matchesSearch && matchesType && matchesPrice && matchesAmenities;
  });

  const toggleFavorite = (roomId: string) => {
    if (favorites.includes(roomId)) {
      setFavorites(favorites.filter(id => id !== roomId));
    } else {
      setFavorites([...favorites, roomId]);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Dynamic pricing calculation
  const calculateTotal = (pricePerNight: number) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    // Multipliers (Mon-Fri base, sat-sun surge simulated)
    return pricePerNight * diffDays;
  };

  // Call server for real Gemini Recommendations
  const fetchAIRecommendations = async () => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: aiPrefs,
          budget: maxPrice,
          location: "Maldives Prestige Island Resort",
          travellersType: aiTravelType
        })
      });
      const data = await res.json();
      setAiResponse(data.recommendation);
    } catch (err) {
      console.error(err);
      setAiResponse("Concierge gateway offline. Using simulated system fallback. We recommend our **Suite Room 302** which offers Private Jacuzzis and a personal butler matching your premium style!");
    } finally {
      setAiLoading(false);
    }
  };

  const executeBooking = () => {
    if (!selectedRoom) return;

    const totalCost = calculateTotal(selectedRoom.price);
    const newBookingData = {
      guestName: "Valued Guest",
      hotelName: "Prestige Silver Bay Resort",
      checkIn,
      checkOut,
      roomType: selectedRoom.type,
      roomNumber: selectedRoom.number,
      cost: totalCost,
      guests: guestsCount,
      paymentMethod
    };

    // Callback triggers server addition + room status adjustment
    onAddBooking(newBookingData);

    // Mock direct UI completion modal with billing pdf download
    const visualRef = "BK-" + Math.floor(1000 + Math.random() * 9000);
    setBookingSuccessData({
      id: visualRef,
      guestName: "Valued Guest",
      hotelName: "Prestige Silver Bay Resort",
      checkIn,
      checkOut,
      roomType: selectedRoom.type,
      roomNumber: selectedRoom.number,
      cost: totalCost,
      status: "Confirmed",
      paymentStatus: "Paid",
      paymentMethod,
      guests: guestsCount,
      rating: 0,
      review: "",
      qrCodeUrl: visualRef
    });

    setSelectedRoom(null);
  };

  const handleReviewSubmission = () => {
    if (!reviewingBooking) return;
    onAddReview(reviewingBooking.id, reviewRating, reviewComment);
    setReviewingBooking(null);
    setReviewComment("");
  };

  // Generate simulated local PDF trigger and save
  const downloadInvoice = (booking: Booking) => {
    const text = `
    ========================================================
                     PRESTIGE HOTELS INC.
                 OFFICIAL BOOKING INVOICE & RECEIPT
    ========================================================
    RECIPIENT:      ${booking.guestName}
    STAY DATES:     ${booking.checkIn} to ${booking.checkOut}
    HOTEL PROPERTY: ${booking.hotelName}
    ASSIGNED SUITE: Room ${booking.roomNumber || "Pending"} (${booking.roomType})
    GUESTS COUNT:   ${booking.guests} Guests
    
    --------------------------------------------------------
    FUNDS DETAILED STATUS:
    BASE RATE PROJECTION: ...... $${booking.cost} USD
    TAXES & FEES (10%):  ...... INCLUDED IN SETTLEMENT
    EXTRA AMENITIES FEES: ...... COMPLIMENTARY GUEST ENTRY
    GRAND TOTAL SECURED:  ...... $${booking.cost} USD (Fully Decided)
    
    TRANSACTION SYSTEM:   ...... SETTLED VIA ${booking.paymentMethod.toUpperCase()}
    TRANSACTION STATUS:   ...... FULLY AUTHORIZED & PAID
    INVOICE IDENTIFIER:   ...... ${booking.id}
    ========================================================
     Thank you for choosing Prestige. Designed by Muhammad Waiz.
    ========================================================
    `;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Prestige_Invoice_${booking.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Search Header and AI Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-300 animate-pulse" size={18} />
            <span className="text-xs font-semibold tracking-wider text-blue-100 uppercase uppercase">Autonomous Room Recommender</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight">Embark On a Bespoke Getaway</h2>
          <p className="mt-2 text-sm text-blue-50/90 leading-relaxed">
            Our luxury catalog adjusts base prices seasonally. Search our suites, filter specific ocean views, or type your preferences in our **Gemini AI advisor** below for customized matching.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={aiPrefs}
              onChange={(e) => setAiPrefs(e.target.value)}
              placeholder="e.g. I want a peaceful beach retreat with private plunge pools, champagne, and butler help..."
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 drop-shadow-sm transition-all"
            />
            <div className="flex gap-2">
              <select
                value={aiTravelType}
                onChange={(e) => setAiTravelType(e.target.value)}
                className="px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <option value="Couples Retreat" className="text-slate-800">Couples</option>
                <option value="Executive Travel" className="text-slate-800">Executive</option>
                <option value="Family Vacay" className="text-slate-800">Family</option>
                <option value="Solo Luxury" className="text-slate-800">Solo VIP</option>
              </select>
              <button
                onClick={fetchAIRecommendations}
                disabled={aiLoading}
                className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-slate-100 text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-yellow-500 fill-yellow-500/10" />
                    <span>Get AI Advice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Response Block */}
      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/5 to-cyan-500/5 border border-indigo-100/60 leading-relaxed text-sm text-slate-700"
        >
          <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold">
            <Sparkles size={16} className="text-amber-500 animate-pulse" />
            <span>AI Concierge Personalized Proposal:</span>
          </div>
          <div className="markdown-body space-y-2 prose prose-slate max-w-none text-slate-600">
            {aiResponse.split("\n").map((line, idx) => {
              if (line.startsWith("###")) {
                return <h4 key={idx} className="font-bold text-slate-800 mt-3 text-base">{line.replace("###", "").trim()}</h4>;
              }
              if (line.startsWith("-") || line.startsWith("*")) {
                return <li key={idx} className="ml-4 list-disc text-slate-600">{line.substring(2).trim()}</li>;
              }
              return <p key={idx} className="leading-relaxed">{line}</p>;
            })}
          </div>
          <div className="mt-4 flex gap-4 text-xs font-semibold text-indigo-500">
            <span>Powered by Gemini 3.5 Flash</span>
            <span>•</span>
            <span>Architected by Muhammad Waiz</span>
          </div>
        </motion.div>
      )}

      {/* Booking Form Overlay / Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-200 shadow-2xl overflow-hidden text-slate-800 relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">Secure Room Chamber</span>
                  <h3 className="text-xl font-bold font-sans text-slate-900">Suite #{selectedRoom.number} - {selectedRoom.type}</h3>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold"
                >
                  X
                </button>
              </div>

              <div className="mb-4">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.type}
                  className="w-full h-40 object-cover rounded-xl border border-slate-100 shadow"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Form elements */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Guests Quantity</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Settlement Method</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Stripe")}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                        paymentMethod === "Stripe"
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      Stripe (Card)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("PayPal")}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                        paymentMethod === "PayPal"
                          ? "bg-amber-50 border-amber-500 text-amber-700"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      PayPal Wallet
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500">Base rate nights total:</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">${selectedRoom.price}/night • Multipliers Active</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Settlement Cost:</span>
                  <span className="text-lg font-bold text-slate-950">${calculateTotal(selectedRoom.price)}</span>
                </div>
              </div>

              <button
                onClick={executeBooking}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
              >
                Confirm Luxury Room
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Success Modal */}
      <AnimatePresence>
        {bookingSuccessData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-200 text-slate-800 shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Room Secured Safely</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Reference: {bookingSuccessData.id}</p>
                <p className="text-xs text-slate-500 mt-2 p-2 px-3 bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-100">
                  Congratulations! Check-in materials have been cataloged with our C# API. Your dynamic check-in QR Code is live.
                </p>

                {/* QR Code representation */}
                <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center bg-white p-2">
                    {/* Simulated vector QR layout */}
                    <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            (i * 3 + 7) % 5 === 0 || i === 0 || i === 3 || i === 12 || i === 15 ? 'bg-slate-900' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-3">QR PASS SECURED</span>
                </div>

                {/* Info and download button */}
                <div className="w-full text-left text-xs space-y-2 mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner Settled:</span>
                    <span className="font-semibold text-slate-800">{bookingSuccessData.paymentMethod} Payment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total charge:</span>
                    <span className="font-semibold text-slate-800">${bookingSuccessData.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dates:</span>
                    <span className="font-semibold text-slate-800">{bookingSuccessData.checkIn} to {bookingSuccessData.checkOut}</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => downloadInvoice(bookingSuccessData)}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Download Bill</span>
                  </button>
                  <button
                    onClick={() => setBookingSuccessData(null)}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review submission panel */}
      <AnimatePresence>
        {reviewingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-200 text-slate-800 shadow-2xl relative"
            >
              <h3 className="text-base font-bold text-slate-900">Leave Premium Review</h3>
              <p className="text-xs text-slate-400 mb-4">Share your thoughts on staying in the Prestige room #{reviewingBooking.roomNumber}.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Star Assessment</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Feedback Comments</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe room service, view fidelity, overall design aesthetics..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setReviewingBooking(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-250 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmission}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-505 rounded-lg"
                  >
                    Post Review
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Filter Suite Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Panel Left Side */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl bg-white p-5 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="text-slate-500" size={16} />
              <h3 className="text-sm font-bold text-slate-900">Aesthetic Filters</h3>
            </div>

            <div className="space-y-5">
              {/* Search input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Text Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search beds or amenities..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Room Category</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700"
                >
                  <option value="All">All Categories</option>
                  <option value="Single Room">Single Rooms</option>
                  <option value="Double Room">Double Rooms</option>
                  <option value="Deluxe Room">Deluxe Rooms</option>
                  <option value="Suite Room">Suite Luxury Rooms</option>
                  <option value="Family Room">Family Suites</option>
                </select>
              </div>

              {/* Price slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-500">Max Budget/Night</label>
                  <span className="text-xs font-mono font-bold text-blue-600">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="700"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Amenities checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Desired Comforts</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                  {allAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 hover:text-slate-950 select-none">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Available Rooms */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700">Available Suites ({filteredRooms.length})</h3>
            <span className="text-xs text-slate-400 font-medium">Prestige Resort - Real-time Rates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRooms.map(room => {
              const checkTotal = calculateTotal(room.price);
              const isFav = favorites.includes(room.id);
              
              return (
                <motion.div
                  layout
                  key={room.id}
                  whileHover={{ y: -5 }}
                  className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] overflow-hidden group hover:border-slate-200 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={room.image}
                      alt={room.type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Absolutely positioned floating pills */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm">
                      Room {room.number}
                    </div>

                    <button
                      onClick={() => toggleFavorite(room.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-rose-500"
                    >
                      <Heart size={14} className={isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                      ${room.price}/night
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition duration-150">{room.type}</h4>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-1">Floor {room.floor} • Guaranteed clean and polished upon arrival.</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {room.amenities.map(a => (
                        <span key={a} className="text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/40 px-2 py-0.5 rounded">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-slate-100/80 mt-4 pt-4 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">4 nights total:</span>
                        <strong className="text-sm font-extrabold text-slate-900">${checkTotal} USD</strong>
                      </div>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        disabled={room.status !== "Available"}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          room.status === "Available"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:opacity-90 cursor-pointer"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {room.status === "Available" ? "Book & Reserve" : room.status}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guest Booking History Ledger */}
      <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] mt-8">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
          <Receipt size={16} className="text-blue-500" />
          <span>Active Guest Bookings Ledger</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-500">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-widest font-mono text-[9px] border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Booking Ref</th>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3 text-right">Settled Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Interactive Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="px-4 py-3 font-medium">{b.guestName}</td>
                  <td className="px-4 py-3 text-slate-500">{b.roomType}</td>
                  <td className="px-4 py-3 text-slate-400">{b.checkIn} to {b.checkOut}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">${b.cost}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      b.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                      b.status === "Cancelled" ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-amber-50 text-amber-600"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => downloadInvoice(b)}
                      title="Download receipt & security pass"
                      className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    >
                      <Download size={13} />
                    </button>
                    {b.status === "Confirmed" && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="p-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                    {b.status === "Confirmed" && b.rating === 0 && (
                      <button
                        onClick={() => setReviewingBooking(b)}
                        className="p-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition"
                      >
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
