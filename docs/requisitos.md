# Requisitos do app de tarefas e rotina

**Versão 3 — rascunho para revisão · 4 de outubro de 2026**

> Documento vivo. Registra o que já foi decidido, o que é proposta e o que ainda está em aberto.
> **[proposta]** = sugestão ainda não confirmada · **[em aberto]** = precisa de decisão.

---

## 1. Objetivo

Um único lugar para soltar tudo o que precisa ser feito (tarefas, inclusive as que se repetem, compromissos, treino e estudo), marcar o que foi concluído e ver depois o quanto foi feito.

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
| Tarefa | Algo a ser feito. Pode acontecer uma vez (com prazo e/ou horário planejado, ambos opcionais, ver 3.1) ou se repetir (ex.: ligação nos dias úteis), com ícone de repetição |
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

**Repetição:** uma tarefa pode se repetir (ex.: mercado toda semana). O tipo "Hábito" existia antes e foi unido a Tarefa. Uma tarefa que se repete precisa do dia de início (a hora é opcional), não tem prazo, não vai para "A encaixar" e não fica vencida: cada dia é marcado como feito, não fazer ou reagendado.

## 4. Funcionalidades

### 4.1 Lista principal
- Estilo do Reminder da Samsung: itens um abaixo do outro, com datas claras e itens vencidos destacados.
- Diferente do Reminder: cada item mostra sua área (cor) e seu tipo (ícone), em vez de tratar tudo da mesma forma.
- Tarefas sem data ficam em uma lista "A encaixar"; tarefas com prazo mostram "vence em X dias"; só os itens com prazo vencido aparecem em vermelho.
- No topo da lista, a seção "Prazos chegando" mostra as tarefas ainda não agendadas que vencem nos próximos 3 dias.
- Filtros por área e por tipo **[proposta]**.

### 4.2 Cadastro rápido
Cadastrar um item novo deve ser fácil e rápido (hoje essa é a maior dor).
- **Obrigatórios:** título, tipo e área. Data e hora são obrigatórias para compromisso, treino e estudo. Em uma tarefa que não se repete, prazo e "quando vou fazer" são opcionais; sem "quando vou fazer", ela vai para "A encaixar", tenha prazo ou não.
- **Opcionais, com padrões prontos:** repetição e lembrete.
- Tudo é classificado na hora do cadastro.
- A hora é digitada direto, com o teclado de números (ex.: 1430 vira 14:30), sem o relógio do Android.

### 4.3 Marcar, não fazer e reagendar
Cada item terá botões claros para:
- **Feito**
- **Não fazer** — o app pergunta em seguida se conta como **falha** ou como **neutro** no histórico.
- **Reagendar**

Cada item também pode ser **editado** ou **excluído**. Ao excluir um item que se repete, o app pergunta o que excluir: **só este dia**, **este e os próximos** (a repetição termina no dia anterior e o histórico continua) ou **todos, inclusive o histórico**.

Uma tarefa agendada que não foi feita no dia planejado fica pendente, de forma neutra, e não aparece como vencida.

### 4.4 Calendário e resumo do mês
- Calendário com compromissos, tarefas, treinos e estudos, e os dias coloridos conforme o quanto foi concluído.
- Ao tocar num dia: os itens daquele dia e o registro "como foi o dia".
- Os números do mês (por item que se repete, metas, energia) ficam no Histórico (ver 4.15), e não no calendário.

### 4.4.1 Uma função para cada aba
Cada informação aparece em um lugar só:

| Aba | Para que serve |
|---|---|
| Dia | Fazer o dia de hoje: agora (com o que já passou sem marcação), metas, linha do tempo e fechar o dia |
| Lista | Os próximos dias: para resolver, prazos chegando e os próximos 7 dias |
| A encaixar | Tarefas sem dia para fazer |
| Calendário | O mês e o que aconteceu em cada dia |
| Histórico | Todos os números, por mês: o compilado do mês |

O planejamento de domingo é a única exceção: mostra os números da semana, porque faz parte do ritual de planejar.

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

### 4.9 Fechamento do dia e registro de energia
O dia é fechado à noite, em dois passos:
1. **O que ficou em aberto:** o app lista os itens do dia sem decisão, e cada um recebe feito, não fazer ou reagendar. Nenhum dia termina com coisa em aberto.
2. **Como foi o dia:** energia de 1 a 5 (um toque) e uma frase livre, opcional.

