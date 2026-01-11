import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GetProfile, LoginUser, RegisterUser, UpdateProfile } from "../api";

const AuthContext = createContext(null);

const storageKey = "urlshortener.auth";

const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.token) {
      setToken(stored.token);
      setUser(stored.user ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(storageKey);
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify({ token, user }));
  }, [token, user]);

  const refreshProfile = async () => {
    if (!token) return null;
    const profile = await GetProfile(token);
    setUser(profile);
    return profile;
  };

  const login = async (payload) => {
    const data = await LoginUser(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await RegisterUser(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const updateProfile = async (payload) => {
    const data = await UpdateProfile(payload, token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(storageKey);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
