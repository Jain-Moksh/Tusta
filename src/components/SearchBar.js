import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="w-full bg-gray-900 border-b border-gray-800">
            <div className="flex items-center px-4 py-3">
                <div className="relative flex-1 max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search by symbol or address"
                    />
                </div>
                <div className="ml-4 flex items-center space-x-4">
                    <button className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center">
                        <span>All chains</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar; 