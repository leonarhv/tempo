import type { Metadata } from "next";
import { productionTeam } from "@/lib/program";
import { InstagramStudio } from "./instagram-studio";

export const metadata: Metadata = {
  title: "Chamada para Instagram | Tempo",
  description: "Monte uma chamada do elenco de Tempo para Stories e Feed.",
  alternates: { canonical: "/instagram" },
};

export default function InstagramPage() {
  const cast = productionTeam.filter(({ role }) => role === "Elenco");
  const direction = productionTeam.filter(({ role }) => role !== "Elenco");

  return <InstagramStudio cast={cast} direction={direction} />;
}
