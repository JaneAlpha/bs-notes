export interface Formula {
  id: string;
  sectionId: string;
  latex: string;
  meaning?: string;
  importance?: string;
  orderIndex: number;
}

export interface Section {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  formulas: Formula[];
  orderIndex: number;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
  orderIndex: number;
}

export interface NotesDatabase {
  version: string;
  generatedAt: string;
  chapters: Chapter[];
}

export interface ReviewRecord {
  sectionId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string;
}

export interface ReviewState {
  records: Record<string, ReviewRecord>;
}
