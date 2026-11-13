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
  ticketUrl: null as string | null,
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
  video?: {
    src: string;
    poster: string;
  };
  pixelated?: boolean;
};

const castMembers: [name: string, portraitFile?: string, video?: ProductionMember["video"]][] = [
  ["Alan Silva"],
  ["Ana Dâmaso", "ana-damaso.webp"],
  ["Ana Sol"],
  ["Daniela Ancesque", "daniela-ancesque.webp"],
  ["Diego Castro", "diego-castro.webp"],
  ["Felipe Fonseca", "felipe-fonseca.webp"],
  ["Fernanda Eler", "fernanda-eler.webp"],
  ["Gabryel Williams", "gabriel-williams.webp"],
  ["Gui Yabiku", "gui-yabiku.webp"],
  ["Gustavo Candido", "gustavo-candido.webp"],
  ["Íris Mota", "iris-mota.webp"],
  ["João Vitor Medeiros", "joao-vitor-medeiros.webp"],
  ["Júlia Leite", "julia-leite.webp"],
  ["Leonardo Vieira", "leonardo-vieira.webp"],
  ["Letizia Pitol Zanuso", "letizia-pitol-zanuso.webp"],
  ["Lisandra Pingo", "lisandra-pingo.webp"],
  ["Mabi Martinho", "mabi-martinhos.webp"],
  [
    "Murillo Navarro",
    "murillo-navarro.webp",
    {
      src: "/images/call/murillo-navarro.mp4",
      poster: "/images/call/murillo-navarro-poster.webp",
    },
  ],
  ["Nádia Rosa", "nadia-rosa.webp"],
  ["Ian Fernandes", "ian-fernandes.webp"],
  ["Sofia Donadelli", "sofia-donadelli.webp"],
];

const castAnimations: Partial<Record<string, string>> = {
  "Alan Silva": "alan-silva",
  "Ana Dâmaso": "ana-damaso",
  "Ana Sol": "ana-sol",
  "Diego Castro": "diego-castro",
  "Felipe Fonseca": "felipe-fonseca",
  "Fernanda Eler": "fernanda-eler",
  "Gabryel Williams": "gabriel-williams",
  "Gui Yabiku": "gui-yabiku",
  "Gustavo Candido": "gustavo-candido",
  "Ian Fernandes": "ian-fernandes",
  "Íris Mota": "iris-mota",
  "Júlia Leite": "julia-leite",
  "Leonardo Vieira": "leonardo-vieira",
  "Letizia Pitol Zanuso": "letizia-pitol-zanuso",
  "Lisandra Pingo": "lisandra-pingo",
  "Mabi Martinho": "mabi-martinhos",
  "Nádia Rosa": "nadia-rosa",
};

// Use local /images/... photo paths when available.
export const productionTeam: ProductionMember[] = [
  {
    id: "direcao",
    name: "André Haidamus",
    role: "Direção",
    photo: "/images/call/andre-haidamus.webp",
    video: {
      src: "/images/call/andre-haidamus.mp4",
      poster: "/images/call/andre-haidamus-poster.webp",
    },
  },
  {
    id: "assistencia-direcao",
    name: "Ana Macário",
    role: "Assistência de direção",
    photo: "/images/call/ana-macario.webp",
    animation: {
      src: "/images/call/ana-macario.gif",
      poster: "/images/call/ana-macario-poster.png",
      alt: "Retrato de Ana Macário",
    },
  },
  {
    id: "assistencia-direcao-2",
    name: "Laís Marques",
    role: "Assistência de direção",
    photo: "/images/call/lais-marques.webp",
  },
  ...castMembers.map(([name, portraitFile, video], index): ProductionMember => {
    const animationName = castAnimations[name];

    return {
      id: `elenco-${index + 1}`,
      name,
      role: "Elenco",
      photo: portraitFile ? `/images/call/${portraitFile}` : null,
      video,
      animation: animationName
        ? {
            src: `/images/call/${animationName}.gif`,
            poster: `/images/call/${animationName}-poster.png`,
            alt: `Retrato de ${name}`,
          }
        : undefined,
    };
  }),
];
