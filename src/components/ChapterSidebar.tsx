import { Chapter } from '../types';

interface Props {
  chapters: Chapter[];
  activeSectionId: string | null;
  dueSectionIds: Set<string>;
  onSelect: (sectionId: string) => void;
}

export function ChapterSidebar({ chapters, activeSectionId, dueSectionIds, onSelect }: Props) {
  return (
    <nav className="w-64 shrink-0 bg-slate-50 border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-sm font-bold text-slate-700">📚 笔记BS系统</h1>
      </div>
      {chapters.map(ch => (
        <div key={ch.id} className="border-b border-slate-200 last:border-b-0">
          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-100">
            {ch.title}
          </div>
          {ch.sections.map(sec => {
            const isActive = sec.id === activeSectionId;
            const isDue = dueSectionIds.has(sec.id);
            return (
              <button
                key={sec.id}
                onClick={() => onSelect(sec.id)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex-1 truncate">{sec.title}</span>
                {isDue && (
                  <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" title="待复习" />
                )}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
