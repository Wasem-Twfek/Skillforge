import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PWAUpdatePrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered:', registration);
    },
    onRegisterError(error: Error) {
      console.log('SW registration error', error);
    },
    onOfflineReady() {
      console.log('App ready to work offline');
      const offlineToast = document.createElement('div');
      offlineToast.className = 'offline-toast';
      offlineToast.textContent = 'App ready for offline use';
      document.body.appendChild(offlineToast);

      setTimeout(() => {
        if (offlineToast.parentNode) {
          document.body.removeChild(offlineToast);
        }
      }, 3000);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">New Version Available</h3>
          <p className="text-sm text-gray-600">
            A new version of SkillForge is available. Would you like to update now?
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt; 