-- Fase 3: avisos no celular.
--
-- inscricoes_push: o "endereço" de push de cada aparelho com os avisos ligados.
-- avisos_enviados: cada aviso que já saiu, para nenhum chegar duas vezes.
-- O agendamento (pg_cron) chama a função enviar-avisos a cada minuto.

create table if not exists public.inscricoes_push (
  endpoint text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  inscricao jsonb not null,
  criado_em timestamptz not null default now()
);

alter table public.inscricoes_push enable row level security;

create policy "A dona lê as próprias inscrições"
  on public.inscricoes_push for select
  using (auth.uid() = user_id);

create policy "A dona cria as próprias inscrições"
  on public.inscricoes_push for insert
  with check (auth.uid() = user_id);

create policy "A dona altera as próprias inscrições"
  on public.inscricoes_push for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "A dona apaga as próprias inscrições"
  on public.inscricoes_push for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.inscricoes_push to authenticated;

-- Sem políticas: só a função enviar-avisos (com a chave de serviço) lê e grava.
create table if not exists public.avisos_enviados (
  user_id uuid not null references auth.users (id) on delete cascade,
  chave text not null,
  enviado_em timestamptz not null default now(),
  primary key (user_id, chave)
);

alter table public.avisos_enviados enable row level security;

-- Agendamento: a cada minuto, chama a função. A chave enviada é a pública (anon),
-- a mesma de web/config.js; a função só envia o que já está na hora.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'enviar-avisos',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://kocdeaukwsydyzwnofof.supabase.co/functions/v1/enviar-avisos',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvY2RlYXVrd3N5ZHl6d25vZm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMjMzNzIsImV4cCI6MjEwNjY5OTM3Mn0.P82DgPuJPcZgVoCUM1hNM7BxHFzbGIg5cfs5ZoF1liA"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
