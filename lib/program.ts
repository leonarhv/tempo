import { callAnimations, type CallAnimation } from "@/lib/call-animations";

// Draft content only. Replace the illustrative copy, people, and images here.
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt?",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  ],
};

export type ProductionMember = {
  id: string;
  name: string;
  role: "Direção" | "Assistência de direção" | "Elenco";
  photo: string | null;
  animation?: CallAnimation;
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
  ...Array.from({ length: 23 }, (_, index) => ({
    id: `elenco-${index + 1}`,
    name: "Lorem ipsum",
    role: "Elenco" as const,
    photo: null,
    animation: callAnimations[(index + 2) % callAnimations.length],
  })),
];

export const processPhotos = [
  {
    title: "Lorem ipsum dolor",
    caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    alt: "Imagem ilustrativa de um grupo de artistas em um exercício de teatro",
    position: "0% 100%",
  },
  {
    title: "Sit amet consectetur",
    caption:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    alt: "Imagem ilustrativa de mãos segurando um texto de teatro anotado",
    position: "50% 100%",
  },
  {
    title: "Adipiscing elit",
    caption:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    alt: "Imagem ilustrativa de dois artistas ensaiando em um palco",
    position: "100% 100%",
  },
];
