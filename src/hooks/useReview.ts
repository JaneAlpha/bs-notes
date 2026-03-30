import { useState, useCallback } from 'react';
import {
  ReviewState,
  loadReviewState,
  submitReview,
  isDue,
  getProgress,
} from '../lib/reviewStorage';

export function useReview() {
  const [state, setState] = useState<ReviewState>(() => loadReviewState());

  const review = useCallback((sectionId: string, quality: number) => {
    const updated = submitReview(state, sectionId, quality);
    setState((prev: ReviewState) => ({ ...prev, records: { ...prev.records, [sectionId]: updated } }));
  }, [state]);

  const checkDue = useCallback((sectionId: string) => isDue(state, sectionId), [state]);

  const progress = useCallback(
    (sectionIds: string[]) => getProgress(state, sectionIds),
    [state]
  );

  return { state, review, checkDue, progress };
}
