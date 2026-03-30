export interface SM2Input {
  quality: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface SM2Output {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
}

export function sm2(input: SM2Input): SM2Output {
  const { quality, easeFactor, interval, repetitions } = input;

  let newEF = easeFactor;
  let newInterval = interval;
  let newReps = repetitions;

  if (quality < 3) {
    newReps = 0;
    newInterval = 1;
  } else {
    if (newReps === 0) {
      newInterval = 1;
    } else if (newReps === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newReps += 1;
  }

  newEF = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const next = new Date();
  next.setDate(next.getDate() + newInterval);

  return {
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newReps,
    nextReview: next.toISOString(),
  };
}

export function qualityLabel(q: number): string {
  if (q === 0) return '完全遗忘';
  if (q === 1) return '错误，记忆模糊';
  if (q === 2) return '错误，但看到答案后想起';
  if (q === 3) return '做对，但非常困难';
  if (q === 4) return '做对，有一定难度';
  return '轻松做对';
}
