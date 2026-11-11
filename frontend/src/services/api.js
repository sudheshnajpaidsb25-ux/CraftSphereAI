const API_BASE = '/api';

export const api = {
  // Health & Dashboard
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  // Crafts Heritage Archive
  getCrafts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.verified_only !== undefined && params.verified_only !== null) {
      query.append('verified_only', params.verified_only);
    }
    const res = await fetch(`${API_BASE}/crafts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch crafts');
    return res.json();
  },

  getCraftById: async (id) => {
    const res = await fetch(`${API_BASE}/crafts/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch craft ${id}`);
    return res.json();
  },

  createCraft: async (craftData) => {
    const res = await fetch(`${API_BASE}/crafts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(craftData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create craft record');
    }
    return res.json();
  },

  updateCraft: async (id, craftData) => {
    const res = await fetch(`${API_BASE}/crafts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(craftData),
    });
    if (!res.ok) throw new Error('Failed to update craft');
    return res.json();
  },

  deleteCraft: async (id) => {
    const res = await fetch(`${API_BASE}/crafts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete craft');
    return true;
  },

  uploadCraftImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/crafts/upload-image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to upload image');
    }
    return res.json();
  },

  // Module 1: AI Craft Recognition
  predictCraft: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/recognition/predict`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Craft recognition failed');
    }
    return res.json();
  },

  // Module 2: Pattern Intelligence
  searchPatterns: async (file, topK = 5) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/patterns/search?top_k=${topK}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Pattern search failed');
    }
    return res.json();
  },

  // Module 4: Artisans & Assessment
  getArtisans: async () => {
    const res = await fetch(`${API_BASE}/artisans`);
    if (!res.ok) throw new Error('Failed to fetch artisans');
    return res.json();
  },

  registerArtisan: async (artisanData) => {
    const res = await fetch(`${API_BASE}/artisans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artisanData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to register artisan');
    }
    return res.json();
  },

  getArtisanById: async (id) => {
    const res = await fetch(`${API_BASE}/artisans/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch artisan ${id}`);
    return res.json();
  },

  createAssessment: async (assessmentData) => {
    const res = await fetch(`${API_BASE}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessmentData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit assessment');
    }
    return res.json();
  },

  getArtisanAssessments: async (artisanId) => {
    const res = await fetch(`${API_BASE}/assessments/artisan/${artisanId}`);
    if (!res.ok) throw new Error('Failed to fetch artisan assessments');
    return res.json();
  },

  // Module 5: Skill Gap Analysis
  getSkillGaps: async (artisanId) => {
    const res = await fetch(`${API_BASE}/skill-gaps/${artisanId}`);
    if (!res.ok) throw new Error('Failed to fetch skill gap analysis');
    return res.json();
  },

  // Module 6: Personalised Training Recommendations
  getRecommendations: async (artisanId) => {
    const res = await fetch(`${API_BASE}/recommendations/${artisanId}`);
    if (!res.ok) throw new Error('Failed to fetch training recommendations');
    return res.json();
  },

  getCourses: async () => {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  // Module 7: Heritage Knowledge Assistant
  queryKnowledge: async (query, topK = 3) => {
    const res = await fetch(`${API_BASE}/knowledge/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Knowledge search query failed');
    }
    return res.json();
  },
};

