import React from 'react';
import { Settings, Bot, FileText, Key, LayoutTemplate, Folder, Search } from 'lucide-react';
import { BrandIcon } from './IconComponents';
import { twMerge } from 'tailwind-merge';

interface AppSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const navItems = [
  { id: 'editor', label: 'Main Editor', icon: FileText, active: true },
  { id: 'ai-feed', label: 'AI Feed', icon: Bot, active: true },
  { id: 'ai-settings', label: 'AI Settings', icon: Settings, active: true },
  { id: 'key-info', label: 'Key Information', icon: Key, active: false },
  { id: 'template', label: 'Template & Design', icon: LayoutTemplate, active: false },
  { id: 'my-docs', label: 'My CV Documents', icon: Folder, active: false },
  { id: 'job-search', label: 'Job Search', icon: Search, active: false },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
        <BrandIcon />
        <h1 className="text-xl font-bold">CV Builder</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActivePage(item.active ? item.id : 'coming-soon')}
                className={twMerge(
                  'w-full flex items-center p-3 rounded-lg text-left transition-colors',
                  activePage === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                  !item.active && 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
                {!item.active && (
                  <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2024 CV Builder MVP</p>
      </div>
    </div>
  );
};

export default AppSidebar;
