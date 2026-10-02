# 12 capítulos — roteiro de Erick e prompt do site

## Decisão para hoje

Preparar somente o capítulo de outubro de 2025, disponível a partir de 01/10/2026. Os outros capítulos ficam estruturados e recebem conteúdo depois, sem inventar lembranças.

A brincadeira retoma o Escape Room do primeiro encontro: três enigmas pessoais abrem três lembranças; ao final, uma pista bíblica entrega uma palavra da mensagem de aniversário.

Frase proposta, reservada para Erick, com exatamente 12 palavras:

**Em todos os nossos dias, quero te amar com todo meu coração.**

1. Em
2. todos
3. os
4. nossos
5. dias
6. quero
7. te
8. amar
9. com
10. todo
11. meu
12. coração

A primeira extração bíblica está conferida. As referências das outras onze palavras serão conferidas quando prepararmos os capítulos seguintes. Não colocar a frase completa nem os presentes finais no código enviado à visitante nesta primeira publicação.

No encerramento de 12/10, depois da última palavra, a proposta é revelar a frase e conectar o site à caixa física: “Essas doze palavras são uma parte do que eu queria te dizer. Para o resto, escrevi 365 motivos. Agora abre a sua caixinha.” O buquê, a carta e os chocolates acompanham essa entrega. Este encerramento fica reservado e será incorporado ao site perto do aniversário.

O girassol pode voltar no buquê de aniversário como ligação com o pedido original, se Erick quiser e encontrar a flor. O site de hoje não revela isso.

## Prompt para copiar no Claude Code

Copie a partir de “Construa” até o fim deste arquivo.

---

Construa agora um site de enigmas românticos para minha namorada, Alícia. Sou Erick. Vamos completar um ano de namoro em 12/10/2026. Quero mandar o link do primeiro capítulo ainda hoje. Entregue uma implementação completa e funcional, com os textos abaixo e instruções objetivas de publicação. Comece a implementar sem realizar uma nova entrevista.

### Contexto e escopo

Nosso primeiro encontro, em setembro de 2025, foi em um Escape Room no Shopping JK de Taguatinga. Nós somos católicos. Pedi Alícia em namoro em 12/10/2025, no Santíssimo da igreja, com rosas e um girassol no buquê. Minha ideia inicial eram tulipas, mas não encontrei. O girassol é minha flor favorita. Ela estava rezando quando entrei. Esperei aproximadamente um minuto e meio até ela terminar e se levantar. Entreguei as flores, me ajoelhei e fiz o pedido. Depois colocamos alianças de prata e participamos da missa. Mais tarde, ela encontrou pétalas e balões no quarto, preparados por sua irmã; conversei com os pais dela; passamos o restante do dia na casa da avó dela.

O site antigo é uma referência factual: https://erick-rocha-web.github.io/minha-namorada/. Crie uma nova experiência em um projeto ou pasta próprios. Se estiver em um repositório já existente, preserve os arquivos e funcionalidades existentes. Não dependa de consultar o site antigo: todos os fatos necessários para hoje estão neste prompt. Não invente outros acontecimentos.

O presente será uma sequência de 12 capítulos, de 01/10/2026 a 12/10/2026. Cada capítulo relembra um mês e entrega uma única palavra. Na publicação de hoje, implementar somente o capítulo 1. Os outros têm apenas datas e nomes dos meses, com `published: false`. Eles serão preenchidos depois.

Não criar enigmas, versículos, palavras ou cartas para os outros onze capítulos. Não acrescentar uma mensagem final por conta própria. Não criar casamento, pedido de noivado ou outras promessas. Não inserir detalhes de presentes futuros.

### Implementação

Se o projeto já tiver uma base web utilizável, aproveite-a. Em uma pasta vazia, prefiro HTML, CSS e JavaScript puro, com módulos e dados separados, compatíveis com GitHub Pages, sem build obrigatório. Usar caminhos relativos nos assets e imports, inclusive se o site estiver em um subdiretório. Sem backend, cadastro, painel administrativo, serviços pagos ou banco de dados nesta primeira versão.

Arquivos sugeridos: `index.html`, `styles.css`, `app.js` e `chapters.js`. Organize de modo que eu possa adicionar um capítulo editando apenas seus dados, mantendo os anteriores.

