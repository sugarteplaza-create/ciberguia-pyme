import { useEffect } from 'react';
import { ExternalLink, ArrowLeft, BadgeCheck, AlertTriangle, PlayCircle } from 'lucide-react';
import { TOOLS } from '../data/catalog.js';
import { INSTALL_GUIDES, LEVELS } from '../data/installGuides.js';

export default function ToolsGuide({ onBack, focusId }) {
  useEffect(() => {
    if (!focusId) return;
    const el = document.getElementById(`tool-${focusId}`);
    if (el) el.scrollIntoView({ block: 'start' });
  }, [focusId]);
  const ids = Object.keys(TOOLS).filter((id) => INSTALL_GUIDES[id]);
  return (
    <section className="sources">
      <button className="btn ghost small" onClick={onBack}><ArrowLeft size={14} /> Volver</button>
      <h1>Guía de instalación de herramientas</h1>
      <p className="lead">
        Nivel de usuario, qué necesitas y enlaces a páginas oficiales o tutoriales. El nivel y el tiempo son una
        estimación del proyecto. Los requisitos marcados «verificado» se contrastaron con la documentación oficial el 25 de noviembre de 2026.
      </p>
      <div className="chips">
        {Object.entries(LEVELS).map(([k, v]) => <span key={k} className={`chip lvl-${k}`} title={v.hint}>{v.label}: {v.hint}</span>)}
      </div>
      {ids.map((id) => {
        const t = TOOLS[id]; const g = INSTALL_GUIDES[id];
        return (
          <article key={id} id={`tool-${id}`} className={`src-group ${focusId === id ? 'focus' : ''}`}>
            <h2>{t.name} <span className={`chip lvl-${g.level}`}>{LEVELS[g.level].label}</span> <span className="chip">⏱ {g.time}</span></h2>
            <p className="muted">{t.note}</p>
            <p className={g.verified ? 'ok-line' : 'warn'}>
              {g.verified ? <><BadgeCheck size={16} /> Requisitos verificados con la documentación oficial.</> : <><AlertTriangle size={16} /> Requisitos orientativos: confírmalos en el sitio oficial.</>}
            </p>
            <h4>Qué necesitas</h4>
            <ul className="plain">{g.reqs.map((r) => <li key={r}>{r}</li>)}</ul>
            <h4>Páginas oficiales</h4>
            <ul className="plain">{g.docs.map((l) => (
              <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer">{l.kind === 'video' && <PlayCircle size={13} />} {l.title} <ExternalLink size={12} /></a></li>
            ))}</ul>
            {g.tutorials.length > 0 && (<>
              <h4>Tutoriales</h4>
              <ul className="plain">{g.tutorials.map((l) => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer">{l.kind === 'video' && <PlayCircle size={13} />} {l.title} <ExternalLink size={12} /></a></li>
              ))}</ul>
            </>)}
          </article>
        );
      })}
    </section>
  );
}
