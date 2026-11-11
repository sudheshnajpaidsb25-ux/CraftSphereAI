import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Database,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Activity,
  ArrowRight,
  Sparkles,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CATEGORY_COLORS = {
  Pottery: '#C86D51',           // Warm terracotta
  'Bamboo and Cane': '#D4AF37', // Muted gold
  Handloom: '#2D6A4F',          // Forest green
  'Wood Carving': '#634832'      // Dark teak
};

export default function DashboardPage({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const metrics = await api.getDashboard();
      setData(metrics);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard metrics from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="w-8 h-8 text-[#143526] animate-spin" />
        <p className="text-sm font-medium text-[#52605B]">Connecting to database & calculating statistics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-red-800 space-y-3">
        <p className="font-semibold text-sm">{error || 'Unable to display dashboard.'}</p>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Format category distribution for charts
  const pieData = Object.entries(data.craft_category_distribution || {}).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#8C6D23'
  }));

  const statCards = [
    {
      title: 'Heritage Craft Records',
      value: data.total_crafts,
      subvalue: `${data.total_verified_crafts} Verified Goan Artifacts`,
      icon: Database,
      page: 'archive',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Registered Artisans',
      value: data.total_artisans,
      subvalue: 'Across Bicholim, Cuncolim, Sattari & Canacona',
      icon: Users,
      page: 'assessment',
      color: 'text-amber-700',
      bg: 'bg-amber-50'
    },
    {
      title: 'Completed Assessments',
      value: data.total_assessments,
      subvalue: `Avg. Rubric Score: ${data.average_assessment_score} / 10.0`,
      icon: Award,
      page: 'gaps',
      color: 'text-blue-700',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Recommendations',
      value: data.total_recommendations,
      subvalue: 'Personalized Adaptive Skill Modules',
      icon: BookOpen,
      page: 'recommendations',
      color: 'text-purple-700',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
              Platform Intelligence Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-xs text-[#52605B] mt-1">
            Real-time telemetry and cultural knowledge statistics computed directly from SQLite.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE5D9] text-xs font-semibold text-[#143526] hover:bg-[#FAF7F2] shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => setActivePage(card.page)}
              className="heritage-card p-5 flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#52605B]">{card.title}</p>
                  <p className="text-3xl font-bold font-serif text-[#143526] mt-2 group-hover:text-[#2D6A4F] transition-colors">
                    {card.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#8A7E68]">
                <span>{card.subvalue}</span>
                <ArrowRight className="w-3 h-3 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Distribution Chart */}
        <div className="lg:col-span-7 heritage-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif font-bold text-base text-[#143526]">
                Goan Craft Category Distribution
              </h2>
              <p className="text-xs text-[#52605B]">
                Archived records classified by traditional material family.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#8C6D23] px-2 py-0.5 rounded bg-[#F7F1E1]">
              {data.total_crafts} Total Entries
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#52605B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#52605B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#143526',
                    borderColor: '#D4AF37',
                    borderRadius: '8px',
                    color: '#FAF7F2',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#F0ECE1] text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#52605B] truncate">{item.name}:</span>
                <span className="font-bold text-[#143526]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Proportions Donut Chart */}
        <div className="lg:col-span-5 heritage-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-serif font-bold text-base text-[#143526]">
              Archive Ratio Breakdown
            </h2>
            <p className="text-xs text-[#52605B]">Proportionate share of digitized traditional crafts.</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#143526',
                    borderColor: '#D4AF37',
                    borderRadius: '8px',
                    color: '#FAF7F2',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#52605B]">
            <span>Verified Authenticity Rate:</span>
            <span className="font-bold text-emerald-700">
              {data.total_crafts > 0 ? Math.round((data.total_verified_crafts / data.total_crafts) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activities & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity Log */}
        <div className="lg:col-span-8 heritage-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C5A059]" />
              <h2 className="font-serif font-bold text-base text-[#143526]">Recent Activity Feed</h2>
            </div>
            <span className="text-[11px] text-[#52605B]">Real-time system audit logs</span>
          </div>

          <div className="space-y-3">
            {(data.recent_activities || []).length === 0 ? (
              <p className="text-xs text-[#52605B] py-6 text-center">No recent activities logged yet.</p>
            ) : (
              data.recent_activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#143526] text-[#FAF7F2]">
                        {act.type}
                      </span>
                      <h4 className="text-xs font-bold text-[#143526]">{act.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#52605B]">{act.description}</p>
                  </div>
                  <span className="text-[10px] text-[#8C6D23] font-medium shrink-0">{act.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Launchpad Actions */}
        <div className="lg:col-span-4 heritage-card p-6 space-y-4">
          <h2 className="font-serif font-bold text-base text-[#143526]">Quick Actions</h2>

          <div className="space-y-2.5">
            <button
              onClick={() => setActivePage('recognition')}
              className="w-full p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#EAE5D9] flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-[#143526]">Run Craft Recognition</p>
                <p className="text-[11px] text-[#52605B]">Upload photo to test MobileNetV2</p>
              </div>
              <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('assessment')}
              className="w-full p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#EAE5D9] flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-[#143526]">New Artisan Assessment</p>
                <p className="text-[11px] text-[#52605B]">Evaluate 5-rubric craft criteria</p>
              </div>
              <Award className="w-4 h-4 text-[#1E4D38] group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('archive')}
              className="w-full p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#EAE5D9] flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-[#143526]">Add Heritage Craft</p>
                <p className="text-[11px] text-[#52605B]">Record traditional Goan artifact</p>
              </div>
              <Database className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('knowledge')}
              className="w-full p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#EAE5D9] flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-[#143526]">Consult Knowledge Assistant</p>
                <p className="text-[11px] text-[#52605B]">Query verified craft traditions</p>
              </div>
              <BookOpen className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

