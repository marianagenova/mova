// Fase 3: chamada a cada minuto pelo pg_cron (ver supabase/migrations/002_avisos.sql).
// Envia os lembretes dos itens que chegaram na hora e, às 20h, o resumo do dia seguinte.
// Cada aviso é anotado em avisos_enviados antes de sair, para nunca chegar duas vezes.
//
// Secrets (Supabase > Edge Functions > Secrets), os mesmos da fase 0:
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY o Supabase já fornece sozinho.
//
// As regras de repetição e o lembrete padrão são os mesmos de web/index.html.

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'jsr:@supabase/supabase-js@2';

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
);

const CHAVE_SERVICO = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, CHAVE_SERVICO);
// Botões "Feito" e "Adiar 15 min" do aviso chamam esta função, sem abrir o app.
const URL_MARCAR = `${Deno.env.get('SUPABASE_URL')}/functions/v1/marcar-aviso`;
const CHAVE_PUBLICA = Deno.env.get('SUPABASE_ANON_KEY')!;

const FUSO = 'America/Sao_Paulo';
const TOLERANCIA = 10; // minutos: se o agendamento atrasar, o aviso ainda sai
const HORA_RESUMO = 20 * 60;
const LIMITE_DIA_PESADO = 6 * 60;
const DURACAO_PADRAO: Record<string, number> = { tarefa: 30, compromisso: 60, treino: 60, estudo: 30 };
const LEMBRETE_PADRAO: Record<string, number> = { tarefa: 0, compromisso: 30, treino: 15, estudo: 15 };
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

type Regra = { semanal?: number[]; intervalo?: number; unidade?: string; mensal?: number; inicio?: string; fim?: string };
type Item = {
  id: string; titulo: string; tipo: string; hora?: string; duracao?: number; data?: string; ate?: string;
  diaTodo?: boolean; regra?: Regra; excecoes?: string[]; local?: string; lembrete?: number | null;
};
type Dados = {
  itens: Item[];
  estados: Record<string, { estado: string }>;
  trilha?: { titulo: string; status: string }[];
  ultimoBackup?: string | null;
  criadoEm?: string;
};
// "item" (item|dia|minutos antes) liga os botões Feito e Adiar no aviso.
type Aviso = { chave: string; titulo: string; texto: string; item?: string };

