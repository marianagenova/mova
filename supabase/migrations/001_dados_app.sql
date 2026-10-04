-- Fase 1: guarda os dados do app de cada pessoa num único documento JSON.
-- Só a própria pessoa (a dona da conta) consegue ler e gravar a sua linha.
--
-- "versao" sobe a cada gravação. O app só grava se a versão que ele conhece ainda
-- for a do servidor; assim, um aparelho desatualizado não apaga o que o outro salvou.

create table if not exists public.dados_app (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dados jsonb not null,
  versao bigint not null default 1,
  atualizado_em timestamptz not null default now()
);

alter table public.dados_app enable row level security;

create policy "A dona lê os próprios dados"
  on public.dados_app for select
  using (auth.uid() = user_id);

create policy "A dona cria os próprios dados"
  on public.dados_app for insert
  with check (auth.uid() = user_id);

create policy "A dona altera os próprios dados"
  on public.dados_app for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.dados_app to authenticated;
