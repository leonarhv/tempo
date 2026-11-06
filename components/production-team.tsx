import Image from "next/image";
import { productionTeam } from "@/lib/program";

export function ProductionTeam() {
  const castCount = productionTeam.filter(
    (person) => person.role === "Elenco",
  ).length;

  return (
    <section
      className="cast-section section-space"
      id="elenco"
      aria-labelledby="cast-title"
    >
      <div className="page-width">
        <div className="section-heading">
          <div>
            <span className="section-note handwritten">
              {productionTeam.length} pessoas
            </span>
            <h2 id="cast-title">Elenco e direção</h2>
          </div>
          <p>
            {castCount} pessoas no elenco
            <br />
            Direção e assistência de direção
          </p>
        </div>

        <ul className="cast-grid" aria-label="Elenco e equipe de direção">
          {productionTeam.map((person) => (
            <li
              className={`cast-person${person.role !== "Elenco" ? " cast-direction" : ""}`}
              key={person.id}
            >
              <figure>
                <div className="portrait-paper">
                  <div className="team-portrait">
                    {person.photo ? (
                      <Image
                        src={person.photo}
                        alt={`Retrato de ${person.name}`}
                        fill
                        sizes="(max-width: 600px) 45vw, (max-width: 800px) 30vw, 220px"
                      />
                    ) : (
                      <div
                        className="portrait-placeholder"
                        role="img"
                        aria-label={`Foto de ${person.role.toLowerCase()} a adicionar`}
                      >
                        <svg
                          viewBox="0 0 100 120"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path d="M68 36c0 15-7 25-18 25S32 51 32 36s7-24 18-24 18 9 18 24Z" />
                          <path d="M18 106V93c0-17 14-28 32-28s32 11 32 28v13" />
                        </svg>
                        <span className="handwritten">foto</span>
                      </div>
                    )}
                  </div>
                </div>
                <figcaption>
                  <span className="handwritten">{person.name}</span>
                  <small>{person.role}</small>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
