import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import SearchBar from './components/SearchBar';
import TrendingStocks from './components/TrendingStocks';
import TradingChart from './components/chart/TradingChart';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        {/* Search and Trending Section */}
        <div className="sticky top-0 z-10 bg-gray-900">
          <SearchBar />
          <TrendingStocks />
        </div>

        {/* Main Trading Section */}
        <main className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <TradingChart />
            </div>
            
            {/* Trading Interface */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex justify-between mb-4">
                <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium">
                  Swap
                </button>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                  Limit
                </button>
              </div>

              {/* Trading Form */}
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">You pay</span>
                    <span className="text-gray-400">Balance: 0</span>
                  </div>
                  <div className="flex justify-between">
                    <input 
                      type="text" 
                      className="bg-transparent text-2xl text-white w-1/2 focus:outline-none" 
                      placeholder="0.0"
                    />
                    <button className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
                      <span className="text-white">ETH</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">You receive</span>
                    <span className="text-gray-400">Balance: 0</span>
                  </div>
                  <div className="flex justify-between">
                    <input 
                      type="text" 
                      className="bg-transparent text-2xl text-white w-1/2 focus:outline-none" 
                      placeholder="0.0"
                    />
                    <button className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
                      <span className="text-white">DODO</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button className="w-full py-3 bg-yellow-400 text-black rounded-lg font-medium">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
