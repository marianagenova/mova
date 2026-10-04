import { config } from '../config.js';

const $ = (id) => document.getElementById(id);

function log(message) {
  const item = document.createElement('li');
  item.textContent = `${new Date().toLocaleTimeString('pt-BR')} · ${message}`;
  $('log').prepend(item);
}

function setStatus(id, ok, text) {
  $(id).textContent = text;
  $(id).dataset.ok = String(ok);
}

function urlBase64ToUint8Array(base64Url) {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

async function getSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

async function refreshStatus() {
  const installed = window.matchMedia('(display-mode: standalone)').matches;
  setStatus('st-installed', installed, installed ? 'sim' : 'não');

  if (!('Notification' in window)) {
    setStatus('st-permission', false, 'não suportado');
  } else {
    const labels = { granted: 'concedida', denied: 'negada', default: 'não pedida' };
    setStatus('st-permission', Notification.permission === 'granted', labels[Notification.permission]);
  }

  if (!('PushManager' in window)) {
    setStatus('st-push', false, 'não suportado');
  } else {
    const subscription = await getSubscription();
    setStatus('st-push', Boolean(subscription), subscription ? 'ativa' : 'inativa');
  }
}

async function enableNotifications() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    log('Permissão de notificação não concedida.');
    await refreshStatus();
    return;
  }
  if (!config.vapidPublicKey) {
    log('Falta a chave VAPID pública em config.js.');
    await refreshStatus();
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
    });
  }
  log('Notificações ativadas.');
  await refreshStatus();
}

async function showLocalNotification() {
  if (Notification.permission !== 'granted') {
    log('Ative as notificações primeiro.');
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification('Mova', {
    body: 'Notificação local funcionando.',
    icon: '../icons/icon-192.png',
    badge: '../icons/badge-96.png',
  });
  log('Notificação local exibida.');
}

async function sendServerPush() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    log('Faltam supabaseUrl e supabaseAnonKey em config.js.');
    return;
  }
  const subscription = await getSubscription();
  if (!subscription) {
    log('Ative as notificações primeiro.');
    return;
  }

  const delaySeconds = Number($('delay').value);
  const response = await fetch(`${config.supabaseUrl}/functions/v1/send-test-push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.supabaseAnonKey}`,
      apikey: config.supabaseAnonKey,
    },
    body: JSON.stringify({ subscription: subscription.toJSON(), delaySeconds }),
  });

  if (!response.ok) {
    const detail = await response.text();
    log(`Servidor respondeu ${response.status}: ${detail}`);
    return;
  }
  log(delaySeconds ? `Push agendado para daqui a ${delaySeconds} s.` : 'Push enviado pelo servidor.');
}

function guard(action) {
  return async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await action();
    } catch (error) {
      log(`Erro: ${error.message}`);
    } finally {
      button.disabled = false;
    }
  };
}

async function start() {
  if (!('serviceWorker' in navigator)) {
    setStatus('st-sw', false, 'não suportado');
    return;
  }
  await navigator.serviceWorker.register('../sw.js');
  await navigator.serviceWorker.ready;
  setStatus('st-sw', true, 'ativo');

  $('btn-enable').addEventListener('click', guard(enableNotifications));
  $('btn-local').addEventListener('click', guard(showLocalNotification));
  $('btn-server').addEventListener('click', guard(sendServerPush));
  await refreshStatus();
}

start().catch((error) => log(`Erro ao iniciar: ${error.message}`));
