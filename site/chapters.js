// Dados dos 12 capítulos.
// Para publicar um capítulo novo: preencha os campos dele seguindo o modelo
// de outubro e troque `published` para true. Não altere os `id`s já
// publicados: o progresso salvo no navegador é guardado por eles.

export const SITE = {
  title: "12 capítulos do nosso primeiro ano",
  recipient: "Para Alícia, do Erick",
  intro:
    "No nosso primeiro encontro, a gente tentou resolver enigmas juntos. Dessa vez, eu escondi algumas lembranças em senhas. Cada uma abre um pedaço do nosso primeiro ano e leva até uma palavra. Guarda todas. No dia 12, elas vão ter algo para te dizer.",
  timeZone: "America/Sao_Paulo",
};

export const CHAPTERS = [
  {
    id: "01",
    opens: "2026-10-01",
    month: "Outubro de 2025",
    published: true,
    subtitle: "Antes do seu sim",
    startLabel: "Abrir outubro",

    letter: [
      "Antes de chegar até você, eu já tinha feito várias escolhas. Algumas ficaram só nos planos. Outras eu consegui levar. E, no meio de tudo, deixei um pouquinho de mim.",
      "Para abrir a lembrança de hoje, você vai precisar voltar a essas escolhas. Os nomes que você encontrar vão ajudar a ler o bilhete.",
    ],

    bouquet: {
      title: "O buquê",
      fragments: [
        {
          lead: "O que ficou no plano:",
          text: "eu tinha outra flor em mente, mas a floricultura não me deixou levar aquela primeira ideia.",
        },
        {
          lead: "O que chegou às suas mãos:",
          text: "elas ocuparam o lugar da minha primeira escolha e eram a maior parte do buquê.",
        },
        {
          lead: "O que levei de mim:",
          text: "entre as outras, coloquei uma diferente. Ela estava ali por um gosto meu, e o nome dela guarda a luz que procura.",
        },
      ],
      format: "Pense nos três nomes de flores no singular, sem espaços e sem acentos.",
      storyLink: {
        label: "Voltar à nossa história",
        href: "https://erick-rocha-web.github.io/minha-namorada/",
        note: "Se alguma escolha ficou escondida de você, ela está no relato de outubro.",
      },
    },

    cipher: {
      title: "O bilhete",
      rule: [
        "Descubra os nomes das três flores e conte quantas letras cada nome tem, usando o singular.",
        "Esses números indicam as colunas do bilhete. Na primeira linha, use o número da flor que eu queria levar. Na segunda, o da flor que encontrei. Na terceira, o da minha favorita.",
        "Repita essa ordem nas linhas seguintes. Junte as letras de cima para baixo e separe as palavras para descobrir a senha.",
        "Cada nome guarda um tamanho. Cada tamanho aponta uma coluna.",
        "Leia uma linha por vez, na ordem das escolhas: o que eu queria, o que encontrei e o que levei de mim. Quando chegar à última escolha, volte à primeira. Junte as letras de cima para baixo. A senha é uma frase.",
      ],
      rows: [
        "FPWVPDJC",
        "XZSIAWPE",
        "MWKMZTEA",
        "TJEKJNZR",
        "JNJTCWEX",
        "BJFTDFPE",
        "UTJAHDWR",
        "MCJEPXSJ",
        "RDNWAPUD",
        "CHTEDECF",
        "HPKUJSDC",
        "TCMNAECS",
      ],
      fieldLabel: "A frase que você decifrou",
      placeholder: "Digite a senha",
      buttonLabel: "Abrir a lembrança",
      // Comparação após normalizar e remover espaços: igualdade exata.
      answer: "diantededeus",
      solvedLabel: "Diante de Deus",
      wrong: "A lembrança ainda não abriu. Quer olhar as pistas de novo?",
      hintFirst: "Preciso de uma pista",
      hintMore: "Mais uma pista",
      hints: [
        "Os nomes das flores são a chave. Não é a quantidade de flores no buquê que importa.",
        "Conte as letras de cada nome no singular. Esses três tamanhos indicam as colunas.",
        "Primeira ideia: tulipa. A que eu encontrei: rosa. A minha favorita: girassol. Continue usando essa ordem ao passar pelas linhas.",
        "Na primeira linha, pegue a sexta letra. Na segunda, a quarta. Na terceira, a oitava. Depois repita essa sequência até acabar o bilhete.",
      ],
    },

    reveal: {
      title: "Diante de Deus",
      paragraphs: [
        "É isso. Diante de Deus.",
        "Eu podia ter escolhido outro lugar, mas queria te fazer aquela pergunta ali. Quando entrei, você estava rezando. Esperei você terminar, com o buquê na mão, tentando parecer mais calmo do que eu estava.",
        "Foram só um minuto e meio, mas eu lembro daquela espera até hoje. Depois você se virou, eu te entreguei as flores e me ajoelhei. Veio o seu sim, vieram as alianças e aquele abraço.",
        "A gente ainda passou a missa bem juntinho, e o dia continuou com as pétalas no seu quarto, a conversa com seus pais e o tempo na casa da sua avó. Mas eu quis guardar na senha o lugar em que tudo isso começou.",
        "Quase um ano depois, eu olho para aquele dia e penso no quanto foi bom começar a nossa história com você.",
      ],
      action: "Buscar nossa palavra",
    },

    bible: {
      title: "Nossa palavra",
      reference: "Jo 14,1",
      wordNumber: 8,
      translation: "Bíblia Ave-Maria",
      intro:
        "Uma palavra ficou escondida neste endereço. Encontre e guarde: ela vai fazer sentido quando estiver junto das outras.",
      instructions:
        "Esta pista usa a tradução Ave-Maria. Se sua Bíblia tiver outra redação, consulte o texto disponível aqui.",
      // Texto exato usado na contagem (13 palavras; sem o número do versículo).
      verse: "Não se perturbe o vosso coração. Credes em Deus, crede também em mim.",
      altLabel: "Minha Bíblia está diferente",
      link: "https://www.liriocatolico.com.br/biblia_online/biblia_ave_maria/sao-joao/14/1/",
      linkLabel: "Consultar esta tradução",
      fieldLabel: "Qual palavra você encontrou?",
      buttonLabel: "Guardar nossa palavra",
      wrong: "Ainda não é essa. Volte ao trecho e observe a pista completa.",
      answers: ["em"],
      word: "Em",
    },

    closing: {
      title: "Nossa primeira palavra ficou guardada",
      paragraphs: [
        "Hoje a gente voltou ao lugar em que eu te fiz uma pergunta importante. Obrigado por aquele sim e por tudo que a gente viveu depois dele.",
        "Guarda essa palavra. Ainda tem muita lembrança para abrir e, no dia 12, elas vão se encontrar.",
      ],
      signature: ["Te amo.", "Erick"],
    },
  },
  {
    id: "02",
    opens: "2026-10-02",
    month: "Novembro de 2025",
    published: true,
    puzzleType: "poem-chain",
    subtitle: "O que ficou entre os versos",
    startLabel: "Abrir novembro",

    letter: [
      "Em novembro, a gente completou nosso primeiro mês. Eu te dei uma rosa, a gente trocou presentes e, em outro momento, eu tentei colocar num poema o que estava sentindo.",
      "Hoje escrevi outros versos para lembrar daquele mês. Eles estão fora de ordem. Quando você encontrar o caminho entre eles, ainda vai faltar descobrir o que guardam.",
    ],

    poem: {
      title: "Os versos soltos",
      rule: [
        "O primeiro mês abre o caminho. Depois, cada verso entrega o próximo: sua última palavra reaparece no começo do verso seguinte.",
        "Reorganize os trechos até a lembrança encontrar sua ordem.",
      ],
      // Ordem inicial embaralhada. Não altere a primeira nem a última palavra
      // de cada verso: elas fazem parte da solução.
      verses: [
        { id: "escrever", text: "Escrever foi meu jeito de guardar o que senti em novembro." },
        { id: "amor", text: "Amor que eu fui conhecendo melhor nos dias ao seu lado." },
        { id: "rosa", text: "Rosa simples, mas escolhida para lembrar aquele encontro." },
        { id: "novembro", text: "Novembro não precisou de grandes festas para ter carinho." },
        { id: "primeiro", text: "Primeiro mês de nós dois, e nas minhas mãos, uma rosa." },
        { id: "carinho", text: "Carinho nos presentes, nas conversas e no que virava amor." },
        { id: "sorriso", text: "Sorriso que eu tentava levar para o papel quando ia escrever." },
        { id: "encontro", text: "Encontro que ficava comigo mesmo depois, no seu sorriso." },
      ],
      solution: ["primeiro", "rosa", "encontro", "sorriso", "escrever", "novembro", "carinho", "amor"],
      checkLabel: "Conferir o poema",
      wrongOrder: "Alguns versos ainda não encontraram seu lugar. Olhe para as palavras que ligam um ao outro.",
      rightOrder: "Agora os versos se encontraram. A senha ficou nos começos. Ela é uma única palavra.",
      fieldLabel: "Que palavra o poema esconde?",
      placeholder: "Digite a senha",
      buttonLabel: "Abrir a lembrança",
      // Comparação após normalizar acentos, caixa e espaços: igualdade exata.
      answer: "presenca",
      solvedLabel: "Presença",
      wrong: "O poema está no lugar. Olhe mais uma vez para seus começos.",
      hintFirst: "Preciso de uma pista",
      hintMore: "Mais uma pista",
      hints: [
        "Um verso termina com a palavra que começa o próximo. O verso do primeiro mês vem antes dos outros.",
        "A rosa leva ao encontro. O encontro leva ao sorriso. Continue seguindo essas ligações.",
        "Com os versos na ordem, olhe para o início de cada linha. A senha é menor do que o texto inteiro.",
        "Pegue a primeira letra de cada verso na ordem correta e junte as letras.",
      ],
    },

    reveal: {
      title: "Era você ali",
      paragraphs: [
        "Presença. Foi isso que eu quis guardar nesses versos.",
        "Lembro da rosa, da troca de presentes e da sua reação ao poema. Também lembro de como era bom passar tempo com você. As conversas e as risadas faziam parte do mês tanto quanto aquilo que eu preparava para te dar.",
        "Eu gostava de tentar encontrar um jeito de mostrar o que estava sentindo. Gostava mais ainda quando percebia que você tinha recebido aquele carinho. Ver o quanto você gostou do poema ficou guardado comigo.",
        "Hoje, quando penso naquele mês, o que mais me vem à cabeça é a alegria de ter você por perto. Eu já estava feliz com aquele primeiro mês. Imagina comigo chegando ao primeiro ano.",
      ],
      action: "Buscar nossa palavra",
    },

    bible: {
      title: "Nossa palavra",
      reference: "Mt 11,28",
      wordNumber: 5,
      translation: "Bíblia Ave-Maria",
      intro:
        "O poema já encontrou seu lugar. A palavra de hoje tem outro endereço. Encontre e guarde: ela vai se juntar à de ontem.",
      instructions:
        "Esta pista usa a tradução Ave-Maria. Se sua Bíblia tiver outra redação, consulte o texto disponível aqui.",
      // Texto exato usado na contagem (15 palavras; sem o número do versículo).
      verse: "Vinde a mim, vós todos que estais aflitos sob o fardo, e eu vos aliviarei.",
      altLabel: "Minha Bíblia está diferente",
      link: "https://www.liriocatolico.com.br/biblia_online/biblia_ave_maria/sao-mateus/11/28/",
      linkLabel: "Consultar esta tradução",
      fieldLabel: "Qual palavra você encontrou?",
      buttonLabel: "Guardar nossa palavra",
      wrong: "Ainda não é essa. Volte ao trecho e observe a pista completa.",
      answers: ["todos"],
      word: "todos",
    },

    closing: {
      title: "Mais um pedacinho nosso",
      paragraphs: [
        "Hoje a gente voltou ao nosso primeiro mês, e eu gostei de lembrar do quanto já estava feliz com você.",
        "Guarda mais essa palavra. Tem outros pedaços da nossa história esperando a vez de aparecer.",
      ],
      signature: ["Te amo.", "Erick"],
    },
  },
  {
    id: "03",
    opens: "2026-10-03",
    month: "Dezembro de 2025",
    published: true,
    puzzleType: "gift-logic",
    subtitle: "O que atravessou a virada",
    startLabel: "Abrir dezembro",

    letter: [
      "Eu lembro de você pensando em vários presentes e não conseguindo esperar pelo Natal para me entregar tudo. Cada escolha mostrava que você tinha prestado atenção no que eu gostava.",
      "Hoje coloquei algumas dessas lembranças em quatro embrulhos. Os bilhetes só aparecem quando cada presente encontra seu lugar. Depois deles, ainda falta uma senha para abrir dezembro.",
    ],

    gifts: {
      title: "Os presentes trocaram de lugar",
      rule: [
        "Descubra qual presente pertence a cada embrulho. Siga a sequência Vinho, Azul, Verde e Dourado. Nas pistas, ‘antes’ e ‘depois’ se referem a essa sequência.",
      ],
      // Ordem fixa dos embrulhos. Cores e bilhetes são só do jogo.
      // `answer` e `note` formam o gabarito: o bilhete só aparece após o acerto.
      wraps: [
        { id: "vinho", name: "Vinho", tone: "wine", answer: "creeper", note: "20" },
        { id: "azul", name: "Azul", tone: "blue", answer: "kuromi", note: "31" },
        { id: "verde", name: "Verde", tone: "green", answer: "camisa", note: "12" },
        { id: "dourado", name: "Dourado", tone: "gold", answer: "colar", note: "25" },
      ],
      options: [
        { id: "kuromi", label: "Funko da Kuromi" },
        { id: "camisa", label: "Camisa do Jotapê" },
        { id: "creeper", label: "Creeper do Minecraft" },
        { id: "colar", label: "Colar com seus olhos" },
      ],
      emptyOption: "Escolha um presente",
      clues: [
        "O presente ligado a um jogo está em um dos extremos.",
        "O presente que guarda um olhar está imediatamente depois daquele que lembra minhas músicas.",
        "O presente que eu escolhi para você vem depois do presente ligado ao jogo e antes daquele que lembra minhas músicas.",
      ],
      checkLabel: "Conferir os embrulhos",
      incomplete: "Escolha um presente para cada embrulho antes de conferir.",
      repeated: "Cada presente pertence a um único embrulho.",
      wrongCombo: "Algum presente ainda está fora do lugar. Cruze as pistas antes de tentar de novo.",
      giftHints: [
        "O presente ligado ao jogo é o Creeper. O que guarda um olhar é o colar.",
        "A Kuromi foi o presente que eu escolhi para você. Ela precisa ficar entre o Creeper e a camisa.",
        "O Creeper não pode ficar no último embrulho: ainda precisam existir lugares depois dele para a Kuromi e a camisa.",
      ],
      noteLabel: "Bilhete",
      found: "Cada presente encontrou seu lugar. Agora os bilhetes precisam encontrar uma ordem de leitura.",
      reading: [
        "Comece pelo presente que eu te dei. Depois, siga os que você me deu: a música, o jogo e o olhar.",
        "Junte os quatro pares de números nessa ordem. Eles guardam uma data: a noite em que um beijo nosso atravessou dois anos.",
      ],
      fieldLabel: "Que data os bilhetes guardam?",
      placeholder: "Dia, mês e ano",
      buttonLabel: "Abrir a lembrança",
      // Aceita 31122025 ou separadores /, -, . e espaço entre dia, mês e ano.
      answer: "31122025",
      solvedLabel: "31/12/2025",
      wrong: "Essa data ainda não abre a lembrança. Confere a ordem em que você leu os bilhetes.",
      hintFirst: "Preciso de uma pista",
      hintMore: "Mais uma pista",
      hints: [
        "A ordem de leitura dos bilhetes é diferente da ordem dos embrulhos.",
        "Leia primeiro o bilhete da Kuromi. Depois, camisa, Creeper e colar.",
        "Junte os pares sem inverter seus algarismos. A senha tem dia, mês e ano.",
      ],
    },

    reveal: {
      title: "Desde o ano passado",
      paragraphs: [
        "31 de dezembro de 2025.",
        "Foi nessa noite que a gente entrou em outro ano se beijando. Depois veio aquela brincadeira de dizer que eu já estava te beijando desde o ano passado. Eu ainda gosto de lembrar disso.",
        "Mas dezembro também ficou guardado em outras coisas. Na Kuromi que escolhi para você, na camisa do Jotapê, no Creeper e, principalmente, naquele colar com seus olhos. Achei tão bonito você transformar uma coisa tão sua em algo que eu pudesse guardar comigo.",
        "Te levar para conhecer minha família no Natal, voltar para casa e assistir filme juntos também fez parte daquele mês. Gosto de lembrar de você vivendo esses momentos comigo.",
        "Quando penso naquela virada, lembro da alegria de começar mais um ano sabendo que você estava ao meu lado.",
      ],
      action: "Buscar nossa palavra",
    },

    bible: {
      title: "Nossa palavra",
      reference: "Lc 2,18",
      wordNumber: 2,
      translation: "Bíblia Ave-Maria",
      intro:
        "Dezembro também nos leva à história do Natal. A palavra de hoje está neste endereço. Encontre e guarde mais um pedaço da nossa mensagem.",
      instructions:
        "Esta pista usa a tradução Ave-Maria. Se sua Bíblia tiver outra redação, consulte o texto disponível aqui.",
      // Texto exato usado na contagem (sem o número do versículo).
      verse: "Todos os que os ouviam admiravam-se das coisas que lhes contavam os pastores.",
      altLabel: "Minha Bíblia está diferente",
      link: "https://www.liriocatolico.com.br/biblia_online/biblia_ave_maria/sao-lucas/2/18/",
      linkLabel: "Consultar esta tradução",
      fieldLabel: "Qual palavra você encontrou?",
      buttonLabel: "Guardar nossa palavra",
      wrong: "Ainda não é essa. Volte ao trecho e observe a pista completa.",
      answers: ["os"],
      word: "os",
    },

    closing: {
      title: "Mais uma lembrança ficou guardada",
      paragraphs: [
        "Hoje a gente abriu alguns presentes de novo e voltou àquela virada.",
        "Eu gostei de começar aquele ano com você. Agora gosto de estar chegando ao nosso primeiro ano juntos e de preparar tudo isso para te fazer lembrar comigo.",
        "Guarda mais essa palavra. Nossa mensagem está tomando forma.",
      ],
      signature: ["Te amo.", "Erick"],
    },
  },
  {
    id: "04",
    opens: "2026-10-04",
    month: "Janeiro de 2026",
    published: true,
    puzzleType: "phone-cipher",
    subtitle: "O recado escondido",
    startLabel: "Abrir janeiro",

    letter: [
      "Em janeiro, eu achei que já sabia como seria meu aniversário. Acabei passando quase três horas longe de casa, acompanhando meu irmão num passeio que começou com um celular e a promessa de um milkshake.",
      "Transformei aquele dia em um recado escondido. O celular foi parte daquela história. Agora ele vai ajudar você a abrir essa lembrança.",
    ],

    phone: {
      title: "O celular",
      rule: [
        "Este recado foi escrito num tempo em que uma tecla precisava dizer várias coisas. Os espaços entre os grupos são pequenas pausas. Descubra as letras e encontre a frase.",
      ],
      // Teclado antigo com múltiplos toques: cada grupo é uma letra e cada
      // repetição avança uma letra na mesma tecla. Resulta em MEUPRESENTEERAVOCE.
      message: "6 33 88 7 777 33 7777 33 66 8 33 33 777 2 888 666 222 33",
      keys: [
        { digit: "1", letters: "" },
        { digit: "2", letters: "ABC" },
        { digit: "3", letters: "DEF" },
        { digit: "4", letters: "GHI" },
        { digit: "5", letters: "JKL" },
        { digit: "6", letters: "MNO" },
        { digit: "7", letters: "PQRS" },
        { digit: "8", letters: "TUV" },
        { digit: "9", letters: "WXYZ" },
      ],
      fieldLabel: "Qual frase estava escondida?",
      placeholder: "Escreva o recado",
      buttonLabel: "Abrir a lembrança",
      // Comparação após normalizar e remover espaços: igualdade exata.
      answer: "meupresenteeravoce",
      solvedLabel: "Meu presente era você",
      wrong: "O recado ainda não abriu a lembrança. Confere os grupos e tenta de novo.",
      hintFirst: "Preciso de uma pista",
      hintMore: "Mais uma pista",
      hints: [
        "Uma mesma tecla guarda várias letras. Para chegar à próxima, você precisa tocar nela outra vez.",
        "Na tecla 2, um toque escreve A, dois escrevem B e três escrevem C. Cada grupo do recado representa uma letra.",
        "Os três primeiros grupos são 6, 33 e 88. Eles formam MEU. Continue do mesmo jeito e depois separe as palavras.",
      ],
    },

    reveal: {
      title: "Meu presente era você",
      paragraphs: [
        "Dia 8 de janeiro caiu numa quinta-feira. A comemoração com os amigos ficou para o sábado, mas eu queria muito te ver no dia do meu aniversário.",
        "Quando você disse que não ia conseguir ir, eu fiquei triste. Acreditei direitinho.",
        "Depois meu irmão me chamou para ir ao shopping, com a história de comprar um celular e a promessa de um milkshake. A gente ficou quase três horas por lá, e eu fui acompanhando sem perceber o que aquele passeio estava ajudando a preparar.",
        "Quando voltei para casa e entrei no quarto, encontrei tudo decorado. E encontrei você, segurando um bolo com a vela acesa, pronta para cantar parabéns.",
        "Eu lembro da alegria de te ver ali. Você tinha pensado em mim, preparado aquela surpresa e encontrado um jeito de estar comigo naquele dia.",
        "No sábado ainda vieram as pizzas que eu fiz, os amigos, o Switch Sports e as brincadeiras. Depois que todo mundo foi embora, você ficou, e a gente pôde deitar juntinho e descansar.",
        "Mas a senha de hoje guarda o que eu senti quando abri a porta do quarto: meu presente era você.",
        "Obrigado por fazer meu aniversário virar uma lembrança tão boa de nós dois.",
      ],
      action: "Buscar nossa palavra",
    },

    bible: {
      title: "Nossa palavra",
      reference: "Lc 1,79",
      wordNumber: 18,
      translation: "Bíblia Ave-Maria",
      intro: "A lembrança abriu. Agora procura o que ficou guardado neste versículo. Quando encontrar, traz para cá.",
      // Sem `instructions`: este capítulo não traz texto de ajuda além do trecho.
      // No trecho alternativo, mostra só a tradução acima do texto.
      altHeading: "Bíblia Ave-Maria",
      // Texto exato da resposta (sem o número do versículo). Não altere.
      verse:
        "que há de iluminar os que jazem nas trevas e na sombra da morte e dirigir os nossos passos no caminho da paz.",
      altLabel: "Minha Bíblia está diferente",
      link: "https://www.liriocatolico.com.br/biblia_online/biblia_ave_maria/sao-lucas/1/79/",
      linkLabel: "Consultar esta tradução",
      fieldLabel: "Qual palavra você encontrou?",
      buttonLabel: "Guardar nossa palavra",
      wrong: "Ainda não é essa. Se precisar, consulte o texto em ‘Minha Bíblia está diferente’.",
      answers: ["nossos"],
      word: "nossos",
    },

    closing: {
      title: "Mais uma lembrança ficou guardada",
      paragraphs: [
        "Eu saí de casa achando que sabia o que estava acontecendo. Voltei e encontrei uma surpresa que você tinha preparado com carinho.",
        "Hoje eu queria te devolver um pouquinho daquela alegria.",
        "Guarda nossa palavra. Amanhã tem mais um pedaço da nossa história.",
      ],
      signature: ["Te amo.", "Erick"],
    },
  },
  {
    id: "05",
    opens: "2026-10-05",
    month: "Fevereiro de 2026",
    published: true,
    puzzleType: "picture-logic",
    subtitle: "O que nasceu dos seus traços",
    startLabel: "Abrir fevereiro",

    letter: [
      "Em fevereiro, a gente continuou fazendo coisas que já tinham virado parte de nós: caminhar no parque, conversar e aproveitar o tempo juntos.",
      "Uma foto nossa acabou ganhando outra vida pelas suas mãos. E os seus traços me deram uma ideia que continua chegando até você.",
      "Hoje eu escondi uma frase dentro de um desenho. Para encontrar, você vai precisar descobrir quais partes dele devem ganhar cor.",
    ],

    drawing: {
      title: "Entre os traços",
      rule: [
        "Os números ao lado de cada linha e acima de cada coluna indicam os grupos de casas que precisam ser pintados, na ordem em que aparecem.",
        "Cada grupo deve ser contínuo. Quando houver dois grupos, deixe pelo menos uma casa sem pintar entre eles.",
        "Por exemplo: 1 1 pede duas casas isoladas, separadas por pelo menos uma casa sem pintura. Um 4 pede quatro casas seguidas.",
        "As pistas das linhas e das colunas precisam funcionar ao mesmo tempo.",
        "Toque numa casa para pintá-la. Toque novamente para marcar um X, e mais uma vez para limpar.",
      ],
      // Letras da grade, de cima para baixo. Não altere: as casas pintadas
      // formam VOCEDESENHOUMEUMUNDO.
      rows: ["AVRIOT", "CEDESE", "NHOUME", "LUMUNR", "SADOIL"],
      rowClues: [[1, 1], [6], [6], [4], [2]],
      colClues: [[2], [4], [4], [4], [4], [2]],
      // Gabarito (1 = pintada). Só usado na conferência; nunca aparece na página.
      solution: ["010010", "111111", "111111", "011110", "001100"],
      checkLabel: "Conferir desenho",
      clearLabel: "Limpar desenho",
      wrongDrawing: "Alguns traços ainda não encaixaram. Confere as pistas das linhas e das colunas.",
      found:
        "O desenho apareceu. Agora leia somente as letras das casas pintadas, linha por linha, da esquerda para a direita. Separe as palavras e descubra a frase.",
      fieldLabel: "Qual frase apareceu nos seus traços?",
      placeholder: "Escreva a frase",
      buttonLabel: "Abrir a lembrança",
      // Comparação após normalizar e remover espaços: igualdade exata.
      answer: "vocedesenhoumeumundo",
      solvedLabel: "Você desenhou meu mundo",
      wrong: "A frase ainda não abriu a lembrança. Leia apenas as casas pintadas, seguindo a ordem das linhas.",
      hintFirst: "Preciso de uma pista",
      hintMore: "Mais uma pista",
      hints: [
        "Uma linha que pede 6 ocupa toda a largura do desenho. Você tem duas linhas assim. Comece por elas.",
        "As duas colunas das extremidades pedem apenas duas casas seguidas. Essas casas já aparecem nas duas linhas inteiras. O restante dessas colunas fica sem pintura.",
        "Na última linha, o grupo de duas casas fica bem no centro. Use essa descoberta para conferir as colunas e terminar os outros traços.",
      ],
    },

    reveal: {
      title: "Você desenhou meu mundo",
      paragraphs: [
        "Eu lembro dos nossos passeios no parque. A gente caminhava, conversava, ria e tirava fotos. Uma delas parecia apenas mais um registro bonito de nós dois.",
        "Depois você me mostrou o que tinha feito com ela.",
        "Você recriou nossa foto à mão, usando giz. Eu fiquei olhando os detalhes, tentando entender como você tinha conseguido colocar tanta coisa nossa naquele desenho.",
        "Eu já sabia que você desenhava bem. Ver aquele cuidado inteiro dedicado a uma lembrança nossa me deixou impressionado e muito feliz.",
        "Até hoje eu guardo o carinho que senti quando recebi aquele presente.",
        "Foi ali que comecei a pensar em criar alguma coisa para você com o que eu sabia fazer. Eu queria dedicar tempo, escolher os detalhes e guardar nossa história de um jeito meu.",
        "Então comecei a transformar as lembranças em páginas, textos e código. A ideia do meu primeiro site para você nasceu daquele desenho.",
        "E agora você está aqui, abrindo mais uma parte dessa história.",
        "Gosto de pensar que os seus traços continuam aparecendo no que eu faço. Uma foto no parque virou um desenho nas suas mãos. Aquele desenho virou uma ideia na minha cabeça. E essa ideia ainda está me ajudando a dizer o quanto eu amo você.",
      ],
      action: "Buscar nossa palavra",
    },

    bible: {
      title: "Nossa palavra",
      reference: "Sl 89,12",
      wordNumber: 7,
      translation: "Bíblia Ave-Maria",
      intro: "A lembrança abriu. Agora tem mais uma coisa para encontrar neste versículo. Quando descobrir, traz para cá.",
      // Sem `instructions`, como em janeiro.
      altHeading: "Bíblia Ave-Maria",
      // Texto exato da resposta (sem o número do versículo). Não altere.
      verse: "Ensinai-nos a bem contar os nossos dias, para alcançarmos o saber do coração.",
      altLabel: "Minha Bíblia está diferente",
      link: "https://www.liriocatolico.com.br/biblia_online/biblia_ave_maria/salmos/89/12/",
      linkLabel: "Consultar esta tradução",
      fieldLabel: "Qual palavra você encontrou?",
      buttonLabel: "Guardar nossa palavra",
      wrong: "Ainda não é essa. Se precisar, consulte o texto em ‘Minha Bíblia está diferente’.",
      answers: ["dias"],
      word: "dias",
    },

    closing: {
      title: "Um pouco dos seus traços ficou aqui",
      paragraphs: [
        "Obrigado por ter colocado tanto carinho naquela foto nossa.",
        "Você me deu uma lembrança que eu podia guardar e uma ideia que eu podia continuar construindo.",
        "Hoje, cada detalhe desta página também foi pensado para você.",
        "Guarda nossa palavra. Ainda temos mais lembranças para abrir.",
      ],
      signature: ["Te amo.", "Erick"],
    },
  },
  { id: "06", opens: "2026-10-06", month: "Março de 2026", published: false },
  { id: "07", opens: "2026-10-07", month: "Abril de 2026", published: false },
  { id: "08", opens: "2026-10-08", month: "Maio de 2026", published: false },
  { id: "09", opens: "2026-10-09", month: "Junho de 2026", published: false },
  { id: "10", opens: "2026-10-10", month: "Julho de 2026", published: false },
  { id: "11", opens: "2026-10-11", month: "Agosto de 2026", published: false },
  { id: "12", opens: "2026-10-12", month: "Setembro de 2026", published: false },
];
