import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { X, Cloud as CloudIcon, ExternalLink } from 'lucide-react';
import { NODE_TYPES, CLOUD_OPTIONS, STANDARDS } from '../data/catalog.js';
import { buildArchitecture, recommend } from '../lib/architecture.js';
import { Icon } from './icons.jsx';

const HALF = 40;

function labelOf(n) {
  if (n.type === 'cloud') {
    const c = CLOUD_OPTIONS.find((o) => o.id === n.cloudId);
    return c?.short || c?.label || 'Nube';
  }
  return NODE_TYPES[n.type].short || NODE_TYPES[n.type].label;
}

function edgePath(a, b) {
  if (a.y === b.y) {
    // Misma fila (Internet ↔ nube): curva por arriba para no cruzar otros íconos.
    const mx = (a.x + b.x) / 2;
    const lift = 18 + Math.min(40, Math.abs(a.x - b.x) / 8);
    return `M ${a.x} ${a.y - HALF} Q ${mx} ${a.y - HALF - lift * 2} ${b.x} ${b.y - HALF}`;
  }
  const y1 = a.y + HALF;
  const y2 = b.y - HALF;
  const mid = (y1 + y2) / 2;
  return `M ${a.x} ${y1} V ${mid} H ${b.x} V ${y2}`;
}

function Callout({ node, arch, ctx, onClose, boxRef, onSources }) {
  const rec = useMemo(() => recommend(node, ctx), [node, ctx]);
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: 0, puff: 0 });
  const below = node.y < arch.height / 2 + 40;
  const topPct = ((below ? node.y + HALF + 14 : node.y - HALF - 14) / arch.height) * 100;

  // Mantiene la nube dentro del recuadro y su "cola" apuntando al ícono.
  useLayoutEffect(() => {
    const place = () => {
      const cw = boxRef.current?.clientWidth || 0;
      const w = ref.current?.offsetWidth || 0;
      const nodeX = (node.x / arch.width) * cw;
      const left = Math.min(Math.max(nodeX - w / 2, 8), Math.max(8, cw - w - 8));
      setPos({ left, puff: nodeX - left });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [node, arch.width, boxRef]);

  return (
    <aside
      ref={ref}
      className={`cloud-callout ${below ? 'below' : 'above'}`}
      style={{ left: pos.left, top: `${topPct}%`, '--puff': `${pos.puff}px` }}
      role="dialog"
      aria-label={`Cómo proteger: ${rec.title}`}
    >
      <span className="puff p1" /><span className="puff p2" /><span className="puff p3" />
      <header>
        <div className="ttl"><CloudIcon size={18} /> <strong>{rec.title}</strong>{rec.count > 1 && <em> ×{rec.count}</em>}</div>
        <span className={`chip ${rec.urgency === 'alta' ? 'hi' : 'mid'}`}>Prioridad {rec.urgency}</span>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={16} /></button>
      </header>
      <div className="body">
        <p className="sum">{rec.summary}</p>
        {rec.notes.map((n) => <p key={n} className="warn">{n}</p>)}
        <h4>Qué debes hacer</h4>
        <ul>{rec.actions.map((a) => <li key={a}>{a}</li>)}</ul>
        <h4>Con qué (open source)</h4>
        <div className="chips">
          {rec.tools.map((t) => (
            <a key={t.id} className="chip tool" href={t.url} target="_blank" rel="noreferrer" title={t.note}>
              {t.name} <ExternalLink size={11} />
            </a>
          ))}
        </div>
        <h4>Basado en <button type="button" className="linklike" onClick={onSources}>(ver fuentes y verificación)</button></h4>
        {['iso', 'cis', 'nist'].map((k) => (
          <p key={k} className="std"><a href={STANDARDS[k].url} target="_blank" rel="noreferrer"><strong>{STANDARDS[k].name}:</strong></a> {rec.standards[k].join(' · ')}</p>
        ))}
      </div>
    </aside>
  );
}

export default function Diagram({ ctx, onSources }) {
  const arch = useMemo(() => buildArchitecture(ctx), [ctx]);
  const [selId, setSelId] = useState(null);
  const boxRef = useRef(null);
  const byId = Object.fromEntries(arch.nodes.map((n) => [n.id, n]));
  const selected = selId ? byId[selId] : null;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSelId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="diagram-wrap">
      <p className="hint">Toca un ícono para ver con qué protegerlo.</p>
      <div className="diagram" ref={boxRef}>
        <svg viewBox={`0 0 ${arch.width} ${arch.height}`} role="img" aria-label="Diagrama de tu red" onClick={() => setSelId(null)}>
          {arch.edges.map((e) => (
            <path key={`${e.from}-${e.to}`} d={edgePath(byId[e.from], byId[e.to])} className={`edge ${e.dashed ? 'dashed' : ''}`} />
          ))}
          {arch.nodes.map((n) => {
            const t = NODE_TYPES[n.type];
            const clickable = n.type !== 'internet';
            return (
              <g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                className={`node ${n.type} ${n.recommended ? 'rec' : ''} ${selId === n.id ? 'sel' : ''} ${clickable ? 'clickable' : ''}`}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-label={clickable ? `${labelOf(n)}: ver cómo protegerlo` : undefined}
                onClick={(ev) => { ev.stopPropagation(); if (clickable) setSelId(n.id === selId ? null : n.id); }}
                onKeyDown={(ev) => { if (clickable && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); setSelId(n.id === selId ? null : n.id); } }}
              >
                <rect x={-HALF} y={-HALF} width={HALF * 2} height={HALF * 2} rx="16" />
                <g transform="translate(-20 -20)"><Icon name={t.icon} size={40} strokeWidth={1.5} /></g>
                {n.count > 1 && (
                  <g transform={`translate(${HALF - 4} ${-HALF + 4})`}>
                    <circle r="13" className="badge" />
                    <text textAnchor="middle" dy="4.5" className="badge-t">×{n.count}</text>
                  </g>
                )}
                <text y={HALF + 20} textAnchor="middle" className="lbl">{labelOf(n)}</text>
                {n.recommended && <text y={HALF + 36} textAnchor="middle" className="rec-t">Recomendado</text>}
              </g>
            );
          })}
        </svg>
        {selected && <Callout node={selected} arch={arch} ctx={ctx} boxRef={boxRef} onSources={onSources} onClose={() => setSelId(null)} />}
      </div>
      <ul className="legend">
        <li><span className="sw solid" /> Elegido por ti</li>
        <li><span className="sw dashed" /> Recomendado para completar la protección</li>
        <li><span className="ln" /> Línea punteada: copia de respaldo o conexión inalámbrica</li>
      </ul>
    </div>
  );
}
