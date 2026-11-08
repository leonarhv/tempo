import type { SVGProps } from "react";

type IconName =
  | "arrow"
  | "instagram"
  | "ticket"
  | "pin"
  | "clock"
  | "video"
  | "video-off"
  | "mic-off"
  | "connection-poor"
  | "push-pin"
  | "play"
  | "pause"
  | "close"
  | "menu"
  | "chevron"
  | "expand";

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    "connection-poor": (
      <>
        <path d="M4 20v-4M9 20v-8" />
        <path d="M14 20V8M19 20V4" opacity=".3" />
        <path d="m14 4 7 7m0-7-7 7" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <path d="M8 5v14M16 5v14" />,
    video: (
      <>
        <rect x="3" y="6" width="12" height="12" rx="2" />
        <path d="m15 10 6-3v10l-6-3" />
      </>
    ),
    "video-off": (
      <path d="M3 3l18 18M10 6h3a2 2 0 0 1 2 2v2l6-3v9M3 8v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" />
    ),
    "mic-off": (
      <>
        <path d="M9 9v3a3 3 0 0 0 5 2m1-4V5a3 3 0 0 0-5.7-1.3M5 10v2a7 7 0 0 0 12 5m2-5v-2M12 19v3m-4 0h8M3 3l18 18" />
      </>
    ),
    "push-pin": (
      <>
        <path d="m9 3 9 9m-9-9 2 5-5 5 5 5 5-5 5 2-9-9M9 16l-6 6" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4Z" />
        <path d="M15 5v3m0 3v2m0 3v3" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    expand: (
      <>
        <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
        <path d="m3 3 6 6m12-6-6 6M3 21l6-6m12 6-6-6" />
      </>
    ),
  };

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
