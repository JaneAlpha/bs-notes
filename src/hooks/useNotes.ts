import { useState, useEffect } from 'react';
import { NotesDatabase } from '../types';

let cachedDb: NotesDatabase | null = null;

export function useNotes() {
  const [db, setDb] = useState<NotesDatabase | null>(cachedDb);
  const [loading, setLoading] = useState(!cachedDb);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedDb) return;
    fetch('./notes.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: NotesDatabase) => {
        cachedDb = data;
        setDb(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { db, loading, error };
}
