import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Review, Booking } from "../types";
import { LineChart, DollarSign, Award, ThumbsUp, ThumbsDown, UserCheck, Shield, BookOpen, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface AdminPortalProps {
  bookings: Booking[];
  reviews: Review[];
  onModerateReview: (reviewId: string, status: "Approved" | "Rejected") => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  bookings,
  reviews,
  onModerateReview
}) => {
  // Mock analytical plot points
  const analyticsData = [
    { month: "Jan", RoomRev: 31000, SpaRev: 8500, DiningRev: 12000 },
    { month: "Feb", RoomRev: 34000, SpaRev: 9400, DiningRev: 14500 },
    { month: "Mar", RoomRev: 41000, SpaRev: 12000, DiningRev: 16000 },
    { month: "Apr", RoomRev: 39000, SpaRev: 11500, DiningRev: 15100 },
    { month: "May", RoomRev: 48000, SpaRev: 14000, DiningRev: 19800 },
    { month: "Jun", RoomRev: 55000, SpaRev: 18200, DiningRev: 24000 }
  ];

  // User details
  const registeredUsers = [
    { id: "usr-1", name: "Muhammad Waiz", email: "waiz@prestige.com", role: "Manager", status: "Active" },
    { id: "usr-2", name: "Sophia Loren", email: "sophia@prestige.com", role: "Guest", status: "Active" },
    { id: "usr-3", name: "Michael Chang", email: "michael@chang.org", role: "Guest", status: "Active" },
    { id: "usr-4", name: "Sarah J. Jenkins", email: "sarah@gmail.com", role: "Guest", status: "Blocked" }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Upper Grid Layout: Charts Analytics & Database reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts graph panel */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Executive Ledger</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Dual-Stream Luxury Revenue Dynamics (H1 2026)</h3>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 font-bold rounded">Stripe / PayPal Verified</span>
            </div>
          </div>

          <div className="flex-1 w-full h-[220px] mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRoom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="RoomRev" name="Suites Booking" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRoom)" />
                <Area type="monotone" dataKey="SpaRev" name="Wellness & Spa" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorSpa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 block"></span>Suite Bookings ($248K)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block"></span>Spa & Wellness ($73.6K)</span>
          </div>
        </div>

        {/* Dynamic Ledger Checklist System Settings */}
        <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">Enterprise KPI Checklist</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">C# WebAPI SSL Security</h4>
                  <p className="text-[10px] text-slate-400">Verifies HTTPS handshakes across Stripe payment webhooks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">EF Core Database Seed</h4>
                  <p className="text-[10px] text-slate-400">Normalized schema, relationships and indexing fully verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Angular Signal Reactivity</h4>
                  <p className="text-[10px] text-slate-400">Dynamic UI computations bound and tested on local viewstate</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Muhammad Waiz Verification</h4>
                  <p className="text-[10px] text-slate-400">Confirm project authorship parameters throughout source systems</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-indigo-100/50 flex items-center gap-3 mt-4">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Shield size={16} />
            </span>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">ENCRYPT GATEWAYS</span>
              <strong className="text-xs text-slate-800">JWT Token Security Hold: SSL/256bit</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row Grid: User Management and Guest Feedback Moderation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Guest Reviews Moderation Ledger */}
        <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] select-none">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 flex items-center gap-1">
            <BookOpen size={14} className="text-indigo-600" />
            <span>Guest Feedback Moderation Gate</span>
          </h3>

          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
            {reviews.map(rev => (
              <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between gap-3 text-xs">
                <div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{rev.guestName} <span className="text-[10px] font-medium text-slate-400">({rev.roomType})</span></span>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 my-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed text-[11px]">"{rev.comment}"</p>
                </div>

                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 text-[10px]">
                  <div>
                    <span className="text-slate-400 mr-2">Mod:</span>
                    <span className={`px-2 py-0.5 font-bold rounded-full ${
                      rev.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                      rev.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    }`}>{rev.status}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onModerateReview(rev.id, "Approved")}
                      className="p-1 px-2.5 rounded hover:bg-emerald-50 text-emerald-600 font-bold transition flex items-center gap-0.5"
                    >
                      <ThumbsUp size={11} />
                      Approve
                    </button>
                    <button
                      onClick={() => onModerateReview(rev.id, "Rejected")}
                      className="p-1 px-2.5 rounded hover:bg-rose-50 text-rose-600 font-bold transition flex items-center gap-0.5"
                    >
                      <ThumbsDown size={11} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Accounts list */}
        <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] select-none">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <UserCheck size={14} className="text-emerald-600" />
            <span>Registered Staff & Users Catalog</span>
          </h3>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {registeredUsers.map(user => (
              <div key={user.id} className="p-3 rounded-xl bg-slate-50 border border-slate-150/60 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-slate-900 block">{user.name}</strong>
                  <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{user.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 font-bold text-[9px] uppercase rounded-full ${
                    user.role === 'Admin' ? "bg-purple-100 text-purple-700" :
                    user.role === 'Manager' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
                  }`}>
                    {user.role}
                  </span>
                  
                  <span className={`w-2.5 h-2.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-400'}`} title={user.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
