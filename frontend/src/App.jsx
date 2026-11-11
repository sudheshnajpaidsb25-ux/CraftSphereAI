import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import RecognitionPage from './pages/RecognitionPage';
import PatternIntelligencePage from './pages/PatternIntelligencePage';
import HeritageArchivePage from './pages/HeritageArchivePage';
import ArtisanAssessmentPage from './pages/ArtisanAssessmentPage';
import SkillGapPage from './pages/SkillGapPage';
import TrainingRecommendationsPage from './pages/TrainingRecommendationsPage';
import KnowledgeAssistantPage from './pages/KnowledgeAssistantPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'recognition':
        return <RecognitionPage />;
      case 'patterns':
        return <PatternIntelligencePage />;
      case 'archive':
        return <HeritageArchivePage />;
      case 'assessment':
        return <ArtisanAssessmentPage setActivePage={setActivePage} />;
      case 'gaps':
        return <SkillGapPage setActivePage={setActivePage} />;
      case 'recommendations':
        return <TrainingRecommendationsPage />;
      case 'knowledge':
        return <KnowledgeAssistantPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C2826]">
      {/* Top Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {renderPage()}
      </main>

      {/* Global Heritage Footer */}
      <Footer />
    </div>
  );
}
