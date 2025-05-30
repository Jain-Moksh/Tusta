import React from 'react';
import { FaExchangeAlt, FaWater, FaServer, FaRocket } from 'react-icons/fa';
import { BiBarChart } from 'react-icons/bi';
import { MdDashboard } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { GiToken } from 'react-icons/gi';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const menuItems = [
    { icon: FaExchangeAlt, label: 'Swap', active: true },
    { icon: FaWater, label: 'Pools' },
    { icon: FaServer, label: 'Mining' },
    { icon: FaRocket, label: 'Launchpad' },
    { icon: GiToken, label: 'Governance' },
    { icon: BiBarChart, label: 'Dashboard' },
    { icon: MdDashboard, label: 'Developer Portal' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gray-900 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-8 w-8"
        />
        {isExpanded && (
          <span className="ml-3 text-xl font-bold text-white">DODO</span>
        )}
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center px-4 py-3 cursor-pointer ${
              item.active ? 'bg-gray-800' : 'hover:bg-gray-800'
            } ${isExpanded ? 'mx-2 rounded-lg' : ''}`}
          >
            <item.icon
              className={`${
                item.active ? 'text-yellow-500' : 'text-gray-400'
              } text-xl`}
            />
            {isExpanded && (
              <span
                className={`ml-3 ${
                  item.active ? 'text-white' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="absolute bottom-4 w-full px-4">
        <div
          className={`flex items-center cursor-pointer px-4 py-3 hover:bg-gray-800 ${
            isExpanded ? 'mx-2 rounded-lg' : ''
          }`}
        >
          <IoSettingsSharp className="text-gray-400 text-xl" />
          {isExpanded && (
            <span className="ml-3 text-gray-400">More</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 