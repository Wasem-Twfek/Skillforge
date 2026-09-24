import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PWAUpdatePrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onOfflineReady() {
      const offlineToast = document.createElement('div');
      offlineToast.className = 'offline-toast';
      offlineToast.textContent = 'App ready for offline use';
      document.body.appendChild(offlineToast);

      window.setTimeout(() => offlineToast.remove(), 3000);
    },
  });

  useEffect(() => {
    setShowPrompt(needRefresh);
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New version available</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            A new version of SkillForge is ready. Update now?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleUpdate}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setShowPrompt(false)}
            className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
