"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X, Play } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled || pathname !== '/'
            ? 'bg-black/95 shadow-lg'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-red-600 rounded-lg transform rotate-45"></div>
                  <Play className="absolute inset-0 w-5 h-5 m-auto text-white transform translate-x-0.5" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text">
                  AnimeFlow
                </span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-8">
                  <Link
                    href="/"
                    className={`${
                      pathname === '/' 
                        ? 'text-red-500 font-medium' 
                        : 'text-gray-300 hover:text-white'
                    } transition-colors relative group`}
                  >
                    Accueil
                    {pathname === '/' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full"></span>
                    )}
                  </Link>
                  <Link
                    href="/anime-list"
                    className={`${
                      pathname === '/anime-list'
                        ? 'text-red-500 font-medium'
                        : 'text-gray-300 hover:text-white'
                    } transition-colors relative group`}
                  >
                    Liste des Animes
                    {pathname === '/anime-list' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full"></span>
                    )}
                  </Link>
                  <Link
                    href="/my-list"
                    className={`${
                      pathname === '/my-list'
                        ? 'text-red-500 font-medium'
                        : 'text-gray-300 hover:text-white'
                    } transition-colors relative group`}
                  >
                    Ma Liste
                    {pathname === '/my-list' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full"></span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </button>
              <Bell className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">{user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Se connecter
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-black/95">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md ${
                pathname === '/'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/anime-list"
              className={`block px-3 py-2 rounded-md ${
                pathname === '/anime-list'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liste des Animes
            </Link>
            <Link
              href="/my-list"
              className={`block px-3 py-2 rounded-md ${
                pathname === '/my-list'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ma Liste
            </Link>
          </div>
        </div>
      </nav>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}