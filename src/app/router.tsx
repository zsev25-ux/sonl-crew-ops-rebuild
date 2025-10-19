import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Layout } from './Layout';
import { AuthProvider, useAuth } from './AuthProvider';

// Placeholder Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <p className="text-lg">Loading...</p>
  </div>
);

// Placeholder Login Screen
const LoginScreen = () => (
  <div className="flex items-center justify-center h-screen bg-midnight-950 text-foreground">
    <h1 className="text-2xl animate-pulse">Signing in...</h1>
  </div>
);

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/route" replace />, // default redirect
      },
      {
        path: 'route',
        element: (
          <Suspense fallback={<PageLoader />}>
            <div className="p-4 bg-card rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">Route Page</h2>
              <p>Work for today will show up here.</p>
            </div>
          </Suspense>
        ),
      },
      {
        path: 'schedule',
        element: (
          <Suspense fallback={<PageLoader />}>
            <div className="p-4 bg-card rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">Schedule Page</h2>
              <p>The job calendar will be here.</p>
            </div>
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export { ProtectedRoute, LoginScreen };
