import React from 'react';
import { Construction } from 'lucide-react';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-fade-in">
      <Construction className="w-24 h-24 text-yellow-500 dark:text-yellow-400 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Coming Soon!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        We are still working on this feature. It will be available as soon as possible.
      </p>
    </div>
  );
};

export default ComingSoonPage;
