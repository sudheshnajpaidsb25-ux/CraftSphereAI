import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Layers,
  UploadCloud,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function PatternIntelligencePage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selected.type)) {
      setError('Please upload a JPG, JPEG, or PNG photograph.');
      return;
    }

    setError(null);
    setResults(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const runPatternSearch = async () => {
    if (!file) {
      setError('Please upload a pattern photograph first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.searchPatterns(file, 4);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Pattern similarity matching failed.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold mb-2 border border-[#E6D8B6]">
          <Layers className="w-3.5 h-3.5" />
          <span>Module 2: 128-D Vector Embeddings & Cosine Metric</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
          Pattern Intelligence & Visual Resemblance
        </h1>
        <p className="text-xs md:text-sm text-[#52605B] mt-1">
          Extract multi-scale spatial texture and color frequency vectors from craft photographs,
          compare against the verified Goan archive, and discover related ancestral motifs.
        </p>
      </div>

      {/* Prominent Ethical Cultural AI Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Ethical Cultural AI Notice & Disclaimer</p>
          <p className="leading-relaxed">
            Visual pattern similarity scores reflect computational color palette, edge density, and
            geometric contour correlations. Visual resemblance does <strong>NOT</strong> constitute
            proof of historical origin, tribal lineage, or cultural authenticity.
          </p>
        </div>
      </div>

      {/* Query Upload Panel */}
      <div className="heritage-card p-6 space-y-4">
        <h2 className="font-serif font-bold text-base text-[#143526]">Query Pattern Photograph</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4">
            {!preview ? (
              <div
                onClick={() => document.getElementById('pattern-file-input').click()}
                className="border-2 border-dashed border-[#C5BEAF] hover:border-[#D4AF37] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 bg-[#FAF7F2] cursor-pointer aspect-video"
              >
                <UploadCloud className="w-8 h-8 text-[#143526]" />
                <p className="text-xs font-semibold text-[#143526]">Click to upload pattern photo</p>
                <p className="text-[10px] text-[#52605B]">JPG, JPEG, PNG (Max: 10 MB)</p>
                <input
                  id="pattern-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-[#EAE5D9] aspect-video flex items-center justify-center bg-black/5">
                <img src={preview} alt="Query pattern" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="md:col-span-8 space-y-3">
            <p className="text-xs text-[#52605B] leading-relaxed">
              Upload any sample photograph—such as a piece of woven cane, terracotta pottery rim, or
              traditional Kunbi textile—to extract its 128-dimensional spatial vector and query the
              heritage archive for mathematical cosine similarity matches.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={runPatternSearch}
                disabled={!file || loading}
                className="px-5 py-2.5 rounded-xl bg-[#143526] hover:bg-[#1E4D38] disabled:opacity-50 text-[#FAF7F2] font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Computing Vector Embeddings...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Search Similar Patterns</span>
                  </>
                )}
              </button>

              {preview && (
                <button
                  onClick={reset}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#EAE5D9] text-[#143526] hover:bg-[#FAF7F2] text-xs font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 pt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#143526]">
                Archive Resemblance Matches
              </h3>
              <p className="text-xs text-[#52605B]">{results.model_method}</p>
            </div>
            <span className="text-xs font-semibold text-[#8C6D23] px-3 py-1 rounded-full bg-[#F7F1E1] border border-[#E6D8B6]">
              {results.matches.length} Closest Matches Retrieved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.matches.map((item, idx) => (
              <div key={idx} className="heritage-card overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#143526]/85 backdrop-blur-sm text-[#FAF7F2] text-[11px] font-bold border border-[#D4AF37]/50">
                      {item.similarity_percentage}% Cosine Match
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D23] px-2 py-0.5 rounded bg-[#F7F1E1]">
                      {item.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#143526] mt-1">{item.name}</h4>
                    <p className="text-[11px] text-[#52605B] line-clamp-3">{item.cultural_context}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 text-[11px] space-y-1 text-[#8A7E68] border-t border-[#F0ECE1] mt-3">
                  <p>
                    <span className="font-semibold text-[#143526]">Region:</span> {item.region_of_origin}
                  </p>
                  <p>
                    <span className="font-semibold text-[#143526]">Technique:</span>{' '}
                    <span className="line-clamp-1">{item.traditional_technique}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

