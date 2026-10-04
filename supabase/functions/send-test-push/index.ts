// Fase 0: envia uma notificação push de teste para a inscrição recebida no corpo da requisição.
// Secrets necessários (Supabase > Edge Functions > Secrets):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (ex.: mailto:voce@exemplo.com)

import webpush from 'npm:web-push@3.6.7';

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };

// O plano gratuito encerra a função após 150 s; 120 s deixa margem.
const MAX_DELAY_SECONDS = 120;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sendTestPush(subscription: webpush.PushSubscription, delaySeconds: number) {
  if (delaySeconds > 0) {
    await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
  }
  const payload = JSON.stringify({
    title: 'Mova',
    body: 'Notificação de teste enviada pelo servidor.',
    sentAt: new Date().toISOString(),
  });
  // urgency "high" pede ao Android para entregar mesmo com o aparelho em economia de bateria.
  await webpush.sendNotification(subscription, payload, { TTL: 600, urgency: 'high' });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método não permitido' }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const subscription = body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return json({ error: 'Inscrição de push inválida' }, 400);
  }
  const delaySeconds = Math.min(Math.max(Number(body.delaySeconds) || 0, 0), MAX_DELAY_SECONDS);

  if (delaySeconds === 0) {
    try {
      await sendTestPush(subscription, 0);
      return json({ ok: true });
    } catch (error) {
      console.error('Falha ao enviar push', error);
      return json({ error: String(error), statusCode: (error as { statusCode?: number }).statusCode }, 502);
    }
  }

  // Responde na hora e envia em segundo plano, para que o app possa ser fechado durante a espera.
  EdgeRuntime.waitUntil(
    sendTestPush(subscription, delaySeconds).catch((error) => console.error('Falha ao enviar push', error)),
  );
  return json({ ok: true, delaySeconds }, 202);
});
