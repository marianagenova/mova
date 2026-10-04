// O app precisa de internet (ver docs/requisitos.md), então não há cache offline.
// O service worker existe para permitir a instalação e receber as notificações push.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Ao abrir o app, sempre confere com o servidor se há versão nova da página,
// em vez de usar a cópia que o navegador guarda por até 10 minutos.
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, { cache: 'no-cache' }));
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const sentAt = data.sentAt
    ? ` Enviada às ${new Date(data.sentAt).toLocaleTimeString('pt-BR')}.`
    : '';

  event.waitUntil(
    self.registration.showNotification(data.title || 'Mova', {
      body: `${data.body || ''}${sentAt}`.trim(),
      icon: 'icons/icon-192.png',
      badge: 'icons/badge-96.png',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => client.url.startsWith(self.registration.scope));
      return open ? open.focus() : self.clients.openWindow(self.registration.scope);
    }),
  );
});
