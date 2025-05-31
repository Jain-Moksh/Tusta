import React, { useState } from 'react';

const SearchBar = ({ onMenuClick, isSidebarExpanded }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
            <div className="flex items-center h-16">
                {/* Hamburger Menu for Mobile */}
                <button 
                    className="md:hidden h-full px-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                    onClick={onMenuClick}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={isSidebarExpanded ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>

                <div className="relative flex-1 max-w-2xl px-4 md:px-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-2 md:mt-0 block w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 h-10 text-[13px] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Search by name or symbol"
                        />
                    </div>
                </div>

                <div className="hidden md:flex items-center pr-6 space-x-3">
                    <button className="h-10 px-4 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 transition-colors flex items-center space-x-2 text-[13px]">
                        <span>All chains</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button className="h-10 px-4 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 transition-colors text-[13px]">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar; 