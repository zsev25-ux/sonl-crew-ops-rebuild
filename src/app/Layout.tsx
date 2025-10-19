import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-midnight-950 text-foreground">
      {/* App Header */}
      <header className="sticky top-0 z-10 h-16 bg-midnight-900 border-b border-border flex items-center px-4">
        <h1 className="text-xl font-bold text-primary">SONL Crew Ops</h1>
      </header>

      {/* Main content area where routes will render */}
      <main className="p-4 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 h-16 bg-midnight-900 border-t border-border">
        <div className="flex items-center justify-around h-full">
          {/* TODO: Add NavLink components here */}
          <p>Route</p>
          <p>Board</p>
          <p>HQ</p>
        </div>
      </nav>
    </div>
  );
}
