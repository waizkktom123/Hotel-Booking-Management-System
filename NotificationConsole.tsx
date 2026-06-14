import React from "react";
import { Terminal, Shield, Bluetooth, Radio } from "lucide-react";
import { motion } from "motion/react";

interface NotificationLog {
  timestamp: string;
  source: "SignalR" | "Stripe" | "PayPal" | "SQL_Server" | "AI_Studio";
  message: string;
  type: "info" | "success" | "critical" | "warning";
}

interface NotificationConsoleProps {
  logs: NotificationLog[];
}

export const NotificationConsole: React.FC<NotificationConsoleProps> = ({ logs }) => {
  return (
    <div className="rounded-3xl bg-zinc-950 border border-slate-800 text-slate-300 overflow-hidden font-mono text-xs flex flex-col h-[280px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] select-text">
      
      {/* Header telemetry tray */}
      <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-indigo-505/10 text-indigo-400">
            <Radio size={14} className="animate-pulse" />
          </span>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">SignalR & Webhooks Telemetry Pipeline</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>PIPELINE: LIVE</span>
        </div>
      </div>

      {/* Terminal Rows */}
      <div className="flex-1 p-3.5 space-y-2 overflow-y-auto max-h-[220px]">
        {logs.length === 0 ? (
          <div className="text-zinc-500 italic text-[10px] text-center pt-8">
            Listening for booking events, payments, SignalR triggers and API transactions...
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 leading-relaxed text-[10.5px]">
              <span className="text-zinc-600 shrink-0 font-medium">[{log.timestamp}]</span>
              
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 tracking-wider border ${
                log.source === 'SignalR' ? "bg-purple-950 text-purple-300 border-purple-800/50" :
                log.source === 'Stripe' ? "bg-indigo-950 text-indigo-300 border-indigo-800/50" :
                log.source === 'PayPal' ? "bg-amber-950 text-amber-300 border-amber-800/50" :
                log.source === 'SQL_Server' ? "bg-sky-950 text-sky-300 border-sky-850/50" :
                "bg-zinc-800 text-zinc-300 border-zinc-700/50"
              }`}>
                {log.source}
              </span>

              <span className={`flex-grow ${
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'critical' ? 'text-rose-400 font-bold' :
                log.type === 'warning' ? 'text-amber-300' :
                'text-zinc-200'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer credits bar */}
      <div className="bg-zinc-900/90 px-4 py-1.5 text-[9px] text-zinc-500 border-t border-zinc-900/50 flex justify-between select-none">
        <span>Channel: ws://localhost:3000/signalr</span>
        <span>Systems Controller by Muhammad Waiz</span>
      </div>

    </div>
  );
};
