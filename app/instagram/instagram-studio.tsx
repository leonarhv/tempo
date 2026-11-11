"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProductionMember } from "@/lib/program";
import { CallPreview } from "./call-preview";
import { formats, getCallLayout, type Format, type Group } from "./call-layout";
import styles from "./instagram.module.css";

const groups = { cast: "Elenco", direction: "Direção" } as const;

export function InstagramStudio({ cast, direction }: {
  cast: ProductionMember[];
  direction: ProductionMember[];
}) {
  const [format, setFormat] = useState<Format>("stories");
  const [group, setGroup] = useState<Group>("cast");
  const [selections, setSelections] = useState<Record<Format, string[]>>({
    stories: ["", ""],
    feed: ["", "", "", ""],
  });
  const [progress, setProgress] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const artwork = useRef<SVGSVGElement>(null);
  const layout = getCallLayout(format, group);
  const selection = selections[format];
  const seats = group === "direction" ? direction : selection.map((id) => cast.find((person) => person.id === id));
  const selected = seats.filter((person) => person !== undefined);
  const ready = selected.length === layout.tiles.length;
  const exporting = progress !== null;
  const names = selected.map(({ name }) => name.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-"));
  const filename = `tempo-${format}-${group === "direction" ? "direcao" : names.join("_")}.gif`;

  useEffect(() => {
    if (downloadUrl) return () => URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  function clearDownload() {
    setDownloadUrl("");
    setError("");
  }

  function selectPerson(index: number, id: string) {
    clearDownload();
    setSelections((previous) => ({
      ...previous,
      [format]: previous[format].map((value, slot) => slot === index ? id : value),
    }));
  }

  async function downloadGif() {
    if (!ready || exporting || !artwork.current) return;

    setProgress(0);
    setError("");
    try {
      const overlay = artwork.current.cloneNode(true) as SVGSVGElement;
      const { createCallGif } = await import("./create-call-gif");
      const gif = await createCallGif(layout, selected, overlay, setProgress);
      const url = URL.createObjectURL(gif);
      setDownloadUrl(url);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
    } catch {
      setError("Não foi possível gerar o GIF. Tente baixar novamente.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <main className={styles.studio}>
      <Link className={styles.back} href="/#elenco">Voltar ao elenco</Link>
      <header className={styles.header}>
        <h1>Chamada para Instagram</h1>
        <p>Monte a chamada do elenco ou da direção e baixe em GIF.</p>
      </header>

      <div className={styles.workspace}>
        <div className={styles.settings}>
          <fieldset disabled={exporting}>
            <legend>Formato</legend>
            <div className={styles.choices}>
              {(Object.keys(formats) as Format[]).map((key) => (
                <label className={styles.choice} key={key}>
                  <input
                    type="radio"
                    name="instagram-format"
                    className="visually-hidden"
                    value={key}
                    checked={key === format}
                    onChange={() => { clearDownload(); setFormat(key); }}
                  />
                  <span>
                    <strong>{formats[key].label}</strong>
                    <small>{formats[key].ratio}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset disabled={exporting}>
            <legend>Chamada</legend>
            <div className={styles.choices}>
              {(Object.keys(groups) as Group[]).map((key) => (
                <label className={styles.choice} key={key}>
                  <input
                    type="radio"
                    name="instagram-group"
                    className="visually-hidden"
                    value={key}
                    checked={key === group}
                    onChange={() => { clearDownload(); setGroup(key); }}
                  />
                  <span><strong>{groups[key]}</strong></span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className={styles.participants}>
          {group === "cast" ? (
            <fieldset disabled={exporting}>
              <legend>Janelas <span>{selected.length}/{seats.length}</span></legend>
              <div className={styles.seats}>
                {seats.map((person, index) => (
                  <label className={styles.seat} key={index}>
                    <span>Janela {index + 1}</span>
                    <select value={person?.id ?? ""} onChange={(event) => selectPerson(index, event.target.value)}>
                      <option value="">Escolha alguém</option>
                      {cast.map(({ id, name }) => (
                        <option key={id} value={id} disabled={id !== person?.id && selection.includes(id)}>{name}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
            <p>A direção e a assistência aparecem juntas nas três janelas.</p>
          )}
        </div>

        <div className={`${styles.preview} ${format === "stories" ? styles.vertical : ""}`}>
          <CallPreview layout={layout} seats={seats} artworkRef={artwork} />
        </div>

        <div className={styles.actions}>
          {downloadUrl ? (
            <a className="button" href={downloadUrl} download={filename}>Baixar GIF novamente</a>
          ) : (
            <button className="button" type="button" disabled={!ready || exporting} onClick={downloadGif}>
              {exporting ? "Gerando GIF…" : "Baixar GIF"}
            </button>
          )}
          {exporting && <progress aria-label="Progresso da geração do GIF" max={1} value={progress || undefined} />}
          {error && <p role="alert">{error}</p>}
        </div>
      </div>
    </main>
  );
}
