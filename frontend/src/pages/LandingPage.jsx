import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  BookOpen,
  ArrowRight,
  Database,
  CheckCircle2,
  Compass,
  Cpu
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  const pillars = [
    {
      id: 'recognition',
      title: 'AI Craft Recognition',
      subtitle: 'MobileNetV2 Vision Architecture',
      desc: 'Instant visual classification across traditional Goan pottery, cane/bamboo, handloom, and sacred woodcarving with confidence metrics.',
      icon: Sparkles,
      color: 'from-amber-600 to-amber-700',
      badge: 'Module 1'
    },
    {
      id: 'patterns',
      title: 'Pattern Intelligence',
      subtitle: 'Vector Cosine Similarity',
      desc: 'Retrieves visually resonant ancestral motifs and geometry from the heritage archive with multi-scale visual embedding.',
      icon: Layers,
      color: 'from-emerald-700 to-teal-800',
      badge: 'Module 2'
    },
    {
      id: 'assessment',
      title: 'Artisan Skill Assessment',
      subtitle: 'Optical CV + Expert Rubric',
      desc: 'Objective symmetry and surface texture measurements paired with structured master craftsman rubric evaluations.',
      icon: Award,
      color: 'from-rose-700 to-amber-800',
      badge: 'Module 4 & 5'
    },
    {
      id: 'recommendations',
      title: 'Personalized Training',
      subtitle: 'Content-Based Adaptive Paths',
      desc: 'Deterministic learning modules mapped directly to identified individual skill gaps with step-by-step practical master guild exercises.',
      icon: BookOpen,
      color: 'from-green-800 to-emerald-900',
      badge: 'Module 6'
    }
  ];

  const traditions = [
    {
      name: 'Bicholim Terracotta',
      region: 'North Goa (Bordem & Marcela)',
      material: 'Alluvial red clay & iron oxide slip',
      technique: 'Kick-wheel throwing & low-fire pit kilns',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Kunbi Tribal Handloom',
      region: 'South Goa (Canacona & Ponda)',
      material: 'Unbleached coarse cotton & madder root dye',
      technique: 'Pit-loom weaving with signature checkered lattice',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Goan Bamboo & Cane (Sup)',
      region: 'Sattari & Valpoi Foothills',
      material: 'Wild Bambusa & local mountain cane (bett)',
      technique: 'Herringbone twill weave & double-bound rims',
      image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Cuncolim Sacred Woodcarving',
      region: 'South Goa (Cuncolim & Bardez)',
      material: 'Goan seasoned teak & jackfruit wood',
      technique: 'Deep relief chisel gouging & beeswax polishing',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl heritage-header-gradient text-white p-8 md:p-16 shadow-2xl border border-[#2D6A4F]">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Goa AI Hackathon 2026 – Artisan Development Theme
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight text-[#FAF7F2]">
            Where Ancestral Goan Wisdom Meets{' '}
            <span className="text-[#D4AF37] italic">Transparent Artificial Intelligence</span>.
          </h1>

          <p className="text-base md:text-lg text-[#E5E0D5] leading-relaxed">
            CraftSphere AI is an integrated platform connecting digital cultural preservation,
            deep learning craft categorization, objective computer-vision skill assessment, and
            personalized training paths for traditional Goan artisans.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActivePage('dashboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#C5A059] text-[#143526] font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Live Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('recognition')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Test AI Recognition</span>
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 text-xs text-[#E5E0D5]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Zero external paid APIs required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Fine-tuned MobileNetV2 architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Verified cultural provenance</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-12 opacity-15 hidden md:block">
          <Cpu className="w-64 h-64 text-[#D4AF37]" />
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#143526]">
            Four Integrated Capabilities
          </h2>
          <p className="text-sm text-[#52605B]">
            Engineered to empower artisans while preserving irreplaceable cultural knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => setActivePage(p.id)}
                className="heritage-card p-6 flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#F7F1E1] text-[#8C6D23] border border-[#E6D8B6]">
                      {p.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#143526] text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#143526] group-hover:text-[#2D6A4F] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs font-medium text-[#C5A059] mt-0.5">{p.subtitle}</p>
                  </div>
                  <p className="text-xs text-[#52605B] leading-relaxed">{p.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EAE5D9] flex items-center justify-between text-xs font-semibold text-[#143526] group-hover:text-[#D4AF37] transition-colors">
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Goan Cultural Traditions Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#143526]">
              Verified Goan Craft Traditions
            </h2>
            <p className="text-sm text-[#52605B]">
              Authentic artisanal lineages documented in the digital heritage archive.
            </p>
          </div>
          <button
            onClick={() => setActivePage('archive')}
            className="text-xs font-bold text-[#1E4D38] hover:text-[#D4AF37] flex items-center gap-1.5"
          >
            <span>View Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {traditions.map((t, idx) => (
            <div
              key={idx}
              onClick={() => setActivePage('archive')}
              className="heritage-card overflow-hidden group cursor-pointer"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[11px] text-[#FAF7F2] font-medium">
                  {t.region}
                </div>
              </div>
              <div className="p-5 space-y-2.5">
                <h3 className="font-serif font-bold text-base text-[#143526]">{t.name}</h3>
                <div className="text-[11px] space-y-1 text-[#52605B]">
                  <p>
                    <span className="font-semibold text-[#143526]">Materials:</span> {t.material}
                  </p>
                  <p>
                    <span className="font-semibold text-[#143526]">Technique:</span> {t.technique}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Launch Callout */}
      <section className="rounded-2xl bg-gradient-to-r from-[#FAF7F2] to-[#F4EFE6] border border-[#E6D8B6] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Ethical Artificial Intelligence for Craft Preservation</span>
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-[#143526]">
            Ready to test artisan skill assessment & skill gaps?
          </h3>
          <p className="text-xs text-[#52605B] leading-relaxed">
            Register a demonstration artisan, evaluate craftsmanship through calibrated rubric
            criteria, view dynamic radar gap visualizations, and generate non-random training paths.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('assessment')}
            className="px-5 py-3 rounded-xl bg-[#143526] hover:bg-[#1E4D38] text-[#FAF7F2] font-semibold text-xs transition-colors cursor-pointer"
          >
            Artisan Assessment
          </button>
          <button
            onClick={() => setActivePage('knowledge')}
            className="px-5 py-3 rounded-xl bg-[#FAF7F2] hover:bg-white text-[#143526] border border-[#C5A059] font-semibold text-xs transition-colors cursor-pointer"
          >
            Ask Knowledge Assistant
          </button>
        </div>
      </section>
    </div>
  );
}

