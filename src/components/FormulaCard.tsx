import { useState } from 'react';
import katex from 'katex';
import { Formula } from '../types';

function SafeLatex({ latex, displayMode }: { latex: string; displayMode: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <code className="text-red-400 text-sm bg-red-50 px-1 rounded">{latex}</code>;
  }
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      errorColor: '#dc2626',
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    setFailed(true);
    return <code className="text-red-400 text-sm bg-red-50 px-1 rounded">{latex}</code>;
  }
}

interface Props {
  formula: Formula;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export function FormulaCard({ formula, onFavorite, isFavorite }: Props) {
  const isImportant = formula.importance === '!!!!' || formula.importance === '!!!' || formula.importance === '☆☆☆';
  return (
    <div className={`rounded-lg border p-4 my-3 ${isImportant ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 overflow-x-auto">
          <div className="text-base">
            <SafeLatex latex={formula.latex} displayMode={true} />
          </div>
          {formula.meaning && (
            <p className="mt-2 text-sm text-slate-600">{formula.meaning}</p>
          )}
        </div>
        {onFavorite && (
          <button
            onClick={() => onFavorite(formula.id)}
            className="shrink-0 text-xl leading-none hover:scale-110 transition-transform"
            title={isFavorite ? '取消收藏' : '收藏'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
      </div>
      {formula.importance && (
        <span className="inline-block mt-2 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
          {formula.importance}
        </span>
      )}
    </div>
  );
}
