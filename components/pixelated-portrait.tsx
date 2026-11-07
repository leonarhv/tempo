// An abstract pixel mosaic: no photograph or unpixelated face is loaded.
const palette: Record<string, string> = {
  a: "#777582",
  b: "#8b8795",
  c: "#aaa1ae",
  d: "#635d70",
  e: "#bd9f91",
  f: "#a4867d",
  g: "#4e4b60",
  h: "#59556c",
  i: "#3e3540",
};

const pixels = [
  "aabbbbaacccbbbaa",
  "abccbaaeeefccbaa",
  "bbccbaeeeeffbbaa",
  "abcbbaeeeeffabba",
  "aabbbaefeeffabba",
  "bbbbaafeeeffbbba",
  "abccbaiiffiiabba",
  "abccbaaiiiibabba",
  "aabbaghiiiggabba",
  "bbbghhghhghhgbba",
  "abghhhggghhhhgba",
  "aghhghhhhghhhgga",
];

export function PixelatedPortrait({ name }: { name: string }) {
  return (
    <svg
      className="call-pixelated-portrait"
      viewBox="0 0 16 12"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Avatar pixelado de ${name}`}
    >
      {pixels.flatMap((row, y) =>
        [...row].map((pixel, x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[pixel]} />
        )),
      )}
    </svg>
  );
}
