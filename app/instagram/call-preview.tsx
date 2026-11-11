import Image from "next/image";
import { useId, type Ref } from "react";
import { Icon } from "@/components/icons";
import type { ProductionMember } from "@/lib/program";
import { getAvatar, getPortrait, type CallLayout } from "./call-layout";
import styles from "./instagram.module.css";

const tileRadius = 13;

export function CallPreview({
  layout,
  seats,
  artworkRef,
}: {
  layout: CallLayout;
  seats: (ProductionMember | undefined)[];
  artworkRef: Ref<SVGSVGElement>;
}) {
  const captionId = useId();
  const maskId = useId();
  const { width, height, tiles, heading, featured } = layout;
  const portraits = tiles.map((tile, index) => {
    const person = seats[index];
    return person && getPortrait(person, tile, featured);
  });

  return (
    <div
      className={styles.canvas}
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={`Prévia da chamada com ${seats.flatMap((person) => person ? [person.name] : []).join(", ") || "janelas vazias"}`}
    >
      {portraits.map((portrait, index) => {
        if (!portrait) return null;
        const { x, y, width: w, height: h } = portrait.box;
        const poster = seats[index]?.animation?.poster;
        return (
          <picture
            key={portrait.src}
            className={styles.portrait}
            style={{
              left: `${(100 * x) / width}%`,
              top: `${(100 * y) / height}%`,
              width: `${(100 * w) / width}%`,
              height: `${(100 * h) / height}%`,
            }}
          >
            {poster && <source media="(prefers-reduced-motion: reduce)" srcSet={poster} />}
            <Image
              src={portrait.src}
              alt=""
              fill
              unoptimized
              loading="eager"
              style={{ objectPosition: `center ${portrait.verticalPosition * 100}%` }}
            />
          </picture>
        );
      })}
      <svg
        ref={artworkRef}
        className={styles.artwork}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ fontFamily: "var(--font-body), Arial, sans-serif" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={captionId} x2="0%" y2="100%">
            <stop stopColor="#1d192b" stopOpacity="0" />
            <stop offset="1" stopColor="#1d192b" stopOpacity=".79" />
          </linearGradient>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
            <rect width={width} height={height} fill="white" />
            {portraits.map((portrait, index) => portrait && (
              <rect key={index} {...portrait.box} rx={seats[index]?.animation ? tileRadius : portrait.box.width / 2} fill="black" />
            ))}
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          <rect width={width} height={height} fill="#ebe7f3" />
          <rect {...layout.window} rx="22" fill="#282533" stroke="#4b435e" strokeWidth="2" />
          {tiles.map((tile, index) => (
            <rect key={index} {...tile} rx={tileRadius} fill={featured ? "#433b54" : "#3c3749"} />
          ))}
        </g>

        <Icon name="video" x={heading.x + 3} y={heading.y} width="28" height="28" stroke="#e0d9ed" />
        <text x={heading.x + 43} y={heading.y + 22} fill="#e0d9ed" fontSize="22" fontWeight="500">Tempo</text>

        {tiles.map((tile, index) => {
          const person = seats[index];
          if (!person) {
            return (
              <g key={index}>
                <rect {...tile} rx={tileRadius} fill="none" stroke="#ffffff" strokeOpacity=".08" />
                <text x={tile.x + tile.width / 2} y={tile.y + tile.height / 2} textAnchor="middle" dominantBaseline="middle" fill="#d0c8dd" fontSize="21">Janela {index + 1}</text>
              </g>
            );
          }

          const bottom = tile.y + tile.height;
          const right = tile.x + tile.width;
          const clipId = `${maskId}-tile-${index}`;
          const cameraOff = !person.animation;
          const avatar = getAvatar(tile, featured);
          const compact = tile.width < 230;

          return (
            <g key={index}>
              <clipPath id={clipId}>
                <rect {...tile} rx={tileRadius} />
              </clipPath>
              {cameraOff && !person.photo && (
                <>
                  <rect {...avatar} rx={avatar.width / 2} fill="#9c8db8" />
                  <text x={avatar.x + avatar.width / 2} y={avatar.y + avatar.height / 2} textAnchor="middle" dominantBaseline="central" fill="#292337" fontSize={avatar.width * 0.35}>
                    {person.name.trim().charAt(0).toUpperCase()}
                  </text>
                </>
              )}
              <rect x={tile.x} y={bottom - 94} width={tile.width} height="94" fill={`url(#${captionId})`} clipPath={`url(#${clipId})`} />
              <rect {...tile} rx={tileRadius} fill="none" stroke={featured ? "#b5a3d0" : "#ffffff"} strokeOpacity={featured ? 1 : 0.08} />
              {featured && (
                <>
                  <circle cx={tile.x + 34} cy={tile.y + 34} r="21" fill="#272231" fillOpacity=".65" />
                  <Icon name="push-pin" x={tile.x + 22} y={tile.y + 22} width="24" height="24" stroke="#dfd0f4" />
                </>
              )}
              <rect x={right - (cameraOff ? 86 : 55)} y={tile.y + 13} width={cameraOff ? 73 : 42} height="42" rx="21" fill="#272231" fillOpacity=".65" />
              {cameraOff && <Icon name="video-off" x={right - 77} y={tile.y + 22} width="24" height="24" stroke="#eee8f6" />}
              <Icon name="mic-off" x={right - 46} y={tile.y + 22} width="24" height="24" stroke="#eee8f6" />
              <text x={tile.x + 15} y={bottom - 36} fill="#f5f1fa" fontSize={compact ? 19 : 22} fontWeight="500">{person.name}</text>
              <text x={tile.x + 15} y={bottom - 13} fill="#d0c8dd" fontSize={compact ? 15 : 17}>{person.role}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
