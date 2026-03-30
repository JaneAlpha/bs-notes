import { useState, useEffect, useCallback } from 'react';
import { Chapter, Section } from './types';
import { useNotes } from './hooks/useNotes';
import { useReview } from './hooks/useReview';
import { useAuth } from './hooks/useAuth';
import { ChapterSidebar } from './components/ChapterSidebar';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { FormulaCard } from './components/FormulaCard';
import { ReviewCard } from './components/ReviewCard';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SectionErrorBoundary } from './components/ErrorBoundary';
import { getDueSectionIds } from './lib/reviewStorage';

type View = 'read' | 'review';

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">📚 笔记BS系统</h1>
        <p className="text-slate-500 mb-6">登录后同步复习进度</p>
        <button
          onClick={onLogin}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          使用 Google 登录
        </button>
        <p className="text-xs text-slate-400 mt-4">暂不登录也可浏览笔记（进度不保存）</p>
      </div>
    </div>
  );
}

function SectionView({
  section,
  onReview,
  isReviewed,
}: {
  section: Section;
  onReview: (q: number) => void;
  isReviewed: boolean;
}) {
  const [view, setView] = useState<View>('read');
  return (
    <div>
      <div className="flex gap-2 mb-4 border-b border-slate-200 pb-3">
        <button
          onClick={() => setView('read')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            view === 'read' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          阅读
        </button>
        <button
          onClick={() => setView('review')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
            view === 'review' ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          复习 {isReviewed && '✓'}
        </button>
      </div>

      <SectionErrorBoundary>
        {view === 'read' ? (
          <div>
            <div className="prose prose-slate max-w-none">
              <MarkdownRenderer content={section.content} />
            </div>
            {section.formulas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-500 mb-2">本章公式</h3>
                {section.formulas.map(f => (
                  <FormulaCard key={f.id} formula={f} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <ReviewCard
            sectionTitle={section.title}
            content={section.content}
            formulas={section.formulas}
            onReview={onReview}
            isReviewed={isReviewed}
          />
        )}
      </SectionErrorBoundary>
    </div>
  );
}

function findSection(chapters: Chapter[], id: string): Section | null {
  for (const ch of chapters) {
    for (const sec of ch.sections) {
      if (sec.id === id) return sec;
    }
  }
  return null;
}

export default function App() {
  const { db, loading, error } = useNotes();
  const { user, loginWithGoogle } = useAuth();
  const { state: reviewState, review } = useReview();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (db && !activeSectionId) {
      const first = db.chapters[0]?.sections[0];
      if (first) setActiveSectionId(first.id);
    }
  }, [db, activeSectionId]);

  const allSectionIds = db ? db.chapters.flatMap(ch => ch.sections.map(s => s.id)) : [];
  const dueSectionIds = getDueSectionIds(reviewState, allSectionIds);
  const learnedSectionIds = allSectionIds.filter(
    id => reviewState.records[id] && reviewState.records[id].repetitions > 0
  );
  const activeSection = db && activeSectionId ? findSection(db.chapters, activeSectionId) : null;
  const isReviewed = activeSectionId ? !!reviewState.records[activeSectionId] : false;

  const handleReview = useCallback((quality: number) => {
    if (activeSectionId) review(activeSectionId, quality);
  }, [activeSectionId, review]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        加载笔记中...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        加载失败: {error}
      </div>
    );
  }
  if (!db) return null;

  if (!user) {
    return <AuthScreen onLogin={loginWithGoogle} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ChapterSidebar
        chapters={db.chapters}
        activeSectionId={activeSectionId}
        dueSectionIds={new Set(dueSectionIds)}
        onSelect={setActiveSectionId}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <ProgressDashboard
            chapters={db.chapters}
            dueSectionIds={dueSectionIds}
            learnedSectionIds={learnedSectionIds}
          />
          {activeSection ? (
            <SectionView
              section={activeSection}
              onReview={handleReview}
              isReviewed={isReviewed}
            />
          ) : (
            <p className="text-slate-400 text-center mt-8">在左侧选择一个小节开始学习</p>
          )}
        </div>
      </main>
    </div>
  );
}
