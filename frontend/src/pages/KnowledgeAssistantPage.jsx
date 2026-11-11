import React, { useState } from 'react';
import { api } from '../services/api';
import {
  MessageSquare,
  Search,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Send,
  RefreshCw,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'What materials are traditionally used in Bicholim pottery?',
  'Explain the cultural importance of the Goan Kunbi handloom saree.',
  'How is the traditional Goan Sup winnowing fan crafted in Sattari?',
  'What wood and carving techniques are used in Cuncolim altar retables?',
  'How is natural madder root used to dye Goan cotton yarn?'
];

export default function KnowledgeAssistantPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (queryString) => {
    const q = queryString || query;
    if (!q.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.queryKnowledge(q, 3);
      setResponse(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Retrieval failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold mb-2 border border-[#E6D8B6]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Module 7: Deterministic Local Knowledge Retrieval</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
          Heritage Knowledge Assistant
        </h1>
        <p className="text-xs md:text-sm text-[#52605B] mt-1">
          Query the verified Goan craft registry and traditional artisan guild curriculum using
          factual TF-IDF vector retrieval.
        </p>
      </div>

      {/* Query Bar */}
      <div className="heritage-card p-6 space-y-4">
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask a question about Goan craft techniques, red clay, bamboo weaves, or Cuncolim woodcarving..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE5D9] text-xs md:text-sm text-[#143526] focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 p-2 rounded-xl bg-[#143526] hover:bg-[#1E4D38] disabled:opacity-50 text-white cursor-pointer transition-colors"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-[#D4AF37]" />}
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-[#8A7E68]">Suggested Queries:</span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(p);
                    handleSearch(p);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#EAE5D9] text-[11px] text-[#52605B] text-left transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </form>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>

      {/* Answer & Sources Panel */}
      {response && (
        <div className="heritage-card p-6 md:p-8 space-y-6 border-[#D4AF37]">
          {/* Answer Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {response.retrieval_method}
              </span>
              <span className="text-xs text-[#8A7E68]">Verified Factual Response</span>
            </div>

            <h3 className="font-serif font-bold text-lg text-[#143526]">
              Query: "{response.query}"
            </h3>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE5D9] text-xs leading-relaxed text-[#143526] whitespace-pre-line space-y-2 font-sans">
              {response.answer}
            </div>
          </div>

          {/* Verified Sources Cited */}
          {response.sources.length > 0 && (
            <div className="pt-4 border-t border-[#F0ECE1] space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#143526] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>Verified Archive Sources Indexed</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {response.sources.map((src, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-[#EAE5D9] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#143526] truncate">{src.title}</span>
                      <span className="text-[10px] font-mono font-bold text-[#8C6D23] bg-[#F7F1E1] px-1.5 py-0.5 rounded">
                        Score: {src.relevance_score}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#52605B] space-y-0.5">
                      <p>
                        <strong>Category:</strong> {src.category} ({src.region})
                      </p>
                      <p className="line-clamp-2 text-[#8A7E68]">"{src.excerpt}"</p>
                      <p className="text-[10px] text-emerald-700 pt-1">
                        <strong>Source:</strong> {src.source_reference}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparency Disclaimer */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#8C6D23] bg-[#F7F1E1] p-3 rounded-xl border border-[#E6D8B6]">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
            <span>
              CraftSphere AI uses transparent, deterministic TF-IDF term matching over stored
              verified records. It does not fabricate facts or hallucinate cultural origins.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

