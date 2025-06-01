import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import SearchBar from './components/SearchBar';
import TrendingStocks from './components/TrendingStocks';
import TradingChart from './components/chart/TradingChart';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [trendlines, setTrendlines] = useState([]);
  const [currentOHLC, setCurrentOHLC] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState({
    start: null,
    end: null
  });

  const handleTrendlinesUpdate = (newTrendlines) => {
    setTrendlines(newTrendlines);
  };

  const handleOHLCUpdate = (ohlcData) => {
    setCurrentOHLC(ohlcData);
  };

  const handleCoordinatesUpdate = (coordinates) => {
    setClickedCoordinates(coordinates);
  };

  const clearCoordinates = () => {
    setClickedCoordinates({
      start: null,
      end: null
    });
  };

  return (
    <div className="min-h-screen fixed inset-0 overflow-auto pb-24">  
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          isSidebarExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarExpanded(false)}
      />

      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white md:hidden"
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
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

      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarExpanded ? 'md:ml-48 lg:ml-64' : 'md:ml-16 lg:ml-24'}`}>
        {/* Search and Trending Section */}
        <div className="sticky top-0 z-10">
          <SearchBar 
            onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            isSidebarExpanded={isSidebarExpanded}
          />
          <TrendingStocks />
        </div>

        {/* Main Trading Section */}
        <main className="p-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {/* Chart Section */}
            <div className="lg:col-span-8 h-full">
              <div className="bg-gray-900 rounded-lg h-fit computer:h-[85vh] w-full">
                <TradingChart 
                  // onTrendlinesUpdate={handleTrendlinesUpdate}
                  // onOHLCUpdate={handleOHLCUpdate}
                  // onCoordinatesUpdate={handleCoordinatesUpdate}
                  // clickedCoordinates={clickedCoordinates}
                />
              </div>
            </div>
            
            {/* Trading Interface */}
            <div className="lg:col-span-4 h-full">
              <div className="bg-gray-900 rounded-lg p-3 h-[500px] computer:h-[85vh] w-full flex flex-col">
                <div className="flex justify-between mb-4">
                  <button className="px-3 py-1.5 lg:px-3 lg:py-2 xl:px-4 xl:py-2 bg-yellow-400 text-black rounded-lg font-medium text-[10px] lg:text-sm xl:text-base computer:text-lg">
                    Swap
                  </button>
                  <button className="px-3 py-1.5 lg:px-3 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white rounded-lg text-[10px] lg:text-sm xl:text-base computer:text-lg">
                    Limit
                  </button>
                </div>

                {/* Trading Form */}
                <div className="flex-1 flex flex-col space-y-3 lg:space-y-4">
                  <div className="bg-gray-800 rounded-lg p-3 lg:p-4 xl:p-4">
                    <div className="flex justify-between mb-1.5 lg:mb-2">
                      <span className="text-gray-400 text-[10px] lg:text-sm xl:text-sm computer:text-base">You pay</span>
                      <span className="text-gray-400 text-[10px] lg:text-sm xl:text-sm computer:text-base">Balance: 1.245 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <input 
                        type="text" 
                        className="bg-transparent text-lg lg:text-xl xl:text-2xl computer:text-2xl text-white w-1/2 focus:outline-none" 
                        placeholder="0.0"
                        value="55.5"
                      />
                      <button className="flex items-center space-x-1.5 lg:space-x-2 bg-gray-700 px-2 py-1 lg:px-3 lg:py-1.5 xl:px-3 xl:py-1.5 rounded-lg">
                        <span className="text-white text-[10px] lg:text-sm xl:text-base computer:text-lg">ETH</span>
                        <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3 lg:p-4 xl:p-4">
                    <div className="flex justify-between mb-1.5 lg:mb-2">
                      <span className="text-gray-400 text-[10px] lg:text-sm xl:text-sm computer:text-base">You receive</span>
                      <span className="text-gray-400 text-[10px] lg:text-sm xl:text-sm computer:text-base">Balance: 1000 DODO</span>
                    </div>
                    <div className="flex justify-between">
                      <input 
                        type="text" 
                        className="bg-transparent text-lg lg:text-xl xl:text-2xl computer:text-2xl text-white w-1/2 focus:outline-none" 
                        placeholder="0.0"
                        value="750.25"
                      />
                      <button className="flex items-center space-x-1.5 lg:space-x-2 bg-gray-700 px-2 py-1 lg:px-3 lg:py-1.5 xl:px-3 xl:py-1.5 rounded-lg">
                        <span className="text-white text-[10px] lg:text-sm xl:text-base computer:text-lg">DODO</span>
                        <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button className="w-full py-2.5 lg:py-3 xl:py-3 bg-yellow-400 text-black rounded-lg font-medium text-[10px] lg:text-sm xl:text-base computer:text-lg">
                    Connect Wallet
                  </button>

                  {/* Chart Info Section */}
                  <div className="bg-gray-800 rounded-lg p-3 lg:p-4 xl:p-4">
                    <div className="flex justify-between mb-2 lg:mb-2 xl:mb-3">
                      <span className="text-gray-400 text-[10px] lg:text-sm xl:text-base computer:text-lg">Chart Information</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 lg:gap-3 xl:gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-2 lg:p-3 xl:p-3">
                        <div className="text-[10px] lg:text-sm xl:text-sm computer:text-base text-gray-400 mb-1">Current Price</div>
                        <div className="text-sm lg:text-base xl:text-lg computer:text-xl text-white">$1,234.56</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2 lg:p-3 xl:p-3">
                        <div className="text-[10px] lg:text-sm xl:text-sm computer:text-base text-gray-400 mb-1">24h Change</div>
                        <div className="text-sm lg:text-base xl:text-lg computer:text-xl text-green-500">+2.45%</div>
                      </div>
                    </div>
                  </div>

                  {/* Trendline Coordinates for Small Screens (below 1024px) */}
                  
                  {/* Trendline Coordinates for Computer Screens */}
                 

                  {/* OHLC Information */}
                  <div className="bg-gray-800 rounded-lg p-3 lg:p-4 xl:p-4">
                    <div className="flex justify-between mb-2 lg:mb-2 xl:mb-3">
                      <span className="text-gray-400 text-[10px] lg:text-sm xl:text-base computer:text-lg">OHLC Information</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 lg:gap-3 xl:gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-2 lg:p-3 xl:p-3">
                        <div className="text-[10px] lg:text-sm xl:text-sm computer:text-base text-gray-400 mb-1">Open</div>
                        <div className="text-[11px] lg:text-base xl:text-lg computer:text-xl text-white">${currentOHLC?.open?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2 lg:p-3 xl:p-3">
                        <div className="text-[10px] lg:text-sm xl:text-sm computer:text-base text-gray-400 mb-1">High</div>
                        <div className="text-[11px] lg:text-base xl:text-lg computer:text-xl text-green-500">${currentOHLC?.high?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2 lg:p-3 xl:p-3">
                        <div className="text-[10px] lg:text-sm xl:text-sm computer:text-base text-gray-400 mb-1">Low</div>
                        <div className="text-[11px] lg:text-base xl:text-lg computer:text-xl text-red-500">${currentOHLC?.low?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2 lg:p-3 xl:p-3">
                        <div className="text-[10px] lg:text-sm xl:text-sm computer:text-base text-gray-400 mb-1">Close</div>
                        <div className="text-[11px] lg:text-base xl:text-lg computer:text-xl text-white">${currentOHLC?.close?.toFixed(2) || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Market Summary for Small Screens (below 1024px) */}
                  <div className="block lg:hidden bg-gray-800 rounded-lg p-3 mt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 text-[10px]">Market Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <div className="text-[10px] text-gray-400 mb-1">Symbol</div>
                        <div className="text-[11px] text-white">ETH/USDT</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <div className="text-[10px] text-gray-400 mb-1">Interval</div>
                        <div className="text-[11px] text-white">1D</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <div className="text-[10px] text-gray-400 mb-1">Exchange</div>
                        <div className="text-[11px] text-white">Binance</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <div className="text-[10px] text-gray-400 mb-1">Last Updated</div>
                        <div className="text-[11px] text-white">
                          {currentOHLC ? new Date(currentOHLC.timestamp).toLocaleTimeString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Summary for Computer Screens */}
                  <div className="hidden computer:block bg-gray-800 rounded-lg p-4 lg:p-3 xl:p-4 mt-4">
                    <div className="flex justify-between mb-3 lg:mb-2 xl:mb-3">
                      <span className="text-gray-400 text-base lg:text-sm xl:text-base computer:text-lg">Market Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
                        <div className="text-sm lg:text-xs xl:text-sm computer:text-base text-gray-400 mb-1">Symbol</div>
                        <div className="text-lg lg:text-base xl:text-lg computer:text-xl text-white">ETH/USDT</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
                        <div className="text-sm lg:text-xs xl:text-sm computer:text-base text-gray-400 mb-1">Interval</div>
                        <div className="text-lg lg:text-base xl:text-lg computer:text-xl text-white">1D</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
                        <div className="text-sm lg:text-xs xl:text-sm computer:text-base text-gray-400 mb-1">Exchange</div>
                        <div className="text-lg lg:text-base xl:text-lg computer:text-xl text-white">Binance</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
                        <div className="text-sm lg:text-xs xl:text-sm computer:text-base text-gray-400 mb-1">Last Updated</div>
                        <div className="text-lg lg:text-base xl:text-lg computer:text-xl text-white">
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
