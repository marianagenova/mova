// Fase 3: botões do aviso no celular, tocados sem abrir o app.
//   "Feito": marca a ocorrência como feita nos dados (dados_app).
//   "Adiar 15 min": guarda em avisos_adiados; a função enviar-avisos manda de novo na hora.
// Cada aviso traz uma assinatura (token) feita pela enviar-avisos; sem ela, nada muda.
//
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY o Supabase já fornece sozinho.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CHAVE_SERVICO = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, CHAVE_SERVICO);
const ADIAR_MINUTOS = 15;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

// A mesma assinatura da enviar-avisos (HMAC-SHA256 com a chave de serviço).
async function assinar(texto: string) {
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(CHAVE_SERVICO), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(texto)));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Marca como feito. Grava só se a versão não mudou no meio; se mudou, tenta de novo.
async function marcarFeito(usuario: string, itemId: string, dia: string) {
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    const { data: linha, error } = await supabase.from('dados_app').select('dados, versao').eq('user_id', usuario).single();
    if (error || !linha) return 'sem dados';
    const dados = linha.dados;
    const item = (dados.itens || []).find((i: { id: string }) => i.id === itemId);
    if (!item) return 'item não existe mais';
    const k = item.regra ? `${itemId}|${dia}` : itemId;
    dados.estados = dados.estados || {};
    if (dados.estados[k]) return 'já estava marcado';
    dados.estados[k] = { estado: 'feito' };
    const { data: gravou } = await supabase.from('dados_app')
      .update({ dados, versao: linha.versao + 1, atualizado_em: new Date().toISOString() })
      .eq('user_id', usuario).eq('versao', linha.versao)
      .select('versao');
    if (gravou?.length) return 'feito';
  }
  return 'conflito';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método não permitido' }, 405);

  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }
  const { acao, usuario, chave, token } = corpo ?? {};
  if (!usuario || !chave || token !== await assinar(`${usuario}|${chave}`)) return json({ error: 'Aviso inválido' }, 403);

  // chave do aviso: "item|aaaa-mm-dd|minutos antes"
  const [itemId, dia] = String(chave).split('|');
  if (acao === 'feito') {
    const resultado = await marcarFeito(usuario, itemId, dia);
    return json({ ok: resultado !== 'conflito', resultado }, resultado === 'conflito' ? 409 : 200);
  }
  if (acao === 'adiar') {
    const quando = new Date(Date.now() + ADIAR_MINUTOS * 60000).toISOString();
    const { error } = await supabase.from('avisos_adiados').insert({ user_id: usuario, chave, quando });
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, quando });
  }
  return json({ error: 'Ação desconhecida' }, 400);
});
