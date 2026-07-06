import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginUser, logoutUser, registerUser } from '../services/authService.js';

const AuthContext = createContext(null);
const tokenKey = 'taskflow_token';
const userKey = 'taskflow_user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(userKey));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState(readStoredUser);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(localStorage.getItem(tokenKey)));

  const persistSession = useCallback((session) => {
    localStorage.setItem(tokenKey, session.token);
    localStorage.setItem(userKey, JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    let isMounted = true;

    getProfile()
      .then(({ user: profile }) => {
        if (isMounted) {
          localStorage.setItem(userKey, JSON.stringify(profile));
          setUser(profile);
        }
      })
      .catch(() => {
        if (isMounted) {
          clearSession();
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [clearSession, token]);

  const login = useCallback(async (payload) => {
    const session = await loginUser(payload);
    persistSession(session);
    return session;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const session = await registerUser(payload);
    persistSession(session);
    return session;
  }, [persistSession]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutUser();
      }
    } finally {
      clearSession();
    }
  }, [clearSession, token]);

  const updateLocalUser = useCallback((updates) => {
    setUser((current) => {
      const nextUser = { ...current, ...updates };
      localStorage.setItem(userKey, JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const value = useMemo(() => ({
    clearSession,
    isAuthenticated: Boolean(token && user),
    isBootstrapping,
    login,
    logout,
    register,
    token,
    updateLocalUser,
    user
  }), [clearSession, isBootstrapping, login, logout, register, token, updateLocalUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
