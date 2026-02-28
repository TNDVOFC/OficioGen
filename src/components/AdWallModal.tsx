import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import AdBanner from './AdBanner';

interface AdWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function AdWallModal({ isOpen, onClose, onComplete }: AdWallModalProps) {
  const [step, setStep] = useState(1); // 1, 2, 3
  const [canProceed, setCanProceed] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCanProceed(false);
      setCountdown(5);
    }
  }, [isOpen]);

  // Countdown timer for each step (forcing view time)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanProceed(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, countdown, step]);

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1);
      setCanProceed(false);
      setCountdown(5); // Reset timer for next ad
    } else {
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="font-bold text-slate-800">Anúncio {step} de 3</h2>
                <p className="text-xs text-slate-500">Assista para liberar sua geração</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Ad Container */}
            <div className="p-4 md:p-6 bg-slate-100 flex-1 flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px] overflow-y-auto">
              <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 shrink-0">
                {/* 
                   Aqui carregamos um banner diferente para cada passo.
                   Em produção, você usaria slotIds diferentes para cada um.
                */}
                {step === 1 && <AdBanner slotId="SLOT_ID_1" className="min-h-[200px] md:min-h-[250px]" />}
                {step === 2 && <AdBanner slotId="SLOT_ID_2" className="min-h-[200px] md:min-h-[250px]" />}
                {step === 3 && <AdBanner slotId="SLOT_ID_3" className="min-h-[200px] md:min-h-[250px]" />}
              </div>
              
              <p className="mt-4 text-xs text-slate-400 text-center">
                Publicidade ajuda a manter o OfícioGen grátis.
              </p>
            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  canProceed 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 active:scale-[0.98]' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!canProceed ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Aguarde {countdown}s...
                  </>
                ) : step < 3 ? (
                  <>
                    Próximo Anúncio <ArrowRight size={18} />
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Gerar Ofício Agora
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
