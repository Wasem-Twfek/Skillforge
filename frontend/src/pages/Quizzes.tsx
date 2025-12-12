import React from 'react';

const Quizzes: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quiz cards will go here */}
      </div>
    </div>
  );
};

export default Quizzes;