O registro aparece no calendário (no dia escolhido) e, somado, no Histórico do mês (diário e gráfico de energia).

### 4.9.1 Metas do dia
Coisas que não têm horário e não são tarefas, marcadas uma vez por dia:
- **Parar** (ex.: comer doces): "Evitei" ou "Não evitei".
- **Começar** (ex.: comer salada, comer frutas): "Fiz" ou "Não fiz".
- **Por quantidade (opcional):** a meta pode ter um número por dia, marcado com um toque (0, 1, 2…). Em "Começar", conta como cumprida se chegar pelo menos ao alvo (ex.: pelo menos 2 porções de fruta). Em "Parar", se ficar no máximo no limite (ex.: nenhum doce). O compilado mostra também o total e a média por dia.

São marcadas na visão do dia ou no fechamento do dia, e é possível criar metas novas. O compilado (dias cumpridos, não cumpridos e sem marcar) fica no Histórico, por mês, e na semana do planejamento de domingo. Na primeira semana de cada mês, a visão do dia avisa que o compilado do mês anterior está pronto, com um botão que leva até ele.

### 4.10 Visão do dia
- **Trocar de dia:** setas ‹ › ou deslizar o dedo (para a esquerda, o dia seguinte; para a direita, o dia anterior).
- **Agora:** a atividade do momento (que dá para marcar ali mesmo), o que vem a seguir e em quanto tempo, e a lista "Já passou o horário · falta marcar" com os itens de hoje cujo horário terminou sem marcação.
- **Linha do tempo:** os itens desenhados nas horas do dia, mostrando os espaços livres. Itens que se sobrepõem ficam destacados, com um aviso. Tocar num bloco abre o item numa janela, com os detalhes e os botões de ação.
- **Duração e carga do dia:** cada item tem uma duração estimada (com um padrão por tipo). O dia mostra o total planejado e aparece como "pesado" acima de 6 horas.

### 4.11 Etapas
- **Etapas dentro de uma tarefa:** uma tarefa pode ser dividida em etapas, e o app destaca a próxima. Quando todas são marcadas, a tarefa é concluída.

### 4.12 Versão mínima e plano B
- **Versão mínima:** uma tarefa que se repete, um treino ou um estudo pode ter uma versão para dia ruim (ex.: "10 minutos de leitura"). Ela conta como feita, mas aparece separada no histórico.
- **Plano B:** um item pode ter uma alternativa definida (ex.: "estudo curto na segunda"). Ao marcar "não fazer", o app oferece criar o plano B.
- **Motivo do "não fiz":** opcional, com opções rápidas (cansaço, imprevisto, trabalho, saúde, esqueci, outro).

### 4.13 Modelos
Modelos criam um item já preenchido e os itens que costumam vir junto:
- **Viagem de trabalho:** compromisso de vários dias, mais "Fazer a mala" na véspera (com a lista da mala) e "Reembolso" com prazo de 5 dias depois da volta.
- **Consulta:** compromisso, mais "Separar documentos e exames" na véspera.

### 4.14 Planejamento da semana (domingo)
Uma tela guiada para os 15 minutos de domingo:
1. Como foi a semana: percentual concluído, versão mínima, falhas, energia média e números por item que se repete.
2. Prazos e tarefas a encaixar, com o botão de agendar.
3. Carga dos próximos 7 dias, dias pesados, sobreposições e conflitos com Trabalho.
4. Plano de treino da semana (texto).

### 4.15 Detalhes, histórico e busca
- **Detalhes no item:** onde, o que levar e observações.
- **Histórico, por mês** (com setas para trocar o mês): percentual concluído e números de tudo o que se repete (com a versão mínima separada), metas do dia, energia, motivos de "não fiz" e diário. É o compilado do mês.
- **Busca** em itens, notas, etapas e diário.

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
4. **Registro de energia:** decidido que entra (ver 4.9). Que padrões se quer enxergar além do gráfico de energia?
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

**[em aberto]** As funcionalidades de 4.9 a 4.15 (incluindo as metas do dia, 4.9.1) estão na versão de teste do app (`web/index.html`, com dados salvos só no aparelho) e ainda precisam ser distribuídas nas fases.
