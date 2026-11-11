import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Target,
  Clock
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function SkillGapPage({ setActivePage }) {
  const [artisans, setArtisans] = useState([]);
  const [selectedArtisanId, setSelectedArtisanId] = useState('');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const data = await api.getArtisans();
      setArtisans(data);
      if (data.length > 0) {
        setSelectedArtisanId(data[0].id.toString());
      }
    } catch (err) {
      setError('Failed to fetch artisan records.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGaps = async (artisanId) => {
    if (!artisanId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSkillGaps(artisanId);
      setGapData(res);
    } catch (err) {
      setError(err.message || 'Failed to calculate skill gap analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  useEffect(() => {
    if (selectedArtisanId) {
      fetchGaps(selectedArtisanId);
    }
  }, [selectedArtisanId]);

  // Format data for Radar Chart
  const radarData = (gapData?.gaps || []).map((g) => ({
    criterion: g.criterion.replace(' Consistency', '').replace(' Quality', ''),
    current: g.current_score,
    target: g.target_score
  }));

  // Format historical progress
  const historyData = (gapData?.historical_progress || []).map((h, idx) => ({
    assessment: `Run ${idx + 1}`,
    score: h.overall_score,
    symmetry: h.symmetry,
    surface: h.surface_finish
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold mb-2 border border-[#E6D8B6]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Module 5: Deterministic Gap Matrix</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
            Artisan Skill Gap Analysis
          </h1>
          <p className="text-xs md:text-sm text-[#52605B] mt-1">
            Compare assessed rubric performance directly against expert master guild target
            benchmarks to isolate developmental priorities.
          </p>
        </div>

        {/* Artisan Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#143526]">Select Artisan:</label>
          <select
            value={selectedArtisanId}
            onChange={(e) => setSelectedArtisanId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#EAE5D9] bg-white text-xs font-semibold text-[#143526] focus:outline-none focus:border-[#D4AF37]"
          >
            {artisans.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.craft_category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && !gapData ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#143526] animate-spin" />
          <p className="text-xs text-[#52605B]">Calculating skill gap differentials...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      ) : gapData && (
        <div className="space-y-8">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="heritage-card p-5 space-y-2">
              <span className="text-[11px] font-semibold text-[#52605B]">Current Overall Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-[#143526]">
                  {gapData.overall_score}
                </span>
                <span className="text-xs text-[#8A7E68]">/ 10.0</span>
              </div>
              <p className="text-[11px] text-[#52605B]">
                {gapData.artisan_name} ({gapData.craft_category} - {gapData.experience_level})
              </p>
            </div>

            <div className="heritage-card p-5 space-y-2">
              <span className="text-[11px] font-semibold text-[#52605B]">Master Target Benchmark</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-[#8C6D23]">
                  {gapData.benchmark_overall}
                </span>
                <span className="text-xs text-[#8A7E68]">/ 10.0</span>
              </div>
              <p className="text-[11px] text-[#52605B]">
                Calibrated against Goan master guild standards
              </p>
            </div>

            <div className="heritage-card p-5 space-y-2 bg-gradient-to-br from-[#FAF7F2] to-white">
              <span className="text-[11px] font-semibold text-[#52605B]">Immediate Action Path</span>
              <p className="text-xs font-bold text-[#143526] line-clamp-2">
                {gapData.top_priorities[0] || 'Benchmark standards satisfied.'}
              </p>
              <button
                onClick={() => setActivePage('recommendations')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143526] hover:text-[#D4AF37] pt-1"
              >
                <span>View Training Solutions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Radar Chart & Criterion Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Radar Chart */}
            <div className="lg:col-span-6 heritage-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#143526]">
                  Proficiency vs. Master Target Radar
                </h3>
                <p className="text-xs text-[#52605B]">
                  Green indicates current performance; gold polygon reflects master targets.
                </p>
              </div>

              <div className="h-72 w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#EAE5D9" />
                    <PolarAngleAxis dataKey="criterion" tick={{ fill: '#143526', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#C5BEAF" />
                    <Radar
                      name="Current Score"
                      dataKey="current"
                      stroke="#2D6A4F"
                      fill="#2D6A4F"
                      fillOpacity={0.45}
                    />
                    <Radar
                      name="Master Target"
                      dataKey="target"
                      stroke="#D4AF37"
                      fill="#D4AF37"
                      fillOpacity={0.25}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#143526',
                        borderColor: '#D4AF37',
                        borderRadius: '8px',
                        color: '#FAF7F2',
                        fontSize: '11px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-[#F0ECE1] text-[11px] text-[#52605B] flex items-center justify-between">
                <span>Evaluated across 5 core craftsmanship axes</span>
                <span className="font-semibold text-[#143526]">Zero subjective bias</span>
              </div>
            </div>

            {/* Detailed Criterion Cards */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="font-serif font-bold text-base text-[#143526]">
                Target Shortfall Matrix
              </h3>

              <div className="space-y-3">
                {gapData.gaps.map((item, idx) => {
                  const isHigh = item.status === 'High Priority Gap';
                  const isMet = item.status === 'Target Met';

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isHigh
                          ? 'bg-rose-50/50 border-rose-200'
                          : isMet
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-[#FAF7F2] border-[#EAE5D9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#143526]">{item.criterion}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isHigh
                                ? 'bg-rose-100 text-rose-800'
                                : isMet
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#143526]">
                          {item.current_score} / {item.target_score}
                        </span>
                      </div>

                      <div className="mt-2 w-full bg-[#EAE5D9] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isMet ? 'bg-emerald-600' : isHigh ? 'bg-rose-600' : 'bg-amber-600'
                          }`}
                          style={{ width: `${(item.current_score / item.target_score) * 100}%` }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#52605B]">
                        <span>{item.benchmark_description}</span>
                        <span className="font-semibold">
                          {item.gap > 0 ? `Gap: -${item.gap} pts` : 'Benchmark Met'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Historical Progression Timeline */}
          {historyData.length > 1 && (
            <div className="heritage-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-base text-[#143526]">
                  Historical Skill Trajectory Over Time
                </h3>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <XAxis dataKey="assessment" tick={{ fontSize: 11, fill: '#52605B' }} />
                    <YAxis domain={[5, 10]} tick={{ fontSize: 11, fill: '#52605B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#143526',
                        borderColor: '#D4AF37',
                        borderRadius: '8px',
                        color: '#FAF7F2',
                        fontSize: '11px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="score" stroke="#143526" strokeWidth={3} name="Overall Score" />
                    <Line type="monotone" dataKey="symmetry" stroke="#D4AF37" strokeWidth={2} name="Symmetry" />
                    <Line type="monotone" dataKey="surface" stroke="#C86D51" strokeWidth={2} name="Surface Finish" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

