import { ReviewRecord, ReviewState } from '../types';
export type { ReviewState };
import { sm2 } from './sm2';

const STORAGE_KEY = 'bs-notes-review-v1';

function defaultRecord(sectionId: string): ReviewRecord {
  return {
    sectionId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastReview: '',
  };
}

export function loadReviewState(): ReviewState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { records: {} };
    return JSON.parse(raw) as ReviewState;
  } catch {
    return { records: {} };
  }
}

export function saveReviewState(state: ReviewState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getRecord(state: ReviewState, sectionId: string): ReviewRecord {
  return state.records[sectionId] ?? defaultRecord(sectionId);
}

export function isDue(state: ReviewState, sectionId: string): boolean {
  const record = getRecord(state, sectionId);
  return new Date(record.nextReview) <= new Date();
}

export function submitReview(
  state: ReviewState,
  sectionId: string,
  quality: number
): ReviewRecord {
  const prev = getRecord(state, sectionId);
  const updated = sm2({
    quality,
    easeFactor: prev.easeFactor,
    interval: prev.interval,
    repetitions: prev.repetitions,
  });

  const record: ReviewRecord = {
    sectionId,
    easeFactor: updated.easeFactor,
    interval: updated.interval,
    repetitions: updated.repetitions,
    nextReview: updated.nextReview,
    lastReview: new Date().toISOString(),
  };

  const next: ReviewState = {
    records: { ...state.records, [sectionId]: record },
  };
  saveReviewState(next);
  return record;
}

export function getDueSectionIds(state: ReviewState, sectionIds: string[]): string[] {
  return sectionIds.filter(id => isDue(state, id));
}

export function getProgress(
  state: ReviewState,
  sectionIds: string[]
): { total: number; due: number; learned: number } {
  const total = sectionIds.length;
  const due = getDueSectionIds(state, sectionIds).length;
  const learned = Object.keys(state.records).filter(
    id => sectionIds.includes(id) && state.records[id].repetitions > 0
  ).length;
  return { total, due, learned };
}
