import React, { useState } from 'react';
import { api } from '../services/api';
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Image as ImageIcon,
  Cpu,
  Layers,
  MapPin,
  HelpCircle
} from 'lucide-react';

export default function RecognitionPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Client-side format & size validation
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selected.type)) {
      setError('Unsupported file type. Please upload a JPG, JPEG, or PNG photograph.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB limit.');
      return;
    }

    setError(null);
    setResult(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      const pseudoEvent = { target: { files: [dropped] } };
      handleFileChange(pseudoEvent);
    }
  };

  const runPrediction = async () => {
    if (!file) {
      setError('Please select or drag a craft image first.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.predictCraft(file);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Image classification failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold mb-2 border border-[#E6D8B6]">
          <Cpu className="w-3.5 h-3.5" />
          <span>Module 1: MobileNetV2 Vision Transfer Learning</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
          AI Craft & Pattern Recognition
        </h1>
        <p className="text-xs md:text-sm text-[#52605B] mt-1">
          Upload photographs of traditional Goan crafts to identify category, analyze structural
          surface patterns, and view curated cultural knowledge.
        </p>
      </div>

      {/* Main Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload & Preview Card */}
        <div className="lg:col-span-6 heritage-card p-6 space-y-4">
          <h2 className="font-serif font-bold text-base text-[#143526]">Craft Photograph Upload</h2>

          {!preview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#C5BEAF] hover:border-[#D4AF37] rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 bg-[#FAF7F2] transition-colors cursor-pointer"
              onClick={() => document.getElementById('craft-image-input').click()}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#EAE5D9] flex items-center justify-center text-[#143526]">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#143526]">
                  Click to select or drag & drop craft photo
                </p>
                <p className="text-xs text-[#52605B]">Supports JPG, JPEG, PNG (Max: 10 MB)</p>
              </div>
              <input
                id="craft-image-input"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#EAE5D9] bg-black/5 aspect-square max-h-72 w-full flex items-center justify-center">
                <img src={preview} alt="Upload preview" className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center justify-between text-xs text-[#52605B]">
                <span className="truncate max-w-[200px]">{file?.name}</span>
                <span>{(file?.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={runPrediction}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-[#143526] hover:bg-[#1E4D38] disabled:opacity-60 text-[#FAF7F2] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Classifying with MobileNetV2...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Classify Craft Category</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetUpload}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-white border border-[#EAE5D9] text-[#143526] hover:bg-[#FAF7F2] text-xs font-semibold"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-[#F0ECE1] text-[11px] text-[#52605B] space-y-1">
            <p className="font-semibold text-[#143526]">Supported Goan Categories:</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Pottery (Bicholim)', 'Bamboo & Cane (Sattari)', 'Handloom (Kunbi)', 'Wood Carving (Cuncolim)'].map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#EAE5D9] text-[#143526]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 space-y-6">
          {!result ? (
            <div className="heritage-card p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#C5A059] flex items-center justify-center border border-[#EAE5D9]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#143526]">
                Awaiting Craft Image Analysis
              </h3>
              <p className="text-xs text-[#52605B] max-w-sm">
                Upload a photograph on the left and run inference to see genuine neural network
                predictions, model confidence scores, and historical Goan lineage details.
              </p>
            </div>
          ) : result.status === 'unsupported_category' || !result.is_supported ? (
            /* Clear Out-of-category handling */
            <div className="heritage-card p-6 border-amber-300 bg-amber-50/50 space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h3 className="font-serif font-bold text-base">Outside Supported Craft Categories</h3>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {result.explanation}
              </p>
              <div className="p-3 bg-white/70 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
                <p className="font-semibold">Helpful Photography Guidelines:</p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-900">
                  <li>Ensure the craft object occupies at least 60% of the image frame.</li>
                  <li>Use natural daylight to reveal authentic red clay, cane grain, or weave texture.</li>
                  <li>Avoid heavy background distractions or synthetic commercial plastic items.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Successful Prediction Card */
            <div className="heritage-card p-6 space-y-5 border-[#D4AF37]">
              {/* Prediction Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Confidence: {result.confidence_percentage}%
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#143526] mt-1.5">
                    {result.predicted_category}
                  </h3>
                  <p className="text-xs text-[#52605B] mt-0.5">
                    {result.model_architecture}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Model Provenance Badge */}
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] text-[11px] text-[#52605B] space-y-1">
                <div className="flex items-center justify-between text-[#143526] font-semibold">
                  <span>Architecture Status:</span>
                  <span className={result.is_trained_model ? 'text-emerald-700' : 'text-amber-700'}>
                    {result.is_trained_model ? 'Fine-Tuned MobileNetV2 Weights Loaded' : 'Pretrained Feature Baseline'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#52605B]">{result.explanation}</p>
              </div>

              {/* All Probabilities Distribution */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#143526]">Category Probability Distribution:</p>
                <div className="space-y-2">
                  {result.all_probabilities.map((item, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between text-[#143526]">
                        <span>{item.category}</span>
                        <span className="font-bold">{item.confidence_percentage}%</span>
                      </div>
                      <div className="w-full bg-[#EAE5D9] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#143526] h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.confidence_percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Knowledge Details */}
              {result.craft_details && (
                <div className="pt-4 border-t border-[#F0ECE1] space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#143526] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#D4AF37]" />
                    <span>Goan Heritage Context: {result.craft_details.title}</span>
                  </h4>
                  <div className="text-xs space-y-1.5 text-[#52605B]">
                    <p>
                      <span className="font-semibold text-[#143526]">Traditional Materials:</span>{' '}
                      {result.craft_details.materials}
                    </p>
                    <p>
                      <span className="font-semibold text-[#143526]">Key Techniques:</span>{' '}
                      {result.craft_details.key_techniques}
                    </p>
                    <p>
                      <span className="font-semibold text-[#143526]">Regional Clusters:</span>{' '}
                      {result.craft_details.geography}
                    </p>
                    <p className="italic text-[#8C6D23] bg-[#F7F1E1] p-2.5 rounded-lg border border-[#E6D8B6]">
                      "{result.craft_details.cultural_significance}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