Esta primeira versão guarda progresso no navegador, usando uma chave estável de localStorage: `erick-alicia-12-capitulos-2026-v1`. Novas publicações não podem apagar o progresso. Armazenar etapas concluídas, textos já liberados e palavras conquistadas por ID de capítulo. Retomar da etapa correta ao recarregar. Se o armazenamento estiver indisponível ou contiver JSON inválido, continuar funcionando em memória, sem travar a experiência.

Essa persistência vale para o mesmo navegador; não implementar nem prometer sincronização entre aparelhos. Bloqueios por data no front-end servem para conduzir a brincadeira, não são uma barreira de segurança. Manter conteúdos futuros e a frase final fora da primeira publicação.

### Aparência e interação

Direção visual: um pequeno caderno de cartas que também guarda um jogo. Papel claro, vinho profundo, texto escuro e pequenos detalhes dourados. Tipografia serifada nos títulos e uma fonte limpa nos textos. Uma única coluna de leitura, espaços proporcionais e cartões com personalidade. O resultado deve parecer pessoal, feito para uma pessoa específica.

Mobile first: textos com pelo menos 16px, controles confortáveis ao toque, ótimo funcionamento em telas de 360px e leitura agradável no desktop. A primeira tela precisa apresentar o capítulo e permitir iniciar o jogo imediatamente. Cabeçalho compacto; sem hero gigante, depoimentos, seções de marketing ou rodapé comercial.

Usar transições suaves de opacidade e deslocamento curto ao abrir lembranças; um pequeno efeito ao guardar a palavra. Nada pode atrasar a leitura ou o envio da resposta. Respeitar `prefers-reduced-motion`. Não exigir rolagem ou longas animações de digitação para liberar os controles.

Não gerar imagens do casal, não usar fotos de outras pessoas, não depender de imagens externas. O conteúdo e a tipografia devem sustentar esta primeira versão. Sem música automática. Implementar labels, foco visível, envio com Enter e feedback acessível via `aria-live`.

### Estrutura da experiência

1. Abertura curta com título, introdução e botão “Abrir outubro”.
2. Enigma 1. Acertar libera a primeira lembrança. A pessoa lê e toca em “Continuar”.
3. Enigma 2. Acertar libera a segunda lembrança e outro “Continuar”.
4. Enigma 3. Acertar libera a terceira lembrança.
5. Ação “Encontrar a palavra de hoje”, que abre a pista bíblica.
6. Campo para digitar a palavra encontrada. Acertar guarda a palavra na primeira posição e abre o fechamento do capítulo.
7. Um quadro com 12 posições mostra somente palavras conquistadas; posições ainda não conquistadas têm número e espaço vazio, sem sugerir letras ou comprimento.
8. Um mapa compacto de 12 capítulos permite revisitar capítulos disponíveis. Um capítulo concluído permite reler suas cartas sem exigir todas as respostas outra vez.

Cada enigma tem resposta digitada e duas dicas opcionais, mostradas apenas quando solicitadas. Tentativas ilimitadas. Não usar cronômetro, perda de pontos, efeitos agressivos ou mensagens humilhantes. Resposta incorreta: “Ainda não é essa. Quer uma pista?”

Normalizar maiúsculas, minúsculas, acentos, espaços repetidos e pontuação simples. Nas respostas de lugar, aceitar as variantes listadas, preservando a resposta canônica. Não validar apenas por substring: não aceitar automaticamente qualquer frase que contenha uma palavra correta misturada a outra resposta.

### Datas e disponibilidade

Usar explicitamente o fuso `America/Sao_Paulo` para o calendário. Comparar datas ISO obtidas por `Intl.DateTimeFormat`/`formatToParts`; não usar o fuso do aparelho nem assumir que UTC corresponde à data do Brasil.

| Capítulo | Abertura | Memória |
|---|---|---|
| 1 | 2026-10-01 | Outubro de 2025 |
| 2 | 2026-10-02 | Novembro de 2025 |
| 3 | 2026-10-03 | Dezembro de 2025 |
| 4 | 2026-10-04 | Janeiro de 2026 |
| 5 | 2026-10-05 | Fevereiro de 2026 |
| 6 | 2026-10-06 | Março de 2026 |
| 7 | 2026-10-07 | Abril de 2026 |
| 8 | 2026-10-08 | Maio de 2026 |
| 9 | 2026-10-09 | Junho de 2026 |
| 10 | 2026-10-10 | Julho de 2026 |
| 11 | 2026-10-11 | Agosto de 2026 |
| 12 | 2026-10-12 | Setembro de 2026 |

