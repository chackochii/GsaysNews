'use client';
import React, { useState } from 'react';

const AdminTopBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        window.location.href = '/adminLogin';
    };

    return (
        <header className="bg-gray-900 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/adminLogo.jpg"
                            alt="Admin Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="text-white font-semibold text-lg hidden sm:inline">Admin Panel</span>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex gap-6 lg:gap-8">
                        <a href="/admin/dashboard" className="text-gray-300 font-medium pointer-events-none opacity-50">
                            Dashboard
                        </a>
                        {/* <a href="/admin/users" className="text-gray-300 font-medium pointer-events-none opacity-50">
                            Users
                        </a>
                        <a href="/admin/settings" className="text-gray-300 font-medium pointer-events-none opacity-50">
                            Settings
                        </a> */}
                    </nav>

                    {/* Profile Section - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-gray-300 font-medium">Admin</span>
                        <img
                            src="/admin.jpg"
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover bg-gray-700"
                        />
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
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
                    <div className="md:hidden pb-4 border-t border-gray-700">
                        <nav className="flex flex-col gap-2 py-4">
                            <a
                                href="/adminpage"
                                className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded transition-colors"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                Dashboard
                            </a>
                            {/* <a
                                href="/admin/users"
                                className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Users
                            </a>
                            <a
                                href="/admin/settings"
                                className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Settings
                            </a> */}
                        </nav>
                        <div className="border-t border-gray-700 pt-4 flex flex-col gap-3">
                            <div className="flex items-center gap-3 px-4">
                                <img
                                    src="/admin.jpg"
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover bg-gray-700"
                                />
                                <span className="text-gray-300 font-medium">Admin</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors mx-4"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminTopBar;