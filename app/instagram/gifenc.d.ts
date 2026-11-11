declare module "gifenc" {
  export function quantize(rgba: Uint8ClampedArray, maxColors: number): number[][];
  export function applyPalette(rgba: Uint8ClampedArray, palette: number[][]): Uint8Array;
  export function GIFEncoder(): {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options: {
        delay: number;
        repeat: number;
        palette?: number[][];
        dispose: number;
        transparent: boolean;
        transparentIndex: number;
      },
    ): void;
    finish(): void;
    bytes(): Uint8Array<ArrayBuffer>;
  };
}
