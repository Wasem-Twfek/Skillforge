import { registerSW } from 'virtual:pwa-register';

// This function handles the service worker registration and updates
export function registerServiceWorker() {
  // This is the service worker with the combined offline experience
  const updateSW = registerSW({
    // When a new service worker is available, this callback is called
    onNeedRefresh() {
      // You can show a UI notification to the user here
      if (confirm('New content available. Reload to update?')) {
        updateSW(true);
      }
    },
    // When offline mode is ready
    onOfflineReady() {
      console.log('App ready to work offline');
      // You can show a toast notification here
      const offlineToast = document.createElement('div');
      offlineToast.className = 'offline-toast';
      offlineToast.textContent = 'App ready for offline use';
      document.body.appendChild(offlineToast);
      
      // Remove the toast after 3 seconds
      setTimeout(() => {
        if (offlineToast.parentNode) {
          document.body.removeChild(offlineToast);
        }
      }, 3000);
    }
  });
}
