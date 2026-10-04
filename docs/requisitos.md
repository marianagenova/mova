# Requisitos do app de hábitos e tarefas

**Versão 2 — rascunho para revisão · 4 de outubro de 2026**

> Documento vivo. Registra o que já foi decidido, o que é proposta e o que ainda está em aberto.
> **[proposta]** = sugestão ainda não confirmada · **[em aberto]** = precisa de decisão.

---

## 1. Objetivo

Um único lugar para soltar tudo o que precisa ser feito (hábitos, tarefas, compromissos, treino e estudo), marcar o que foi concluído e ver depois o quanto foi feito.

- Substitui o app Reminder da Samsung e, se ficar bom o bastante, o Google Calendar.
- O que dá prazer: concluir o item, mostrar para si mesma que foi feito e ver o histórico depois.
- Motivação de fundo: entender melhor como funciona e como rende melhor, com o histórico ajudando a enxergar padrões.

## 2. Contexto de uso

- Uso pessoal, uma única pessoa, sem compartilhamento.
- Android (Samsung) no dia a dia, e notebook para consultar e editar.
- Precisa de internet; não precisa funcionar offline.
- Sem IA dentro do app (a IA é usada só para construí-lo).
- Preferência por horários fixos e necessidade de lembretes.

## 3. Conceitos

**Áreas** (organizam por cor)

| Área | Para que serve |
|---|---|
| Trabalho | Viagens, reuniões fora do horário e itens do trabalho que precisam aparecer na agenda pessoal |
| Pessoal | Todo o resto |

**Tipos de item** (identificados visualmente, por exemplo com ícone) **[proposta]**

| Tipo | Descrição |
|---|---|
| Tarefa | Algo a ser feito uma vez. Pode ter prazo e/ou um horário planejado, ambos opcionais (ver 3.1) |
| Hábito | Se repete; deve ser fácil de distinguir de uma tarefa |
| Compromisso | Acontece em um horário imposto por outra pessoa ou por algo externo (ex.: consulta, reunião, voo); ocupa o calendário e pode durar vários dias (ex.: viagem) |
| Treino | Tipo de treino do dia, com check de feito ou não |
| Estudo | Sessões com horário e lista de leituras |

**Repetições aceitas:** todo dia · dias úteis · dias específicos da semana · a cada N dias ou semanas (ex.: a cada 15 dias) · uma vez por mês (ex.: todo dia 5).

**Estados de um item:** pendente · vencido (só itens com prazo, em destaque) · feito · não fazer · reagendado.

### 3.1 Tarefa ou compromisso? Prazo ou horário planejado?

**Tarefa ou compromisso:** o que decide é quem escolhe o horário.
- **Compromisso:** o horário faz parte do próprio item e é imposto por outra pessoa ou por algo externo (consulta, reunião, voo). Teste: "se eu fizer em outro horário ou outro dia, continua sendo a mesma coisa?" Se não, é compromisso. Ele ocupa o calendário e gera aviso de conflito.
- **Tarefa:** o que importa é o resultado. O horário, se houver, é escolhido pela própria pessoa e pode ser movido.

**Duas informações opcionais em cada tarefa:**

| Campo | Pergunta que responde | Exemplo |
|---|---|---|
| Prazo | Até quando? (limite real) | Protocolar até o dia X |
| Quando vou fazer | Quando pretendo encaixar? (escolhido por você) | Mercado, sábado às 10h |

**Situações visíveis de uma tarefa:**
- **A encaixar:** sem "quando vou fazer". Fica em uma lista própria, para não ser esquecida.
- **Agendada:** com dia e hora escolhidos. Aparece no calendário como um bloco que pode ser movido.
- **Com prazo:** mostra "vence em X dias". Uma tarefa pode ter prazo e também estar agendada.
- **Prazo chegando:** uma tarefa com prazo e ainda sem "quando vou fazer" aparece também no topo da lista principal, na seção "Prazos chegando", a partir de 3 dias antes do prazo. Ela sai dali quando for agendada ou concluída.

**Regra do "vencido":** só itens com prazo ficam vencidos (em vermelho). Uma tarefa agendada que não foi feita no dia planejado aparece como pendente, de forma neutra, e não como vencida.

**Repetição:** o que se repete (ex.: mercado toda semana) é um hábito.

## 4. Funcionalidades

### 4.1 Lista principal
- Estilo do Reminder da Samsung: itens um abaixo do outro, com datas claras e itens vencidos destacados.
- Diferente do Reminder: cada item mostra sua área (cor) e seu tipo (ícone), em vez de tratar tudo da mesma forma.
- Tarefas sem data ficam em uma lista "A encaixar"; tarefas com prazo mostram "vence em X dias"; só os itens com prazo vencido aparecem em vermelho.
- No topo da lista, a seção "Prazos chegando" mostra as tarefas ainda não agendadas que vencem nos próximos 3 dias.
- Filtros por área e por tipo **[proposta]**.

### 4.2 Cadastro rápido
Cadastrar um item novo deve ser fácil e rápido (hoje essa é a maior dor).
- **Obrigatórios:** título, tipo e área. Data e hora são obrigatórias para compromisso e hábito. Em uma tarefa, prazo e "quando vou fazer" são opcionais; sem "quando vou fazer", ela vai para "A encaixar", tenha prazo ou não.
- **Opcionais, com padrões prontos:** repetição e lembrete.
- Tudo é classificado na hora do cadastro.

### 4.3 Marcar, não fazer e reagendar
Cada item terá botões claros para:
- **Feito**
- **Não fazer** — o app pergunta em seguida se conta como **falha** ou como **neutro** no histórico.
- **Reagendar**

