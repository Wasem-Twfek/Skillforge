import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockCourses>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Filter courses based on search query
    const filteredCourses = mockCourses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      (course.tags ?? []).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5); // Limit to 5 results
    
    setSearchResults(filteredCourses);
  };

  return (
    <div className="w-full max-w-xl mx-auto relative z-20">
      <div className={`
        relative 
        ${isSearchFocused ? 'ring-2 ring-primary-500 shadow-lg' : 'shadow'}
        transition-all duration-200 rounded-full bg-white dark:bg-gray-800
      `}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-3 border-none rounded-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-0"
          placeholder="Search for skills, topics, or courses..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        />
      </div>
      
      {/* Search Results Dropdown */}
      {isSearchFocused && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="py-2">
            {searchResults.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/100/4338ca/ffffff?text=${course.title[0]}`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{course.category} • {course.level}</div>
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xs">★</span>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{course.rating} ({course.reviews})</span>
                  </div>
                </div>
              </Link>
            ))}
            
            {searchQuery.trim().length >= 2 && (
              <Link
                to={`/courses?search=${encodeURIComponent(searchQuery)}`}
                className="block text-center px-4 py-3 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
              >
                See all results for &quot;{searchQuery}&quot;
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar; 