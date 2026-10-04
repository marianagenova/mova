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

const ICONES = { icon: 'icons/icon-192.png', badge: 'icons/badge-96.png' };

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const sentAt = data.sentAt
    ? ` Enviada às ${new Date(data.sentAt).toLocaleTimeString('pt-BR')}.`
    : '';

  event.waitUntil(
    self.registration.showNotification(data.title || 'Mova', {
      body: `${data.body || ''}${sentAt}`.trim(),
      ...ICONES,
      // Lembrete de item: botões para marcar sem abrir o app (fase 3).
      ...(data.acao ? {
        data: { acao: data.acao },
        actions: [{ action: 'feito', title: 'Feito' }, { action: 'adiar', title: 'Adiar 15 min' }],
      } : {}),
    }),
  );
});

// Botão "Feito" ou "Adiar 15 min": avisa o servidor (função marcar-aviso) sem abrir o app.
async function responderAviso(acao, escolha) {
  try {
    const resp = await fetch(acao.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${acao.apikey}`, apikey: acao.apikey },
      body: JSON.stringify({ acao: escolha, usuario: acao.usuario, chave: acao.chave, token: acao.token }),
    });
    if (!resp.ok) throw new Error(`status ${resp.status}`);
  } catch (erro) {
    await self.registration.showNotification('Mova', { body: 'Não foi possível marcar pelo aviso. Abra o app para marcar.', ...ICONES });
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const acao = event.notification.data?.acao;
  if (event.action && acao) {
    event.waitUntil(responderAviso(acao, event.action));
    return;
  }
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => client.url.startsWith(self.registration.scope));
      return open ? open.focus() : self.clients.openWindow(self.registration.scope);
    }),
  );
});
