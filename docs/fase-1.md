# Fase 1 — conta e dados no servidor

Objetivo: os mesmos dados no celular e no notebook, guardados no Supabase, com acesso só da dona do app.

## Como funciona

- O app pede **e-mail e senha** (Supabase Auth). Só existe uma conta, criada pelo painel, e o cadastro de novas contas fica desligado.
- Os dados ficam na tabela `dados_app`: uma linha por conta, com o documento inteiro em JSON (o mesmo formato do backup). As regras de segurança (RLS) deixam cada conta ler e gravar só a própria linha.
- O app guarda uma cópia no aparelho, para abrir rápido, e envia cada mudança para o servidor cerca de 1,5 s depois.
- Cada gravação sobe a coluna `versao`. O app só grava se a versão que conhece ainda for a do servidor. Se outro aparelho salvou antes, vale o servidor, e as mudanças locais ficam guardadas no aparelho (`mova.dados.copia-conflito`).
- Ao voltar para o app (no máximo a cada 30 s) e quando a internet volta, o app confere se o outro aparelho mudou algo.
- No primeiro login:
  - se o servidor está vazio, o app pergunta se pode enviar os dados do aparelho (fazer isso pelo celular);
  - se o servidor já tem dados, eles substituem os do aparelho, e a cópia antiga fica guardada (`mova.dados.copia-antes-do-login`).

## Passo a passo no Supabase

### 1. Criar a tabela

Em **SQL Editor > New query**, cole o conteúdo de [`supabase/migrations/001_dados_app.sql`](../supabase/migrations/001_dados_app.sql) e clique em **Run**.

### 2. Criar a conta

Em **Authentication > Users > Add user > Create new user**:
- e-mail e senha da dona do app;
- marcar **Auto Confirm User**.

### 3. Desligar o cadastro de novas contas

Em **Authentication > Sign In / Providers**, desligar **Allow new users to sign up** e salvar.

## Primeiro uso

1. No celular, exportar um backup (engrenagem > Exportar backup), por segurança.
2. Abrir o app no celular, entrar e aceitar enviar os dados para o servidor.
3. Entrar no notebook: os dados do servidor são baixados.

## Critério de pronto

- [ ] Tabela criada e protegida
- [ ] Conta criada e cadastro desligado
- [ ] Dados do celular enviados ao servidor
- [ ] Uma mudança feita no celular aparece no notebook, e vice-versa
