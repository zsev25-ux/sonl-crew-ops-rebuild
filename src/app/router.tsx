import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Layout } from './Layout';
import { useAuth } from './AuthProvider';

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <p className="text-lg">Loading...</p>
  </div>
);

const LoginScreen = () => (
  <div className="flex items-center justify-center h-screen bg-midnight-950 text-foreground">
    <h1 className="text-2xl animate-pulse">Signing in...</h1>
  </div>
);

const RoutePage = lazy(async () => ({
  default: () => <div>Route Page Placeholder</div>,
}));

const SchedulePage = lazy(async () => ({
  default: () => <div>Schedule Page Placeholder</div>,
}));

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoginScreen />;
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
        element: <Navigate to="/route" replace />,
      },
      {
        path: 'route',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoutePage />
          </Suspense>
        ),
      },
      {
        path: 'schedule',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SchedulePage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
