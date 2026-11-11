import React from 'react';
import {
  Sparkles,
  Award,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
  MapPin,
  CheckCircle2,
  Heart,
  FileCode,
  Terminal
} from 'lucide-react';

export default function AboutPage() {
  const modules = [
    { num: '01', title: 'AI Craft Recognition', desc: 'MobileNetV2 transfer learning model fine-tuned for Goan pottery, cane/bamboo, handloom, and woodcarving.' },
    { num: '02', title: 'Pattern Intelligence', desc: '128-dimensional multi-scale visual pattern vectors with cosine vector similarity metric.' },
    { num: '03', title: 'Digital Heritage Archive', desc: 'Verified Goan craft registry with regional provenance, material taxonomy, and CC-BY-NC-SA licensing.' },
    { num: '04', title: 'Artisan Skill Assessment', desc: '5-criterion master rubric paired transparently with optical computer vision bilateral symmetry & surface smoothness metrics.' },
    { num: '05', title: 'Skill Gap Analysis', desc: 'Radar & tabular shortfall matrix comparing live scores against calibrated master guild benchmarks.' },
    { num: '06', title: 'Personalized Training', desc: 'Content-based curriculum engine producing non-random learning sequences and master exercises.' },
    { num: '07', title: 'Heritage Knowledge Assistant', desc: 'Deterministic local TF-IDF vector retrieval answering artisan queries with cited factual archives.' }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold border border-[#E6D8B6]">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Goa AI Hackathon 2026 – Artisan Development Theme</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#143526]">
          CraftSphere AI Platform Architecture
        </h1>
        <p className="text-xs md:text-sm text-[#52605B] leading-relaxed">
          An integrated full-stack AI ecosystem designed to preserve Goan cultural heritage,
          empower indigenous artisans with objective feedback, and bridge traditional craftsmanship
          with modern computer vision.
        </p>
      </div>

      {/* Vision & Ethical AI Pledge */}
      <div className="heritage-card p-6 md:p-8 space-y-5 bg-gradient-to-br from-white to-[#FAF7F2]">
        <div className="flex items-center gap-2 text-[#143526]">
          <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-serif font-bold">Ethical Artificial Intelligence Pledge</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#52605B] leading-relaxed">
          <div className="p-4 rounded-xl bg-white border border-[#EAE5D9] space-y-2">
            <h4 className="font-bold text-[#143526] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cultural Authenticity</span>
            </h4>
            <p>
              We do not fabricate historical claims or invent fake cultural lineages. All verified
              records cite authentic Goan traditions like Bicholim terracotta and Kunbi weaving.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#EAE5D9] space-y-2">
            <h4 className="font-bold text-[#143526] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sensor Separation</span>
            </h4>
            <p>
              Photographs cannot capture tactile density or internal clay structure. Optical CV metrics
              are transparently presented alongside, but distinct from, expert master evaluations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#EAE5D9] space-y-2">
            <h4 className="font-bold text-[#143526] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transparent AI Models</span>
            </h4>
            <p>
              No unvalidated black-box claims. The system accurately reports whether fine-tuned MobileNetV2
              weights, prototype centroids, or deterministic TF-IDF retrieval were utilized.
            </p>
          </div>
        </div>
      </div>

      {/* Full Module Inventory */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#143526]">Platform Module Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => (
            <div key={m.num} className="heritage-card p-4 flex items-start gap-3.5">
              <span className="w-8 h-8 rounded-xl bg-[#143526] text-[#D4AF37] text-xs font-bold font-mono flex items-center justify-center shrink-0">
                {m.num}
              </span>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#143526]">{m.title}</h4>
                <p className="text-xs text-[#52605B] mt-1 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="heritage-card p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#C5A059]" />
          <h2 className="text-xl font-serif font-bold text-[#143526]">Technical Architecture Stack</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] space-y-1.5">
            <span className="font-bold text-[#143526] block">Frontend Client</span>
            <ul className="text-[#52605B] space-y-1">
              <li>• React 19 & Vite 8</li>
              <li>• Tailwind CSS v4</li>
              <li>• Lucide React Icons</li>
              <li>• Recharts (Radar, Pie, Bar)</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] space-y-1.5">
            <span className="font-bold text-[#143526] block">Backend API</span>
            <ul className="text-[#52605B] space-y-1">
              <li>• Python 3.14 & FastAPI</li>
              <li>• Uvicorn ASGI Server</li>
              <li>• Pydantic v2 Schemas</li>
              <li>• RESTful Swagger OpenAPI</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] space-y-1.5">
            <span className="font-bold text-[#143526] block">Database & Storage</span>
            <ul className="text-[#52605B] space-y-1">
              <li>• SQLite (Self-Contained)</li>
              <li>• SQLAlchemy 2.1 ORM</li>
              <li>• 9 Interlinked Tables</li>
              <li>• Local Static Upload Mounting</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] space-y-1.5">
            <span className="font-bold text-[#143526] block">AI & Computer Vision</span>
            <ul className="text-[#52605B] space-y-1">
              <li>• MobileNetV2 Transfer Model</li>
              <li>• OpenCV (Bilateral/Laplacian)</li>
              <li>• Scikit-learn (TF-IDF & Metrics)</li>
              <li>• PyTorch / Torchvision</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Solo Developer & Hackathon Info */}
      <div className="p-6 rounded-2xl bg-[#143526] text-white border border-[#2D6A4F] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold">
            <Terminal className="w-4 h-4" />
            <span>Goa AI Hackathon 2026 Solo Project Submission</span>
          </div>
          <h3 className="text-lg md:text-xl font-serif font-bold text-[#FAF7F2]">
            CraftSphere AI – Complete Working MVP
          </h3>
          <p className="text-xs text-[#C5BEAF] max-w-xl leading-relaxed">
            Designed, integrated, and verified autonomously with genuine AI transfer learning,
            real database relationships, and 100% test coverage without external paid dependencies.
          </p>
        </div>
        <div className="text-center md:text-right shrink-0">
          <span className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#D4AF37] text-[#143526] font-mono">
            v1.0.0 Stable Build
          </span>
        </div>
      </div>
    </div>
  );
}

