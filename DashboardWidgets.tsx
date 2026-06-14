import React from "react";
import { TrendingUp, Users, DollarSign, Umbrella, Percent, Loader } from "lucide-react";
import { motion } from "motion/react";

interface KPIProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  gradient: string;
}

export const KPI3DCard: React.FC<KPIProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  gradient
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="relative overflow-hidden rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
    >
      {/* Absolute background 3D glass aura */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl`} />

      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</span>
          <h3 className="mt-2 text-3xl font-bold font-sans tracking-tight text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-blue-500/10`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center mt-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          isPositive ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"
        }`}>
          {isPositive ? "+" : ""}{change}
        </span>
        <span className="ml-2 text-xs text-slate-400">vs last month</span>
      </div>
    </motion.div>
  );
};

export const MiniMeters: React.FC = () => {
  const currentOccupancy = 78; // 78% occupancy
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Occupancy Indicator */}
      <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Occupancy Analytics</h4>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Simple Circular progress indicator */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="url(#blueGrad)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * currentOccupancy) / 100}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-slate-800">{currentOccupancy}%</span>
              <span className="text-[10px] text-slate-400 font-medium">Active</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-800">Peak Maldives Season</div>
            <p className="text-xs text-slate-400 mt-1">42 of 54 active guest suites occupied. Dynamic pricing multiplier currently operating at 1.25x.</p>
            <div className="mt-3 flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Booked</span>
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>Open</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern 3D Quick Stats */}
      <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Systems Status</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>SQL Database Ingestion</span>
              <span className="text-emerald-600 font-mono">100% OK</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Stripe & PayPal APIs Gateway</span>
              <span className="text-cyan-600 font-mono">Online</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>SignalR Websocket Latency</span>
              <span className="text-indigo-600 font-mono">14ms</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: "95%" }}></div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-3 font-mono">Simulated server up 982 hours. Maintained by Muhammad Waiz.</p>
      </div>
    </div>
  );
};
