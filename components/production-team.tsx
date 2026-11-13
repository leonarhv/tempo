"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";
import { PixelatedPortrait } from "@/components/pixelated-portrait";
import { productionTeam, type ProductionMember } from "@/lib/program";

const avatarColors = [
  "#9c8db8",
  "#98a6bb",
  "#b395b0",
  "#9caaa4",
  "#ad9db9",
  "#909fbd",
];

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const preference = window.matchMedia(reducedMotionQuery);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function CallVideo({
  video,
  motionPaused,
}: {
  video: NonNullable<ProductionMember["video"]>;
  motionPaused: boolean;
}) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    () => true,
  );

  if (motionPaused || reducedMotion) {
    return <Image src={video.poster} alt="" fill unoptimized />;
  }

  return (
    <video
      className="call-video"
      src={video.src}
      poster={video.poster}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
    />
  );
}

function CallParticipant({
  person,
  index,
  featured = false,
  motionPaused = false,
}: {
  person: ProductionMember;
  index: number;
  featured?: boolean;
  motionPaused?: boolean;
}) {
  const [initial] = person.name.trim();
  const cameraOff = !person.pixelated && !person.animation && !person.video;

  return (
    <li
      className={`call-participant${featured ? " call-participant-featured" : ""}${person.pixelated ? " call-participant-pixelated" : ""}`}
      style={
        {
          "--avatar-color": avatarColors[index % avatarColors.length],
        } as CSSProperties
      }
    >
      <figure>
        {person.pixelated ? (
          <PixelatedPortrait name={person.name} />
        ) : person.video ? (
          <CallVideo video={person.video} motionPaused={motionPaused} />
        ) : person.animation ? (
          <picture>
            <source
              media={reducedMotionQuery}
              srcSet={person.animation.poster}
            />
            <Image
              src={
                motionPaused ? person.animation.poster : person.animation.src
              }
              alt={person.animation.alt}
              fill
              unoptimized
            />
          </picture>
        ) : (
          <div className="call-avatar" aria-hidden="true">
            <span className="call-avatar-circle">
              {person.photo ? (
                <Image
                  src={person.photo}
                  alt=""
                  fill
                  sizes={
                    featured ? "(max-width: 600px) 28vw, 200px" : "90px"
                  }
                />
              ) : (
                initial?.toUpperCase()
              )}
            </span>
          </div>
        )}
        {featured && (
          <span className="call-pinned" aria-hidden="true">
            <Icon name="push-pin" />
          </span>
        )}
        <span className="call-device-status">
          {cameraOff && (
            <>
              <Icon name="video-off" />
              <span className="visually-hidden">Câmera desligada</span>
            </>
          )}
          <Icon name="mic-off" />
        </span>
        <figcaption className="call-participant-caption">
          <strong>{person.name}</strong>
          {person.pixelated ? (
            <span className="call-connection-status">
              <Icon name="connection-poor" />
              Conexão ruim
            </span>
          ) : (
            <span>{person.role}</span>
          )}
        </figcaption>
      </figure>
    </li>
  );
}

export function ProductionTeam() {
  const [motionPaused, setMotionPaused] = useState(false);
  const direction = productionTeam.filter((person) => person.role !== "Elenco");
  const cast = productionTeam.filter((person) => person.role === "Elenco");

  return (
    <section
      className="cast-section section-space"
      id="elenco"
      aria-labelledby="cast-title"
    >
      <div className="page-width">
        <div className="section-heading">
          <h2 id="cast-title">Elenco e direção</h2>
        </div>
        <div className="cast-call">
          <div className="call-heading">
            <Icon name="video" />
            <span>Tempo</span>
            <button
              className="call-motion-toggle"
              type="button"
              aria-pressed={motionPaused}
              onClick={() => setMotionPaused(!motionPaused)}
            >
              <Icon name={motionPaused ? "play" : "pause"} />
              <span>
                {motionPaused ? "Retomar movimentos" : "Pausar movimentos"}
              </span>
            </button>
          </div>
          <ul
            className="call-leads"
            aria-label="Direção e assistência de direção"
          >
            {direction.map((person, index) => (
              <CallParticipant
                person={person}
                index={index}
                featured
                motionPaused={motionPaused}
                key={person.id}
              />
            ))}
          </ul>
          <ul className="call-cast" aria-label="Elenco">
            {cast.map((person, index) => (
              <CallParticipant
                person={person}
                index={index + direction.length}
                motionPaused={motionPaused}
                key={person.id}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
