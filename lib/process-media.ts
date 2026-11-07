export type ProcessPhoto = {
  id: string;
  type: "photo";
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProcessVideo = {
  id: string;
  type: "video";
  title: string;
  youtubeId: string;
  format: "landscape" | "portrait";
};

export type ProcessMedia = ProcessPhoto | ProcessVideo;
export const INITIAL_MEDIA_COUNT = 7;

const photos: ProcessPhoto[] = [
  {
    id: "ensaio-grupo",
    type: "photo",
    title: "Ensaio em grupo",
    src: "/images/process/ensaio-grupo.jpg",
    alt: "Integrantes do grupo em ensaio, segurando folhas de texto e levantando os braços.",
    width: 1600,
    height: 900,
  },
  {
    id: "projecao",
    type: "photo",
    title: "Luz e projeção",
    src: "/images/process/projecao.jpg",
    alt: "Pessoas em uma sala escura experimentando sombras e uma projeção na parede.",
    width: 960,
    height: 1280,
  },
  {
    id: "encontro-elenco",
    type: "photo",
    title: "Encontro do elenco",
    src: "/images/process/encontro-elenco.jpg",
    alt: "Integrantes do elenco reunidos lado a lado em uma sala de ensaio.",
    width: 1600,
    height: 1200,
  },
  {
    id: "objetos",
    type: "photo",
    title: "Objetos em cena",
    src: "/images/process/objetos.jpg",
    alt: "Objetos recortados sobre uma caixa projetando sombras na parede.",
    width: 960,
    height: 1280,
  },
  {
    id: "luz-sombra",
    type: "photo",
    title: "Luz e sombra",
    src: "/images/process/luz-sombra.jpg",
    alt: "Integrantes do grupo explorando luz, sombras e objetos diante de uma projeção.",
    width: 960,
    height: 1280,
  },
];

function video(youtubeId: string, format: ProcessVideo["format"]): ProcessVideo {
  return {
    id: youtubeId,
    type: "video",
    title: format === "portrait" ? "Short do processo" : "Vídeo do processo",
    youtubeId,
    format,
  };
}

// Order here is the order in the mural and viewer. The first seven form the preview.
// Add photos under public/images/process/ and video entries with their YouTube ID.
export const processMedia: ProcessMedia[] = [
  photos[0],
  video("JvaMtmv3QdI", "portrait"),
  photos[1],
  video("A6gDf0N4TbI", "landscape"),
  photos[2],
  video("ITk1rgfWvRQ", "portrait"),
  photos[3],
  video("T5EHz5vT7o0", "landscape"),
  video("wVO6u3O5Uic", "portrait"),
  photos[4],
  video("chYP6OEI7uI", "landscape"),
  video("vFh21dwVq1Q", "portrait"),
  video("WJSHEADXTpM", "landscape"),
  video("ygSkCOU34_s", "portrait"),
  video("wOqYOyEAKek", "landscape"),
  video("dUcDvBQJ_ac", "portrait"),
  video("SYXPML03v20", "landscape"),
  video("v83n8kfqwPw", "portrait"),
  video("lGLyfD4bXa8", "landscape"),
  video("hlBt-zMlqms", "portrait"),
  video("KWTtJEIonac", "portrait"),
];

export const heroProcessPhoto = photos[0];

export function videoPoster(media: ProcessVideo) {
  return `/images/process/youtube/${media.youtubeId}.webp`;
}
