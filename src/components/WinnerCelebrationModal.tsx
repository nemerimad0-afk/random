import React, { useRef } from 'react';
import { Winner } from '../types';
import { Trophy, Award, Sparkles, X, Printer, ArrowRight } from 'lucide-react';
import { triggerGrandCelebration } from '../utils/confetti';
import { soundFx } from '../utils/audio';
import { CollegeLogo, JawwalLogo } from './Logos';

interface WinnerCelebrationModalProps {
  winners: Winner[];
  onClose: () => void;
  onDrawNext: () => void;
  collegeLogoSrc: string | null;
  jawwalLogoSrc: string | null;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  winners,
  onClose,
  onDrawNext,
  collegeLogoSrc,
  jawwalLogoSrc,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!winners || winners.length === 0) return null;

  const handlePrintCertificate = () => {
    soundFx.playClick();
    window.print();
  };

  const isMultiple = winners.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Golden celebratory glow aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#E5A93C]/20 via-[#BF8216]/15 to-transparent blur-3xl animate-pulse" />
      </div>

      <div
        ref={certificateRef}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#0F1D3C] via-[#0B1530] to-[#070D1E] border-2 border-[#E5A93C] rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(229,169,60,0.4)] text-center my-auto print:bg-white print:text-black print:border-black print:shadow-none"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors print:hidden"
          title="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {/* شعار الكلية والجوال جنب بعض وبنفس الحجم تماماً 80*80 */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 p-2 rounded-2xl bg-[#060C1D]/90 border border-[#E5A93C]/40 mx-auto w-fit mb-4 shadow-lg">
          <CollegeLogo customSrc={collegeLogoSrc} size="80" />
          <div className="h-16 w-[1.5px] bg-[#E5A93C]/50" />
          <JawwalLogo customSrc={jawwalLogoSrc} size="80" />
        </div>

        {/* Slogan */}
        <div className="mb-2">
          <h1 className="text-xl sm:text-2xl font-black font-['Tajawal',sans-serif]">
            <span className="gold-gradient-text drop-shadow-[0_2px_12px_rgba(245,190,56,0.4)]">
              نبني المستقبل بذكاء
            </span>
          </h1>
        </div>

        {/* Central Golden Trophy Icon */}
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFE894] via-[#E5A93C] to-[#BF8216] opacity-25 blur-xl animate-ping" style={{ animationDuration: '3s' }} />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#FFE894] via-[#F5BE38] to-[#BF8216] p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-[#0A142D] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#F5BE38] filter drop-shadow-[0_0_12px_rgba(245,190,56,0.6)] animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
          </div>
        </div>

        {/* Banner: الفائز بالجائزة */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#E5A93C]/20 via-[#E5A93C]/30 to-[#E5A93C]/20 border border-[#E5A93C]/60 text-[#FFE894] text-sm sm:text-base font-black shadow-inner mb-3">
          <Sparkles className="w-4 h-4 text-[#E5A93C]" />
          <span>الفائز بالجائزة</span>
          <Sparkles className="w-4 h-4 text-[#E5A93C]" />
        </div>

        {/* Winners Render */}
        <div className="my-4 space-y-4">
          {winners.map((winner, idx) => (
            <div
              key={winner.id || idx}
              className="p-5 rounded-2xl bg-[#060B18]/90 border border-[#E5A93C]/50 shadow-inner text-center"
            >
              {isMultiple && (
                <div className="text-xs font-bold text-[#E5A93C] mb-1">
                  الفائز رقم {idx + 1}
                </div>
              )}

              {/* Big Golden Winner Number */}
              <div
                className="text-5xl sm:text-7xl font-black tracking-wider gold-gradient-text drop-shadow-[0_4px_25px_rgba(245,190,56,0.6)] font-mono tabular-nums select-all my-2"
                dir="ltr"
              >
                {winner.number}
              </div>

              {/* Participant Name if available */}
              {winner.name && (
                <div className="text-lg sm:text-xl font-bold text-white mb-2">
                  {winner.name}
                </div>
              )}

              {/* Tag: الفائز بالجائزة */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/40 text-[#FFE894] text-xs sm:text-sm font-bold">
                <Award className="w-4 h-4 text-[#E5A93C]" />
                <span>مبارك الفوز بالجائزة</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Subtitle */}
        <p className="text-xs text-slate-300 font-semibold mb-5">
          الكلية الذكية الجامعية للتعليم الحديث & شركة جوال
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 print:hidden">
          <button
            type="button"
            onClick={() => {
              triggerGrandCelebration();
              soundFx.playFanfare();
            }}
            className="px-4 py-2.5 bg-[#0B1530] border border-[#E5A93C]/40 text-[#FFE894] hover:bg-[#E5A93C]/20 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#E5A93C]" />
            <span>ألعاب نارية واحتفال</span>
          </button>

          <button
            type="button"
            onClick={handlePrintCertificate}
            className="px-4 py-2.5 bg-[#0B1530] border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>طباعة بطاقة الفائز</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onDrawNext();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-[#E5A93C] via-[#F5BE38] to-[#BF8216] text-[#060B18] hover:opacity-95 font-black text-sm rounded-xl shadow-[0_0_20px_rgba(229,169,60,0.4)] transition-all flex items-center gap-2"
          >
            <span>السحب التالي</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Official Draw Stamp in Print mode */}
        <div className="hidden print:block mt-8 pt-4 border-t border-slate-300 text-center text-xs text-slate-600">
          تم السحب إلكترونياً وبطريقة عشوائية معتمدة | الكلية الذكية الجامعية للتعليم الحديث وشركة جوال
          <br />
          تاريخ السحب: {new Date().toLocaleDateString('ar-PS')} - {new Date().toLocaleTimeString('ar-PS')}
        </div>
      </div>
    </div>
  );
};
