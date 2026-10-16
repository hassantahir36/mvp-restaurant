import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(undefined);
const TOKEN_KEY = '@restaurant/token';
const USER_KEY = '@restaurant/user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const [[, savedToken], [, savedUser]] = await AsyncStorage.multiGet([
          TOKEN_KEY,
          USER_KEY,
        ]);

        if (active && savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.warn('Could not restore login:', error);
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const result = await api.login(email, password);
      await AsyncStorage.multiSet([
        [TOKEN_KEY, result.token],
        [USER_KEY, JSON.stringify(result.user)],
      ]);
      setToken(result.token);
      setUser(result.user);
      return true;
    } catch (error) {
      return { success: false, message: error.message || 'Login failed.' };
    }
  }, []);

  const signup = useCallback(async (details) => {
    try {
      await api.register({
        name: details.name,
        email: details.email,
        password: details.password,
      });

      const result = await api.login(details.email, details.password);

      await AsyncStorage.multiSet([
        [TOKEN_KEY, result.token],
        [USER_KEY, JSON.stringify(result.user)],
      ]);

      setToken(result.token);
      setUser(result.user);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Signup failed.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthLoading,
    login,
    signup,
    logout,
  }), [user, token, isAuthLoading, login, signup, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}