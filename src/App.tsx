import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';
import AnimeList from './pages/AnimeList';
import MyList from './pages/MyList';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Router>
          <div className="min-h-screen bg-[#141414]">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/anime-list" element={<AnimeList />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;