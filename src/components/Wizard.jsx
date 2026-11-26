import { useState } from 'react';
import { Minus, Plus, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { NODE_TYPES, PEOPLE_OPTIONS, DATA_OPTIONS, CLOUD_OPTIONS } from '../data/catalog.js';
import { Icon } from './icons.jsx';

const DEVICE_ORDER = ['router', 'firewall', 'switch', 'wifi', 'pc', 'notebook', 'server', 'camera', 'printer', 'audio', 'bluetooth'];
const STEPS = ['Tu organización', 'Tu red', 'Tus datos'];

function Counter({ value, onChange, min = 0, max = 50, label }) {
  return (
    <div className="counter" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Quitar uno" disabled={value <= min}><Minus size={14} /></button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Agregar uno"><Plus size={14} /></button>
    </div>
  );
}

export default function Wizard({ ctx, setCtx, onFinish, onBack }) {
  const [i, setI] = useState(0);
  const set = (patch) => setCtx({ ...ctx, ...patch });
  const setDevice = (id, n) => set({ devices: { ...ctx.devices, [id]: n } });
  const toggleCloud = (id) =>
    set({ clouds: ctx.clouds.includes(id) ? ctx.clouds.filter((c) => c !== id) : [...ctx.clouds, id] });

  const last = i === STEPS.length - 1;
  const next = () => (last ? onFinish() : setI(i + 1));
  const back = () => (i === 0 ? onBack() : setI(i - 1));

  return (
    <section className="wizard">
      <ol className="steps" aria-label="Progreso">
        {STEPS.map((s, k) => (
          <li key={s} className={k === i ? 'on' : k < i ? 'done' : ''}>
            <span>{k < i ? <Check size={14} /> : k + 1}</span> {s}
          </li>
        ))}
      </ol>

      {i === 0 && (
        <div>
          <h2>Cuéntanos de tu organización</h2>
          <label className="field">
            Nombre (opcional)
            <input value={ctx.orgName} onChange={(e) => set({ orgName: e.target.value })} placeholder="Ej: Mi empresa" maxLength={60} />
          </label>
          <h3>¿Cuántas personas usan la red?</h3>
          <div className="cards">
            {PEOPLE_OPTIONS.map((o) => (
              <button key={o.id} type="button" className={`card choice ${ctx.people === o.id ? 'sel' : ''}`} onClick={() => set({ people: o.id })} aria-pressed={ctx.people === o.id}>
                <strong>{o.label}</strong><span>{o.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {i === 1 && (
        <div>
          <h2>Arma tu red</h2>
          <p className="lead small">Indica cuántos de cada equipo tienes. Si no estás seguro, déjalo en 0.</p>
          <div className="cards devices">
            {DEVICE_ORDER.map((id) => {
              const t = NODE_TYPES[id];
              const v = ctx.devices[id] || 0;
              return (
                <div key={id} className={`card device ${v > 0 ? 'sel' : ''}`}>
                  <Icon name={t.icon} size={40} strokeWidth={1.5} />
                  <strong>{t.label}</strong>
                  <span>{t.description}</span>
                  <Counter value={v} min={id === 'router' ? 1 : 0} onChange={(n) => setDevice(id, n)} label={t.label} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {i === 2 && (
        <div>
          <h2>¿Cuántos datos guardas?</h2>
          <div className="cards">
            {DATA_OPTIONS.map((o) => (
              <button key={o.id} type="button" className={`card choice ${ctx.data === o.id ? 'sel' : ''}`} onClick={() => set({ data: o.id })} aria-pressed={ctx.data === o.id}>
                <strong>{o.label}</strong><span>{o.hint}</span>
              </button>
            ))}
          </div>
          <h3>¿Usas algún servicio en la nube?</h3>
          <div className="cards">
            {CLOUD_OPTIONS.map((o) => (
              <button key={o.id} type="button" className={`card choice cloud ${ctx.clouds.includes(o.id) ? 'sel' : ''}`} onClick={() => toggleCloud(o.id)} aria-pressed={ctx.clouds.includes(o.id)}>
                <Icon name="Cloud" size={28} strokeWidth={1.5} />
                <strong>{o.label}</strong>
              </button>
            ))}
          </div>
          <p className="fine">Si no usas ninguna nube, déjalas sin marcar.</p>
        </div>
      )}

      <div className="actions">
        <button className="btn ghost" onClick={back}><ArrowLeft size={16} /> Atrás</button>
        <button className="btn primary" onClick={next}>{last ? 'Ver mi arquitectura' : 'Siguiente'} <ArrowRight size={16} /></button>
      </div>
    </section>
  );
}
