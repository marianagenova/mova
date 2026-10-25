# Versão simples (outubro de 2026)

O app ficou com informação demais. A nova versão tem só três telas (**Hoje**, **Calendário**, **Um dia**) e a engrenagem.

## Os três tipos de coisa

| Tipo | Aviso | Se não fizer |
|---|---|---|
| Com hora | Na hora, com Feito e Adiar | Fica na lista até o fim do dia e some |
| Só com dia | No resumo da manhã | Passa sozinha para o dia seguinte |
| Um dia (sem data) | Nenhum | Fica na caixinha "Um dia" |

- Uma coisa só com dia pode ganhar um horário só para hoje (`dados.horasDoDia`). Se não for feita, volta a ser só com dia.
- Não existe mais "reagendar" nem "A encaixar". O que estava em A encaixar aparece em "Um dia".
- Resumo da manhã (padrão 5h15) e aviso do fechamento (padrão 20h): os dois mudam de hora ou desligam na engrenagem (`dados.resumoManha`, `dados.avisoFechamento`). O fechamento mostra o que ficou sem marcar, as metas e o dia seguinte.
- "Não fiz" (desde 25/10/2026): vale só para o que tem hora, é dia todo ou de vários dias. Ao concluir o fechamento, o que ficou sem marcar vira "não fiz" sozinho; tocando no item dá para escrever o motivo (`estados[k] = { estado: "naofeito", em, motivo }`). O que é só com dia continua passando para o dia seguinte.
- Domingo: planejamento em 3 passos (a semana com os prazos, a caixinha Um dia, estudo e treino).
- Saíram: Lista, Histórico, energia e motivos, modelos, metas na tela principal.

Os dados são os mesmos do app anterior. O app novo grava `versaoApp: 2`, `inicioNovo`, `resumoManha`, `horasDoDia` e `enderecoApp`; a função `enviar-avisos` usa esses campos.

## Endereço

Testada em `web/previa/` e, desde 11/10/2026, no endereço principal (`web/index.html`). O endereço `/previa/` leva para o principal.

## Passo a passo no Supabase

1. Em **Edge Functions > enviar-avisos > Code**, troque o código pelo de [`supabase/functions/enviar-avisos/index.ts`](../supabase/functions/enviar-avisos/index.ts) e clique em **Deploy updates**.
2. Em **Edge Functions > marcar-aviso > Code**, troque o código pelo de [`supabase/functions/marcar-aviso/index.ts`](../supabase/functions/marcar-aviso/index.ts) e clique em **Deploy updates**.
