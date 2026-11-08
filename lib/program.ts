import { callAnimations, type CallAnimation } from "@/lib/call-animations";

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
    "https://nomacu.com/r/t/de81f104-51b1-4533-93bc-ff8e687b210f?utm_source=tempo" as string | null,
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
  animation?: CallAnimation;
  pixelated?: boolean;
};

// Add each person's name and a local /images/... photo path when available.
export const productionTeam: ProductionMember[] = [
  {
    id: "direcao",
    name: "Lorem ipsum",
    role: "Direção",
    photo: null,
    animation: callAnimations[0],
  },
  {
    id: "assistencia-direcao",
    name: "Lorem ipsum",
    role: "Assistência de direção",
    photo: null,
    animation: callAnimations[1],
  },
  {
    id: "assistencia-direcao-2",
    name: "Lorem ipsum",
    role: "Assistência de direção",
    photo: null,
    animation: callAnimations[2],
  },
  {
    id: "alan-silva",
    name: "Alan Silva",
    role: "Elenco",
    photo: null,
    pixelated: true,
  },
  ...Array.from({ length: 21 }, (_, index) => ({
    id: `elenco-${index + 1}`,
    name: "Lorem ipsum",
    role: "Elenco" as const,
    photo: null,
    animation: callAnimations[(index + 2) % callAnimations.length],
  })),
];
