import { useState, useEffect } from 'react';
import { Participant, Winner, DrawSpeed } from './types';
import { Header } from './components/Header';
import { DrawStage } from './components/DrawStage';
import { NumbersManager } from './components/NumbersManager';
import { WinnersList } from './components/WinnersList';
import { WinnerCelebrationModal } from './components/WinnerCelebrationModal';
import { soundFx } from './utils/audio';
import {
  Sparkles,
  Award,
  Hash,
  Trophy,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const STORAGE_KEYS = {
  PARTICIPANTS: 'smart_raffle_participants_v1',
  WINNERS: 'smart_raffle_winners_v1',
  SETTINGS: 'smart_raffle_settings_v1',
  LOGOS: 'smart_raffle_logos_v1',
};

// Initial starter participants representing Jawwal numbers and Smart University College student numbers
const INITIAL_PARTICIPANTS: Participant[] = [
  // Jawwal Palestinian Numbers
  { id: 'p1', number: '0599102030', name: 'أحمد ناصر الدين (جوال)', isDrawn: false },
  { id: 'p2', number: '0598445566', name: 'مريم القدومي (جوال)', isDrawn: false },
  { id: 'p3', number: '0597112233', name: 'طارق خليل القواسمي', isDrawn: false },
  { id: 'p4', number: '0595998877', name: 'هدى عبد الجواد (جوال)', isDrawn: false },
  { id: 'p5', number: '0599334455', name: 'وسام التميمي', isDrawn: false },
  { id: 'p6', number: '0598776655', name: 'ياسمين شاهين (جوال)', isDrawn: false },
  { id: 'p7', number: '0599221100', name: 'خالد البرغوثي', isDrawn: false },
  { id: 'p8', number: '0597665544', name: 'رنا النتشة (جوال)', isDrawn: false },
  { id: 'p9', number: '0599887766', name: 'عمر سلهب التميمي', isDrawn: false },
  { id: 'p10', number: '0595223344', name: 'ديمة عساف (جوال)', isDrawn: false },
  // Smart University College (SUME) Student IDs
  { id: 'p11', number: '2024101', name: 'طالب ذكاء اصطناعي - الكلية الذكية', isDrawn: false },
  { id: 'p12', number: '2024102', name: 'طالب أمن سيبراني - الكلية الذكية', isDrawn: false },
  { id: 'p13', number: '2024103', name: 'طالب هندسة برمجيات - الكلية الذكية', isDrawn: false },
  { id: 'p14', number: '2024104', name: 'طالب وسائط رقمية - الكلية الذكية', isDrawn: false },
  { id: 'p15', number: '2024105', name: 'طالب أنظمة ذكية - الكلية الذكية', isDrawn: false },
  { id: 'p16', number: '2024106', name: 'طالب إدارة أعمال رقمية - الكلية الذكية', isDrawn: false },
  { id: 'p17', number: '2024107', name: 'طالب حوسبة سحابية - الكلية الذكية', isDrawn: false },
  { id: 'p18', number: '2024108', name: 'طالب تكنولوجيا مالية - الكلية الذكية', isDrawn: false },
  // Event Ticket Numbers
  { id: 'p19', number: 'TICKET-101', name: 'تذكرة الحفل #101', isDrawn: false },
  { id: 'p20', number: 'TICKET-102', name: 'تذكرة الحفل #102', isDrawn: false },
];

export default function App() {
  // Load initial participants
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PARTICIPANTS;
  });

  // Load winners
  const [winners, setWinners] = useState<Winner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WINNERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Logos state
  const [collegeLogoSrc, setCollegeLogoSrc] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGOS);
      if (saved) return JSON.parse(saved).college || null;
    } catch {
      // Fallback
    }
    return null;
  });

  const [jawwalLogoSrc, setJawwalLogoSrc] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGOS);
      if (saved) return JSON.parse(saved).jawwal || null;
    } catch {
      // Fallback
    }
    return null;
  });

  // Draw settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speed, setSpeed] = useState<DrawSpeed>('normal');
  const [removeWinnerFromPool, setRemoveWinnerFromPool] = useState<boolean>(true);

  // Active modal celebration batch
  const [celebrationBatch, setCelebrationBatch] = useState<Winner[] | null>(null);

  // Main UI view mode: 'all' | 'stage' | 'numbers' | 'winners'
  const [activeView, setActiveView] = useState<'all' | 'stage' | 'numbers' | 'winners'>('all');

  // Sync participants to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
    } catch {
      // Ignore
    }
  }, [participants]);

  // Sync winners to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
    } catch {
      // Ignore
    }
  }, [winners]);

  // Sync sound setting to soundFx singleton
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle new drawn winners
  const handleDrawWinners = (newWinners: Winner[], removeAfterDraw: boolean) => {
    setWinners((prev) => [...newWinners, ...prev]);
    setCelebrationBatch(newWinners);

    if (removeAfterDraw) {
      const drawnNumbersSet = new Set(newWinners.map((w) => w.number));
      setParticipants((prev) =>
        prev.map((p) => {
          if (drawnNumbersSet.has(p.number)) {
            const correspondingWinner = newWinners.find((w) => w.number === p.number);
            return {
              ...p,
              isDrawn: true,
              drawnPrize: correspondingWinner?.prize,
              drawnAt: correspondingWinner?.timestamp,
            };
          }
          return p;
        })
      );
    }
  };

  // Add / Replace participants
  const handleAddParticipants = (newItems: Participant[], replaceAll = false) => {
    if (replaceAll) {
      setParticipants(newItems);
    } else {
      setParticipants((prev) => [...prev, ...newItems]);
    }
  };

  // Clear all participants
  const handleClearAllParticipants = () => {
    setParticipants([]);
  };

  // Reset drawn status of participants
  const handleResetDrawnStatus = () => {
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        isDrawn: false,
        drawnPrize: undefined,
        drawnAt: undefined,
      }))
    );
  };

  // Delete a single participant
  const handleDeleteSingleParticipant = (id: string) => {
    soundFx.playClick();
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  // Remove winner from winners list
  const handleRemoveWinner = (id: string, returnToPool: boolean) => {
    soundFx.playClick();
    const winnerToRemove = winners.find((w) => w.id === id);
    if (!winnerToRemove) return;

    setWinners((prev) => prev.filter((w) => w.id !== id));

    if (returnToPool) {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.number === winnerToRemove.number) {
            return {
              ...p,
              isDrawn: false,
              drawnPrize: undefined,
              drawnAt: undefined,
            };
          }
          return p;
        })
      );
    }
  };

  // Clear all winners
  const handleClearWinners = () => {
    setWinners([]);
  };

  // Quick sequential range generation (e.g. 1 to 10) directly applied and saved
  const handleQuickSetRange = (start: number, end: number, replace = true) => {
    if (end < start) return;
    const count = end - start + 1;
    if (count > 5000) return;
    const newItems: Participant[] = [];
    const existingNums = new Set(replace ? [] : participants.map((p) => p.number.toLowerCase()));

    for (let i = start; i <= end; i++) {
      const numStr = i.toString();
      if (!existingNums.has(numStr.toLowerCase())) {
        existingNums.add(numStr.toLowerCase());
        newItems.push({
          id: `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          number: numStr,
          isDrawn: false,
        });
      }
    }

    if (replace) {
      setParticipants(newItems);
    } else {
      setParticipants((prev) => [...prev, ...newItems]);
    }
  };

  // Update logos
  const handleUpdateLogos = (college: string | null, jawwal: string | null) => {
    setCollegeLogoSrc(college);
    setJawwalLogoSrc(jawwal);
    try {
      localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify({ college, jawwal }));
    } catch {
      // Ignore
    }
  };

  const availableCount = participants.filter((p) => !p.isDrawn).length;

  return (
    <div className="relative min-h-screen bg-[#060B18] text-slate-100 flex flex-col overflow-x-hidden selection:bg-[#E5A93C] selection:text-[#060B18]">
      
      {/* Background Decorative Stage Image & Ambient Lighting Scrim */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Generated Stage Backdrop Asset with zero-broken-image fallback */}
        <img
          src="/src/assets/images/stage_backdrop_1790516088017.jpg"
          alt="خلفية منصة السحب"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px]"
          onError={(e) => {
            // Hide if asset fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Ambient Dark Navy & Gold Radial Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060B18]/80 to-[#060B18]" />
        
        {/* Subtle Luxury Golden Star Particles */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#E5A93C]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#0E1E4C]/40 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main App Bar / Header with College Logo, Slogan "نبني المستقبل بذكاء", and Jawwal Logo */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        collegeLogoSrc={collegeLogoSrc}
        jawwalLogoSrc={jawwalLogoSrc}
        onUpdateLogos={handleUpdateLogos}
      />

      {/* Main View Navigation Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B1530]/80 border border-[#E5A93C]/20 rounded-2xl p-1.5 backdrop-blur-md">
          
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveView('all');
              }}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === 'all'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#070D1E]'
              }`}
            >
              عرض شامل (المسرح + الإدارة)
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveView('stage');
              }}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === 'stage'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#070D1E]'
              }`}
            >
              منصة العرض المباشر (الشاشات والمسرح)
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveView('numbers');
              }}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === 'numbers'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#070D1E]'
              }`}
            >
              إدخال وتجهيز الأرقام ({availableCount})
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveView('winners');
              }}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === 'winners'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#070D1E]'
              }`}
            >
              سجل الفائزين ({winners.length})
            </button>
          </div>

          {/* Quick Status indicators */}
          <div className="flex items-center gap-3 text-xs text-slate-300 pr-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#FFE894]">
              <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
              <span>نظام سحب عشوائي مؤمن بالكامل 100%</span>
            </span>
          </div>

        </div>
      </div>

      {/* Main Dynamic View Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        
        {/* VIEW 1: THE MAIN STAGE (Shown in 'all' and 'stage' modes) */}
        {(activeView === 'all' || activeView === 'stage') && (
          <section aria-label="منصة السحب العشوائي">
            <DrawStage
              participants={participants}
              onDrawWinners={handleDrawWinners}
              soundEnabled={soundEnabled}
              removeWinnerFromPool={removeWinnerFromPool}
            />
          </section>
        )}

        {/* VIEW 2: NUMBERS MANAGER (Shown in 'all' and 'numbers' modes) */}
        {(activeView === 'all' || activeView === 'numbers') && (
          <section aria-label="إدارة أرقام السحب">
            <NumbersManager
              participants={participants}
              onAddParticipants={handleAddParticipants}
              onClearAll={handleClearAllParticipants}
              onResetDrawnStatus={handleResetDrawnStatus}
              onDeleteSingle={handleDeleteSingleParticipant}
            />
          </section>
        )}

        {/* VIEW 3: WINNERS LIST (Shown in 'all' and 'winners' modes) */}
        {(activeView === 'all' || activeView === 'winners') && (
          <section aria-label="سجل الفائزين">
            <WinnersList
              winners={winners}
              onRemoveWinner={handleRemoveWinner}
              onClearWinners={handleClearWinners}
            />
          </section>
        )}

        {/* Quick Guide & Rules Info Panel */}
        {activeView === 'all' && (
          <section className="rounded-2xl bg-[#091228]/80 border border-slate-800 p-5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white mb-2 text-sm">
              <HelpCircle className="w-4 h-4 text-[#E5A93C]" />
              <span>دليل استخدام برنامج السحب الذكي:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400 mt-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#FFE894] font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-slate-200 block mb-0.5">تحديد الأرقام المشاركة:</strong>
                  يمكنك لصق قائمة أرقام الهواتف أو الأرقام الجامعية مباشرة، أو توليد أرقام تسلسلية بنقرة واحدة من تبويب إدارة الأرقام.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#FFE894] font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-slate-200 block mb-0.5">اختيار الجائزة ونمط السحب:</strong>
                  حدد الجائزة المراد تقديمها، واختر سرعة وتأثيرات التدوير (سريع، متوازن، حماسي مسرحي) مع إمكانية سحب عدة فائزين معاً.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#FFE894] font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-slate-200 block mb-0.5">توثيق وطباعة النتائج:</strong>
                  يتم حفظ جميع السحوبات تلقائياً مع خيار تصديرها إلى Excel (CSV) أو طباعة بطاقة فوز رسمية تحمل شعارات الكلية وجوال.
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Winner Celebration Modal */}
      {celebrationBatch && (
        <WinnerCelebrationModal
          winners={celebrationBatch}
          onClose={() => setCelebrationBatch(null)}
          onDrawNext={() => setCelebrationBatch(null)}
          collegeLogoSrc={collegeLogoSrc}
          jawwalLogoSrc={jawwalLogoSrc}
        />
      )}

      {/* Footer with Slogan and Institutional Identity */}
      <footer className="relative z-10 w-full border-t border-slate-800 bg-[#040813] py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <div className="flex items-center gap-2">
            <span className="gold-gradient-text font-bold text-sm">
              نبني المستقبل بذكاء
            </span>
            <span>·</span>
            <span>الكلية الذكية الجامعية للتعليم الحديث وشركة جوال</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
            <span>·</span>
            <span className="text-[#E5A93C]">النسخة الرقمية المعتمدة للفعاليات</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
