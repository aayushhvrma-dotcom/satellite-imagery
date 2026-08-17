import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Satellite } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('Mumbai Metropolitan Region');
  const [loading, setLoading] = useState(false);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://satellite-imagery.onrender.com/api/v1/analysis', {
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
      
      {/* Floating Satellite Animation Element */}
      <div className="absolute top-28 right-16 z-30 pointer-events-none animate-bounce duration-1000 hidden lg:block">
        <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 p-3 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center space-x-2 text-cyan-400">
          <Satellite className="h-6 w-6 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider">SENTINEL-2 ACTIVE</span>
        </div>
      </div>

      {/* Navbar (Teams removed from top right) */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-slate-800/80 backdrop-blur-md relative z-20">
        <div className="text-xl font-black tracking-wider text-white">GEO.AI</div>
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-slate-300">
          <span className="hover:text-cyan-400 cursor-pointer">DASHBOARD</span>
          <span className="hover:text-cyan-400 cursor-pointer">MODEL SPECS</span>
          <span className="hover:text-cyan-400 cursor-pointer">API</span>
        </div>
      </nav>

      {/* Hero Section with Realistic Earth Atmosphere Background */}
      <div className="relative overflow-hidden py-24 px-6 lg:px-16 border-b border-slate-800/80 min-h-[600px] flex items-center">
        
        {/* Real Blue Earth Atmosphere Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-end">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80" 
            alt="Earth from Space" 
            className="w-full h-full object-cover opacity-70 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight text-white drop-shadow-2xl">
              AI-Powered <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Satellite Imagery</span> <br />
              Change Detection.
            </h1>
            
            <p className="text-base text-slate-300 max-w-xl leading-relaxed drop-shadow">
              Monitor environmental changes, urban sprawl, and deforestation using Sentinel-2 data and advanced Siamese U-Net architectures.
            </p>
          </div>

          {/* Right Quick Start Analysis Form Card */}
          <div className="lg:col-span-5">
            <form onSubmit={handleStartAnalysis} className="bg-slate-950/80 backdrop-blur-xl border border-cyan-500/40 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="text-base font-bold text-white border-b border-slate-800 pb-2">Run Analysis</div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Baseline Date (T1)</label>
                <input 
                  type="text" 
                  value="01-01-2023"
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Analysis Date (T2)</label>
                <input 
                  type="text" 
                  value="01-01-2024"
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Location Name</label>
                <input 
                  type="text" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 text-sm mt-3 cursor-pointer"
              >
                <span>{loading ? "Processing..." : "Detect Changes"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}