// Assinatura conferida pela função marcar-aviso (HMAC-SHA256 com a chave de serviço).
async function assinar(texto: string) {
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(CHAVE_SERVICO), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(texto)));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---------- Datas (chaves "aaaa-mm-dd", contadas em UTC para não depender do fuso) ----------
function agoraNoFuso() {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((p) => [p.type, p.value]),
  );
  return { dia: `${partes.year}-${partes.month}-${partes.day}`, minutos: Number(partes.hour) * 60 + Number(partes.minute) };
}
const paraData = (k: string) => { const [a, m, d] = k.split('-').map(Number); return new Date(Date.UTC(a, m - 1, d)); };
const somarDias = (k: string, n: number) => { const d = paraData(k); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const diferencaDias = (a: string, b: string) => Math.round((paraData(b).getTime() - paraData(a).getTime()) / 86400000);
const minutos = (h: string) => { const [H, M] = h.split(':').map(Number); return H * 60 + M; };
const fmtMin = (m: number) => { const H = Math.floor(m / 60); const M = m % 60; return M ? `${H}h${String(M).padStart(2, '0')}` : `${H}h`; };
const fmtDur = (m: number) => (m < 60 ? `${m} min` : fmtMin(m));

// ---------- Regras do app ----------
function ocorreEm(item: Item, k: string) {
  const r = item.regra;
  if (r) {
    if (r.inicio && k < r.inicio) return false;
    if (r.fim && k > r.fim) return false;
    if (item.excecoes?.includes(k)) return false;
    const d = paraData(k);
    if (r.semanal) return r.semanal.includes(d.getUTCDay());
    if (r.intervalo) {
      const passo = r.intervalo * (r.unidade === 'semana' ? 7 : 1);
      const n = diferencaDias(r.inicio!, k);
      return n >= 0 && n % passo === 0;
    }
    if (r.mensal) return d.getUTCDate() === r.mensal;
    return false;
  }
  if (!item.data) return false;
  return k >= item.data && k <= (item.ate || item.data);
}

const variosDias = (item: Item) => Boolean(item.ate) && !item.regra;
const estadoDe = (dados: Dados, item: Item, k: string) => dados.estados?.[item.regra ? `${item.id}|${k}` : item.id];

function lembreteDe(item: Item): number | null {
  if ('lembrete' in item) return item.lembrete ?? null;
  if (!item.hora || item.diaTodo) return null;
  return LEMBRETE_PADRAO[item.tipo] ?? null;
}

function quandoAntes(min: number) {
  if (min === 1440) return 'amanhã';
  return `em ${fmtDur(min)}`;
}

// ---------- O que enviar agora ----------
function avisosDeAgora(dados: Dados, hoje: string, agora: number): Aviso[] {
  const amanha = somarDias(hoje, 1);
  const avisos: Aviso[] = [];
  const estudo = (dados.trilha || []).filter((m) => m.status === 'andamento').map((m) => m.titulo).join(' + ');

  // Lembretes: o aviso de um item de amanhã pode cair hoje (ex.: 1 dia antes, ou 1h antes de 0h30).
  for (const [dia, deslocamento] of [[hoje, 0], [amanha, 1440]] as const) {
    for (const item of dados.itens || []) {
      const antes = lembreteDe(item);
      if (antes === null || !item.hora || item.diaTodo || !ocorreEm(item, dia)) continue;
      if (variosDias(item) && dia !== item.data) continue; // viagem: só no dia da ida
      if (estadoDe(dados, item, dia)) continue; // já marcado (feito, não fazer ou reagendado)
      const alvo = minutos(item.hora) - antes + deslocamento;
      if (agora < alvo || agora >= alvo + TOLERANCIA) continue;
      const partes = [`${item.titulo} às ${fmtHora(item.hora)}${antes ? ` (${quandoAntes(antes)})` : ''}`];
      if (item.tipo === 'estudo' && estudo) partes.push(estudo);
      if (item.local) partes.push(item.local);
      const chave = `${item.id}|${dia}|${antes}`;
      avisos.push({ chave, titulo: 'Mova', texto: partes.join(' · '), item: chave });
    }
  }

  // Resumo das 20h: o dia seguinte e, se faltar, o fechamento de hoje.
  if (agora >= HORA_RESUMO && agora < HORA_RESUMO + TOLERANCIA) {
    const doDia = (dados.itens || []).filter((i) => ocorreEm(i, amanha) && !estadoDe(dados, i, amanha));
    const comHora = doDia.filter((i) => i.hora && !i.diaTodo && !variosDias(i)).sort((a, b) => a.hora!.localeCompare(b.hora!));
    const carga = comHora.reduce((s, i) => s + (i.duracao || DURACAO_PADRAO[i.tipo] || 30), 0);
    const linhas = [];
    if (doDia.length) {
      const partes = [`${doDia.length} ${doDia.length === 1 ? 'atividade' : 'atividades'}`];
      if (comHora[0]) partes.push(`primeira: ${comHora[0].titulo} às ${fmtHora(comHora[0].hora!)}`);
      if (carga > LIMITE_DIA_PESADO) partes.push(`dia pesado (${fmtDur(carga)})`);
      linhas.push(partes.join(' · '));
    } else {
      linhas.push('Nada planejado.');
    }
    if (!dados.estados?.[`fechamento|${hoje}`]) linhas.push('Falta fechar o dia de hoje.');
    // Backup: depois de 30 dias sem exportar, lembra aos domingos.
    const ultimo = dados.ultimoBackup || dados.criadoEm;
    const semBackup = ultimo ? diferencaDias(ultimo, hoje) : 0;
    if (semBackup >= 30 && paraData(hoje).getUTCDay() === 0) {
      linhas.push(`Faz ${semBackup} dias sem backup: engrenagem › Exportar backup.`);
    }
    avisos.push({ chave: `resumo|${hoje}`, titulo: `Amanhã (${DIAS[paraData(amanha).getUTCDay()]})`, texto: linhas.join('\n') });
  }
  return avisos;
}

function fmtHora(h: string) { return fmtMin(minutos(h)); }

// Avisos adiados pelo botão "Adiar 15 min" que já chegaram na hora.
async function avisosAdiados(dados: Dados, usuario: string): Promise<Aviso[]> {
  const { data: linhas } = await supabase.from('avisos_adiados').select('id, chave')
    .eq('user_id', usuario).lte('quando', new Date().toISOString());
  if (!linhas?.length) return [];
  await supabase.from('avisos_adiados').delete().in('id', linhas.map((l: { id: number }) => l.id));
  const avisos: Aviso[] = [];
  for (const { id, chave } of linhas) {
    const [itemId, dia] = chave.split('|');
    const item = (dados.itens || []).find((i) => i.id === itemId);
    if (!item?.hora || estadoDe(dados, item, dia)) continue; // já marcado ou excluído
    avisos.push({ chave: `adiado|${id}`, titulo: 'Mova', texto: `${item.titulo} às ${fmtHora(item.hora)} (adiado)`, item: chave });
  }
  return avisos;
}

// ---------- Envio ----------
Deno.serve(async () => {
  const { dia: hoje, minutos: agora } = agoraNoFuso();
  const { data: contas, error } = await supabase.from('dados_app').select('user_id, dados');
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  let enviados = 0;
  for (const conta of contas || []) {
    const dados = conta.dados as Dados;
    const avisos = [...avisosDeAgora(dados, hoje, agora), ...await avisosAdiados(dados, conta.user_id)];
    if (!avisos.length) continue;
    const { data: inscricoes } = await supabase.from('inscricoes_push').select('endpoint, inscricao').eq('user_id', conta.user_id);
    if (!inscricoes?.length) continue;

    for (const aviso of avisos) {
      // Anota antes de enviar: se a anotação já existia, o aviso já saiu e não vai de novo.
      const { data: novo } = await supabase.from('avisos_enviados')
        .upsert({ user_id: conta.user_id, chave: aviso.chave }, { onConflict: 'user_id,chave', ignoreDuplicates: true })
        .select();
      if (!novo?.length) continue;

      const acao = aviso.item ? {
        url: URL_MARCAR, apikey: CHAVE_PUBLICA, usuario: conta.user_id, chave: aviso.item,
        token: await assinar(`${conta.user_id}|${aviso.item}`),
      } : undefined;
      const payload = JSON.stringify({ title: aviso.titulo, body: aviso.texto, acao });
      for (const { endpoint, inscricao } of inscricoes) {
        try {
          // urgency "high" pede ao Android para entregar mesmo com o aparelho em economia de bateria.
          await webpush.sendNotification(inscricao, payload, { TTL: 3600, urgency: 'high' });
          enviados++;
        } catch (erro) {
          const status = (erro as { statusCode?: number }).statusCode;
          // 404/410: o aparelho desligou os avisos ou trocou de endereço.
          if (status === 404 || status === 410) await supabase.from('inscricoes_push').delete().eq('endpoint', endpoint);
          else console.error('Falha ao enviar aviso', status, erro);
        }
      }
    }
  }

  // Uma vez por hora, apaga as anotações com mais de 3 dias.
  if (agora % 60 === 0) {
    await supabase.from('avisos_enviados').delete().lt('enviado_em', new Date(Date.now() - 3 * 86400000).toISOString());
  }
  return new Response(JSON.stringify({ ok: true, hoje, agora: fmtMin(agora), enviados }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
