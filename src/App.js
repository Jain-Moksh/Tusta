import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import SearchBar from './components/SearchBar';
import TrendingStocks from './components/TrendingStocks';
import TradingChart from './components/chart/TradingChart';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [trendlines, setTrendlines] = useState([]);
  const [currentOHLC, setCurrentOHLC] = useState(null);

  const handleTrendlinesUpdate = (newTrendlines) => {
    setTrendlines(newTrendlines);
  };

  const handleOHLCUpdate = (ohlcData) => {
    setCurrentOHLC(ohlcData);
  };

  return (
    <div className="min-h-screen fixed inset-0 overflow-auto">  
      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        {/* Search and Trending Section */}
        <div className="sticky top-0 z-10">
          <SearchBar />
          <TrendingStocks />
        </div>

        {/* Main Trading Section */}
        <main className="p-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-8 h-full">
              <div className="bg-gray-900  rounded-lg h-[500px] 2xl:h-[85vh] w-full">
                <TradingChart 
                  onTrendlinesUpdate={handleTrendlinesUpdate}
                  onOHLCUpdate={handleOHLCUpdate}
                />
              </div>
            </div>
            
            {/* Trading Interface */}
            <div className="lg:col-span-4 h-full ">
              <div className="bg-gray-900 rounded-lg p-4 h-[500px] 2xl:h-[85vh] w-full flex flex-col">
                <div className="flex justify-between mb-4">
                  <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium">
                    Swap
                  </button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                    Limit
                  </button>
                </div>

                {/* Trading Form */}
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">You pay</span>
                      <span className="text-gray-400">Balance: 1.245 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <input 
                        type="text" 
                        className="bg-transparent text-2xl text-white w-1/2 focus:outline-none" 
                        placeholder="0.0"
                        value="55.5"
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
                      <span className="text-gray-400">Balance: 1000 DODO</span>
                    </div>
                    <div className="flex justify-between">
                      <input 
                        type="text" 
                        className="bg-transparent text-2xl text-white w-1/2 focus:outline-none" 
                        placeholder="0.0"
                        value="750.25"
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

                  {/* Chart Info Section */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400">Chart Information</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Current Price</div>
                        <div className="text-lg text-white">$1,234.56</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">24h Change</div>
                        <div className="text-lg text-green-500">+2.45%</div>
                      </div>
                    </div>
                  </div>

                  {/* OHLC Information */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400">OHLC Information</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Open</div>
                        <div className="text-lg text-white">${currentOHLC?.open?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">High</div>
                        <div className="text-lg text-green-500">${currentOHLC?.high?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Low</div>
                        <div className="text-lg text-red-500">${currentOHLC?.low?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Close</div>
                        <div className="text-lg text-white">${currentOHLC?.close?.toFixed(2) || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Market Summary for Computer Screens */}
                  <div className="hidden 2xl:block bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400">Market Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Symbol</div>
                        <div className="text-lg text-white">ETH/USDT</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Interval</div>
                        <div className="text-lg text-white">1D</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Exchange</div>
                        <div className="text-lg text-white">Binance</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                        <div className="text-lg text-white">
                          {currentOHLC ? new Date(currentOHLC.timestamp).toLocaleTimeString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
