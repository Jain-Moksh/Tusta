import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ isSidebarExpanded }) => {
  return (
    <header 
      className={`h-16 bg-gray-900 fixed top-0 right-0 flex items-center justify-between px-6 border-b border-gray-800 transition-all duration-300 ${
        isSidebarExpanded ? 'left-64' : 'left-20'
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white">Trading Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
          <BellIcon className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
          <UserCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header; 