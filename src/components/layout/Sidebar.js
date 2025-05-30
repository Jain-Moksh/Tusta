import React from 'react';
import { HomeIcon, ChartBarIcon, CogIcon, WalletIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const menuItems = [
    { icon: HomeIcon, label: 'Dashboard' },
    { icon: ChartBarIcon, label: 'Trading' },
    { icon: WalletIcon, label: 'Wallet' },
    { icon: CogIcon, label: 'Settings' },
  ];

  return (
    <div 
      className={`h-screen bg-gray-900 fixed left-0 top-0 flex flex-col py-6 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center mb-6 px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
          {isExpanded && (
            <span className="ml-3 text-white font-semibold text-lg">Trading App</span>
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-3 mb-6">
        <div className={`flex items-center p-3 rounded-xl bg-gray-800 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <div className="relative">
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          {isExpanded && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">Pro Trader</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2 px-3 flex-grow">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-center p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ${
              isExpanded ? 'justify-start' : 'justify-center'
            }`}
          >
            <item.icon className="w-6 h-6 min-w-6" />
            {isExpanded && (
              <span className="ml-3 text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="px-3 mt-auto pt-6 border-t border-gray-800">
        <button
          className={`flex items-center w-full p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ${
            isExpanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 min-w-6" />
          {isExpanded && (
            <span className="ml-3 text-sm font-medium whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 