import React from 'react';

const TrendingStocks = () => {
    const trendingStocks = [
        { id: 1, symbol: 'PEPE', name: 'Pepe', emoji: '🔥' },
        { id: 2, symbol: 'PEPSI', name: 'Pepsi', emoji: '🚀' },
        { id: 3, symbol: 'PEPE', name: 'Pepe', emoji: '⭐' },
        { id: 4, symbol: 'KENDU', name: 'Kendu', emoji: '💫' },
        { id: 5, symbol: 'BULI', name: 'Buli', emoji: '🌟' },
        { id: 6, symbol: 'BULI', name: 'Buli', emoji: '✨' },
        { id: 7, symbol: 'BULI', name: 'Buli', emoji: '💎' },
        { id: 8, symbol: 'BULI', name: 'Buli', emoji: '🚀' },
        { id: 9, symbol: 'BULI', name: 'Buli', emoji: '⚡' },
        { id: 10, symbol: 'BULI', name: 'Buli', emoji: '🌙' },
        { id: 11, symbol: 'BULI', name: 'Buli', emoji: '💎' },
        { id: 12, symbol: 'BULI', name: 'Buli', emoji: '🚀' },
        { id: 13, symbol: 'BULI', name: 'Buli', emoji: '⚡' },
        { id: 14, symbol: 'BULI', name: 'Buli', emoji: '🌙' },
        { id: 15, symbol: 'BULI', name: 'Buli', emoji: '🔮' },
        { id: 16, symbol: 'BULI', name: 'Buli', emoji: '🌙' },
        { id: 17, symbol: 'BULI', name: 'Buli', emoji: '💎' },
        { id: 18, symbol: 'BULI', name: 'Buli', emoji: '🚀' },
        { id: 19, symbol: 'BULI', name: 'Buli', emoji: '⚡' },
        { id: 20, symbol: 'BULI', name: 'Buli', emoji: '🌙' },
        { id: 21, symbol: 'BULI', name: 'Buli', emoji: '🔮' }
    ];

    return (
        <div className="w-full overflow-hidden bg-gray-900 border-b border-gray-800">
            <div className="flex items-center px-4 py-2 space-x-3 min-w-max">
                <div className="flex items-center px-3 py-1.5 lg:px-2 lg:py-1 xl:px-3 xl:py-1.5 text-xs lg:text-xs xl:text-sm computer:text-base text-gray-300 bg-gray-800/50 rounded-lg">
                    <span className="mr-2 lg:mr-1.5 xl:mr-2">🔥</span>
                    <span className="font-medium">Trending</span>
                </div>
                
                {trendingStocks.map((stock, index) => (
                    <div
                        key={stock.id}
                        className="flex items-center bg-gray-800/40 hover:bg-gray-800/60 cursor-pointer transition-all duration-200 rounded-lg px-3 py-1.5 lg:px-2 lg:py-1 xl:px-3 xl:py-1.5 group"
                    >
                        <div className="flex items-center space-x-2 lg:space-x-1.5 xl:space-x-2">
                            <span className="text-gray-500 text-[10px] lg:text-[10px] xl:text-xs computer:text-sm font-medium">#{index + 1}</span>
                            <div className="flex items-center">
                                <span className="text-white font-medium text-xs lg:text-xs xl:text-sm computer:text-base">{stock.symbol}</span>
                                <span className="ml-1.5 lg:ml-1 xl:ml-1.5 text-[10px] lg:text-[10px] xl:text-xs computer:text-sm px-1.5 py-0.5 lg:px-1 lg:py-0.5 xl:px-1.5 xl:py-0.5 bg-gray-700/50 text-gray-300 rounded group-hover:bg-gray-700">
                                    {stock.emoji}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingStocks; 