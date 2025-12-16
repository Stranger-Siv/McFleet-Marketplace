import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ColdStartLoading from './components/ColdStartLoading';

function App() {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [showColdStart, setShowColdStart] = useState(true);

  const handleBackendReady = () => {
    setIsBackendReady(true);
    setShowColdStart(false);
  };

  // Quick initial check - if backend responds immediately, skip cold start screen
  useEffect(() => {
    const quickCheck = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
        const response = await fetch(`${apiBaseUrl}/api/auth/listings?limit=1`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          // Backend is already ready
          setIsBackendReady(true);
          setShowColdStart(false);
        }
      } catch (error) {
        // Backend not ready, show cold start screen
        // ColdStartLoading component will handle retries
      }
    };

    // Small delay to avoid flash if backend is fast
    const timer = setTimeout(quickCheck, 500);
    return () => clearTimeout(timer);
  }, []);

  if (showColdStart && !isBackendReady) {
    return <ColdStartLoading onReady={handleBackendReady} />;
  }

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
