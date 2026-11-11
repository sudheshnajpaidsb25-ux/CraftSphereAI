import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Database,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
  X,
  ExternalLink,
  MapPin,
  RefreshCw,
  Tag
} from 'lucide-react';

const CATEGORIES = ['All', 'Pottery', 'Bamboo and Cane', 'Handloom', 'Wood Carving'];

export default function HeritageArchivePage() {
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [verifiedFilter, setVerifiedFilter] = useState('all'); // 'all', 'verified', 'unverified'

  // Modals state
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCraft, setEditingCraft] = useState(null);

  // New craft form
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pottery',
    material: '',
    traditional_technique: '',
    region_of_origin: 'Goa',
    cultural_description: '',
    image_url: '',
    source_reference: 'Directorate of Art & Culture, Government of Goa',
    license_info: 'Creative Commons CC-BY-NC-SA 4.0',
    is_verified: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchCrafts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();
      if (verifiedFilter === 'verified') params.verified_only = true;
      if (verifiedFilter === 'unverified') params.verified_only = false;

      const data = await api.getCrafts(params);
      setCrafts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrafts();
  }, [selectedCategory, verifiedFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCrafts();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.material || !formData.traditional_technique || !formData.cultural_description) {
      setFormError('Please fill in all mandatory craft record fields.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      if (editingCraft) {
        await api.updateCraft(editingCraft.id, formData);
      } else {
        await api.createCraft(formData);
      }
      setShowAddModal(false);
      setEditingCraft(null);
      resetForm();
      fetchCrafts();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this craft record?')) return;
    try {
      await api.deleteCraft(id);
      fetchCrafts();
      if (selectedCraft?.id === id) setSelectedCraft(null);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openEdit = (craft) => {
    setEditingCraft(craft);
    setFormData({
      name: craft.name,
      category: craft.category,
      material: craft.material,
      traditional_technique: craft.traditional_technique,
      region_of_origin: craft.region_of_origin,
      cultural_description: craft.cultural_description,
      image_url: craft.image_url || '',
      source_reference: craft.source_reference || '',
      license_info: craft.license_info || 'Creative Commons CC-BY-NC-SA 4.0',
      is_verified: craft.is_verified
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Pottery',
      material: '',
      traditional_technique: '',
      region_of_origin: 'Goa',
      cultural_description: '',
      image_url: '',
      source_reference: 'Directorate of Art & Culture, Government of Goa',
      license_info: 'Creative Commons CC-BY-NC-SA 4.0',
      is_verified: true
    });
    setEditingCraft(null);
    setFormError(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F1E1] text-[#8C6D23] text-xs font-semibold mb-2 border border-[#E6D8B6]">
            <Database className="w-3.5 h-3.5" />
            <span>Module 3: Cultural Knowledge Registry</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#143526]">
            Digital Heritage Archive
          </h1>
          <p className="text-xs md:text-sm text-[#52605B] mt-1">
            Search, filter, and document authentic Goan traditional crafts with verified provenance.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#143526] hover:bg-[#1E4D38] text-[#FAF7F2] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add Craft Record</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="heritage-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#C5BEAF] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by craft, material, region, technique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE5D9] text-xs text-[#143526] focus:outline-none focus:border-[#D4AF37]"
            />
          </form>

          {/* Verification Status Filter */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE5D9] text-xs">
            <span className="text-[11px] font-semibold text-[#52605B] px-2">Status:</span>
            <button
              onClick={() => setVerifiedFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                verifiedFilter === 'all' ? 'bg-[#143526] text-white' : 'text-[#52605B] hover:text-[#143526]'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setVerifiedFilter('verified')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                verifiedFilter === 'verified' ? 'bg-emerald-700 text-white' : 'text-[#52605B] hover:text-emerald-800'
              }`}
            >
              Verified Only
            </button>
            <button
              onClick={() => setVerifiedFilter('unverified')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                verifiedFilter === 'unverified' ? 'bg-amber-600 text-white' : 'text-[#52605B] hover:text-amber-800'
              }`}
            >
              Unverified / Review
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F0ECE1]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-[#143526] font-bold shadow-sm'
                  : 'bg-[#FAF7F2] text-[#52605B] hover:bg-[#F4EFE6] border border-[#EAE5D9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Craft Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#143526] animate-spin" />
          <p className="text-xs text-[#52605B]">Loading heritage craft records...</p>
        </div>
      ) : crafts.length === 0 ? (
        <div className="heritage-card p-12 text-center space-y-3">
          <Database className="w-10 h-10 text-[#C5BEAF] mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#143526]">No Craft Records Found</h3>
          <p className="text-xs text-[#52605B]">Try resetting your search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crafts.map((craft) => (
            <div key={craft.id} className="heritage-card overflow-hidden flex flex-col justify-between group">
              <div>
                {/* Image and Badges */}
                <div className="h-48 overflow-hidden relative bg-black/10">
                  <img
                    src={craft.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'}
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-white font-medium">
                      {craft.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {craft.is_verified ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-sm">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-600/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-sm">
                        <AlertCircle className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-[#143526] group-hover:text-[#2D6A4F] transition-colors">
                      {craft.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8C6D23]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{craft.region_of_origin}</span>
                  </div>

                  <p className="text-xs text-[#52605B] line-clamp-2 leading-relaxed">
                    {craft.cultural_description}
                  </p>

                  <div className="text-[11px] space-y-1 text-[#8A7E68] pt-2 border-t border-[#F0ECE1]">
                    <p>
                      <span className="font-semibold text-[#143526]">Material:</span> {craft.material}
                    </p>
                    <p>
                      <span className="font-semibold text-[#143526]">Technique:</span>{' '}
                      <span className="line-clamp-1">{craft.traditional_technique}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 border-t border-[#F0ECE1] bg-[#FAF7F2] flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedCraft(craft)}
                  className="font-bold text-[#143526] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Details</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(craft)}
                    className="p-1 text-[#52605B] hover:text-[#143526] transition-colors cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(craft.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Detail Modal */}
      {selectedCraft && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-5 border border-[#D4AF37]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#F7F1E1] text-[#8C6D23] uppercase">
                    {selectedCraft.category}
                  </span>
                  {selectedCraft.is_verified ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Goan Heritage
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Unverified Community Submission
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#143526] mt-2">
                  {selectedCraft.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCraft(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-[#52605B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedCraft.image_url && (
              <div className="h-64 rounded-2xl overflow-hidden bg-black/5">
                <img
                  src={selectedCraft.image_url}
                  alt={selectedCraft.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3 text-xs leading-relaxed text-[#52605B]">
              <div>
                <h4 className="font-bold text-[#143526] text-sm">Cultural & Historical Significance</h4>
                <p className="mt-1">{selectedCraft.cultural_description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F0ECE1]">
                <div>
                  <span className="font-bold text-[#143526]">Region of Origin:</span>
                  <p>{selectedCraft.region_of_origin}</p>
                </div>
                <div>
                  <span className="font-bold text-[#143526]">Primary Materials:</span>
                  <p>{selectedCraft.material}</p>
                </div>
                <div>
                  <span className="font-bold text-[#143526]">Traditional Technique:</span>
                  <p>{selectedCraft.traditional_technique}</p>
                </div>
                <div>
                  <span className="font-bold text-[#143526]">Source Reference:</span>
                  <p>{selectedCraft.source_reference || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#8C6D23]">
                <span>License: {selectedCraft.license_info}</span>
                <span>ID: #{selectedCraft.id}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Craft Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-[#143526]">
                {editingCraft ? 'Edit Heritage Craft Record' : 'Add New Heritage Craft'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-[#52605B]" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#143526] mb-1">Craft Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bicholim Red Clay Kundlem Vessel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#143526] mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] bg-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Pottery">Pottery</option>
                    <option value="Bamboo and Cane">Bamboo and Cane</option>
                    <option value="Handloom">Handloom</option>
                    <option value="Wood Carving">Wood Carving</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#143526] mb-1">Region of Origin *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bicholim, North Goa"
                    value={formData.region_of_origin}
                    onChange={(e) => setFormData({ ...formData, region_of_origin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Raw Materials *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bicholim alluvial red clay, river sand"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Traditional Technique *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kick-wheel throwing and slow pit firing"
                  value={formData.traditional_technique}
                  onChange={(e) => setFormData({ ...formData, traditional_technique: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Cultural Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the cultural lineage, historical use, and communal significance..."
                  value={formData.cultural_description}
                  onChange={(e) => setFormData({ ...formData, cultural_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#143526] mb-1">Source Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Directorate of Art & Culture, Government of Goa"
                  value={formData.source_reference}
                  onChange={(e) => setFormData({ ...formData, source_reference: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5D9] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={formData.is_verified}
                  onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                  className="w-4 h-4 text-[#143526] rounded border-gray-300"
                />
                <label htmlFor="is_verified" className="font-semibold text-[#143526] cursor-pointer">
                  Mark as Verified Goan Heritage (Official Field Documentation)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#F0ECE1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#143526] hover:bg-[#1E4D38] text-white font-bold cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingCraft ? 'Update Record' : 'Add to Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

