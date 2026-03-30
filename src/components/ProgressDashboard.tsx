import { Chapter } from '../types';

interface Props {
  chapters: Chapter[];
  dueSectionIds: string[];
  learnedSectionIds: string[];
}

export function ProgressDashboard({ chapters, dueSectionIds, learnedSectionIds }: Props) {
  const total = chapters.reduce((sum, ch) => sum + ch.sections.length, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
      <h2 className="text-sm font-semibold text-slate-600 mb-3">复习进度</h2>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-slate-50 rounded">
          <div className="text-2xl font-bold text-slate-800">{total}</div>
          <div className="text-xs text-slate-500">全部小节</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded">
          <div className="text-2xl font-bold text-orange-600">{dueSectionIds.length}</div>
          <div className="text-xs text-slate-500">待复习</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded">
          <div className="text-2xl font-bold text-green-600">{learnedSectionIds.length}</div>
          <div className="text-xs text-slate-500">已掌握</div>
        </div>
      </div>

      <div className="space-y-2">
        {chapters.map(ch => {
          const chTotal = ch.sections.length;
          const chLearned = ch.sections.filter(s => learnedSectionIds.includes(s.id)).length;
          const pct = chTotal > 0 ? Math.round((chLearned / chTotal) * 100) : 0;
          return (
            <div key={ch.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 truncate mr-2">{ch.title}</span>
                <span className="text-slate-400">{chLearned}/{chTotal} · {pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
