"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { program } from "@/lib/program";
import { heroProcessPhoto, processMedia } from "@/lib/process-media";
import { ProcessMural, ProcessViewer } from "@/components/process-gallery";
import { ProductionTeam } from "@/components/production-team";
import { Icon } from "@/components/icons";
import { SymplaLogo } from "@/components/sympla-logo";
import { SevenMinuteTimer } from "@/components/seven-minute-timer";

type Modal = "gallery" | "instagram" | null;

function TicketButton({
  small = false,
  label = "Ver ingressos",
}: {
  small?: boolean;
  label?: string;
}) {
  const className = `button sympla-button${small ? " button-small" : ""}`;

  return program.ticketUrl ? (
    <a
      className={className}
      href={program.ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{label}</span>
      <SymplaLogo />
    </a>
  ) : (
    <button className={className} disabled>
      <span>Ingressos em breve</span>
      <SymplaLogo />
    </button>
  );
}

function InstagramLinks({ className = "text-link" }: { className?: string }) {
  return program.instagrams.map((profile) => (
    <a
      key={profile.url}
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`Instagram ${profile.name} (abre em nova aba)`}
    >
      {profile.name}
      <Icon name="arrow" />
    </a>
  ));
}

export function DigitalProgram() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [reminderPending, setReminderPending] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Finish the current media or dialog before showing the invitation.
  const activeModal = modal ?? (reminderPending ? "tickets" : null);
  const handleCountdownElapsed = useCallback(
    () => setReminderPending(true),
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!activeModal || !dialog) return;
    if (!dialog.open) dialog.showModal();
  }, [activeModal]);

  useEffect(() => {
    if (modal !== "gallery") return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setMediaIndex(
          (index) =>
            (index +
              (event.key === "ArrowRight" ? 1 : -1) +
              processMedia.length) %
            processMedia.length,
        );
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modal]);

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    if (modal) {
      setModal(null);
    } else {
      setReminderPending(false);
    }
  }

  function openMedia(index: number) {
    setMediaIndex(index);
    setModal("gallery");
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header page-width" id="inicio">
        <a className="wordmark" href="#inicio" aria-label="Tempo, início">
          <Image
            src="/images/tempo-header.svg"
            alt="Tempo"
            width={495}
            height={537}
            className="header-logo"
            unoptimized
            preload
          />
        </a>
        <nav
          id="main-nav"
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegação principal"
          onClick={() => setMenuOpen(false)}
        >
          <a href="#a-peca">A peça</a>
          <a href="#elenco">Elenco</a>
          <a href="#processo">Nosso processo</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setModal("instagram")}
            aria-label="Ver os dois perfis da turma no Instagram"
            aria-haspopup="dialog"
          >
            <Icon name="instagram" />
          </button>
          <TicketButton small />
          <button
            className="icon-button menu-toggle"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <main id="conteudo">
        <div className="hero-shell">
          <section className="hero page-width" aria-labelledby="play-title">
            <div className="hero-artwork">
              <h1 id="play-title" className="visually-hidden">
                Tempo: essa noite eu vou sonhar com você
              </h1>
              <div
                className="original-title"
                role="img"
                aria-label="Identidade visual de Tempo: essa noite eu vou sonhar com você"
              />
            </div>
            <div className="hero-collage">
              <span className="handwritten collage-note">
                Lorem ipsum dolor
                <br />
                sit amet, consectetur.
              </span>
              <button
                className="hero-polaroid"
                onClick={() => openMedia(0)}
                aria-label="Ampliar foto do nosso processo"
              >
                <span className="tape" aria-hidden="true" />
                <Image
                  className="hero-process-photo"
                  src={heroProcessPhoto.src}
                  alt={heroProcessPhoto.alt}
                  width={heroProcessPhoto.width}
                  height={heroProcessPhoto.height}
                  sizes="(max-width: 600px) 80vw, 405px"
                />
                <span className="handwritten polaroid-caption">
                  lorem ipsum dolor sit amet
                </span>
                <span className="photo-expand">
                  <Icon name="expand" />
                </span>
              </button>
              <svg
                className="handdrawn-arrow"
                viewBox="0 0 100 90"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 8c57-10 84 13 57 45-10 12-29 21-36 23m0 0 7-17m-7 17 19 1"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="handwritten collage-bottom-note">
                lorem ipsum dolor sit amet.
              </p>
            </div>
          </section>

          <div className="hero-service page-width">
            <div className="hero-date">
              <span className="date-circle">27, 28 e 29</span>
              <span>
                de novembro
                <br />
                <small>às 19h e às 21h</small>
              </span>
            </div>
            <div className="hero-venue">
              <Icon name="pin" />
              <span>
                {program.venue}
                <br />
                <small>{program.room}</small>
              </span>
            </div>
            <TicketButton />
          </div>
          <span className="paper-tear" aria-hidden="true" />
        </div>

        <section
          className="about-section section-space"
          id="a-peca"
          aria-labelledby="about-title"
        >
          <div className="page-width about-layout">
            <div className="about-heading">
              <span className="section-note handwritten">Sobre a peça</span>
              <h2 id="about-title">
                Lorem ipsum
                <br />
                dolor sit
                <br />
                amet.
              </h2>
              <svg
                className="scribbled-line"
                viewBox="0 0 270 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 12C59 4 156 4 264 8 199 12 87 16 27 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="synopsis">
              {program.synopsis.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? "synopsis-lead" : undefined}
                >
                  {paragraph}
                </p>
              ))}
              <p className="handwritten synopsis-signature">
                Lorem ipsum dolor sit amet.
              </p>
            </div>
          </div>
        </section>

        <ProductionTeam />

        <section
          className="process-section section-space"
          id="processo"
          aria-labelledby="process-title"
        >
          <div className="page-width">
            <div className="section-heading">
              <div>
                <h2 id="process-title">Nosso processo</h2>
              </div>
            </div>
            <ProcessMural onOpen={openMedia} />
            <div className="instagram-note">
              <Icon name="instagram" />
              <p>Siga nossos coletivos no Instagram</p>
              <div className="instagram-profiles">
                <InstagramLinks />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="page-width footer-top">
          <a className="wordmark" href="#inicio" aria-label="Tempo, início">
            <Image
              src="/images/tempo-header.svg"
              alt="Tempo"
              width={495}
              height={537}
              className="header-logo"
              unoptimized
            />
          </a>
          <p className="handwritten">Essa noite eu vou sonhar com vocês</p>
          <a className="back-to-top" href="#inicio">
            Voltar ao início
            <Icon name="arrow" />
          </a>
        </div>
        <div className="page-width footer-bottom">
          <span>Tempo: Essa noite eu vou sonhar com você</span>
        </div>
      </footer>

      <SevenMinuteTimer onElapsed={handleCountdownElapsed} />

      <dialog
        ref={dialogRef}
        className={`program-dialog ${activeModal === "gallery" ? "gallery-dialog" : "info-dialog"}${activeModal === "tickets" ? " ticket-reminder-dialog" : ""}`}
        aria-labelledby="dialog-title"
        aria-describedby={
          activeModal === "tickets" ? "ticket-reminder-message" : undefined
        }
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <div className="dialog-content">
          <button
            className="icon-button dialog-close"
            onClick={closeModal}
            aria-label="Fechar"
          >
            <Icon name="close" />
          </button>
          {activeModal === "gallery" ? (
            <ProcessViewer
              media={processMedia[mediaIndex]}
              index={mediaIndex}
              onNavigate={(direction) =>
                setMediaIndex(
                  (index) =>
                    (index + direction + processMedia.length) % processMedia.length,
                )
              }
            />
          ) : activeModal === "tickets" ? (
            <>
              <span className="handwritten ticket-reminder-note">
                7 minutos depois...
              </span>
              <h2 id="dialog-title">Ainda está aí?</h2>
              <p id="ticket-reminder-message">
                Então aproveita para comprar seu ingresso.
              </p>
              <TicketButton label="Comprar meu ingresso" />
              {!program.ticketUrl && (
                <p className="ticket-reminder-availability">
                  As vendas abrem em breve.
                  <span className="instagram-profiles">
                    <InstagramLinks className="instagram-profile-link" />
                  </span>
                </p>
              )}
              <button
                className="text-link ticket-reminder-dismiss"
                onClick={closeModal}
              >
                Continuar no programa
              </button>
            </>
          ) : (
            <>
              <h2 id="dialog-title">Instagram da turma</h2>
              <div className="instagram-profiles">
                <InstagramLinks />
              </div>
              <button className="button" onClick={closeModal}>
                Continuar explorando
                <Icon name="arrow" />
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
