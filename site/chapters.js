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
  { id: "02", opens: "2026-10-02", month: "Novembro de 2025", published: false },
  { id: "03", opens: "2026-10-03", month: "Dezembro de 2025", published: false },
  { id: "04", opens: "2026-10-04", month: "Janeiro de 2026", published: false },
  { id: "05", opens: "2026-10-05", month: "Fevereiro de 2026", published: false },
  { id: "06", opens: "2026-10-06", month: "Março de 2026", published: false },
  { id: "07", opens: "2026-10-07", month: "Abril de 2026", published: false },
  { id: "08", opens: "2026-10-08", month: "Maio de 2026", published: false },
  { id: "09", opens: "2026-10-09", month: "Junho de 2026", published: false },
  { id: "10", opens: "2026-10-10", month: "Julho de 2026", published: false },
  { id: "11", opens: "2026-10-11", month: "Agosto de 2026", published: false },
  { id: "12", opens: "2026-10-12", month: "Setembro de 2026", published: false },
];
