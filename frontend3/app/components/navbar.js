'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // ✅ lightweight icon package (lucide-react)

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ mobile toggle
  const baseUrl = process.env.NEXT_PUBLIC_BE_BASE_URL || 'http://localhost:5010';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/news/categories`);
        if (response.status === 200 && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error.message);
      }
    };

    fetchCategories();
  }, [baseUrl]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLinkClick = () => {
    setMenuOpen(false); // ✅ close menu on click
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src="/Gsay.png" alt="Logo" className="h-12 w-auto" />
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-sm font-medium">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`#${cat.toLowerCase()}`}
                    className="hover:text-yellow-300 transition-colors duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-300 italic">Loading...</li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700 shadow-lg">
          <ul className="flex flex-col p-4 space-y-3 text-sm font-medium">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`#${cat.toLowerCase()}`}
                    onClick={handleLinkClick}
                    className="block py-2 px-3 rounded-md hover:bg-gray-700 hover:text-yellow-300 transition-all duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-300 italic px-3">Loading...</li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;