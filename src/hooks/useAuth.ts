import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const FIREBASE_ENABLED = !!import.meta.env.VITE_FIREBASE_API_KEY &&
  !import.meta.env.VITE_FIREBASE_API_KEY.startsWith('demo');

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!FIREBASE_ENABLED || !auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email: string, password: string) =>
    auth ? signInWithEmailAndPassword(auth, email, password) : Promise.reject();

  const register = (email: string, password: string) =>
    auth ? createUserWithEmailAndPassword(auth, email, password) : Promise.reject();

  const loginWithGoogle = () =>
    auth ? signInWithPopup(auth, new GoogleAuthProvider()) : Promise.reject();

  const logout = () => auth ? signOut(auth) : Promise.reject();

  return { user, loading, login, register, loginWithGoogle, logout };
}
