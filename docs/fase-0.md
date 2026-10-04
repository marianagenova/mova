# Fase 0 — base técnica

Objetivo: site publicado, instalável no celular e uma notificação push de teste chegando no Samsung.

## O que já está no repositório

| Arquivo | Para que serve |
|---|---|
| `web/` | O app (HTML, CSS e JS puros, sem etapa de build), publicado como está |
| `web/sw.js` | Service worker: permite instalar e recebe as notificações |
| `web/config.js` | URL e chave pública do Supabase e chave pública VAPID |
| `supabase/functions/send-test-push/` | Edge Function que envia o push de teste |
| `.github/workflows/pages.yml` | Publica `web/` no GitHub Pages a cada push na `main` |
| `scripts/gerar-chaves-vapid.ps1` | Gera as chaves VAPID |

## Passo a passo

### 1. Gerar as chaves VAPID

```powershell
powershell -ExecutionPolicy Bypass -File scripts\gerar-chaves-vapid.ps1
```

Guarde as duas linhas. A **pública** vai no app e no Supabase. A **privada** vai **só** no Supabase e nunca no repositório.

### 2. Criar o projeto no Supabase

1. Em [supabase.com](https://supabase.com), crie um projeto (região: São Paulo).
2. Em **Project Settings > API Keys**, copie a URL do projeto e a chave **anon** (aba "Legacy API keys").

### 3. Criar a Edge Function

1. Em **Edge Functions > Deploy a new function > Via Editor**, crie a função com o nome `send-test-push` e cole o conteúdo de `supabase/functions/send-test-push/index.ts`.
2. Em **Edge Functions > Secrets**, adicione:
   - `VAPID_PUBLIC_KEY`: a chave pública
   - `VAPID_PRIVATE_KEY`: a chave privada
   - `VAPID_SUBJECT`: `mailto:` seguido do seu e-mail

Se o projeto só oferecer a chave nova (`sb_publishable_...`) em vez da anon, desligue **Verify JWT** nas configurações da função.

### 4. Preencher `web/config.js`

Preencha `supabaseUrl`, `supabaseAnonKey` e `vapidPublicKey`. Esses três valores são públicos e podem ir para o repositório.

### 5. Publicar no GitHub Pages

1. Faça o push para o GitHub.
2. Em **Settings > Pages**, escolha **Source: GitHub Actions**. No plano gratuito, o Pages exige repositório público.
3. Quando o workflow terminar, o app estará em `https://marianagenova.github.io/mova/`.

### 6. Testar no Samsung

1. Abra o endereço no **Chrome** e instale o app (menu ⋮ > **Adicionar à tela inicial** ou **Instalar app**).
2. Abra o app pela tela inicial. "Instalado na tela inicial" deve mostrar **sim**.
3. Toque em **1. Ativar notificações** e permita.
4. Toque em **2. Notificação local**. Ela deve aparecer na hora.
5. Escolha **em 2 min**, toque em **3. Push pelo servidor**, feche o app e bloqueie a tela.
6. Compare o horário de envio mostrado na notificação com o horário em que ela chegou.

### Se a notificação atrasar ou não chegar

- **Configurações > Aplicativos > Chrome > Bateria:** escolha **Sem restrições**.
- **Configurações > Bateria > Limites de uso em segundo plano:** confira se o Chrome não está em "Aplicativos em suspensão".
- Confira se as notificações do Chrome e do Mova estão permitidas.

## Critério de pronto

- [ ] Site publicado no GitHub Pages
- [ ] App instalado na tela inicial do Samsung
- [ ] Notificação local aparecendo
- [ ] Push do servidor chegando com o app fechado e a tela bloqueada, com atraso aceitável
