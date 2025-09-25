const CACHE_NAME = 'sih-career-path-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/quiz',
  '/colleges',
  '/timeline',
  '/chatbot',
  '/career-mapping',
  '/dashboard',
  '/manifest.json',
  // Add critical CSS and JS files
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  // Offline fallback page
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(err => console.log('Cache failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then(fetchResponse => {
            // Cache dynamic content
            if (event.request.url.indexOf('http') === 0) {
              return caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  // Don't cache POST requests or large files
                  if (event.request.url.indexOf('/api/') === -1) {
                    cache.put(event.request.url, fetchResponse.clone());
                  }
                  return fetchResponse;
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Offline fallback
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // Fallback for images
            if (event.request.headers.get('accept').includes('image')) {
              return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b7280">Offline</text></svg>', {
                headers: { 'Content-Type': 'image/svg+xml' }
              });
            }
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'quiz-submission') {
    event.waitUntil(syncQuizData());
  }
  if (event.tag === 'profile-update') {
    event.waitUntil(syncProfileData());
  }
});

// Push notifications for timeline reminders
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Career Path',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/close-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Career Path Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/timeline')
    );
  }
});

// Sync functions
async function syncQuizData() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const quizRequests = requests.filter(req => req.url.includes('/api/quiz'));
    
    for (const request of quizRequests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        // Sync with server when online
        await fetch('/api/quiz/sync', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.log('Sync failed:', error);
  }
}

async function syncProfileData() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const profileRequests = requests.filter(req => req.url.includes('/api/profile'));
    
    for (const request of profileRequests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        await fetch('/api/profile/sync', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.log('Profile sync failed:', error);
  }
}
