import React from 'react';

interface LogoProps {
  customSrc?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '80';
  hideText?: boolean;
}

/**
 * High-res vector emblem for "الكلية الذكية الجامعية للتعليم الحديث" (SUME)
 */
export const CollegeLogo: React.FC<LogoProps> = ({
  customSrc,
  className = '',
  size = '80',
  hideText = false,
}) => {
  // 80x80 size mappings (80px x 80px)
  const sizeClasses =
    size === '80' || size === 'xl'
      ? 'w-[80px] h-[80px] min-w-[80px] min-h-[80px]'
      : size === 'lg'
      ? 'w-16 h-16 min-w-16 min-h-16'
      : size === 'sm'
      ? 'w-10 h-10 min-w-10 min-h-10'
      : 'w-14 h-14 min-w-14 min-h-14';

  if (customSrc) {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <img
          src={customSrc}
          alt="الكلية الذكية الجامعية"
          className={`object-contain rounded-xl shadow-md ${sizeClasses}`}
          style={{ width: '80px', height: '80px' }}
        />
        {!hideText && (
          <div className="flex flex-col text-right">
            <span className="text-[15px] sm:text-base font-extrabold tracking-tight text-white leading-tight">
              الكلية الذكية الجامعية
            </span>
            <span className="text-[11px] sm:text-xs text-[#E5A93C] font-semibold leading-tight mt-0.5">
              للتعليم الحديث · فلسطين
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Emblem - 80*80 px */}
      <svg
        className={`${sizeClasses} shrink-0 filter drop-shadow-[0_0_15px_rgba(245,190,56,0.4)]`}
        style={{ width: size === '80' || size === 'xl' ? '80px' : undefined, height: size === '80' || size === 'xl' ? '80px' : undefined }}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="40%" stopColor="#E5A93C" />
            <stop offset="80%" stopColor="#BF8216" />
            <stop offset="100%" stopColor="#FFDE6A" />
          </linearGradient>
          <linearGradient id="navyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2F5D" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>
        </defs>

        {/* Outer Circular Laurel / Shield Base */}
        <circle cx="50" cy="50" r="46" fill="url(#navyGrad1)" stroke="url(#goldGrad1)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="41" stroke="#E5A93C" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />

        {/* Smart Technology Neural Hexagon / Crystal */}
        <polygon
          points="50,18 78,34 78,66 50,82 22,66 22,34"
          fill="none"
          stroke="url(#goldGrad1)"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Internal Smart Connectivity Lines */}
        <circle cx="50" cy="18" r="2.2" fill="#FFE894" />
        <circle cx="78" cy="34" r="2.2" fill="#FFE894" />
        <circle cx="78" cy="66" r="2.2" fill="#FFE894" />
        <circle cx="50" cy="82" r="2.2" fill="#FFE894" />
        <circle cx="22" cy="66" r="2.2" fill="#FFE894" />
        <circle cx="22" cy="34" r="2.2" fill="#FFE894" />

        {/* University Graduation Cap Emblem */}
        <path
          d="M50 32 L72 43 L50 54 L28 43 Z"
          fill="url(#goldGrad1)"
        />
        {/* Cap Base & Tassel */}
        <path
          d="M36 47.5 L36 58 C36 65 64 65 64 58 L64 47.5"
          fill="none"
          stroke="url(#goldGrad1)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Tassel cord */}
        <path
          d="M68 45 L73 52 L73 57"
          fill="none"
          stroke="#FFE894"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="73" cy="58" r="1.5" fill="#FFE894" />

        {/* Open Book of Knowledge at Bottom */}
        <path
          d="M38 65 C43 63 48 64 50 67 C52 64 57 63 62 65 L61 74 C56 72 52 73 50 76 C48 73 44 72 39 74 Z"
          fill="url(#goldGrad1)"
          opacity="0.9"
        />

        {/* Center Smart Tech Sparkle */}
        <path
          d="M50 49 L51.2 52 L54 53 L51.2 54 L50 57 L48.8 54 L46 53 L48.8 52 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* College Typography */}
      {!hideText && (
        <div className="flex flex-col text-right">
          <span className="text-[15px] sm:text-base font-extrabold tracking-tight text-white leading-tight">
            الكلية الذكية الجامعية
          </span>
          <span className="text-[11px] sm:text-xs text-[#E5A93C] font-semibold leading-tight mt-0.5">
            للتعليم الحديث · فلسطين
          </span>
          <span className="text-[9px] tracking-wider text-slate-400 font-mono font-medium hidden sm:inline uppercase mt-0.5">
            Smart University College (SUME)
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * High-res vector emblem for "شركة جوال" (Jawwal)
 */
export const JawwalLogo: React.FC<LogoProps> = ({
  customSrc,
  className = '',
  size = '80',
  hideText = false,
}) => {
  // 80x80 size mappings (80px x 80px)
  const sizeClasses =
    size === '80' || size === 'xl'
      ? 'w-[80px] h-[80px] min-w-[80px] min-h-[80px]'
      : size === 'lg'
      ? 'w-16 h-16 min-w-16 min-h-16'
      : size === 'sm'
      ? 'w-10 h-10 min-w-10 min-h-10'
      : 'w-14 h-14 min-w-14 min-h-14';

  if (customSrc) {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        <img
          src={customSrc}
          alt="شركة جوال"
          className={`object-contain rounded-xl shadow-md ${sizeClasses}`}
          style={{ width: '80px', height: '80px' }}
        />
        {!hideText && (
          <div className="flex flex-col text-right">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight font-['Tajawal',sans-serif]">
              جَــوّال
            </span>
            <span className="text-[11px] text-slate-300 font-medium leading-tight">
              شركة الاتصالات الخلوية
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Jawwal Brand Icon - 80*80 px */}
      <svg
        className={`${sizeClasses} shrink-0 filter drop-shadow-[0_0_15px_rgba(255,102,0,0.35)]`}
        style={{ width: size === '80' || size === 'xl' ? '80px' : undefined, height: size === '80' || size === 'xl' ? '80px' : undefined }}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="jawwalOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA100" />
            <stop offset="60%" stopColor="#FF5A00" />
            <stop offset="100%" stopColor="#E53900" />
          </linearGradient>
          <linearGradient id="jawwalGoldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="100%" stopColor="#F5BE38" />
          </linearGradient>
        </defs>

        {/* Circular Deep Navy Shield Background */}
        <rect width="100" height="100" rx="22" fill="#0B132B" stroke="#FF7A00" strokeWidth="1.8" strokeOpacity="0.6" />

        {/* The Jawwal Iconic Dynamic Wave Loop */}
        <path
          d="M26 30 C26 22 36 18 45 22 C56 27 68 40 70 54 C72 68 62 82 48 82 C34 82 24 72 26 56 C27 48 34 42 42 43 C49 44 54 50 53 57 C52 64 47 67 43 66 C39 65 37 62 38 58"
          fill="none"
          stroke="url(#jawwalOrangeGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Jawwal Golden Dot Accent */}
        <circle cx="68" cy="28" r="6" fill="url(#jawwalGoldAccent)" />
        <circle cx="68" cy="28" r="3" fill="#FFFFFF" opacity="0.8" />
      </svg>

      {/* Jawwal Typography */}
      {!hideText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight font-['Tajawal',sans-serif]">
              جَــوّال
            </span>
            <span className="bg-[#FF6600]/20 border border-[#FF6600]/40 text-[#FFA040] text-[10px] px-1.5 py-0.5 rounded font-bold">
              Jawwal
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium leading-tight">
            شركة الاتصالات الخلوية
          </span>
        </div>
      )}
    </div>
  );
};
