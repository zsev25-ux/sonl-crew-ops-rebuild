import React from 'react';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card p-4 shadow-sm">
        <h1 className="text-2xl font-semibold">Crew Ops</h1>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
