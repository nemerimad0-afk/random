import React, { useState } from 'react';
import { CollegeLogo, JawwalLogo } from './Logos';
import { Volume2, VolumeX, Maximize2, Minimize2, Image as ImageIcon, Upload, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  collegeLogoSrc: string | null;
  jawwalLogoSrc: string | null;
  onUpdateLogos: (college: string | null, jawwal: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  collegeLogoSrc,
  jawwalLogoSrc,
  onUpdateLogos,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(() => {});
      }
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'college' | 'jawwal'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'college') {
          onUpdateLogos(result, jawwalLogoSrc);
        } else {
          onUpdateLogos(collegeLogoSrc, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="relative w-full border-b border-[#E5A93C]/25 bg-gradient-to-b from-[#091024] via-[#0B1530] to-[#070D1E] shadow-2xl z-30">
      {/* Golden top hairline ambient line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Right: شعار الكلية وجوال جنب بعض بنفس الحجم 80*80 */}
          <div className="flex items-center gap-3 sm:gap-4 p-2 rounded-2xl bg-[#070D1E]/80 border border-[#E5A93C]/30 shadow-inner">
            <CollegeLogo customSrc={collegeLogoSrc} size="80" />
            <div className="h-16 w-[1.5px] bg-gradient-to-b from-transparent via-[#E5A93C]/50 to-transparent" />
            <JawwalLogo customSrc={jawwalLogoSrc} size="80" />
          </div>

          {/* Center: فقط "نبني المستقبل بذكاء" بنفس اللون والطريقة */}
          <div className="flex items-center justify-center text-center my-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-['Tajawal',sans-serif]">
              <span className="gold-gradient-text drop-shadow-[0_2px_18px_rgba(245,190,56,0.4)]">
                نبني المستقبل بذكاء
              </span>
            </h1>
          </div>

          {/* Left: أدوات التحكم الفوري (الصوت والشاشة وتخصيص الشعارات) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0D1B3E]/80 border border-[#E5A93C]/20 rounded-xl p-1 shadow-md">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onToggleSound();
                }}
                className={`p-2 rounded-lg transition-all ${
                  soundEnabled
                    ? 'text-[#F5BE38] hover:bg-[#E5A93C]/15'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
                aria-label="تبديل الصوت"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  toggleFullscreen();
                }}
                className="p-2 text-slate-300 hover:text-[#F5BE38] hover:bg-[#E5A93C]/15 rounded-lg transition-all"
                title={isFullscreen ? 'إنهاء ملء الشاشة' : 'عرض ملء الشاشة للعروض والمسارح'}
                aria-label="ملء الشاشة"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Custom Logo Button */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setShowLogoModal(true);
                }}
                className="p-2 text-slate-300 hover:text-[#F5BE38] hover:bg-[#E5A93C]/15 rounded-lg transition-all"
                title="تخصيص ورفع الشعارات الرسمية"
                aria-label="تخصيص الشعارات"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Modal for Customizing / Uploading Logos */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0C1630] border border-[#E5A93C]/40 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#E5A93C]" />
              <span>تخصيص شعارات السحب</span>
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              يمكنك استخدام الشعارات الرسمية المدمجة فائقة الدقة أو رفع ملفات صور خاصة بالكلية أو الرعاة.
            </p>

            <div className="space-y-4">
              {/* College Logo Uploader */}
              <div className="p-4 bg-[#070D1E] rounded-xl border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-sm">شعار الكلية الذكية الجامعية</span>
                  {collegeLogoSrc && (
                    <button
                      onClick={() => onUpdateLogos(null, jawwalLogoSrc)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      استعادة الشعار الرسمي
                    </button>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-[#E5A93C]/30 hover:border-[#E5A93C] rounded-lg cursor-pointer transition-colors bg-[#0B1530]/50 text-slate-300 text-xs">
                  <Upload className="w-4 h-4 text-[#E5A93C]" />
                  <span>رفع صورة جديدة للكلية (PNG, JPG, SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'college')}
                  />
                </label>
              </div>

              {/* Jawwal Logo Uploader */}
              <div className="p-4 bg-[#070D1E] rounded-xl border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-sm">شعار شركة جوال</span>
                  {jawwalLogoSrc && (
                    <button
                      onClick={() => onUpdateLogos(collegeLogoSrc, null)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      استعادة الشعار الرسمي
                    </button>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-[#FF6600]/30 hover:border-[#FF6600] rounded-lg cursor-pointer transition-colors bg-[#0B1530]/50 text-slate-300 text-xs">
                  <Upload className="w-4 h-4 text-[#FF6600]" />
                  <span>رفع صورة جديدة لشركة جوال (PNG, JPG, SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'jawwal')}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLogoModal(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
              >
                تم وحفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
