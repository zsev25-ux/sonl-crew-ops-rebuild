import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

type AuthContextValue = {
  user: { id: string; name: string } | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockUser = {
  id: 'demo-user',
  name: 'Demo User',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const value = useMemo(() => ({ user, isLoading }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
