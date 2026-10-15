import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScannerSection from "./components/ScannerSection";

import SettingsDrawer from "./components/SettingsDrawer";
import DeployGuideModal from "./components/DeployGuideModal";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0607] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-700/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative">
        <Header onOpenSettings={() => setSettingsOpen(true)} onOpenGuide={() => setGuideOpen(true)} />
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-medium text-orange-300">
            🔴 Fast · Concurrent · Real-time scanning engine
          </span>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Explore any domain's <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">hidden surface</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            MarsScanner finds live subdomains and hidden directories in real time, streaming every
            result straight to your screen as a full, ready-to-open URL.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-white/10 px-3 py-1">⚡ Async concurrent scanning</span>
            <span className="rounded-full border border-white/10 px-3 py-1">🌐 Real DNS + HTTP verification</span>
            <span className="rounded-full border border-white/10 px-3 py-1">📱 Fully mobile responsive</span>
            <span className="rounded-full border border-white/10 px-3 py-1">🐍 Python + FastAPI backend</span>
          </div>
        </section>

        {/* Scanner sections */}
        <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ScannerSection mode="subdomains" />
            <ScannerSection mode="directories" />
          </div>

          {/* Quick setup callout */}
          <div className="mt-10 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-600/5 p-6 text-center sm:p-8">
            <h2 className="text-lg font-semibold text-white sm:text-xl">Want this running on your own link?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
              Deploy the FastAPI backend for free on Render, deploy this frontend for free on
              Vercel or Netlify, then point it to your backend from Settings — done.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setGuideOpen(true)}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                View Deployment Guide
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Configure Backend URL
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <DeployGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
