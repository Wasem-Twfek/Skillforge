// Custom PWA configuration to fix Content Security Policy issues

// This line will be replaced by the precache manifest
// DO NOT REMOVE OR MODIFY THIS COMMENT - WORKBOX PRECACHE MANIFEST
self.__WB_MANIFEST
// DO NOT REMOVE OR MODIFY THIS COMMENT - WORKBOX PRECACHE MANIFEST

// Force activation and clients claim
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Set a more permissive Content Security Policy that allows images and other resources
self.addEventListener('fetch', (event) => {
  const response = new Response('', {
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3001; font-src 'self' data:;"
    }
  });
  
  // Only modify CSP for HTML responses
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((originalResponse) => {
          // Clone the response to modify headers
          const newResponse = new Response(originalResponse.body, {
            status: originalResponse.status,
            statusText: originalResponse.statusText,
            headers: new Headers(originalResponse.headers)
          });
          
          // Add CSP header
          newResponse.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3001; font-src 'self' data:;"
          );
          
          return newResponse;
        })
        .catch(() => fetch(event.request))
    );
  }
});
