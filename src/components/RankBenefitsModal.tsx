'use client';

import { useEffect, useState } from 'react';
import { X, Crown, Zap, Clock, ChevronRight, Check } from 'lucide-react';
import { RANK_BENEFITS, RANK_XP_THRESHOLDS, ACCELERATION_THRESHOLD, SUBSCRIPTION_DAYS, canAccelerate } from '@/lib/roles';

interface RankBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentXP: number;
  currentRank: number;
}

export default function RankBenefitsModal({ isOpen, onClose, currentXP, currentRank }: RankBenefitsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const currentThresholds = (RANK_XP_THRESHOLDS as any)[currentRank];
  const rankProgress = currentThresholds 
    ? ((currentXP - currentThresholds.min) / (currentThresholds.max - currentThresholds.min)) * 100
    : 0;

  const canAccelerateNow = canAccelerate(currentXP);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-blue-500/20 to-purple-500/10">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold">Šta svaki rang otključava?</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
          {Object.entries(RANK_BENEFITS).map(([level, benefits]) => {
            const rankNum = parseInt(level);
            const thresholds = (RANK_XP_THRESHOLDS as any)[rankNum];
            const isCurrent = rankNum === currentRank;
            const isUnlocked = rankNum <= currentRank;
            
            return (
              <div 
                key={rankNum}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 border-blue-500/30' 
                    : isUnlocked 
                      ? 'bg-slate-700/50 border-slate-600 opacity-80'
                      : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${benefits.colorClass} flex items-center justify-center text-lg flex-shrink-0`}>
                    {benefits.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${isCurrent ? 'text-blue-400' : ''}`}>
                        {rankNum}. {benefits.name}
                      </p>
                      {isUnlocked && <Check className="w-4 h-4 text-green-400" />}
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          Trenutni
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {thresholds.min.toLocaleString()} – {thresholds.max.toLocaleString()} XP
                    </p>
                  </div>
                </div>
                
                {/* Benefits */}
                <div className="mt-2 ml-13 space-y-1">
                  {benefits.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                  {benefits.discount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-400 font-medium mt-2">
                      <Zap className="w-4 h-4" />
                      <span>{benefits.discount}% popust na sve</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          {/* Current Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-400">Trenutni napredak</span>
              <span className="text-yellow-400 font-medium">{Math.round(rankProgress)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${rankProgress}%` }}
              />
            </div>
          </div>

          {/* Subscription Info */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <Clock className="w-4 h-4" />
            <span>Rok: {SUBSCRIPTION_DAYS} dana</span>
          </div>

          {/* Acceleration Option */}
          {canAccelerateNow && currentRank < 7 && (
            <button className="w-full py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 font-medium hover:from-yellow-500/30 hover:to-orange-500/30 transition-all flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Želiš brži rang?
              <span className="text-xs text-slate-400">(Zatraži ubrzanje)</span>
            </button>
          )}
          
          {!canAccelerateNow && currentRank < 7 && (
            <div className="text-center text-sm text-slate-500">
              Do ubrzanja: {Math.round(ACCELERATION_THRESHOLD * 100)}% trenutnog ranga
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
