import { AuthProvider } from './app/AuthProvider';
import { AppRouter } from './app/router';

// This component now just wraps the app in providers and renders the router.
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