Uma tarefa agendada que não foi feita no dia planejado fica pendente, de forma neutra, e não aparece como vencida.

### 4.4 Calendário e resumo do mês
- Calendário com compromissos, tarefas, hábitos, treinos e estudos.
- Resumo do mês com as duas visões: dias coloridos conforme o quanto foi concluído e números por hábito.

### 4.5 Trabalho e conflitos
- Itens de trabalho (viagens, reuniões fora do horário) entram na agenda pessoal, inclusive ocupando vários dias.
- **Aviso de conflito:** ao agendar algo pessoal em um dia com item de trabalho, o app avisa. Compromissos ocupam o calendário; tarefas agendadas pela própria pessoa não bloqueiam.

### 4.6 Treino
- Cada dia mostra o tipo de treino, com check de feito ou não.
- Um campo de texto opcional para registrar o plano da semana (atualizado aos domingos, a partir do plano feito fora do app).
- Sem controle do que foi prescrito versus o que foi feito; o detalhamento (cargas, repetições, ritmo) fica fora do app.

### 4.7 Estudo
- Sessões com horário fixo (hoje: terça e quinta, 6h10 às 6h40).
- Lista de leituras com checklist e destaque para o que ler primeiro **[proposta]**.
- Regras da rotina atual: se terça ou quinta desandar, estudo curto na segunda; na versão mínima (dia ruim), 10 minutos de leitura já contam. **[em aberto: como representar isso no app]**

### 4.8 Notificações
- **Lembrete por item**, configurado no cadastro de cada tarefa.
- **Resumo do dia seguinte, todo dia às 20h**, com o que está agendado para amanhã.

### 4.9 Registro opcional de energia e observações **[em aberto, versão futura]**
Um registro diário de 1 ou 2 toques (energia de 1 a 5 e uma nota livre), para depois enxergar padrões. Ainda sem decisão sobre o que se quer observar.

## 5. Visual

- Minimalista, mas colorido: uma cor por área (Trabalho e Pessoal).
- Sem modo escuro.
- Sem animações e sem sons.
- Pensado primeiro para o celular, funcionando bem também no notebook.

## 6. Decisões técnicas

- **PWA** (site instalável na tela inicial do celular), hospedado no GitHub Pages.
- **Supabase** para login e banco de dados, com acesso só da dona do app.
- **Lembretes enviados por um servidor** (notificação push), para que o que for cadastrado em qualquer aparelho dispare no celular na hora certa.
  - O GitHub Pages só hospeda arquivos estáticos e não consegue enviar notificações. Quem envia é uma **Edge Function do Supabase**, chamada a cada minuto por um agendamento no banco (**pg_cron**). A cada execução, ela busca os lembretes que chegaram na hora e envia o push (Web Push). Assim tudo fica no Supabase, sem outro servidor.
  - O resumo das 20h usa o mesmo mecanismo, com um agendamento diário.
- **Primeiro marco técnico:** uma notificação de teste chegando no celular Samsung, antes de construir as funcionalidades. Ponto de atenção: a economia de bateria do Samsung pode atrasar notificações.
- **Backup:** botão para exportar os dados, porque o plano gratuito do Supabase não inclui backups automáticos.
- **Pausa por inatividade:** o plano gratuito pausa projetos com pouca atividade em 7 dias; com uso diário isso não deve ocorrer.

## 7. Rotina semanal de referência

Serve para pré-cadastrar os itens recorrentes.

| Dia | Manhã | Noite |
|---|---|---|
| Segunda | 5h50 ligação · 6h15 natação (técnica) | Tempo meu, leve |
| Terça | 5h50 ligação · 6h10–6h40 estudo · 6h45 saída · 7h Pilates (+ cardio leve opcional) | Tempo meu, leve |
| Quarta | 5h50 ligação · 7h20 musculação A (academia vazia) | Tempo meu, leve |
| Quinta | 5h50 ligação · 6h10–6h40 estudo · 6h45 saída · 7h Pilates (+ cardio leve opcional) | Tempo meu, leve |
| Sexta | 5h50 ligação · 6h15 natação (contínua, leve) | Tempo meu, leve |
| Sábado | Livre | ~14h musculação B (academia livre) |
| Domingo | Descanso · estudo mais longo (opcional) | 15 min de planejamento |

Exemplo de repetição com horário fixo: sobrancelha, todo sábado às 15h.

## 8. Pontos em aberto

1. **Opções de lembrete:** na hora, alguns minutos antes, um dia antes? Pode haver mais de um lembrete por item?
2. **Treino e estudo:** ficam como tipos dentro da área Pessoal? **[proposta: sim]**
3. **Estudo:** como representar sessões fixas, lista de leituras e as regras de reserva e versão mínima.
4. **Registro de energia:** vale entrar? Que padrões se quer enxergar?
5. **Sábado:** a musculação B (~14h) e a sobrancelha (15h) podem se sobrepor; confirmar os horários reais.
6. **Nomes dos campos:** "Prazo" e "Quando vou fazer" ficam bons ou existem nomes que façam mais sentido?

## 9. Ordem de construção **[proposta]**

| Fase | Entrega |
|---|---|
| 0 | Base técnica: repositório, site publicado, instalável no celular e notificação de teste no Samsung |
| 1 | Login, banco de dados, lista principal e cadastro rápido |
| 2 | Repetições e ações (feito, não fazer, reagendar) |
| 3 | Lembretes por item e resumo das 20h |
| 4 | Calendário, resumo do mês, área Trabalho e aviso de conflito |
| 5 | Treino e estudo |
| 6 | Exportar dados e ajustes finais |

Cada fase já deve ser usável sozinha, para ajustar o rumo com base no uso real.
