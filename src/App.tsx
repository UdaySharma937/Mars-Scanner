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
    <div className="min-h-screen bg-[#0b0607] text-white flex">
      {/* Side Navigation Bar setup - Left Side */}
      <div className="w-16 flex-col border-r border-white/10 bg-[#0b0607] lg:flex hidden">
        <div className="flex flex-col items-center gap-6 py-6">
          <img src="/logo.svg" alt="Logo" className="h-10 w-10 rounded-full" />
          <button className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-400">📊</button>
          <button className="h-10 w-10 rounded-xl hover:bg-orange-500/10 text-slate-500 hover:text-orange-400">⚙️</button>
        </div>
      </div>
      
      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto">
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
          
          {/* Hero - height reduced for focus on tabs */}
          <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 text-center sm:px-6 sm:pt-16">
            <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Explore any domain's <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">hidden surface</span>
            </h1>
          </section>

          {/* New Tabbed interface section for mobile optimization */}
          <section className="mx-auto max-w-6xl w-full px-4 mb-4 sm:px-6">
            <div className="border border-white/10 rounded-2xl bg-[#0e0a0a]">
              
              {/* Context Selector Buttons (Tab list) */}
              <div className="flex border-b border-white/10">
                {Object.entries(scannerModes).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as keyof typeof scannerModes)}
                    className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 border-b-2 
                      ${activeTab === key 
                        ? 'border-orange-500 text-white' 
                        : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'}`}
                  >
                    {label}
                  </button>
                ))}
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
      </div>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <DeployGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
