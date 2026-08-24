import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Satellite, Activity, Cpu, Layers, BarChart3, Zap, CheckCircle2, Loader2, Sparkles, Compass } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('Mumbai Metropolitan Region');
  const [loading, setLoading] = useState(false);
  const [activeBand, setActiveBand] = useState<'ndvi' | 'ndwi' | 'ndbi'>('ndvi');
  const [analysisStep, setAnalysisStep] = useState(0);

  // Global Mouse Coordinate Tracking with Darker Rich Glow
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "GEO.AI | Planetary Change Intelligence";
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 1200);
    setTimeout(() => setAnalysisStep(3), 2500);

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
      setTimeout(() => navigate(`/dashboard/${data.id}`), 3500);
    } catch (err) {
      console.warn("Backend offline, using demo navigation:", err);
      setTimeout(() => navigate(`/dashboard/demo-job-id`), 3500);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden relative">
      
      {/* UPDATED: Darker & Richer Cursor Spotlight Glow (Deep Indigo / Electric Violet) */}
      <div 
        className="absolute pointer-events-none w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[140px] transition-transform duration-75 z-20"
        style={{ transform: `translate(${cursorPos.x - 300}px, ${cursorPos.y - 300}px)` }}
      />

      {/* Sleek Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-900/90 border border-indigo-500/40 p-8 rounded-3xl max-w-md w-full shadow-[0_0_80px_rgba(99,102,241,0.25)] space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-mono tracking-wide">Executing Geospatial Pipeline</h3>
              <p className="text-indigo-400 text-xs mt-1 font-mono">Target Grid: {locationName}</p>
            </div>

            <div className="space-y-3 text-left font-mono text-xs">
              <div className={`p-3.5 rounded-xl border flex items-center space-x-3 transition-all ${analysisStep >= 1 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                {analysisStep > 1 ? <CheckCircle2 className="h-4 w-4 text-indigo-400" /> : <div className="w-4 h-4 rounded-full border border-current animate-pulse" />}
                <span>Ingesting Sentinel-2 Rasters (2017-2025)...</span>
              </div>
              <div className={`p-3.5 rounded-xl border flex items-center space-x-3 transition-all ${analysisStep >= 2 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                {analysisStep > 2 ? <CheckCircle2 className="h-4 w-4 text-indigo-400" /> : analysisStep === 2 ? <div className="w-4 h-4 rounded-full border border-current animate-pulse" /> : <div className="w-4 h-4 rounded-full border border-slate-800" />}
                <span>Running Siamese U-Net Neural Segmentation...</span>
              </div>
              <div className={`p-3.5 rounded-xl border flex items-center space-x-3 transition-all ${analysisStep >= 3 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                {analysisStep >= 3 ? <CheckCircle2 className="h-4 w-4 text-indigo-400" /> : <div className="w-4 h-4 rounded-full border border-slate-800" />}
                <span>Generating Executive Change Report...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: HERO */}
      <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
        
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
          <div className="bg-slate-950/85 backdrop-blur-xl border border-indigo-500/40 p-3.5 rounded-2xl shadow-[0_0_35px_rgba(99,102,241,0.25)] flex items-center space-x-3 text-indigo-300 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-indigo-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-indigo-400" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-indigo-400" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-indigo-400" />
            <Satellite className="h-5 w-5 animate-spin text-indigo-400" style={{ animationDuration: '8s' }} />
            <div className="text-xs font-mono">
              <div className="font-bold tracking-wider">SENTINEL-2 ACTIVE</div>
              <div className="text-slate-400 text-[10px]">10m Resolution Grid</div>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-slate-800/40 backdrop-blur-xl relative z-20">
          <div className="flex items-center space-x-3">
            <span className="text-xl md:text-2xl font-black tracking-wider text-white">GEO.AI</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
              URBANPULSE V2
            </span>
          </div>

          <div className="hidden md:flex space-x-10 text-sm font-semibold text-slate-300">
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">DASHBOARD</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">SPECTRAL BANDS</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">SIAMESE U-NET</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">API SPECS</span>
          </div>

          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-full text-xs tracking-wide transition-all shadow-[0_0_25px_rgba(99,102,241,0.35)] cursor-pointer hover:scale-105"
          >
            Launch Intelligence
          </button>
        </nav>

        {/* Hero Center Content & Form */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-12 relative z-10 my-auto items-center py-12">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-mono shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <Activity className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
              <span>Multi-Spectral Telemetry & Sprawl Analysis (2017 – 2025)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-xl">
              Planetary Vision. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Real-Time Change Intelligence.
              </span>
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed drop-shadow">
              Autonomous detection of urban expansion pressure, canopy depletion, and water basin dynamics powered by Sentinel-2 satellite surface reflectance arrays and deep neural networks.
            </p>
          </div>

          {/* Quick Analysis Form Card */}
          <div className="lg:col-span-5">
            <form onSubmit={handleStartAnalysis} className="bg-slate-950/90 backdrop-blur-2xl border border-indigo-500/30 p-7 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4 relative overflow-hidden group">
              <div className="absolute top-2 left-2 text-indigo-500/30 font-mono text-[10px]">┌</div>
              <div className="absolute top-2 right-2 text-indigo-500/30 font-mono text-[10px]">┐</div>
              <div className="absolute bottom-2 left-2 text-indigo-500/30 font-mono text-[10px]">└</div>
              <div className="absolute bottom-2 right-2 text-indigo-500/30 font-mono text-[10px]">┘</div>

              <div className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between relative z-10">
                <span>Configure Geospatial Job</span>
                <span className="text-xs font-mono text-indigo-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>STATUS: READY</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 font-mono">Baseline (T1)</label>
                  <input type="text" value="01-01-2017" readOnly className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 font-mono">Target (T2)</label>
                  <input type="text" value="01-01-2025" readOnly className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono" />
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                <label className="text-[11px] font-semibold text-slate-400 font-mono">Target Location / City</label>
                <input 
                  type="text" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black py-3.5 rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center space-x-2 text-sm mt-2 cursor-pointer relative z-10 hover:scale-[1.02]"
              >
                <span>{loading ? "Processing Rasters..." : "Detect Changes & Report"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Live Telemetry Ticker Bar */}
        <div className="hidden sm:flex items-center justify-between px-8 pb-6 text-slate-400 text-xs font-mono relative z-10 border-t border-slate-800/40 pt-4 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
            <span>Telemetry Stream: Copernicus Open Access Hub Linked</span>
          </div>
          <div className="flex space-x-6 text-[11px] text-indigo-300">
            <span>ORBIT: S2A_MSIL1C</span>
            <span>CLOUD COVER: &lt; 1.4%</span>
            <span>GRID: EPSG:4326</span>
          </div>
        </div>
      </div>


      {/* SECTION 2: BENTO GRID & INTERACTIVE SPECTRAL TOGGLE SECTION */}
      <div ref={sectionRef} className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#010A17] via-[#0A4267] to-[#20658E] py-24 px-6">
        
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

        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center relative z-20 space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-indigo-500/30 text-indigo-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Competitive Edge & Spectral Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why UrbanPulse AI Outperforms Traditional Mapping
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Moving beyond manual surveys and outdated vector maps with autonomous, multi-temporal satellite processing from 2017 to 2025.
          </p>
        </div>

        {/* Interactive Spectral Band Toggles */}
        <div className="relative z-20 mb-10 flex flex-wrap justify-center gap-3 bg-slate-950/70 p-2.5 rounded-2xl border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => setActiveBand('ndvi')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${activeBand === 'ndvi' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>NDVI (Vegetation Index)</span>
          </button>
          <button 
            onClick={() => setActiveBand('ndwi')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${activeBand === 'ndwi' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>NDWI (Water Basins)</span>
          </button>
          <button 
            onClick={() => setActiveBand('ndbi')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${activeBand === 'ndbi' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>NDBI (Built-up Sprawl)</span>
          </button>
        </div>

        {/* Dynamic Interactive Band Info Preview Card */}
        <div className="max-w-4xl w-full relative z-20 mb-12 bg-slate-950/90 backdrop-blur-2xl border border-indigo-500/40 p-7 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.2)] text-center">
          {activeBand === 'ndvi' && (
            <div className="space-y-2 animate-fadeIn">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">[Spectral Band Focus: Red & NIR]</span>
              <h3 className="text-xl font-bold text-white">Normalized Difference Vegetation Index (NDVI)</h3>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                Quantifies canopy depletion and green infrastructure loss by measuring photosynthetic reflection across the 2017–2025 baseline.
              </p>
            </div>
          )}
          {activeBand === 'ndwi' && (
            <div className="space-y-2 animate-fadeIn">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">[Spectral Band Focus: Green & NIR]</span>
              <h3 className="text-xl font-bold text-white">Normalized Difference Water Index (NDWI)</h3>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                Isolates open water bodies and tracks wetland encroachment or hydrological shifts over urban drainage grids.
              </p>
            </div>
          )}
          {activeBand === 'ndbi' && (
            <div className="space-y-2 animate-fadeIn">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">[Spectral Band Focus: SWIR & NIR]</span>
              <h3 className="text-xl font-bold text-white">Normalized Difference Built-up Index (NDBI)</h3>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                Instantly flags impervious surface growth and concrete expansion pressure with pixel-level precision.
              </p>
            </div>
          )}
        </div>

        {/* Bento Grid Layout for Differentiators */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20 w-full px-4">
          
          <div className="md:col-span-2 bg-slate-950/80 backdrop-blur-2xl border border-indigo-500/30 p-8 rounded-3xl shadow-2xl hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-3 left-3 text-indigo-500/30 font-mono text-[10px]">┌ ┐</div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">Automated Multi-Temporal Engine (2017–2025)</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Unlike static maps, we compute automated historical change trajectories across an 8-year timeline instantly via Sentinel-2 rasters, ensuring zero manual lag in urban tracking.
            </p>
          </div>

          <div className="bg-slate-950/80 backdrop-blur-2xl border border-indigo-500/30 p-8 rounded-3xl shadow-2xl hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 group relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono">Deep Siamese U-Net Models</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Leveraging advanced neural segmentation to isolate exact pixel-level urban expansion and canopy degradation.
            </p>
          </div>

          <div className="bg-slate-950/80 backdrop-blur-2xl border border-indigo-500/30 p-8 rounded-3xl shadow-2xl hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 group relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono">Actionable Municipal Insights</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Instant executive briefing generation and ecological risk scores, turning raw spectral bands into strategic decisions.
            </p>
          </div>

          <div className="md:col-span-2 bg-slate-950/80 backdrop-blur-2xl border border-indigo-500/30 p-8 rounded-3xl shadow-2xl hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 group relative overflow-hidden">
            <div className="absolute bottom-3 right-3 text-indigo-500/30 font-mono text-[10px]">└ ┘</div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">Real-Time Copernicus Satellite Ingestion</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Direct connection to European Space Agency open access hub pipelines, guaranteeing high-resolution 10m grid telemetry on demand.
            </p>
          </div>

        </div>

        {/* Bottom Attribution / Core Tag */}
        <div className="mt-12 text-center relative z-20">
          <span className="text-indigo-300 text-xs md:text-sm tracking-widest uppercase font-mono font-bold bg-slate-950/70 px-6 py-2.5 rounded-full border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            — AUTONOMOUS GEOSPATIAL CHANGE DETECTION ENGINE
          </span>
        </div>

      </div>

    </div>
  );
}
