import React, { createContext, useContext, useEffect, useState } from 'react';
// Correctly import User from the main 'firebase/auth' entry point
import { onAuthStateChanged, type User } from 'firebase/auth'; 
import { auth, ensureAnonAuth } from '../shared/lib/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    ensureAnonAuth().catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      setUser(user);

      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true); 
          const userRole = (idTokenResult.claims.role as string) || 'crew'; 
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

  const value = { user, isLoading, role };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
