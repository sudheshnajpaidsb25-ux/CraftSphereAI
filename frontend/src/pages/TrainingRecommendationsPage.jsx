import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  ListOrdered,
  Sparkles,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function TrainingRecommendationsPage() {
  const [artisans, setArtisans] = useState([]);
  const [selectedArtisanId, setSelectedArtisanId] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const data = await api.getArtisans();
      setArtisans(data);
      if (data.length > 0) {
        setSelectedArtisanId(data[0].id.toString());
      }
    } catch (err) {
      setError('Failed to fetch artisans.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (artisanId) => {
    if (!artisanId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRecommendations(artisanId);
      setPlan(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  useEffect(() => {
    if (selectedArtisanId) {
      fetchRecommendations(selectedArtisanId);
    }
  }, [selectedArtisanId]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold mb-2 border border-[#E6D8B6]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Module 6: Content-Based Curriculum Recommender</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
            Personalized Artisan Training Paths
          </h1>
          <p className="text-xs md:text-sm text-[#52605B] mt-1">
            Deterministic learning modules mapped directly to isolated skill gaps with practical
            traditional master exercises.
          </p>
        </div>

        {/* Artisan Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#143526]">Artisan:</label>
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

      {loading && !plan ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#143526] animate-spin" />
          <p className="text-xs text-[#52605B]">Computing content-based recommendations...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      ) : plan && (
        <div className="space-y-8">
          {/* Plan Summary Card */}
          <div className="heritage-card p-6 bg-gradient-to-r from-white via-[#FAF7F2] to-white space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D23] px-2.5 py-0.5 rounded bg-[#F7F1E1]">
                  Targeted Learning Blueprint
                </span>
                <h2 className="text-xl font-serif font-bold text-[#143526] mt-1.5">
                  {plan.artisan_name} – {plan.craft_category} ({plan.experience_level})
                </h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                {plan.recommendations.length} Active Target Courses
              </span>
            </div>

            {/* Identified Weaknesses Badges */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#143526]">Isolated Target Skill Gaps:</span>
              <div className="flex flex-wrap gap-2">
                {plan.identified_weaknesses.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-900"
                  >
                    • {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Learning Sequence Banner */}
            <div className="pt-3 border-t border-[#F0ECE1] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#143526]">
                <ListOrdered className="w-4 h-4 text-[#D4AF37]" />
                <span>Suggested Pedagogical Learning Sequence</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#52605B]">
                {plan.suggested_sequence.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white border border-[#EAE5D9] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#143526] text-[#FAF7F2] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Courses Grid */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#143526]">
              Recommended Training Modules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.recommendations.map((rec) => {
                const c = rec.course;
                return (
                  <div
                    key={rec.priority_rank}
                    className="heritage-card p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#143526] text-[#FAF7F2]">
                            Priority #{rec.priority_rank}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7F1E1] text-[#8C6D23]">
                            {c.difficulty_level}
                          </span>
                          <span className="text-[10px] font-semibold text-[#52605B] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#C5A059]" /> {c.estimated_hours} Hours
                          </span>
                        </div>
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#143526]">{c.title}</h4>

                      <p className="text-xs text-[#52605B] leading-relaxed line-clamp-3">
                        {c.description}
                      </p>

                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900">
                        <strong className="block mb-0.5 text-[#8C6D23]">Content-Based Match Reason:</strong>
                        <p className="leading-tight">{rec.rationale}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D6A4F]">
                        Focus: {c.skill_focus}
                      </span>
                      <button
                        onClick={() => setSelectedCourse(c)}
                        className="flex items-center gap-1 text-xs font-bold text-[#143526] hover:text-[#D4AF37] cursor-pointer"
                      >
                        <span>Inspect Practical Exercises</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Practical Exercises Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-5 border border-[#D4AF37]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#F7F1E1] text-[#8C6D23] uppercase">
                  {selectedCourse.skill_focus} Mastery • {selectedCourse.difficulty_level}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#143526] mt-1.5">
                  {selectedCourse.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#52605B]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[#143526] text-sm">Course Overview</h4>
                <p className="text-[#52605B] mt-1 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {selectedCourse.traditional_master_notes && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 italic">
                  <strong className="block font-sans not-italic text-xs font-bold text-[#8C6D23] mb-1">
                    Master Craftsman Field Advice:
                  </strong>
                  "{selectedCourse.traditional_master_notes}"
                </div>
              )}

              <div>
                <h4 className="font-bold text-[#143526] text-sm mb-2">Step-by-Step Practical Exercises</h4>
                <div className="space-y-2">
                  {selectedCourse.practical_exercises.map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#143526] text-[#FAF7F2] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-[#143526] font-medium leading-relaxed">{ex}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#52605B]">
                <span>Estimated Practice Duration: {selectedCourse.estimated_hours} Hours</span>
                <button
                  onClick={() => {
                    alert(`Enrolled ${selectedCourse.title} for tracking!`);
                    setSelectedCourse(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#143526] hover:bg-[#1E4D38] text-white font-bold cursor-pointer"
                >
                  Start Module Practice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

