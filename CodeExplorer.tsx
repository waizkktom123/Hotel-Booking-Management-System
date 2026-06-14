import React, { useState } from "react";
import { Folder, FileCode, Check, Copy, ExternalLink, Terminal, Cpu } from "lucide-react";
import { sourceCodeTemplates } from "../data/sourceCodeTemplates";
import { CodeFile } from "../types";

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(sourceCodeTemplates[0]);
  const [copied, setCopied] = useState(false);

  const categories = Array.from(new Set(sourceCodeTemplates.map(f => f.category)));

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 bgColor rounded-md bg-blue-500/10 text-cyan-400">
              <Cpu size={16} />
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-cyan-400">Enterprise Backend & Frontend Architecture</span>
          </div>
          <h2 className="text-lg font-bold font-sans mt-0.5">C# .NET 9 Web API & Angular 20 Source Registry</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Explore the complete, production-ready implementation of the Clean Architecture pattern, Entity Framework cores, role-based controllers, and responsive Angular components.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Terminal size={12} className="text-cyan-400" />
          <span>Dev: Muhammad Waiz</span>
        </div>
      </div>

      {/* Code Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Directory Tree */}
        <div className="lg:col-span-4 border-r border-slate-100 bg-slate-50/50 p-4 font-sans text-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solution Explorer</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/50 text-slate-600 font-bold">PROD-READY</span>
          </div>

          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center gap-2 text-slate-700 font-semibold px-2 py-1 select-none">
                  <Folder className="text-blue-500 fill-blue-500/10" size={16} />
                  <span>{cat}</span>
                </div>

                <div className="pl-4 space-y-0.5">
                  {sourceCodeTemplates
                    .filter(f => f.category === cat)
                    .map(file => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs font-mono group relative ${
                            isSelected
                              ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-bold border-l-2 border-blue-600 shadow-sm"
                              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                          }`}
                        >
                          <FileCode
                            size={14}
                            className={isSelected ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
                          />
                          <span className="truncate flex-1">{file.name}</span>
                          <span className={`text-[9px] font-sans font-bold px-1.5 py-0.5 rounded uppercase ${
                            file.language === 'csharp' ? "bg-purple-100 text-purple-700" :
                            file.language === 'sql' ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                          }`}>
                            {file.language === 'csharp' ? 'C#' : file.language === 'sql' ? 'SQL' : 'TS'}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100/40 text-xs text-blue-800 leading-relaxed font-sans">
            <span className="font-bold block mb-1 flex items-center gap-1">⚡ Developer Quick Copy</span>
            These modules have been architected precisely. You can select any file and click the <strong className="font-semibold">Copy Source</strong> button to paste directly into your IDE context.
          </div>
        </div>

        {/* Right Side: Code Viewport */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 text-slate-100">
          {/* Bar top */}
          <div className="bg-slate-900/95 border-b border-slate-800 flex justify-between items-center px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-lime-500/10 text-lime-400 border border-lime-500/20 uppercase">
                {selectedFile.language}
              </span>
              <span className="text-xs font-mono text-slate-400 truncate max-w-sm sm:max-w-md">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition duration-200 outline-none border border-indigo-500/30"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-lime-300 animate-bounce" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Source</span>
                </>
              )}
            </button>
          </div>

          {/* Actual Code Viewport */}
          <div className="flex-1 p-4 font-mono text-xs overflow-auto max-h-[580px] leading-relaxed select-text shadow-inner">
            <pre className="text-slate-200 font-sans whitespace-pre bg-transparent"><code className="font-mono text-[11px] block">{selectedFile.content}</code></pre>
          </div>

          {/* Bottom attribution bar */}
          <div className="bg-slate-900 px-4 py-2 text-[10px] font-mono text-slate-500 flex justify-between border-t border-slate-800/80">
            <span>Encoding: UTF-8</span>
            <span>Architected with Precision by Muhammad Waiz</span>
          </div>
        </div>
      </div>
    </div>
  );
};
