import React, { useState, useEffect } from 'react';
import AdBanner from './components/AdBanner';
import AdWallModal from './components/AdWallModal';
import { Play, Trophy } from 'lucide-react';

export default function App() {
  const [adsWatched, setAdsWatched] = useState(0);
  const [isAdWallOpen, setIsAdWallOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('adsWatched');
    if (saved) setAdsWatched(parseInt(saved, 10));
  }, []);

  const handleAdComplete = () => {
    const newCount = adsWatched + 1;
    setAdsWatched(newCount);
    localStorage.setItem('adsWatched', newCount.toString());
    setIsAdWallOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="font-bold text-slate-800 text-lg">OfícioGen Ads</h1>
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700 text-sm font-medium">
            <Trophy size={16} />
            <span>{adsWatched} Assistidos</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col gap-6">
        {/* Main Action */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
            <Play size={32} className="ml-1" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Assistir Anúncios</h2>
            <p className="text-slate-500 text-sm mt-1">
              Apoie o projeto assistindo a uma sequência de publicidade.
            </p>
          </div>
          <button
            onClick={() => setIsAdWallOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            Iniciar Sequência
          </button>
        </div>

        {/* Static Ad Units */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
            Parceiros
          </p>
          <AdBanner slotId="STATIC_SLOT_1" className="min-h-[250px] bg-white border-slate-200 shadow-sm" />
          <AdBanner slotId="STATIC_SLOT_2" className="min-h-[250px] bg-white border-slate-200 shadow-sm" />
        </div>
      </main>

      <AdWallModal
        isOpen={isAdWallOpen}
        onClose={() => setIsAdWallOpen(false)}
        onComplete={handleAdComplete}
      />
    </div>
  );
}

