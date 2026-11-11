import React from 'react';
import { Sparkles, Heart, ShieldCheck, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#143526] text-[#E5E0D5] border-t border-[#2D6A4F] mt-16 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Theme */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#143526] font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-serif">
                CraftSphere <span className="text-[#D4AF37]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#C5BEAF] leading-relaxed">
              Intelligent Cultural Heritage Preservation and Artisan Development Platform.
              Connecting indigenous wisdom with transparent computer vision.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#D4AF37]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Goa AI Hackathon 2026 – Artisan Development</span>
            </div>
          </div>

          {/* Supported Craft Families */}
          <div>
            <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-3">
              Goan Craft Families
            </h4>
            <ul className="text-xs space-y-1.5 text-[#C5BEAF]">
              <li>• Bicholim Terracotta & Red Clay Pottery</li>
              <li>• Valpoi & Sattari Bamboo / Cane Weave</li>
              <li>• Traditional Kunbi Handloom Sarees</li>
              <li>• Sacred Cuncolim Architectural Wood Carving</li>
            </ul>
          </div>

          {/* AI Architecture & Ethics */}
          <div>
            <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-3">
              Ethical AI Principles
            </h4>
            <ul className="text-xs space-y-1.5 text-[#C5BEAF]">
              <li>• Transparent MobileNetV2 Vision Architecture</li>
              <li>• Separate Optical CV from Expert Judgments</li>
              <li>• Cosine Pattern Metric without Cultural Bias</li>
              <li>• Local Deterministic TF-IDF Knowledge Retrieval</li>
            </ul>
          </div>

          {/* Verification & Attribution */}
          <div>
            <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-3">
              Governance & Integrity
            </h4>
            <p className="text-xs text-[#C5BEAF] leading-relaxed">
              Records are maintained with verified provenance. Sample demonstration entries are
              clearly identified. Unverified crafts are labeled explicitly.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#A3E635]">
              <ShieldCheck className="w-4 h-4" />
              <span>Preservation License: CC-BY-NC-SA 4.0</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E4D38] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A89F8D]">
          <p>© 2026 CraftSphere AI. Built for the Goa AI Hackathon 2026.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> for traditional Goan artisans.
          </p>
        </div>
      </div>
    </footer>
  );
}