Um capítulo só está disponível quando a data chegou E `published` é verdadeiro. Datas futuras mostram “Abre em DD/MM”. Se a data chegou e o conteúdo ainda não foi publicado, mostrar “A próxima lembrança chega em breve”, sem liberar uma tela vazia. Capítulos publicados continuam disponíveis depois de sua data. Outubro deve continuar acessível mesmo se eu só enviar o link depois da meia-noite. Antes do início, mostrar a data de abertura.

### Conteúdo exato da abertura

Título: “12 capítulos do nosso primeiro ano”

Destinatária: “Para Alícia, do Erick”

Introdução:

“No nosso primeiro encontro, a gente tentou resolver enigmas juntos. Agora eu preparei alguns para você. Cada capítulo guarda uma lembrança nossa e uma palavra. No dia 12, você vai entender o que elas têm para te dizer.”

Instrução curta:

“Resolva as pistas, abra as lembranças e guarde uma palavra por dia. Se precisar, pode pedir uma dica.”

Capítulo: “01 · Outubro de 2025”

Subtítulo: “O dia do seu sim”

Botão: “Abrir outubro”

### Enigma 1 — Uma flor diferente

Enunciado:

“No buquê daquele dia, havia várias flores parecidas e uma diferente. O nome dela guarda uma estrela, e eu a escolhi por um motivo bem meu. Qual era?”

Resposta canônica: `girassol`.

Dica 1: “Ela estava no meio das rosas.”

Dica 2: “É a minha flor favorita. No nome dela tem ‘sol’.”

Texto liberado:

“Eu queria te dar tulipas, mas não encontrei. Então escolhi as rosas e coloquei um girassol no meio, porque é a minha flor favorita. Gosto de lembrar disso: tentei preparar um buquê que você gostasse e acabei deixando um pedacinho meu entre as flores.

Eu estava tão preocupado em preparar tudo que só consegui respirar direito depois de te entregar aquele buquê. E ainda tinha uma pergunta importante para fazer.”

### Enigma 2 — Antes de você se virar

Enunciado:

“Naquele dia, quando eu cheguei, você estava de joelhos. Eu esperei você terminar de rezar, com as flores na mão e uma pergunta na cabeça. Em que lugar da igreja eu te pedi em namoro?”

Resposta canônica: `Santíssimo`.

Variantes aceitas: `santissimo`, `o santissimo`, `no santissimo`, `capela do santissimo`, `na capela do santissimo`, `santissimo sacramento`.

Dica 1: “Não foi no seu quarto nem depois da missa. Foi antes, dentro da igreja.”

Dica 2: “É o lugar em que a gente fica diante de Jesus no Santíssimo Sacramento.”

Texto liberado:

“Eu cheguei dois minutos depois de você. Quando entrei, você estava rezando, e eu esperei até você se levantar. Aquele minuto e meio me pareceu enorme. Eu sabia o que queria te perguntar, mas meu coração não acompanhava a calma que eu tentava mostrar.

Hoje, lembro da sua alegria e do abraço depois do seu sim. Gosto de saber que o nosso primeiro passo como namorados aconteceu ali, diante de Deus.”

### Enigma 3 — O começo escondido

Enunciado:

“O começo destas quatro linhas guarda o dia em que a gente começou. Que número está escondido aqui?”

Mostrar as quatro linhas abaixo separadamente, preservando a primeira letra e a quebra de linha de cada uma:

“Desde aquela manhã, outubro nunca mais foi só outubro.
O buquê chegou antes das palavras.
Zelei por cada detalhe, mesmo nervoso por dentro.
E você disse sim.”

Resposta canônica: `12`. Aceitar também `doze`, `dia 12` e `dia doze`.

Dica 1: “O segredo está no começo de cada linha.”

Dica 2: “Leia só a primeira letra de cada linha, de cima para baixo.”

