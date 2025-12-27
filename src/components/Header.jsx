import React from 'react';
import { GitHubIcon } from '../assets/icons';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between bg-gray-800 text-white p-3 z-10">
  <h1 className="font-bold text-2xl pl-10">Task Tracker</h1>
  
  <a 
    href="https://github.com/rohanmzn/techjar-task-tracker" 
    target="_blank" 
    rel="noopener noreferrer"
    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition mr-10"
  >
    <GitHubIcon />
    <span>Code</span>
  </a>
</header>
  );
};

export default Header;