import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStore } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(tokenStore.get());

  const signIn = useCallback((t) => {
    tokenStore.set(t);
    setToken(t);
  }, []);
  const signOut = useCallback(() => {
    tokenStore.clear();
    setToken(null);
  }, []);

  useEffect(() => {
    window.addEventListener('veloop:logout', signOut);
    return () => window.removeEventListener('veloop:logout', signOut);
  }, [signOut]);

  const value = useMemo(() => ({ token, signIn, signOut }), [token, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
