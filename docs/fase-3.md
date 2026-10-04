# Fase 3: avisos no celular

Objetivo: lembrete de cada item na hora escolhida e, às 20h, o resumo do dia seguinte.

## Como funciona

- Cada item tem o campo **Lembrete no celular**: sem lembrete, na hora, 5, 15 ou 30 minutos antes, 1 hora antes ou 1 dia antes. Um lembrete por item.
- Padrão (vale também para os itens criados antes do campo existir): compromisso 30 min antes, treino e estudo 15 min antes, tarefa com horário na hora. Só avisa itens com horário.
- Item já marcado (feito, não fazer ou reagendado) não avisa.
- Às 20h chega o resumo de amanhã (quantas atividades, a primeira e se o dia está pesado) e, se o dia de hoje ainda não foi fechado, "Falta fechar o dia de hoje".
- Os avisos são ligados em cada aparelho, em Ajustes > Avisos. O endereço de push do aparelho fica na tabela `inscricoes_push`.
- O `pg_cron` chama a Edge Function `enviar-avisos` a cada minuto. Ela lê os dados de `dados_app`, decide o que está na hora (fuso de São Paulo, com 10 min de tolerância) e envia. Cada aviso é anotado em `avisos_enviados` antes de sair, para não chegar duas vezes.

## Passo a passo no Supabase

### 1. Criar as tabelas e o agendamento

Em **SQL Editor > New query**, cole o conteúdo de [`supabase/migrations/002_avisos.sql`](../supabase/migrations/002_avisos.sql) e clique em **Run**.

### 2. Criar a Edge Function

Em **Edge Functions > Deploy a new function > Via Editor**, crie a função com o nome `enviar-avisos`, cole o conteúdo de [`supabase/functions/enviar-avisos/index.ts`](../supabase/functions/enviar-avisos/index.ts) e clique em **Deploy**. Os secrets VAPID são os mesmos da fase 0.

### 3. Ligar os avisos no celular

No app: engrenagem > **Ativar avisos neste celular** > **Permitir**.

## Critério de pronto

- [ ] Tabelas e agendamento criados
- [ ] Função `enviar-avisos` publicada
- [ ] Avisos ligados no celular
- [ ] Um item de teste com "Na hora" avisa no horário
- [ ] O resumo das 20h chega

## Botões no aviso e lembrete de backup

- O aviso de cada item vem com os botões **Feito** e **Adiar 15 min**. Eles chamam a função `marcar-aviso` sem abrir o app:
  - **Feito** marca a ocorrência em `dados_app` (gravando só se a versão não mudou no meio);
  - **Adiar 15 min** guarda o aviso em `avisos_adiados`, e a `enviar-avisos` manda de novo na hora (se ainda não foi marcado).
- Cada aviso leva uma assinatura (HMAC com a chave de serviço) feita pela `enviar-avisos` e conferida pela `marcar-aviso`.
- Aos domingos, depois de 30 dias sem exportar o backup, o resumo das 20h lembra de exportar.

### Passo a passo

1. Em **SQL Editor > New query**, cole [`supabase/migrations/003_avisos_adiados.sql`](../supabase/migrations/003_avisos_adiados.sql) e clique em **Run**.
2. Em **Edge Functions > Deploy a new function > Via Editor**, crie `marcar-aviso` com o conteúdo de [`supabase/functions/marcar-aviso/index.ts`](../supabase/functions/marcar-aviso/index.ts).
3. Na função `enviar-avisos`, aba **Code**, troque o código pelo de [`supabase/functions/enviar-avisos/index.ts`](../supabase/functions/enviar-avisos/index.ts) e clique em **Deploy updates**.
