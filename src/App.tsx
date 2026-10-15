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
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Dark/Light theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mobile par context select karne ke liye current context state
  const [activeTab, setActiveTab] = useState<keyof typeof scannerModes>("subdomains");

  const scrollToSection = (tab?: keyof typeof scannerModes) => {
    if (tab) {
      setActiveTab(tab);
    }
    setMenuOpen(false);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0b0607] text-white" : "bg-slate-50 text-slate-900"} flex flex-col relative overflow-x-hidden transition-colors duration-300`}>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-700/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)"} 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative flex flex-col flex-grow">
        {/* Top Right Controls: Theme Toggle + Menu Bar Toggle */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {/* Modern Dark/Light Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center justify-center h-11 w-11 rounded-xl border transition-all shadow-lg active:scale-95 ${
              isDarkMode 
                ? "bg-[#160d0e] border-white/10 text-orange-400 hover:bg-orange-500/10" 
                : "bg-white border-slate-200 text-orange-600 hover:bg-orange-50"
            }`}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <span className="text-lg">☀️</span>
            ) : (
              <span className="text-lg">🌙</span>
            )}
          </button>

          {/* Menu Bar Toggle Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center justify-center h-11 w-11 rounded-xl border transition-all shadow-lg active:scale-95 ${
              isDarkMode 
                ? "bg-[#160d0e] border-white/10 text-orange-400 hover:bg-orange-500/10" 
                : "bg-white border-slate-200 text-orange-600 hover:bg-orange-50"
            }`}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <span className="text-xl font-bold">✕</span>
            ) : (
              <span className="text-xl font-bold">☰</span>
            )}
          </button>
        </div>

        {/* Backdrop Blur Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-all flex items-center justify-center p-4">
            <div className={`border rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 ${
              isDarkMode ? "bg-[#12080a] border-white/15 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}>
              <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Navigation Menu
                </h3>
                <button
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm px-2.5 py-1 rounded-lg ${isDarkMode ? "text-slate-400 hover:text-white bg-white/5" : "text-slate-600 hover:text-slate-900 bg-slate-100"}`}
                >
                  Close
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium transition-all border ${
                    isDarkMode 
                      ? "bg-white/5 hover:bg-orange-500/15 text-slate-200 hover:text-orange-300 border-transparent hover:border-orange-500/30" 
                      : "bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border-slate-200 hover:border-orange-200"
                  }`}
                >
                  <span>🏠</span> Home
                </button>

                <button
                  onClick={() => scrollToSection("subdomains")}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium transition-all border ${
                    isDarkMode 
                      ? "bg-white/5 hover:bg-orange-500/15 text-slate-200 hover:text-orange-300 border-transparent hover:border-orange-500/30" 
                      : "bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border-slate-200 hover:border-orange-200"
                  }`}
                >
                  <span>🔍</span> Subdomain Scan
                </button>

                <button
                  onClick={() => scrollToSection("directories")}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium transition-all border ${
                    isDarkMode 
                      ? "bg-white/5 hover:bg-orange-500/15 text-slate-200 hover:text-orange-300 border-transparent hover:border-orange-500/30" 
                      : "bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border-slate-200 hover:border-orange-200"
                  }`}
                >
                  <span>📂</span> Directories Scan
                </button>
              </div>
            </div>
          </div>
        )}

        <Header onOpenSettings={() => setSettingsOpen(true)} onOpenGuide={() => setGuideOpen(true)} />
        
        {/* Security Intelligence Logo Section (Mars Theme Consistent) */}
        <div className="mx-auto mt-6 flex items-center justify-center gap-3.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-transparent border border-orange-500/20 backdrop-blur-md max-w-sm shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 via-orange-500 to-red-700 shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            <span className="text-xl">🔴</span>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0b0607] animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-black tracking-widest bg-gradient-to-r from-orange-400 via-red-500 to-rose-500 bg-clip-text text-transparent">
              MARS SCANNER
            </span>
            <span className="text-[10px] text-orange-300/80 font-semibold tracking-wider uppercase">
              Security Intelligence
            </span>
          </div>
        </div>

        {/* Hero section */}
        <section className="mx-auto max-w-6xl px-4 pb-6 pt-6 text-center sm:px-6">
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Explore any domain's <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">hidden surface</span>
          </h1>
        </section>

        {/* Tabbed interface section preserving states for both tabs concurrently */}
        <section className="mx-auto max-w-6xl w-full px-4 mb-4 sm:px-6">
          <div className={`border rounded-2xl shadow-2xl backdrop-blur-md ${isDarkMode ? "border-white/10 bg-[#0e0a0a]/90" : "border-slate-200 bg-white/90"}`}>
            
            {/* Context Selector Buttons (Tab list) */}
            <div className={`flex border-b p-1.5 gap-2 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
              {Object.entries(scannerModes).map(([key, { label }]) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as keyof typeof scannerModes)}
                    className={`flex-1 relative px-6 py-3.5 text-center font-semibold rounded-xl transition-all duration-300 transform active:scale-95 
                      ${isActive 
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
                        : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'}`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isActive && <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />}
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Scanner Content - Both rendered simultaneously to retain scan states */}
            <div className="p-4 sm:p-6">
              <div className={activeTab === "subdomains" ? "block" : "hidden"}>
                <ScannerSection mode="subdomains" />
              </div>
              <div className={activeTab === "directories" ? "block" : "hidden"}>
                <ScannerSection mode="directories" />
              </div>
            </div>

          </div>
        </section>

        {/* Features info bar */}
        <section className="mx-auto max-w-6xl w-full px-4 pb-16 sm:px-6">
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className={`rounded-full border px-3 py-1 ${isDarkMode ? "border-white/10" : "border-slate-200 bg-white"}`}>⚡ Async concurrent scanning</span>
            <span className={`rounded-full border px-3 py-1 ${isDarkMode ? "border-white/10" : "border-slate-200 bg-white"}`}>🌐 Real DNS + HTTP verification</span>
            <span className={`rounded-full border px-3 py-1 ${isDarkMode ? "border-white/10" : "border-slate-200 bg-white"}`}>📱 Fully mobile responsive</span>
            <span className={`rounded-full border px-3 py-1 ${isDarkMode ? "border-white/10" : "border-slate-200 bg-white"}`}>🐍 Python + FastAPI backend</span>
          </div>
        </section>

        <Footer />
      </div>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <DeployGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
