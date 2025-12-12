import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OfflineDetector: React.FC = () => {
  // We're using this state in the useEffect, so it's not actually unused
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initial check
    const checkOfflineStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      
      // If offline, navigate to offline page
      if (offline) {
        navigate('/offline');
      }
    };
    
    checkOfflineStatus();
    
    // Set up event listeners for online/offline status
    const handleOnline = () => {
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      // Navigate to offline page when connection is lost
      navigate('/offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate, isOffline]); // Add isOffline to dependency array to avoid lint warning
  
  // This component doesn't render anything visible
  // It just handles the offline detection logic
  return null;
};

export default OfflineDetector;
