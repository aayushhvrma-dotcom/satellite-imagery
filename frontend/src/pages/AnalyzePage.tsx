import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startAnalysis, getJobStatus } from '../api/client';
import { Loader2, MapPin } from 'lucide-react';

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('Mumbai');
  const [lat, setLat] = useState(19.0760);
  const [lon, setLon] = useState(72.8777);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Send request to Python backend
      const res = await startAnalysis({
        location_name: locationName,
        latitude: lat,
        longitude: lon,
        radius_km: 10,
        start_year: 2017,
        end_year: 2025
      });
      
      const jobId = res.id;

      // 2. Check status every second until complete
      const interval = setInterval(async () => {
        const statusRes = await getJobStatus(jobId);
        setStage(statusRes.current_stage);
        
        if (statusRes.status === 'completed') {
          clearInterval(interval);
          navigate(`/dashboard/${jobId}`); // 3. Go to dashboard!
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error connecting to backend!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <MapPin className="text-cyan-400" />
          <span>Configure Urban Analysis</span>
        </h2>
        
        {loading ? (
          <div className="text-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
            <p className="text-lg font-medium">{stage || 'Sending to AI engine...'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">City / Location Name</label>
              <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Latitude</label>
                <input type="number" step="any" value={lat} onChange={(e) => setLat(parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Longitude</label>
                <input type="number" step="any" value={lon} onChange={(e) => setLon(parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" required />
              </div>
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 rounded-lg transition mt-6">
              Run UrbanPulse Analysis
            </button>
          </form>
        )}
      </div>
    </div>
  );
}