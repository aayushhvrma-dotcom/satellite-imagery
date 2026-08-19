import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Satellite, Activity, Cpu } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('Mumbai Metropolitan Region');
  const [loading, setLoading] = useState(false);

  // Parallax scroll state for Section 2
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const winHeight = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (winHeight - rect.top) / (winHeight + rect.height)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_name: locationName,
          latitude: 19.0760,
          longitude: 72.8777,
          radius_km: 10,
          start_year: 2017,
          end_year: 2025
        }),
      });

      if (!response.ok) throw new Error('Failed to start analysis');
      const data = await response.json();
      navigate(`/dashboard/${data.id}`);
    } catch (err) {
      console.warn("Backend offline, using demo navigation:", err);
      navigate(`/dashboard/demo-job-id`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden relative">
      
      {/* SECTION 1: HERO */}
      <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Background: Real Rotating Earth Video Loop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]" />
        </div>

        {/* Floating Animated Satellite Badge at Top Right */}
        <div className="absolute top-28 right-8 z-30 pointer-events-none animate-bounce duration-1000 hidden lg:block">
          <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 p-3 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center space-x-3 text-cyan-400">
            <Satellite className="h-5 w-5 animate-spin text-cyan-400" style={{ animationDuration: '8s' }} />
            <div className="text-xs font-mono">
              <div className="font-bold tracking-wider">SENTINEL-2 ACTIVE</div>
              <div className="text-slate-400 text-[10px]">10m Resolution Grid</div>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-slate-800/40 backdrop-blur-md relative z-20">
          <div className="flex items-center space-x-3">
            <span className="text-xl md:text-2xl font-black tracking-wider text-white">GEO.AI</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              URBANPULSE V2
            </span>
          </div>

          <div className="hidden md:flex space-x-10 text-sm font-semibold text-slate-300">
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">DASHBOARD</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">SPECTRAL BANDS</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">SIAMESE U-NET</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">API SPECS</span>
          </div>

          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
          >
            Launch Intelligence
          </button>
        </nav>

        {/* Hero Center Content & Form */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-12 relative z-10 my-auto items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Activity className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
              <span>Multi-Spectral Telemetry & Sprawl Analysis (2017 – 2025)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-lg">
              Planetary Vision. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Real-Time Change Intelligence.
              </span>
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed drop-shadow">
              Autonomous detection of urban expansion pressure, canopy depletion, and water basin dynamics powered by Sentinel-2 satellite surface reflectance arrays and deep neural networks.
            </p>
          </div>

          {/* Quick Analysis Form Card */}
          <div className="lg:col-span-5">
            <form onSubmit={handleStartAnalysis} className="bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/40 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-4">
              <div className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Configure Geospatial Job</span>
                <span className="text-xs font-mono text-cyan-400">STATUS: READY</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 font-mono">Baseline (T1)</label>
                  <input type="text" value="01-01-2017" readOnly className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 font-mono">Target (T2)</label>
                  <input type="text" value="01-01-2025" readOnly className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 font-mono">Target Location / City</label>
                <input 
                  type="text" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black py-3.5 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center space-x-2 text-sm mt-2 cursor-pointer"
              >
                <span>{loading ? "Processing Sentinel Rasters..." : "Detect Changes & Report"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Live Telemetry Indicator */}
        <div className="hidden sm:flex items-center space-x-3 px-8 pb-6 text-slate-400 text-xs font-mono relative z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Telemetry Stream: Copernicus Open Access Hub Linked</span>
        </div>
      </div>


      {/* SECTION 2: ARCHITECTURE & MANIFESTO QUOTE SECTION */}
      <div ref={sectionRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#010A17] via-[#0A4267] to-[#20658E] px-6">
        
        {/* Parallax Atmospheric Layer */}
        <div 
          className="absolute inset-x-0 top-0 z-10 pointer-events-none opacity-30"
          style={{ transform: `translate3d(0, ${(scrollProgress - 0.5) * -120}px, 0)` }}
        >
          <img 
            src="https://soft-zoom-63098134.figma.site/_assets/v11/8d520a7515d06cbfc403d0125e3d05b1a7ccd29c.png" 
            alt="Atmospheric Layer" 
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Central Intelligence Statement */}
        <div className="max-w-4xl mx-auto text-center relative z-20 space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>Siamese U-Net Inference Engine</span>
          </div>

          <p className="font-instrument text-white text-2xl sm:text-3xl md:text-5xl lg:text-[46px] leading-[1.3] md:leading-[1.4] tracking-wide text-glow">
            "UrbanPulse AI was engineered on a mandate for absolute spatial precision. We bridge low-latency satellite ingestion with multi-spectral surface reflectance indices (NDVI, NDWI) to expose urban expansion pressure before it strains ecological balances. No guesswork, no outdated maps — just high-resolution geospatial telemetry that empowers sustainable municipal planning."
          </p>

          <div className="pt-4">
            <span className="text-cyan-300 text-xs md:text-sm tracking-widest uppercase font-mono font-bold">
              — SENTINEL-2 COPERNICUS ENGINE & SPATIAL MODELING CORE
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}