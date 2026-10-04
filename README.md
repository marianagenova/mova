# Mova

App pessoal de tarefas e rotina: um único lugar para soltar tudo o que precisa ser feito (tarefas, inclusive as que se repetem, compromissos, treino e estudo), marcar o que foi concluído e ver depois o quanto foi feito.

Substitui o Reminder da Samsung e, se ficar bom o bastante, o Google Calendar.

## Sobre

- Uso pessoal, uma única pessoa, sem compartilhamento.
- Celular Android (Samsung) no dia a dia e notebook para consultar e editar.
- Precisa de internet; não funciona offline.
- Sem IA dentro do app.

### Conceitos principais

- **Áreas** (uma cor para cada): Trabalho e Pessoal.
- **Tipos de item** (um ícone para cada): Tarefa (que pode se repetir), Compromisso, Treino e Estudo.
- **Estados:** pendente, vencido (só itens com prazo), feito, não fazer e reagendado.
- **Repetições:** todo dia, dias úteis, dias específicos da semana, a cada N dias ou semanas, uma vez por mês.

### Funcionalidades previstas

- Lista principal com área, tipo, prazos e itens vencidos em destaque
- Cadastro rápido (título, tipo e área obrigatórios)
- Ações de feito, não fazer (contando como falha ou neutro) e reagendar
- Calendário e resumo do mês
- Itens de trabalho na agenda pessoal, com aviso de conflito
- Treino e estudo
- Lembrete por item e resumo do dia seguinte, todo dia às 20h
- Exportação dos dados para backup

Os requisitos completos estão em [docs/requisitos.md](docs/requisitos.md).

## Stack

| Parte | Tecnologia |
|---|---|
| App | PWA (site instalável na tela inicial do celular) |
| Hospedagem | GitHub Pages |
| Login e banco de dados | Supabase |
| Lembretes | Web Push enviado por Edge Function do Supabase, disparada a cada minuto pelo pg_cron |

### Pontos de atenção

- A economia de bateria do Samsung pode atrasar notificações; por isso, o primeiro marco técnico é uma notificação de teste chegando no celular.
- O plano gratuito do Supabase não faz backup automático (daí o botão de exportar) e pausa projetos sem atividade por 7 dias.

## Ordem de construção

Cada fase já deve ser usável sozinha.

| Fase | Entrega | Status |
|---|---|---|
| 0 | Base técnica: repositório, site publicado, instalável no celular e notificação de teste no Samsung | Concluída |
| 1 | Login, banco de dados, lista principal e cadastro rápido | Em andamento ([docs/fase-1.md](docs/fase-1.md)) |
| 2 | Repetições e ações (feito, não fazer, reagendar) | — |
| 3 | Lembretes por item e resumo das 20h | — |
| 4 | Calendário, resumo do mês, área Trabalho e aviso de conflito | — |
| 5 | Treino e estudo | — |
| 6 | Exportar dados e ajustes finais | — |

## Como rodar

O app fica em [web/index.html](web/index.html) e é HTML, CSS e JS puros, sem etapa de build. Nesta versão de teste, os dados ficam salvos só no aparelho (armazenamento do navegador), com exportação e importação de backup na aba Histórico. A tela de teste de notificações fica em [web/teste/](web/teste/). A cada push na `main`, ele é publicado no GitHub Pages pelo workflow [.github/workflows/pages.yml](.github/workflows/pages.yml).

A configuração do Supabase, das chaves de notificação e do teste no celular está em [docs/fase-0.md](docs/fase-0.md).
