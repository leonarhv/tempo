"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import {
  INITIAL_MEDIA_COUNT,
  processMedia,
  videoPoster,
  type ProcessMedia,
} from "@/lib/process-media";

export function ProcessMural({ onOpen }: { onOpen: (index: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const visibleMedia = expanded
    ? processMedia
    : processMedia.slice(0, INITIAL_MEDIA_COUNT);

  return (
    <>
      <div className="process-mural" id="process-mural">
        {visibleMedia.map((media, index) => {
          const isPhoto = media.type === "photo";
          return (
            <button
              key={media.id}
              className="process-card"
              onClick={() => onOpen(index)}
              aria-haspopup="dialog"
              aria-label={`${isPhoto ? "Ampliar foto" : "Assistir"}: ${media.title} (${index + 1} de ${processMedia.length})`}
            >
              <span className="process-card-image">
                <Image
                  src={isPhoto ? media.src : videoPoster(media)}
                  alt={isPhoto ? media.alt : ""}
                  width={isPhoto ? media.width : media.format === "portrait" ? 202 : 480}
                  height={isPhoto ? media.height : media.format === "portrait" ? 360 : 270}
                  sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
                />
                {!isPhoto && (
                  <span className="process-play" aria-hidden="true">
                    <Icon name="play" />
                  </span>
                )}
              </span>
              <span className="process-card-caption">
                <span className="handwritten">{media.title}</span>
                <Icon name={isPhoto ? "expand" : "play"} />
              </span>
            </button>
          );
        })}
      </div>
      {processMedia.length > INITIAL_MEDIA_COUNT && (
        <div className="process-more">
          <p aria-live="polite">
            {visibleMedia.length} de {processMedia.length} registros
          </p>
          {!expanded && (
            <button
              className="button process-more-button"
              aria-controls="process-mural"
              onClick={() => setExpanded(true)}
            >
              Ver mais do processo
            </button>
          )}
        </div>
      )}
    </>
  );
}

export function ProcessViewer({
  media,
  index,
  onNavigate,
}: {
  media: ProcessMedia;
  index: number;
  onNavigate: (direction: number) => void;
}) {
  return (
    <>
      <h2 id="dialog-title" className="visually-hidden">
        {media.title}
      </h2>
      <div className="process-stage">
        {media.type === "photo" ? (
          <Image
            key={media.id}
            className="process-viewer-photo"
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes="(max-width: 1000px) 95vw, 960px"
            loading="eager"
          />
        ) : (
          <iframe
            key={media.id}
            className={`process-player process-player-${media.format}`}
            src={`https://www.youtube-nocookie.com/embed/${media.youtubeId}?autoplay=1&playsinline=1&rel=0`}
            title={`${media.title} (${index + 1} de ${processMedia.length})`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
      <div className="lightbox-bottom">
        <div aria-live="polite">
          <p className="handwritten">{media.title}</p>
          {media.type === "video" && (
            <a
              href={`https://www.youtube.com/watch?v=${media.youtubeId}`}
              className="process-youtube-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Assistir no YouTube
            </a>
          )}
          <small>{index + 1} de {processMedia.length}</small>
        </div>
        <div className="gallery-controls">
          <button
            className="icon-button previous-photo"
            aria-label="Mídia anterior"
            onClick={() => onNavigate(-1)}
          >
            <Icon name="chevron" />
          </button>
          <button
            className="icon-button"
            aria-label="Próxima mídia"
            onClick={() => onNavigate(1)}
          >
            <Icon name="chevron" />
          </button>
        </div>
      </div>
    </>
  );
}
