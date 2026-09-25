import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './pwa/offline-toast.css';

// Service worker registration is handled solely by the PWAUpdatePrompt
// component (useRegisterSW) so the worker is registered exactly once.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
