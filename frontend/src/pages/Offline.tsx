import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Offline: React.FC = () => {
  const [cachedCourses, setCachedCourses] = useState<string[]>([]);
  
  useEffect(() => {
    // This is a simplified example - in a real app, you would check
    // your cached data from IndexedDB or other storage
    const checkCachedContent = async () => {
      try {
        // Example of how you might check for cached courses
        // In a real implementation, you'd use IndexedDB or another storage method
        const cache = await caches.open('api-cache');
        const keys = await cache.keys();
        const courseUrls = keys
          .filter(request => request.url.includes('/api/courses'))
          .map(request => {
            // Extract course ID or name from URL
            const urlParts = request.url.split('/');
            return urlParts[urlParts.length - 1];
          });
        
        setCachedCourses(courseUrls);
      } catch (error) {
        console.error('Error checking cached content:', error);
      }
    };
    
    checkCachedContent();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">You're Offline</h1>
          <div className="mt-2">
            <svg 
              className="w-16 h-16 mx-auto text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
              />
            </svg>
          </div>
          <p className="mt-4 text-gray-600">
            It looks like you're currently offline. Don't worry - you can still access your previously viewed content.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900">Available Offline:</h2>
          
          {cachedCourses.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {cachedCourses.map((course, index) => (
                <li key={index} className="p-3 bg-blue-50 rounded-md">
                  <Link 
                    to={`/courses/${course}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {course.replace(/-/g, ' ')}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              No content available offline. When you're back online, browse some courses to make them available offline.
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offline;
