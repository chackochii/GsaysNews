'use client';
import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 👇 This function will handle smooth scrolling
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false); // close mobile menu
    }
  };

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src="/Gsay.png" alt="Logo" className="h-16 w-36" />
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 lg:gap-8 text-gray-400 font-medium">
            <li onClick={() => scrollToSection("news")} className="hover:text-blue-600 cursor-pointer transition-colors">News</li>
            <li onClick={() => scrollToSection("fashion")} className="hover:text-blue-600 cursor-pointer transition-colors">Fashion</li>
            <li onClick={() => scrollToSection("gadgets")} className="hover:text-blue-600 cursor-pointer transition-colors">Gadgets</li>
            <li onClick={() => scrollToSection("lifestyle")} className="hover:text-blue-600 cursor-pointer transition-colors">Lifestyle</li>
            <li onClick={() => scrollToSection("trendingnews")} className="hover:text-blue-600 cursor-pointer transition-colors">Trending</li>
          </ul>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-blue-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col gap-3 text-gray-400 font-medium">
              <li onClick={() => scrollToSection("news")} className="hover:text-blue-600 cursor-pointer transition-colors py-2 border-b border-gray-100">News</li>
              <li onClick={() => scrollToSection("fashion")} className="hover:text-blue-600 cursor-pointer transition-colors py-2 border-b border-gray-100">Fashion</li>
              <li onClick={() => scrollToSection("gadgets")} className="hover:text-blue-600 cursor-pointer transition-colors py-2 border-b border-gray-100">Gadgets</li>
              <li onClick={() => scrollToSection("lifestyle")} className="hover:text-blue-600 cursor-pointer transition-colors py-2 border-b border-gray-100">Lifestyle</li>
              <li onClick={() => scrollToSection("video")} className="hover:text-blue-600 cursor-pointer transition-colors py-2">Video</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
