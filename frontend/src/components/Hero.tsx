import { useState } from 'react';

export default function Hero() {
  const [date1, setDate1] = useState('2023-01-01');
  const [date2, setDate2] = useState('2024-01-01');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDetection = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://satellite-imagery.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aoi: { lat: 28.6139, lng: 77.2090 },
          date1: date1,
          date2: date2
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Backend connect nahi hua!", error);
      alert("Error: Backend server is not running on port 8000.");
    }
    setLoading(false);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden pb-20">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="font-bold text-white text-2xl tracking-widest z-50 uppercase">Geo.AI</div>
        
        <div className="hidden md:flex gap-12">
          {['Dashboard', 'Model Specs', 'API', 'Team'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-white/80 hover:text-white text-sm tracking-widest uppercase transition-colors">
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-sm tracking-wide hover:bg-blue-700 transition-all duration-300 button-glow">
            Connect GEE
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col md:flex-row justify-center items-center h-full pt-40 px-6 md:px-12 gap-12 max-w-7xl mx-auto">
        
        {/* Left Side: Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-inter text-white text-4xl md:text-6xl lg:text-[80px] font-bold leading-[1.1] tracking-tight text-glow">
            AI-Powered <br className="hidden md:block"/> Satellite Imagery <br className="hidden md:block"/> Change Detection.
          </h1>
          <p className="text-white/70 text-base md:text-lg mt-6 max-w-xl font-inter mx-auto md:mx-0">
            Monitor environmental changes, urban sprawl, and deforestation using Sentinel-2 data and advanced Siamese U-Net architectures.
          </p>
        </div>

        {/* Right Side: Working Control Panel Form */}
        <div className="flex-1 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-3xl liquid-glass relative">
          <h3 className="text-white text-xl font-semibold mb-6">Run Analysis</h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Baseline Date (T1)</label>
              <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            
            <div>
              <label className="text-white/70 text-sm mb-1 block">Analysis Date (T2)</label>
              <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>

            <button 
              onClick={handleDetection}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Processing AI Model..." : "Detect Changes"}
            </button>
          </div>

          {/* Results Box */}
          {result && result.status === "success" && (
            <div className="mt-6 p-5 bg-black/60 border border-blue-500/40 rounded-xl backdrop-blur-md w-full md:w-[800px] md:absolute md:top-full md:mt-4 md:left-1/2 md:-translate-x-1/2 z-50 shadow-2xl shadow-blue-900/20">
              <h4 className="text-blue-400 font-semibold mb-4 text-center tracking-widest uppercase">Analysis Results</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/60 text-xs mb-2 uppercase">Baseline ({date1})</span>
                  <img src={result.gee_image_1} alt="Before" className="w-full h-48 object-cover rounded-lg border border-white/20" />
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-white/60 text-xs mb-2 uppercase">Analysis ({date2})</span>
                  <img src={result.gee_image_2} alt="After" className="w-full h-48 object-cover rounded-lg border border-white/20" />
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-red-400/80 text-xs mb-2 uppercase">AI Change Mask</span>
                  <img src={result.analysis.mask_url} alt="Mask" className="w-full h-48 object-cover rounded-lg border border-red-500/50" />
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm border-t border-white/10 pt-4">
                <span className="text-white/70">Changed Pixels: <strong className="text-white">{result.analysis.changed_pixels}</strong></span>
                <span className="text-white/70">Estimated Area: <strong className="text-red-400">{result.analysis.affected_area_sqm} sqm</strong></span>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}