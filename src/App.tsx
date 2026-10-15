import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScannerSection from "./components/ScannerSection";
import SettingsDrawer from "./components/SettingsDrawer";
import DeployGuideModal from "./components/DeployGuideModal";

// Subdomain aur Directories section ko categorize karne ke liye map
const scannerModes = {
  subdomains: { label: "Subdomains Scan" },
  directories: { label: "Directories Scan" },
};

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  
  // Mobile par context select karne ke liye current context state
  const [activeTab, setActiveTab] = useState<keyof typeof scannerModes>("subdomains");

  return (
    <div className="min-h-screen bg-[#0b0607] text-white flex flex-col relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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

      <div className="relative flex flex-col flex-grow">
        <Header onOpenSettings={() => setSettingsOpen(true)} onOpenGuide={() => setGuideOpen(true)} />
        
        {/* Hero section */}
        <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 text-center sm:px-6 sm:pt-16">
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Explore any domain's <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">hidden surface</span>
          </h1>
        </section>

        {/* Tabbed interface section with unique smooth button animation */}
        <section className="mx-auto max-w-6xl w-full px-4 mb-4 sm:px-6">
          <div className="border border-white/10 rounded-2xl bg-[#0e0a0a]/90 backdrop-blur-md shadow-2xl">
            
            {/* Context Selector Buttons (Tab list) with unique transition effect */}
            <div className="flex border-b border-white/10 p-1.5 gap-2">
              {Object.entries(scannerModes).map(([key, { label }]) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as keyof typeof scannerModes)}
                    className={`flex-1 relative px-6 py-3.5 text-center font-semibold rounded-xl transition-all duration-300 transform active:scale-95 
                      ${isActive 
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'}`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isActive && <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />}
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Scanner Content */}
            <div className="p-4 sm:p-6">
              <ScannerSection mode={activeTab} />
            </div>

          </div>
        </section>

        {/* Features info bar */}
        <section className="mx-auto max-w-6xl w-full px-4 pb-16 sm:px-6">
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-white/10 px-3 py-1">⚡ Async concurrent scanning</span>
            <span className="rounded-full border border-white/10 px-3 py-1">🌐 Real DNS + HTTP verification</span>
            <span className="rounded-full border border-white/10 px-3 py-1">📱 Fully mobile responsive</span>
            <span className="rounded-full border border-white/10 px-3 py-1">🐍 Python + FastAPI backend</span>
          </div>
        </section>

        <Footer />
      </div>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <DeployGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
