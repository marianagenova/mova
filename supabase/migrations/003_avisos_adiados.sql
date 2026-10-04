-- Fase 3: botão "Adiar 15 min" do aviso no celular.
-- A função marcar-aviso guarda aqui o aviso adiado; a enviar-avisos manda de novo na hora
-- e apaga a linha. Sem políticas: só as funções (com a chave de serviço) leem e gravam.

create table if not exists public.avisos_adiados (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  chave text not null,
  quando timestamptz not null
);

alter table public.avisos_adiados enable row level security;
