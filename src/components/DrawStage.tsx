import React, { useState, useEffect, useRef } from 'react';
import { Participant, Winner } from '../types';
import {
  Trophy,
  Play,
  RotateCw,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { triggerGrandCelebration } from '../utils/confetti';

interface DrawStageProps {
  participants: Participant[];
  onDrawWinners: (winners: Winner[], removeAfterDraw: boolean) => void;
  soundEnabled: boolean;
  removeWinnerFromPool?: boolean;
}

export const DrawStage: React.FC<DrawStageProps> = ({
  participants,
  onDrawWinners,
  soundEnabled,
  removeWinnerFromPool = true,
}) => {
  // Available pool of participants
  const availablePool = participants.filter((p) => !p.isDrawn);
  const drawnCount = participants.filter((p) => p.isDrawn).length;

  // Rolling state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [displayNumber, setDisplayNumber] = useState<string>('------');
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [lastWinner, setLastWinner] = useState<Winner | null>(null);

  const animationFrameRef = useRef<number | null>(null);

  // Update initial display number when pool changes and not drawing
  useEffect(() => {
    if (!isDrawing && availablePool.length > 0) {
      if (displayNumber === '------' || !availablePool.some((p) => p.number === displayNumber)) {
        setDisplayNumber(availablePool[0].number);
        setDisplayName(availablePool[0].name || null);
      }
    } else if (availablePool.length === 0 && !isDrawing) {
      setDisplayNumber('------');
      setDisplayName(null);
    }
  }, [availablePool, isDrawing, displayNumber]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /**
   * Start the random raffle draw with realistic suspense rolling animation
   */
  const handleStartDraw = () => {
    if (availablePool.length === 0 || isDrawing) return;

    setIsDrawing(true);
    soundFx.playClick();

    const duration = 3800; // Balanced exciting suspense duration
    const startTime = performance.now();

    // Play suspense tension riser tone
    if (soundEnabled) {
      soundFx.playRiser(duration / 1000);
    }

    // Determine actual winner upfront randomly from available pool
    const randomIndex = Math.floor(Math.random() * availablePool.length);
    const chosen = availablePool[randomIndex];

    const finalWinner: Winner = {
      id: `win-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      drawOrder: drawnCount + 1,
      number: chosen.number,
      name: chosen.name,
      prize: 'الفائز بالجائزة',
      timestamp: Date.now(),
    };

    let lastTickTime = 0;

    const animateRoll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Deceleration easing function (cubic out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentTickInterval = 40 + easeOut * 280;

      if (currentTime - lastTickTime >= currentTickInterval) {
        lastTickTime = currentTime;

        // In the final portion of the duration, lock on the winner
        if (progress > 0.92) {
          setDisplayNumber(finalWinner.number);
          setDisplayName(finalWinner.name || null);
        } else {
          // Pick a random participant from pool
          const randIdx = Math.floor(Math.random() * availablePool.length);
          const candidate = availablePool[randIdx];
          setDisplayNumber(candidate.number);
          setDisplayName(candidate.name || null);
        }

        if (soundEnabled) {
          soundFx.playTick(450 + Math.random() * 250);
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateRoll);
      } else {
        // DRAW FINISHED!
        setDisplayNumber(finalWinner.number);
        setDisplayName(finalWinner.name || null);
        setLastWinner(finalWinner);
        setIsDrawing(false);

        // Sound fanfare & Confetti Blast!
        if (soundEnabled) {
          soundFx.playFanfare();
        }
        triggerGrandCelebration();

        // Notify parent with final winners
        setTimeout(() => {
          onDrawWinners([finalWinner], removeWinnerFromPool);
        }, 300);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateRoll);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#0C1736] via-[#091228] to-[#050A17] border-2 border-[#E5A93C]/40 p-6 sm:p-12 shadow-[0_0_60px_rgba(229,169,60,0.2)] flex flex-col justify-between min-h-[580px]">
      {/* Background ambient circular halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#E5A93C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FF6600]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* 1. TOP OF STAGE: "نبني المستقبل بذكاء" وتحتها "الكلية الذكية الجامعية للتعليم الحديث" */}
      <div className="relative z-10 w-full text-center pt-2 pb-6">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Tajawal',sans-serif] tracking-tight">
          <span className="gold-gradient-text drop-shadow-[0_4px_25px_rgba(245,190,56,0.5)]">
            نبني المستقبل بذكاء
          </span>
        </h2>
        <p className="mt-2 sm:mt-3 text-base sm:text-xl lg:text-2xl font-bold text-slate-200 tracking-wide font-['Tajawal',sans-serif] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          الكلية الذكية الجامعية للتعليم الحديث
        </p>
      </div>

      {/* 2. THE MAIN STAGE CENTER: الفائز بالجائزة + أرقام السحب + زر البدء الكبير */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center w-full">
        
        {/* Banner: الفائز بالجائزة */}
        <div className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#0E1C42] via-[#14285D] to-[#0E1C42] border-2 border-[#E5A93C]/60 text-[#FFE894] text-base sm:text-lg font-black shadow-[0_0_25px_rgba(229,169,60,0.25)] mb-6 sm:mb-8">
          <Trophy className="w-5 h-5 text-[#F5BE38]" />
          <span>الفائز بالجائزة</span>
          <Sparkles className="w-4 h-4 text-[#E5A93C]" />
        </div>

        {/* The Giant Golden Rolling Box */}
        <div className="relative w-full max-w-2xl px-2">
          {/* Outer Decorative Golden Frame */}
          <div
            className={`relative rounded-3xl p-1.5 transition-all duration-300 ${
              isDrawing
                ? 'bg-gradient-to-r from-[#FF7A00] via-[#FFE894] to-[#FF7A00] shadow-[0_0_60px_rgba(255,122,0,0.6)]'
                : 'bg-gradient-to-r from-[#BF8216] via-[#FFE894] via-[#E5A93C] to-[#BF8216] shadow-[0_0_45px_rgba(229,169,60,0.35)]'
            }`}
          >
            {/* Inner Dark Navy Capsule */}
            <div className="relative rounded-[22px] bg-[#050B17] py-10 sm:py-14 px-4 sm:px-8 overflow-hidden flex flex-col items-center justify-center min-h-[200px] sm:min-h-[250px]">
              
              {/* Subtle slot grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

              {/* Status text above digits */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
                {isDrawing ? (
                  <span className="flex items-center gap-2 text-[#FF9E3B] animate-pulse">
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>جاري تدوير أرقام السحب لاختيار الفائز بالجائزة...</span>
                  </span>
                ) : lastWinner ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>مبارك للفائز بالجائزة!</span>
                  </span>
                ) : (
                  <span className="text-[#FFE894]/80">
                    جاهز للسحب العشوائي الرسمي
                  </span>
                )}
              </div>

              {/* THE BIG DIGIT DISPLAY */}
              <div
                className={`font-mono font-black tracking-widest text-5xl sm:text-7xl md:text-8xl transition-transform duration-75 tabular-nums select-all ${
                  isDrawing
                    ? 'scale-105 filter blur-[0.5px] text-[#FFE894]'
                    : 'gold-gradient-text drop-shadow-[0_4px_35px_rgba(245,190,56,0.65)]'
                }`}
                dir="ltr"
              >
                {displayNumber}
              </div>

              {/* Participant Name under digits if exists */}
              <div className="h-8 mt-3 flex items-center justify-center">
                {displayName ? (
                  <div className="text-base sm:text-lg font-bold text-white bg-[#0A1636]/90 border border-[#E5A93C]/40 px-5 py-1 rounded-full truncate max-w-lg animate-fadeIn shadow-md">
                    {displayName}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">
                    {availablePool.length > 0
                      ? 'اضغط الزر أدناه لبدء السحب العشوائي'
                      : 'لا توجد أرقام متاحة في الصندوق حالياً'}
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* PRIMARY CALL TO ACTION: START DRAW BUTTON */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <button
            type="button"
            onClick={handleStartDraw}
            disabled={isDrawing || availablePool.length === 0}
            className={`group relative px-10 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-2xl transition-all duration-300 flex items-center gap-3.5 shadow-2xl ${
              isDrawing
                ? 'opacity-85 cursor-wait bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                : availablePool.length === 0
                ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400'
                : 'bg-gradient-to-r from-[#FFE894] via-[#F5BE38] via-[#E5A93C] to-[#D49013] text-[#060B18] hover:scale-[1.04] active:scale-[0.98] shadow-[0_0_50px_rgba(245,190,56,0.6)]'
            }`}
          >
            {isDrawing ? (
              <>
                <RotateCw className="w-7 h-7 animate-spin text-white" />
                <span>جاري السحب العشوائي...</span>
              </>
            ) : (
              <>
                <Play className="w-7 h-7 fill-current" />
                <span>بدء السحب العشوائي</span>
                <Sparkles className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              </>
            )}
          </button>

          {availablePool.length === 0 && (
            <p className="text-xs sm:text-sm text-amber-300 flex items-center gap-1.5 mt-3 bg-amber-950/40 border border-amber-500/30 px-4 py-1.5 rounded-full">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>الصندوق فارغ حالياً، يرجى الانتقال إلى تبويب إدارة الأرقام لإدخال الأرقام.</span>
            </p>
          )}
        </div>

      </div>

      {/* 3. BOTTOM OF STAGE: الكلية الذكية الجامعية للتعليم الحديث وتفاصيل السحب */}
      <div className="relative z-10 w-full mt-10 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white font-['Tajawal',sans-serif]">
            الكلية الذكية الجامعية للتعليم الحديث
          </h3>
          <p className="text-xs text-[#E5A93C] font-semibold mt-0.5">
            بالشراكة والتعاون التكنولوجي مع شركة جوال
          </p>
        </div>

        {/* تفاصيل السحب */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#060C1D] border border-[#E5A93C]/30 text-white shadow-inner">
            <span className="text-slate-400">تفاصيل السحب:</span>
            <strong className="text-[#FFE894] font-mono tabular-nums text-sm">
              {availablePool.length}
            </strong>
            <span className="text-slate-300">رقم مؤهل في الصندوق</span>
          </div>

          {drawnCount > 0 && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#060C1D] border border-slate-800 text-slate-300">
              <span className="text-slate-400">الفائزون السابقون:</span>
              <strong className="text-emerald-400 font-mono tabular-nums text-sm">
                {drawnCount}
              </strong>
            </div>
          )}

          <div className="px-3.5 py-1.5 rounded-xl bg-[#060C1D] border border-slate-800 text-slate-400 hidden sm:block">
            السحب إلكتروني عشوائي وموثق
          </div>
        </div>
      </div>
    </div>
  );
};
