import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';

function App({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WatchlistProvider>
        {children}
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;