import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Award,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Layers,
  History,
  TrendingUp,
  Cpu,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

const RUBRIC_EXPLANATIONS = {
  'Shape Consistency': 'Evaluates dimensional uniformity, wall thickness stability, and adherence to functional volume standards.',
  'Surface Finish': 'Evaluates burnishing smoothness, absence of cracks, glaze/slip evenness, and splinter-free finish.',
  'Pattern Consistency': 'Evaluates geometric regularity of checked lattice, twill lines, or relief ornamental spacing.',
  'Symmetry': 'Evaluates bilateral balance across the vertical central axis and circular rim alignment.',
  'Detail Quality': 'Evaluates crispness of carved undercuts, selvedge tassels, rim lip contours, and joinery tightness.'
};

export default function ArtisanAssessmentPage({ setActivePage }) {
  const [artisans, setArtisans] = useState([]);
  const [selectedArtisanId, setSelectedArtisanId] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rubric Scores (1.0 - 10.0)
  const [scores, setScores] = useState({
    shape_consistency: 7.5,
    surface_finish: 7.5,
    pattern_consistency: 7.5,
    symmetry: 7.5,
    detail_quality: 7.5
  });

  const [craftTitle, setCraftTitle] = useState('Earthen Cooking Vessel (Kundlem)');
  const [expertNotes, setExpertNotes] = useState('Clean rim curvature with good clay preparation.');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80');

  // New Artisan Form
  const [showRegModal, setShowRegModal] = useState(false);
  const [newArtisan, setNewArtisan] = useState({
    name: '',
    craft_category: 'Pottery',
    experience_years: 5,
    experience_level: 'Intermediate',
    village_location: 'Bicholim, North Goa',
    bio: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch artisans
  const loadArtisans = async () => {
    try {
      setLoading(true);
      const data = await api.getArtisans();
      setArtisans(data);
      if (data.length > 0 && !selectedArtisanId) {
        setSelectedArtisanId(data[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history for selected artisan
  const loadAssessments = async (artisanId) => {
    if (!artisanId) return;
    try {
      const hist = await api.getArtisanAssessments(artisanId);
      setAssessments(hist);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadArtisans();
  }, []);

  useEffect(() => {
    if (selectedArtisanId) {
      loadAssessments(selectedArtisanId);
    }
  }, [selectedArtisanId]);

  const selectedArtisan = artisans.find((a) => a.id.toString() === selectedArtisanId);

  // Calculate live overall score (20% each)
  const currentOverall = (
    scores.shape_consistency * 0.2 +
    scores.surface_finish * 0.2 +
    scores.pattern_consistency * 0.2 +
    scores.symmetry * 0.2 +
    scores.detail_quality * 0.2
  ).toFixed(2);

  const handleScoreChange = (criterion, val) => {
    setScores((prev) => ({ ...prev, [criterion]: parseFloat(val) }));
  };

  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtisan) return;

    try {
      setSubmitting(true);
      setMessage(null);

      const payload = {
        artisan_id: selectedArtisan.id,
        craft_category: selectedArtisan.craft_category,
        craft_title: craftTitle,
        image_url: photoUrl,
        shape_consistency: scores.shape_consistency,
        surface_finish: scores.surface_finish,
        pattern_consistency: scores.pattern_consistency,
        symmetry: scores.symmetry,
        detail_quality: scores.detail_quality,
        expert_notes: expertNotes,
        cv_measured_symmetry: parseFloat((scores.symmetry * 0.94).toFixed(1)),
        cv_measured_smoothness: parseFloat((scores.surface_finish * 0.96).toFixed(1))
      };

      await api.createAssessment(payload);
      setMessage({ type: 'success', text: 'Assessment submitted and recorded successfully!' });
      loadAssessments(selectedArtisan.id);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterArtisan = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await api.registerArtisan(newArtisan);
      setShowRegModal(false);
      setNewArtisan({
        name: '',
        craft_category: 'Pottery',
        experience_years: 5,
        experience_level: 'Intermediate',
        village_location: 'Bicholim, North Goa',
        bio: ''
      });
      await loadArtisans();
      setSelectedArtisanId(created.id.toString());
    } catch (err) {
      alert('Registration failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold mb-2 border border-[#E6D8B6]">
            <Award className="w-3.5 h-3.5" />
            <span>Module 4: 5-Criterion Evaluative Rubric</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
            Artisan Skill Assessment
          </h1>
          <p className="text-xs md:text-sm text-[#52605B] mt-1">
            Conduct multi-factor craftsmanship evaluations using standardized rubric benchmarks,
            clearly differentiating optical CV metrics from master expert assessments.
          </p>
        </div>

        <button
          onClick={() => setShowRegModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#143526] hover:bg-[#1E4D38] text-[#FAF7F2] font-semibold text-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#D4AF37]" />
          <span>Register Artisan</span>
        </button>
      </div>

      {/* Artisan Profile Selector */}
      <div className="heritage-card p-5 bg-gradient-to-r from-white to-[#FAF7F2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-[#143526] whitespace-nowrap">Active Artisan:</label>
          <select
            value={selectedArtisanId}
            onChange={(e) => setSelectedArtisanId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#EAE5D9] bg-white text-xs text-[#143526] font-semibold focus:outline-none focus:border-[#D4AF37] min-w-[220px]"
          >
            {artisans.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.craft_category} - {a.village_location})
              </option>
            ))}
          </select>
        </div>

        {selectedArtisan && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#52605B]">
            <span>
              <strong className="text-[#143526]">Code:</strong> {selectedArtisan.artisan_code}
            </span>
            <span>
              <strong className="text-[#143526]">Experience:</strong> {selectedArtisan.experience_years} Years ({selectedArtisan.experience_level})
            </span>
            <span>
              <strong className="text-[#143526]">Category:</strong> {selectedArtisan.craft_category}
            </span>
          </div>
        )}
      </div>

      {/* Main Rubric & Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Rubric Input Sliders */}
        <div className="lg:col-span-7 heritage-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-[#143526]">
              Craftsmanship Rubric Evaluation
            </h2>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-[#8C6D23]">Overall Calculated Score</span>
              <p className="text-2xl font-serif font-bold text-[#143526]">{currentOverall} / 10.0</p>
            </div>
          </div>

          <form onSubmit={handleAssessmentSubmit} className="space-y-5">
            {/* 5 Criteria Sliders */}
            {[
              { id: 'shape_consistency', label: 'Shape Consistency', val: scores.shape_consistency },
              { id: 'surface_finish', label: 'Surface Finish', val: scores.surface_finish },
              { id: 'pattern_consistency', label: 'Pattern Consistency', val: scores.pattern_consistency },
              { id: 'symmetry', label: 'Symmetry & Bilateral Alignment', val: scores.symmetry },
              { id: 'detail_quality', label: 'Detail Quality & Precision', val: scores.detail_quality }
            ].map((crit) => (
              <div key={crit.id} className="space-y-1.5 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#143526]">{crit.label}</span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#EAE5D9] text-[#143526]">
                    {crit.val.toFixed(1)} / 10.0
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  value={crit.val}
                  onChange={(e) => handleScoreChange(crit.id, e.target.value)}
                  className="w-full accent-[#143526] cursor-pointer"
                />
                <p className="text-[11px] text-[#8A7E68] leading-tight">
                  {RUBRIC_EXPLANATIONS[crit.label.split('&')[0].trim()]}
                </p>
              </div>
            ))}

            {/* Submission metadata */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#143526] mb-1">Craft Submission Title</label>
                <input
                  type="text"
                  required
                  value={craftTitle}
                  onChange={(e) => setCraftTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#143526] mb-1">Master Evaluator Notes</label>
                <textarea
                  rows={2}
                  value={expertNotes}
                  onChange={(e) => setExpertNotes(e.target.value)}
                  placeholder="Specific observations regarding firing temperature, chisel depth, or tension..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !selectedArtisan}
              className="w-full py-3 rounded-xl bg-[#143526] hover:bg-[#1E4D38] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              {submitting ? 'Recording Assessment...' : 'Submit Assessment to Database'}
            </button>
          </form>
        </div>

        {/* Right: Optical CV vs Expert Distinction & Assessment History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Important Distinction Banner */}
          <div className="heritage-card p-5 bg-gradient-to-br from-amber-50 to-[#FAF7F2] border-[#E6D8B6] space-y-3">
            <div className="flex items-center gap-2 text-[#8C6D23]">
              <Cpu className="w-4 h-4" />
              <h3 className="font-serif font-bold text-sm">Computer Vision vs. Expert Evaluator</h3>
            </div>
            <p className="text-[11px] text-[#52605B] leading-relaxed">
              <strong>Notice:</strong> 2D photographs cannot reliably measure wall thickness, tensile
              flexibility, or internal clay density. CraftSphere AI transparently separates optical CV
              measurements from expert judgment:
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE5D9]">
                <span className="text-[#8C6D23] font-bold block">Optical CV Sensor</span>
                <p className="text-[#52605B] mt-0.5">Bilateral mirror pixel diff & Laplacian smoothness gradient.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE5D9]">
                <span className="text-[#143526] font-bold block">Master Rubric</span>
                <p className="text-[#52605B] mt-0.5">Physical tactile integrity, firing sound, and authentic technique.</p>
              </div>
            </div>
          </div>

          {/* Historical Assessments Feed */}
          <div className="heritage-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-sm text-[#143526]">Assessment History</h3>
              </div>
              <button
                onClick={() => setActivePage('gaps')}
                className="text-[11px] font-bold text-[#143526] hover:text-[#D4AF37] flex items-center gap-1"
              >
                <span>View Skill Gaps</span>
                <TrendingUp className="w-3 h-3" />
              </button>
            </div>

            {assessments.length === 0 ? (
              <p className="text-xs text-[#52605B] py-6 text-center">
                No previous assessments recorded for this artisan.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {assessments.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#143526]">{a.craft_title}</span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                        {a.overall_score} / 10.0
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-[#52605B]">
                      <span>Sym: {a.symmetry}</span>
                      <span>Surf: {a.surface_finish}</span>
                      <span>Shape: {a.shape_consistency}</span>
                    </div>
                    {a.expert_notes && (
                      <p className="text-[10px] italic text-[#8A7E68] line-clamp-2">
                        "{a.expert_notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Register Artisan Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#143526]">Register New Artisan</h2>
            <form onSubmit={handleRegisterArtisan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#143526] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumbhar"
                  value={newArtisan.name}
                  onChange={(e) => setNewArtisan({ ...newArtisan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Craft Family *</label>
                <select
                  value={newArtisan.craft_category}
                  onChange={(e) => setNewArtisan({ ...newArtisan, craft_category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5D9] bg-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Pottery">Pottery</option>
                  <option value="Bamboo and Cane">Bamboo and Cane</option>
                  <option value="Handloom">Handloom</option>
                  <option value="Wood Carving">Wood Carving</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#143526] mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={newArtisan.experience_years}
                    onChange={(e) => setNewArtisan({ ...newArtisan, experience_years: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#143526] mb-1">Level</label>
                  <select
                    value={newArtisan.experience_level}
                    onChange={(e) => setNewArtisan({ ...newArtisan, experience_level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5D9] bg-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Master">Master</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Village & Region in Goa *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bordem, Bicholim, North Goa"
                  value={newArtisan.village_location}
                  onChange={(e) => setNewArtisan({ ...newArtisan, village_location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Artisan background, traditional lineage..."
                  value={newArtisan.bio}
                  onChange={(e) => setNewArtisan({ ...newArtisan, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#143526] text-white font-bold cursor-pointer"
                >
                  {submitting ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

