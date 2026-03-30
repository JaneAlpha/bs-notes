import { useState } from 'react';
import { Formula } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Props {
  sectionTitle: string;
  content: string;
  formulas: Formula[];
  onReview: (quality: number) => void;
  isReviewed: boolean;
}

const QUALITY_OPTIONS = [
  { q: 0, label: '0 – 完全遗忘' },
  { q: 1, label: '1 – 错误，记忆模糊' },
  { q: 2, label: '2 – 错误，看到答案才想起' },
  { q: 3, label: '3 – 做对，非常困难' },
  { q: 4, label: '4 – 做对，有难度' },
  { q: 5, label: '5 – 轻松做对' },
];

export function ReviewCard({ sectionTitle, content, formulas, onReview, isReviewed }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-medium">📝 复习：{sectionTitle}</p>
        <p className="text-blue-600 text-sm mt-1">根据记忆回忆要点，然后对照原文检查。</p>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          显示答案
        </button>
      ) : (
        <>
          <div className="prose prose-slate max-w-none">
            <MarkdownRenderer content={content} />
          </div>
          {formulas.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-500 mb-2">公式回顾</h3>
              {formulas.map(f => (
                <div key={f.id} className="bg-slate-50 border border-slate-200 rounded p-3 my-2">
                  <code className="text-sm text-slate-700">{f.latex}</code>
                  {f.meaning && <p className="text-xs text-slate-500 mt-1">{f.meaning}</p>}
                </div>
              ))}
            </div>
          )}
          {isReviewed ? (
            <p className="text-green-600 text-center py-2">✓ 已复习完毕</p>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-slate-600 mb-2">这次回忆的困难程度？</p>
              <div className="grid grid-cols-2 gap-2">
                {QUALITY_OPTIONS.map(({ q, label }) => (
                  <button
                    key={q}
                    onClick={() => onReview(q)}
                    className="py-2 px-3 rounded border border-slate-300 text-sm hover:bg-blue-50 hover:border-blue-400 transition-colors text-left"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
