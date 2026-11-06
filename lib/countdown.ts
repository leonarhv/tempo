export const COUNTDOWN_SECONDS = 7 * 60;

export function secondsUntil(deadline: number, now: number) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