As iniciais formam D-O-Z-E. Não destacar essas letras antes de ela pedir a segunda dica ou acertar. Depois do acerto, pode destacar o acróstico por alguns segundos.

Texto liberado:

“12 de outubro de 2025. Foi o dia em que eu te pedi em namoro, a gente colocou as alianças e passou a missa bem juntinho. Depois vieram as pétalas no seu quarto, a conversa com seus pais e o resto do dia na casa da sua avó.

Lembro de tudo isso com carinho. Mas, entre tanta coisa que aconteceu, o que mais ficou foi a felicidade de saber que, dali em diante, a gente era um casal.”

### Busca bíblica — A palavra de hoje

Liberar somente depois dos três enigmas e das lembranças anteriores.

Texto introdutório:

“Para fechar esta lembrança, vamos voltar à Palavra de Deus. Lê o versículo inteiro primeiro. A parte que fala de confiar em Deus me faz lembrar de como eu quis começar o nosso namoro. Depois, encontra a palavra indicada e guarda ela aqui.”

Mostrar claramente:

**Jo 14,1 · palavra 8**

Tradução usada na pista: Bíblia Ave-Maria.

Instruções:

“Conte somente as palavras do versículo 1, a partir de 1. Não conte o número do versículo, títulos, notas ou sinais de pontuação. Esta pista usa a tradução Ave-Maria.”

Resposta canônica: `em`. Aceitar `EM` e outras variações de caixa ou pontuação simples.

Campo: “Qual palavra você encontrou?”

Botão: “Guardar minha palavra”

Não mostrar a resposta antes do acerto. A primeira palavra pertence à posição 1 do quadro final. Guardar e exibir `Em` depois do acerto.

Disponibilizar a ação opcional “Minha Bíblia está diferente” para abrir o texto exato usado na pista, sem destaque na palavra certa:

“Não se perturbe o vosso coração. Credes em Deus, crede também em mim.”

Esse texto é o versículo completo usado para a contagem. Ele tem 13 palavras, e a oitava é a resposta. Não alterar sua redação. Não incluir o número “1” como parte do texto contado. A opção é importante porque não sabemos qual edição física ela tem.

Disponibilizar “Consultar a tradução desta pista” com este link, abrindo em outra aba sem perder o progresso:
https://www.liriocatolico.com.br/biblia_online/biblia_ave_maria/sao-joao/14/1/

A redação também foi conferida na publicação da Editora Ave-Maria:
https://revistaavemaria.com.br/jesus-e-o-caminho-a-verdade-e-a-vida.html

Os links são referência; o jogo precisa continuar funcionando sem buscar conteúdo externo em tempo real.

### Fechamento do capítulo

Título: “Nossa primeira palavra ficou guardada”

Texto:

“A primeira palavra é pequena, mas é só o começo. Guarda ela com carinho: ainda faltam onze. Hoje eu quis voltar ao dia em que você disse sim. Amanhã, a gente abre mais uma lembrança.

Te amo.
Erick”

Mostrar a posição 1 preenchida e as outras onze em branco. Permitir reler o capítulo. Não exibir a frase final, flores do próximo presente, caixa, bilhetes, chocolates ou uma contagem de 365.

### Conferência antes de entregar

Teste o fluxo completo do capítulo 1: respostas corretas, incorretas, variações de acento/caixa, dicas opcionais, leitura do versículo alternativo e armazenamento da palavra. Verifique que não é possível pular para uma etapa bloqueada pela interface. Recarregue no meio do jogo e depois da conclusão para conferir a retomada. Confirme que o capítulo 1 continua acessível em 02/10 e que capítulos com `published: false` não abrem mesmo depois da data.

Confira o acróstico D-O-Z-E e a contagem bíblica programaticamente, usando a mesma string de versículo apresentada à visitante. Verifique layout em celular e desktop, sem texto cortado ou rolagem horizontal acidental. Não criar uma suíte extensa de testes para esta página; priorize essas verificações reais do fluxo.

Conclua entregando os arquivos funcionais, um resumo curto do que foi conferido e as instruções mais rápidas para publicar no GitHub Pages. Se a hospedagem já estiver configurada e houver autorização e acesso à publicação, use essa configuração; caso contrário, deixe o projeto pronto e indique os passos que faltam. Não alegue que existe um link publicado antes de uma publicação efetiva.
