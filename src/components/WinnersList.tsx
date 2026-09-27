import React from 'react';
import { Winner } from '../types';
import { Trophy, Award, Download, Printer, RotateCcw, Trash2, Calendar, Clock } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface WinnersListProps {
  winners: Winner[];
  onRemoveWinner: (id: string, returnToPool: boolean) => void;
  onClearWinners: () => void;
}

export const WinnersList: React.FC<WinnersListProps> = ({
  winners,
  onRemoveWinner,
  onClearWinners,
}) => {
  if (winners.length === 0) {
    return (
      <div className="w-full bg-[#0A142D]/60 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center">
        <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
        <h3 className="text-base font-bold text-slate-300">سجل الفائزين فارغ حتى الآن</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          عند تشغيل السحب العشوائي، سيتم توثيق جميع الفائزين والجوائز المرتبطة بهم هنا مع إمكانية التصدير والطباعة.
        </p>
      </div>
    );
  }

  /** Export winners to CSV */
  const handleExportCSV = () => {
    soundFx.playClick();
    const headers = 'رقم السحب,الرقم الفائز,الاسم,الجائزة,الوقت والتاريخ\n';
    const rows = winners
      .map((w, idx) => {
        const timeStr = new Date(w.timestamp).toLocaleString('ar-PS');
        return `"${idx + 1}","${w.number}","${w.name || '-'}","${w.prize}","${timeStr}"`;
      })
      .join('\n');

    // Add UTF-8 BOM so Excel opens Arabic correctly
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-college-jawwal-winners-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** Print official winners sheet */
  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <div className="w-full bg-[#0A142D]/90 border border-[#E5A93C]/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE894] via-[#E5A93C] to-[#BF8216] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#070D1E] rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#F5BE38]" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>سجل الفائزين المعتمد</span>
              <span className="text-xs bg-[#E5A93C]/20 text-[#FFE894] border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full font-bold">
                {winners.length} فائز
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              نتائج السحب العشوائي الموثقة للكلية الذكية الجامعية وشركة جوال
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#0B1530] border border-[#E5A93C]/30 hover:border-[#E5A93C] text-[#FFE894] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير Excel (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-[#0B1530] border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة المحضر</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('هل أنت متأكد من مسح جميع الفائزين من السجل؟')) {
                soundFx.playClick();
                onClearWinners();
              }
            }}
            className="px-3 py-2 bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs font-semibold rounded-xl hover:bg-rose-900/40 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح السجل</span>
          </button>
        </div>
      </div>

      {/* Winners Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {winners.map((winner, idx) => (
          <div
            key={winner.id}
            className="relative rounded-2xl bg-[#060B18] border border-[#E5A93C]/25 hover:border-[#E5A93C]/60 p-4 transition-all duration-200 group flex flex-col justify-between"
          >
            {/* Top row: Order badge & prize */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#FFE894] text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="text-[11px] text-[#FFE894] font-medium truncate bg-[#0E1938] px-2.5 py-0.5 rounded-md border border-[#E5A93C]/20 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#E5A93C] shrink-0" />
                <span>الفائز بالجائزة</span>
              </span>
            </div>

            {/* Winner Big Number */}
            <div className="my-2">
              <div
                className="font-mono text-2xl sm:text-3xl font-black text-white group-hover:text-[#FFE894] transition-colors tabular-nums"
                dir="ltr"
              >
                {winner.number}
              </div>
              {winner.name && (
                <div className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5 truncate">
                  {winner.name}
                </div>
              )}
            </div>

            {/* Bottom row: Timestamp & action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{new Date(winner.timestamp).toLocaleTimeString('ar-PS')}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onRemoveWinner(winner.id, true)}
                  className="px-2 py-0.5 rounded bg-[#0A1636] border border-amber-600/30 text-amber-300 hover:bg-amber-600/20 text-[10px] flex items-center gap-1"
                  title="إلغاء الفوز وإعادة الرقم إلى صندوق السحب"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>إعادة للصندوق</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveWinner(winner.id, false)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="حذف من السجل نهائياً"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
