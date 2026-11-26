import { ExternalLink, BadgeCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { SOURCE_GROUPS, NOT_VERIFIED, VERIFIED_ON } from '../data/sources.js';

export default function Sources({ onBack }) {
  return (
    <section className="sources">
      <button className="btn ghost small" onClick={onBack}><ArrowLeft size={14} /> Volver</button>
      <h1>Fuentes y verificación</h1>
      <p className="lead">
        Todas las referencias a ISO/IEC 27001, CIS Controls y NIST CSF de esta guía fueron comparadas con las fuentes de abajo
        (revisión del {VERIFIED_ON}). Abre los enlaces y compruébalo tú mismo.
      </p>

      {SOURCE_GROUPS.map((g) => (
        <article key={g.id} className="src-group">
          <h2>{g.title}</h2>
          <p className="ok-line"><BadgeCheck size={16} /> {g.checked}</p>
          <ul>
            {g.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer">{l.title} <ExternalLink size={12} /></a>
                {l.official && <span className="chip mid">Sitio oficial</span>}
                <p>{l.note}</p>
              </li>
            ))}
          </ul>
        </article>
      ))}

      <article className="src-group warn-box">
        <h2><AlertTriangle size={18} /> Lo que NO está verificado</h2>
        <ul>{NOT_VERIFIED.map((t) => <li key={t}>{t}</li>)}</ul>
      </article>
    </section>
  );
}
