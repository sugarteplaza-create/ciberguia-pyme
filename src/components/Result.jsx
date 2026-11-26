import { useMemo, useState } from 'react';
import { Download, Printer, Pencil, ChevronDown } from 'lucide-react';
import Diagram from './Diagram.jsx';
import { buildPlan, planToMarkdown } from '../lib/architecture.js';

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function Plan({ ctx }) {
  const plan = useMemo(() => buildPlan(ctx), [ctx]);
  return (
    <div className="plan">
      {plan.map((p) => (
        <details key={p.id} className="plan-item" open={p.urgency === 'alta'}>
          <summary>
            <strong>{p.title}{p.count > 1 ? ` ×${p.count}` : ''}</strong>
            <span className={`chip ${p.urgency === 'alta' ? 'hi' : 'mid'}`}>Prioridad {p.urgency}</span>
            <ChevronDown size={16} />
          </summary>
          <p>{p.summary}</p>
          <ul>{p.actions.map((a) => <li key={a}>{a}</li>)}</ul>
          <div className="chips">
            {p.tools.map((t) => <a key={t.id} className="chip tool" href={t.url} target="_blank" rel="noreferrer" title={t.note}>{t.name}</a>)}
          </div>
        </details>
      ))}
    </div>
  );
}

export default function Result({ ctx, onEdit, onSources }) {
  const [tab, setTab] = useState('arch');
  return (
    <section className="result">
      <div className="result-head">
        <h2>{ctx.orgName ? `Red de ${ctx.orgName}` : 'Tu arquitectura de red'}</h2>
        <div className="actions inline">
          <button className="btn ghost small" onClick={onEdit}><Pencil size={14} /> Editar respuestas</button>
          <button className="btn ghost small" onClick={() => download('plan-de-proteccion.md', planToMarkdown(ctx))}><Download size={14} /> Descargar plan</button>
          <button className="btn ghost small" onClick={() => window.print()}><Printer size={14} /> Imprimir</button>
        </div>
      </div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'arch'} className={tab === 'arch' ? 'on' : ''} onClick={() => setTab('arch')}>Arquitectura</button>
        <button role="tab" aria-selected={tab === 'plan'} className={tab === 'plan' ? 'on' : ''} onClick={() => setTab('plan')}>Plan de protección</button>
      </div>
      {tab === 'arch' ? <Diagram ctx={ctx} onSources={onSources} /> : <Plan ctx={ctx} />}
    </section>
  );
}
