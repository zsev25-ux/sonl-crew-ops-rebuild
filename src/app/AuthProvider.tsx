import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, ensureAnonAuth } from '../shared/lib/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  role: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    ensureAnonAuth().catch((error) => {
      console.error('Failed to ensure anonymous authentication:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setIsLoading(true);
      setUser(nextUser);

      if (nextUser) {
        try {
          const idTokenResult = await nextUser.getIdTokenResult(true);
          const userRole = (idTokenResult.claims.role as string | undefined) ?? 'crew';
          setRole(userRole);
        } catch (error) {
          console.error('Error getting user role:', error);
          setRole('crew');
        }
      } else {
        setRole(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      role,
    }),
    [isLoading, role, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
