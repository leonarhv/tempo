// Dates, times, venue, and the title are taken from the supplied visual identity.
export const program = {
  title: "Tempo",
  subtitle: "Essa noite eu vou sonhar com você",
  instagrams: [
    { name: "@cia.alea.t", url: "https://www.instagram.com/cia.alea.t/" },
    {
      name: "@gatopingado_coletivo",
      url: "https://www.instagram.com/gatopingado_coletivo/",
    },
  ],
  ticketUrl:
    "https://nomacu.com/r/t/de81f104-51b1-4533-93bc-ff8e687b210f?utm_source=tempo" as
      | string
      | null,
  venue: "Teatro Escola Macunaíma",
  room: "Teatro 4",
  synopsis: [
    "Um instante pode conter muito mais do que o relógio é capaz de medir.",
    "Como em um sonho, cotidiano e imaginário se sobrepõem, criando metáforas que nos permitem dizer o que nem sempre cabe em palavras (e a gente ama metáforas).",
    "Inspirada pela obra Velocidade, do grupo Quatroloscinco, de Belo Horizonte/MG, a encenação nasce da pesquisa sobre Tempo e Presença e investiga outras maneiras de experimentar o tempo diante da aceleração da vida contemporânea.",
    "Entre urgências e desvios, somos desafiados a lidar com a pressa de chegar ao futuro e a permanecer no instante enquanto ele acontece, como em um sonho lúcido.",
  ],
};

export type ProductionMember = {
  id: string;
  name: string;
  role: "Direção" | "Assistência de direção" | "Elenco";
  photo: string | null;
  animation?: {
    src: string;
    poster: string;
    alt: string;
  };
  pixelated?: boolean;
};

const castNames = [
  "Ana Dâmaso",
  "Ana Sol",
  "Daniela Ancesque",
  "Diego Castro",
  "Felipe Fonseca",
  "Fernanda Eler",
  "Gabriel Williams",
  "Gui Yabiku",
  "Gustavo Candido",
  "Íris Mota",
  "João Vitor Medeiros",
  "Júlia Leite",
  "Leonardo Vieira",
  "Letizia Pitol Zanuso",
  "Lisandra Pingo",
  "Mabi Martinhos",
  "Murillo Navarro",
  "Nádia Rosa",
  "Sam Fernandes",
  "Sofia Donadelli",
];

// Use local /images/... photo paths when available.
export const productionTeam: ProductionMember[] = [
  {
    id: "direcao",
    name: "André Haidamus",
    role: "Direção",
    photo: "/images/call/andre-haidamus.webp",
  },
  {
    id: "assistencia-direcao",
    name: "Ana Macário",
    role: "Assistência de direção",
    photo: "/images/call/ana-macario.webp",
  },
  {
    id: "assistencia-direcao-2",
    name: "Laís Marques",
    role: "Assistência de direção",
    photo: null,
  },
  {
    id: "alan-silva",
    name: "Alan Silva",
    role: "Elenco",
    photo: null,
    pixelated: true,
  },
  ...castNames.map((name, index) => ({
    id: `elenco-${index + 1}`,
    name,
    role: "Elenco" as const,
    photo: null,
    animation:
      name === "Ana Sol"
        ? {
            src: "/images/call/ana-sol.gif",
            poster: "/images/call/ana-sol-poster.png",
            alt: "Retrato de Ana Sol",
          }
        : undefined,
  })),
];
