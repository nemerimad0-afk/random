import React, { useState, useId } from 'react';
import { Participant } from '../types';
import {
  ListPlus,
  Hash,
  Sparkles,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle2,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface NumbersManagerProps {
  participants: Participant[];
  onAddParticipants: (newParticipants: Participant[], replaceAll?: boolean) => void;
  onClearAll: () => void;
  onResetDrawnStatus: () => void;
  onDeleteSingle: (id: string) => void;
}

export const NumbersManager: React.FC<NumbersManagerProps> = ({
  participants,
  onAddParticipants,
  onClearAll,
  onResetDrawnStatus,
  onDeleteSingle,
}) => {
  // Default to 'range' as requested by the user
  const [activeTab, setActiveTab] = useState<'range' | 'paste' | 'presets' | 'list'>('range');
  const [bulkInput, setBulkInput] = useState('');
  const [inputFeedback, setInputFeedback] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // Range generator state - defaults from 1 to 10
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(10);
  const [rangePrefix, setRangePrefix] = useState<string>('');
  const [padZeros, setPadZeros] = useState<boolean>(false);

  // Search in pool
  const [searchTerm, setSearchTerm] = useState('');

  const bulkInputId = useId();
  const rangeStartId = useId();
  const rangeEndId = useId();
  const rangePrefixId = useId();
  const padZerosId = useId();

  const availableCount = participants.filter((p) => !p.isDrawn).length;
  const drawnCount = participants.filter((p) => p.isDrawn).length;

  /** Generate sequential numbers and save them automatically */
  const handleGenerateRange = (replace = true) => {
    soundFx.playClick();
    if (rangeEnd < rangeStart) {
      setInputFeedback({
        message: 'رقم النهاية يجب أن يكون أكبر من أو يساوي رقم البداية',
        type: 'warning',
      });
      return;
    }

    const count = rangeEnd - rangeStart + 1;
    if (count > 5000) {
      setInputFeedback({
        message: 'الحد الأقصى للتوليد التلقائي في الدفعة الواحدة هو 5000 رقم',
        type: 'warning',
      });
      return;
    }

    const maxDigits = rangeEnd.toString().length;
    const newItems: Participant[] = [];
    const existingNums = new Set(replace ? [] : participants.map((p) => p.number.toLowerCase()));

    for (let i = rangeStart; i <= rangeEnd; i++) {
      let numStr = i.toString();
      if (padZeros && numStr.length < maxDigits) {
        numStr = numStr.padStart(maxDigits, '0');
      }
      const fullNum = `${rangePrefix}${numStr}`;

      if (!existingNums.has(fullNum.toLowerCase())) {
        existingNums.add(fullNum.toLowerCase());
        newItems.push({
          id: `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          number: fullNum,
          isDrawn: false,
        });
      }
    }

    // Call onAddParticipants with replace flag
    onAddParticipants(newItems, replace);

    const feedbackText = replace
      ? `✓ تم بنجاح تعيين وحفظ الأرقام من (${rangeStart}) إلى (${rangeEnd}) في صندوق السحب (${newItems.length} أرقام جاهزة للسحب الآن).`
      : `✓ تمت إضافة (${newItems.length}) رقم إلى الصندوق بنجاح!`;

    setInputFeedback({
      message: feedbackText,
      type: 'success',
    });

    setTimeout(() => setInputFeedback(null), 5000);
  };

  /** Set quick preset ranges like 1-10, 1-20, 1-50, etc. */
  const handleQuickRangeSelect = (start: number, end: number, autoApply = false) => {
    soundFx.playClick();
    setRangeStart(start);
    setRangeEnd(end);

    if (autoApply) {
      const maxDigits = end.toString().length;
      const newItems: Participant[] = [];
      for (let i = start; i <= end; i++) {
        let numStr = i.toString();
        if (padZeros && numStr.length < maxDigits) {
          numStr = numStr.padStart(maxDigits, '0');
        }
        newItems.push({
          id: `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          number: `${rangePrefix}${numStr}`,
          isDrawn: false,
        });
      }
      onAddParticipants(newItems, true);
      setInputFeedback({
        message: `✓ تم تلقائياً حفظ وتعيين الأرقام من (${start}) إلى (${end}) في صندوق السحب!`,
        type: 'success',
      });
      setTimeout(() => setInputFeedback(null), 4000);
    }
  };

  /** Parse and add numbers from text area */
  const handleProcessBulkInput = (replace = false) => {
    if (!bulkInput.trim()) {
      setInputFeedback({ message: 'الرجاء إدخال أرقام أولاً', type: 'warning' });
      return;
    }

    soundFx.playClick();
    const rawLines = bulkInput
      .split(/[\n,;]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const existingNums = new Set(replace ? [] : participants.map((p) => p.number.toLowerCase()));
    const newItems: Participant[] = [];
    let duplicateCount = 0;

    rawLines.forEach((line) => {
      let num = line;
      let name = '';

      if (line.includes('-') || line.includes(':') || line.includes('|')) {
        const parts = line.split(/[-:|]/).map((s) => s.trim());
        if (parts.length >= 2) {
          num = parts[0];
          name = parts.slice(1).join(' ');
        }
      }

      if (existingNums.has(num.toLowerCase())) {
        duplicateCount++;
      } else {
        existingNums.add(num.toLowerCase());
        newItems.push({
          id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          number: num,
          name: name || undefined,
          isDrawn: false,
        });
      }
    });

    if (newItems.length === 0 && duplicateCount > 0) {
      setInputFeedback({
        message: `جميع الأرقام المدخلة (${duplicateCount}) موجودة بالفعل في الصندوق.`,
        type: 'warning',
      });
      return;
    }

    onAddParticipants(newItems, replace);
    setBulkInput('');
    setInputFeedback({
      message: `تمت إضافة ${newItems.length} رقم بنجاح! ${duplicateCount > 0 ? `(تم تخطي ${duplicateCount} مكرر)` : ''}`,
      type: 'success',
    });
    setTimeout(() => setInputFeedback(null), 4000);
  };

  /** Apply ready presets */
  const handleApplyPreset = (type: 'jawwal' | 'college' | 'festival') => {
    soundFx.playClick();
    const newItems: Participant[] = [];
    const timestamp = Date.now();

    if (type === 'jawwal') {
      const sampleNames = [
        'أحمد ناصر الدين',
        'مريم القدومي',
        'طارق خليل',
        'هدى عبد الجواد',
        'وسام التميمي',
        'ياسمين شاهين',
        'خالد برغوثي',
        'رنا القواسمي',
        'عمر سلهب',
        'ديمة النتشة',
        'محمد عساف',
        'نور البيطار',
        'إياد شقير',
        'سارة الجعبري',
        'حمزة كنعان',
      ];

      for (let i = 1; i <= 35; i++) {
        const randPhone = `059${Math.floor(2000000 + Math.random() * 7999999)}`;
        const name = sampleNames[i % sampleNames.length];
        newItems.push({
          id: `preset-j-${timestamp}-${i}`,
          number: randPhone,
          name: `${name} (مشترك جوال)`,
          isDrawn: false,
        });
      }
    } else if (type === 'college') {
      const studentMajors = [
        'ذكاء اصطناعي وأنظمة ذكية',
        'أمن سيبراني',
        'هندسة البرمجيات',
        'تصميم الوسائط الرقمية',
        'إدارة الأعمال الرقمية',
      ];
      for (let i = 101; i <= 140; i++) {
        const studentId = `2024${i}`;
        const major = studentMajors[i % studentMajors.length];
        newItems.push({
          id: `preset-c-${timestamp}-${i}`,
          number: studentId,
          name: `طالب كلية ذكية - ${major}`,
          isDrawn: false,
        });
      }
    } else {
      for (let i = 1001; i <= 1080; i++) {
        newItems.push({
          id: `preset-f-${timestamp}-${i}`,
          number: `TICKET-${i}`,
          name: `تذكرة الحفل #${i}`,
          isDrawn: false,
        });
      }
    }

    onAddParticipants(newItems, true);
    setInputFeedback({
      message: `تم إدراج وحفظ ${newItems.length} رقم نموذجي في الصندوق!`,
      type: 'success',
    });
    setTimeout(() => setInputFeedback(null), 4000);
  };

  /** Export numbers to text file */
  const handleExportList = () => {
    soundFx.playClick();
    const content = participants
      .map((p) => `${p.number}${p.name ? ` - ${p.name}` : ''}${p.isDrawn ? ' [فاز]' : ''}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-raffle-numbers-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredParticipants = participants.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.number.toLowerCase().includes(term) || (p.name && p.name.toLowerCase().includes(term));
  });

  // Calculate live preview of numbers
  const previewCount = Math.max(0, rangeEnd - rangeStart + 1);
  const previewNumbers: string[] = [];
  if (previewCount > 0 && previewCount <= 15) {
    const maxDigits = rangeEnd.toString().length;
    for (let i = rangeStart; i <= rangeEnd; i++) {
      let numStr = i.toString();
      if (padZeros && numStr.length < maxDigits) {
        numStr = numStr.padStart(maxDigits, '0');
      }
      previewNumbers.push(`${rangePrefix}${numStr}`);
    }
  }

  return (
    <div className="w-full bg-[#0A142D]/90 border border-[#E5A93C]/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Top Header & Pool Statistics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#E5A93C]" />
            <span>إدارة وتجهيز أرقام السحب</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            أدخل أرقام السحب بنطاق متسلسل (من رقم إلى رقم) أو باللصق المباشر - تحفظ تلقائياً في الصندوق
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070D1E] border border-[#E5A93C]/30 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300">الأرقام الجاهزة للسحب:</span>
            <span className="text-sm font-bold text-[#FFE894] font-mono tabular-nums">
              {availableCount}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070D1E] border border-slate-700">
            <span className="text-xs text-slate-400">الإجمالي:</span>
            <span className="text-sm font-bold text-slate-200 font-mono tabular-nums">
              {participants.length}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#060B18] border border-slate-800 rounded-xl mb-5">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('range');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            activeTab === 'range'
              ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-[#0B1530]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>توليد وحفظ نطاق (من .. إلى)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('paste');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'paste'
              ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-[#0B1530]'
          }`}
        >
          <ListPlus className="w-4 h-4" />
          <span>إدخال يدوي / لصق قائمة</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('presets');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'presets'
              ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-[#0B1530]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>نماذج جاهزة (جوال / الكلية)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('list');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all mr-auto ${
            activeTab === 'list'
              ? 'bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-[#0B1530]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>مراجعة الصندوق الحالي ({participants.length})</span>
        </button>
      </div>

      {/* Tab Feedback Notification */}
      {inputFeedback && (
        <div
          className={`mb-5 p-3.5 rounded-xl border flex items-center gap-2.5 transition-all animate-fadeIn ${
            inputFeedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}
        >
          {inputFeedback.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{inputFeedback.message}</span>
        </div>
      )}

      {/* TAB 1: RANGE GENERATOR (FROM ... TO ...) */}
      {activeTab === 'range' && (
        <div className="space-y-5">
          {/* Informational banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C193C] to-[#070D1E] border border-[#E5A93C]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-0.5">
                <Zap className="w-4 h-4 text-[#E5A93C]" />
                <span>إدخال نطاق أرقام السحب المباشر:</span>
              </div>
              <p className="text-xs text-slate-300">
                حدد رقم البداية ورقم النهاية (مثلاً من <strong className="text-[#FFE894]">1</strong> إلى <strong className="text-[#FFE894]">10</strong>)، وسيقوم البرنامج بتوليدها وحفظها في صندوق السحب فوراً.
              </p>
            </div>

            {/* Auto-save confirmation indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold whitespace-nowrap">
              <Check className="w-3.5 h-3.5" />
              <span>حفظ تلقائي في الذاكرة</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-2">
              اختيار سريع جاهز بنقرة واحدة:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'من 1 إلى 10', start: 1, end: 10 },
                { label: 'من 1 إلى 20', start: 1, end: 20 },
                { label: 'من 1 إلى 50', start: 1, end: 50 },
                { label: 'من 1 إلى 100', start: 1, end: 100 },
                { label: 'من 1 إلى 200', start: 1, end: 200 },
                { label: 'من 1 إلى 500', start: 1, end: 500 },
              ].map((preset) => {
                const isCurrent = rangeStart === preset.start && rangeEnd === preset.end;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleQuickRangeSelect(preset.start, preset.end, false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isCurrent
                        ? 'bg-[#E5A93C] text-[#060B18] border-[#E5A93C] shadow-md'
                        : 'bg-[#060B18] text-slate-300 border-slate-700 hover:border-[#E5A93C]/50 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#060B18] p-4 rounded-xl border border-slate-800">
            <div>
              <label htmlFor={rangeStartId} className="block text-xs font-bold text-[#FFE894] mb-1.5">
                من رقم (البداية):
              </label>
              <input
                id={rangeStartId}
                type="number"
                min={0}
                value={rangeStart}
                onChange={(e) => setRangeStart(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0A142D] border-2 border-[#E5A93C]/40 focus:border-[#E5A93C] rounded-xl px-3.5 py-2.5 text-base sm:text-lg text-white font-mono font-bold outline-none tabular-nums"
              />
            </div>

            <div>
              <label htmlFor={rangeEndId} className="block text-xs font-bold text-[#FFE894] mb-1.5">
                إلى رقم (النهاية):
              </label>
              <input
                id={rangeEndId}
                type="number"
                min={rangeStart}
                value={rangeEnd}
                onChange={(e) => setRangeEnd(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0A142D] border-2 border-[#E5A93C]/40 focus:border-[#E5A93C] rounded-xl px-3.5 py-2.5 text-base sm:text-lg text-white font-mono font-bold outline-none tabular-nums"
              />
            </div>

            <div>
              <label htmlFor={rangePrefixId} className="block text-xs font-bold text-slate-300 mb-1.5">
                بادئة اختيارية (مثال: SUME- أو رقم بدون بادئة):
              </label>
              <input
                id={rangePrefixId}
                type="text"
                value={rangePrefix}
                onChange={(e) => setRangePrefix(e.target.value)}
                placeholder="بدون بادئة (أرقام فقط)"
                className="w-full bg-[#0A142D] border border-slate-700 focus:border-[#E5A93C] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono outline-none"
              />
            </div>
          </div>

          {/* Options & Live Preview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#081126] border border-slate-800/80">
            <div className="flex items-center gap-2">
              <input
                id={padZerosId}
                type="checkbox"
                checked={padZeros}
                onChange={(e) => setPadZeros(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-[#E5A93C] focus:ring-[#E5A93C] cursor-pointer"
              />
              <label htmlFor={padZerosId} className="text-xs text-slate-300 cursor-pointer">
                حشو الأصفار اليسارية (مثال: 01, 02 .. 10 بدلاً من 1, 2 .. 10)
              </label>
            </div>

            {/* Live Numbers Preview */}
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>الأرقام التي سيتم إدخالها:</span>
              <span className="font-bold text-[#FFE894] font-mono tabular-nums">
                {previewCount} رقم
              </span>
              {previewNumbers.length > 0 && (
                <span className="text-[11px] text-slate-300 bg-[#0A142D] px-2 py-0.5 rounded border border-slate-700 font-mono" dir="ltr">
                  [{previewNumbers.join(', ')}]
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Replace Button */}
            <button
              type="button"
              onClick={() => handleGenerateRange(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#FFE894] via-[#F5BE38] via-[#E5A93C] to-[#D49013] text-[#060B18] font-black text-sm rounded-xl hover:opacity-95 shadow-[0_0_25px_rgba(229,169,60,0.35)] flex items-center gap-2.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>
                تعيين النطاق من ({rangeStart}) إلى ({rangeEnd}) وحفظه في الصندوق فوراً
              </span>
            </button>

            {/* Secondary Add Button */}
            <button
              type="button"
              onClick={() => handleGenerateRange(false)}
              className="px-4 py-3 bg-[#0B1530] border border-amber-600/40 text-amber-300 font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#0B1530]/80 transition-colors flex items-center gap-2"
            >
              <ListPlus className="w-4 h-4" />
              <span>إضافة هذا النطاق إلى الأرقام الموجودة مسبقاً دون مسحها</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PASTE & MANUAL ENTRY */}
      {activeTab === 'paste' && (
        <div className="space-y-4">
          <div>
            <label htmlFor={bulkInputId} className="block text-xs font-semibold text-slate-300 mb-1.5">
              الصق الأرقام هنا (مفصولة بسطر جديد أو فواصل أو مسافات)، مع إمكانية إضافة الاسم بجانب الرقم (مثال: <span dir="ltr" className="text-[#FFE894]">0599123456 - محمد</span> أو <span dir="ltr" className="text-[#FFE894]">1045</span>):
            </label>
            <textarea
              id={bulkInputId}
              rows={5}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="مثال:&#10;0599123456 - محمد خالد&#10;0598765432 - فاطمة أحمد&#10;20241050&#10;20241051&#10;105 - سارة خليل"
              className="w-full bg-[#060B18] border border-slate-700 focus:border-[#E5A93C] rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 font-mono outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleProcessBulkInput(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] font-bold text-sm rounded-xl hover:opacity-95 shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>حفظ وتعيين هذه القائمة فقط في الصندوق</span>
            </button>

            <button
              type="button"
              onClick={() => handleProcessBulkInput(false)}
              className="px-4 py-2.5 bg-[#0B1530] border border-amber-600/40 text-amber-300 font-semibold text-sm rounded-xl hover:bg-[#0B1530]/80 transition-colors"
            >
              إضافة إلى الأرقام الحالية
            </button>

            <button
              type="button"
              onClick={() => setBulkInput('')}
              className="px-3.5 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mr-auto"
            >
              مسح الحقل
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PRESETS */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#070E24] border border-[#FF6600]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">مشتركو جوال (059)</span>
                <span className="text-[10px] bg-[#FF6600]/20 text-[#FFA040] px-2 py-0.5 rounded font-bold">
                  35 مشترك
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                قائمة نموذجية لأرقام هواتف شبكة جوال بأسماء مشاركين جاهزة للسحب الفوري.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleApplyPreset('jawwal')}
              className="w-full py-2 bg-[#FF6600] hover:bg-[#E55A00] text-white font-bold text-xs rounded-lg transition-colors"
            >
              تحميل نموذج جوال
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#070E24] border border-[#E5A93C]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">أرقام الكلية الذكية الجامعية</span>
                <span className="text-[10px] bg-[#E5A93C]/20 text-[#FFE894] px-2 py-0.5 rounded font-bold">
                  40 طالب
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                أرقام جامعية للطلبة مع تخصصاتهم التكنولوجية (هندسة البرمجيات، ذكاء اصطناعي، أمن سيبراني).
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleApplyPreset('college')}
              className="w-full py-2 bg-gradient-to-r from-[#E5A93C] to-[#BF8216] text-[#060B18] font-bold text-xs rounded-lg transition-colors"
            >
              تحميل نموذج الكلية الذكية
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#070E24] border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">تذاكر المهرجانات والحفلات</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                  80 تذكرة
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                تذاكر مرقمة من TICKET-1001 إلى TICKET-1080 مناسبة لسحوبات الكوبونات المباشرة.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleApplyPreset('festival')}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-colors"
            >
              تحميل نموذج التذاكر
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CURRENT POOL INSPECTOR */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث في الأرقام أو الأسماء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#060B18] border border-slate-700 focus:border-[#E5A93C] rounded-lg pr-9 pl-3 py-1.5 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
              {drawnCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onResetDrawnStatus();
                  }}
                  className="px-3 py-1.5 bg-[#0D1E45] border border-amber-500/30 text-amber-200 text-xs font-semibold rounded-lg hover:bg-[#0D1E45]/80 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة الفائزين ({drawnCount}) للصندوق</span>
                </button>
              )}

              {participants.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleExportList}
                    className="px-3 py-1.5 bg-[#070D1E] border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg hover:text-white flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير القائمة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من تفريغ جميع الأرقام من صندوق السحب؟')) {
                        soundFx.playClick();
                        onClearAll();
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-semibold rounded-lg hover:bg-rose-900/50 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تفريغ الصندوق</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Numbers Grid / List */}
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              لا توجد أرقام مسجلة تطابق البحث، استخدم تبويب "توليد وحفظ نطاق (من .. إلى)" لإضافة الأرقام.
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filteredParticipants.map((p) => (
                <div
                  key={p.id}
                  className={`p-2 rounded-lg border text-right transition-all flex items-center justify-between group ${
                    p.isDrawn
                      ? 'bg-amber-950/20 border-amber-600/30 text-amber-300/60'
                      : 'bg-[#060B18] border-slate-800 hover:border-[#E5A93C]/40 text-slate-200'
                  }`}
                >
                  <div className="truncate pl-1">
                    <div className="font-mono font-bold text-xs tabular-nums text-white truncate" dir="ltr">
                      {p.number}
                    </div>
                    {p.name && (
                      <div className="text-[10px] text-slate-400 truncate">
                        {p.name}
                      </div>
                    )}
                    {p.isDrawn && (
                      <div className="text-[9px] text-[#FFE894] font-semibold">
                        ★ فاز بالجائزة
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteSingle(p.id)}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="حذف هذا الرقم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
