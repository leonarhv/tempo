"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { COUNTDOWN_SECONDS, secondsUntil } from "@/lib/countdown";
import { Icon } from "@/components/icons";

export function SevenMinuteTimer({ onElapsed }: { onElapsed: () => void }) {
  const [secondsRemaining, setSecondsRemaining] = useState(COUNTDOWN_SECONDS);
  const expandedClockRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // A fresh mount starts a new countdown; nothing is stored between visits.
    const deadline = Date.now() + COUNTDOWN_SECONDS * 1000;
    let finished = false;

    function update() {
      if (finished) return;
      const remaining = secondsUntil(deadline, Date.now());
      setSecondsRemaining(remaining);

      if (remaining === 0) {
        finished = true;
        window.clearInterval(interval);
        expandedClockRef.current?.close();
        onElapsed();
      }
    }

    // Use elapsed time, rather than counting ticks, so background tabs catch up.
    const interval = window.setInterval(update, 250);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, [onElapsed]);

  return (
    <>
      <aside
        className="seven-minute-timer"
        aria-label="Contagem regressiva de 7 minutos"
      >
        <button
          className="countdown-trigger"
          type="button"
          aria-label="Ampliar relógio de 7 minutos"
          aria-haspopup="dialog"
          aria-controls="expanded-clock"
          onClick={() => expandedClockRef.current?.showModal()}
        >
          <CountdownDial secondsRemaining={secondsRemaining} />
        </button>
      </aside>
      <dialog
        ref={expandedClockRef}
        className="clock-dialog"
        id="expanded-clock"
        aria-label="Relógio ampliado de 7 minutos"
        onClick={(event) => {
          if (event.target === event.currentTarget)
            expandedClockRef.current?.close();
        }}
      >
        <button
          type="button"
          className="icon-button clock-minimize"
          aria-label="Minimizar relógio"
          onClick={() => expandedClockRef.current?.close()}
        >
          <Icon name="close" />
        </button>
        <CountdownDial secondsRemaining={secondsRemaining} />
      </dialog>
    </>
  );
}

function CountdownDial({ secondsRemaining }: { secondsRemaining: number }) {
  const minutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsRemaining % 60).toString().padStart(2, "0");

  return (
    <div
      className="countdown-watch"
      style={
        {
          "--countdown-progress": secondsRemaining / COUNTDOWN_SECONDS,
        } as CSSProperties
      }
    >
      <span className="handwritten countdown-label">7 minutos</span>
      <div className="countdown-dial">
        <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle className="countdown-paper" cx="60" cy="60" r="55" />
          <ellipse
            className="countdown-pencil"
            cx="60"
            cy="60"
            rx="57"
            ry="54"
            transform="rotate(-12 60 60)"
          />
          <circle className="countdown-track" cx="60" cy="60" r="47" />
          <circle
            className="countdown-progress"
            cx="60"
            cy="60"
            r="47"
            pathLength="100"
          />
          {Array.from({ length: 7 }, (_, index) => (
            <path
              className="countdown-mark"
              key={index}
              d="M60 7v5"
              transform={`rotate(${(index * 360) / 7} 60 60)`}
            />
          ))}
        </svg>
        <span
          className="countdown-value"
          role="timer"
          aria-live="off"
          aria-atomic="true"
        >
          {minutes}:{seconds}
        </span>
      </div>
    </div>
  );
}
