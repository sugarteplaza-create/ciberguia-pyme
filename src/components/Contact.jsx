import { useState } from 'react';
import { PhoneCall, Mail, Copy, Check } from 'lucide-react';
import { config } from '../config.js';
import { CONTACT_REASONS, MAX_COMMENT, validateContact, buildContactBody, buildContactMailto } from '../lib/contact.js';

export default function Contact({ orgName }) {
  const [d, setD] = useState({ name: '', email: '', phone: '', reason: '', comment: '' });
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const errors = validateContact(d);
  const ok = Object.keys(errors).length === 0;
  const mailUrl = buildContactMailto(config.feedbackEmail, d, orgName);
  const show = (k) => touched && errors[k] && <span className="err" role="alert">{errors[k]}</span>;

  const copy = async () => {
    setTouched(true);
    if (!ok) return;
    try { await navigator.clipboard.writeText(buildContactBody(d, orgName)); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* portapapeles bloqueado */ }
  };

  return (
    <section className="feedback contact" aria-labelledby="ct-title">
      <h2 id="ct-title"><PhoneCall size={20} /> Habla con nosotros</h2>
      <p className="lead small">¿Prefieres que te ayudemos? Ofrecemos asesoría e instalaciones en persona. Déjanos tus datos y el motivo.</p>
      <label className="field">Nombre
        <input value={d.name} onChange={set('name')} maxLength={80} autoComplete="name" />{show('name')}
      </label>
      <label className="field">Correo
        <input type="email" value={d.email} onChange={set('email')} maxLength={120} autoComplete="email" />{show('email')}
      </label>
      <label className="field">Teléfono
        <input type="tel" value={d.phone} onChange={set('phone')} maxLength={30} autoComplete="tel" placeholder="+56 9 1234 5678" />{show('phone')}
      </label>
      <label className="field">Motivo de contacto
        <select value={d.reason} onChange={set('reason')}>
          <option value="">Selecciona una opción…</option>
          {CONTACT_REASONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>{show('reason')}
      </label>
      <label className="field wide">{d.reason === 'otros' ? 'Cuéntanos qué necesitas' : 'Comentario (opcional)'}
        <textarea rows={3} maxLength={MAX_COMMENT} value={d.comment} onChange={set('comment')} placeholder="Un breve comentario…" />
        <span className="fine">{d.comment.length}/{MAX_COMMENT}</span>{show('comment')}
      </label>
      <div className="actions inline">
        {mailUrl && <a className={`btn primary ${ok ? '' : 'disabled'}`} href={ok ? mailUrl : undefined} onClick={(e) => { if (!ok) { e.preventDefault(); setTouched(true); } }} aria-disabled={!ok}><Mail size={16} /> Enviar solicitud por correo</a>}
        <button className="btn ghost" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copiado' : 'Copiar solicitud'}</button>
      </div>
      <p className="fine">
        Esta aplicación no guarda tus datos: la solicitud se abre lista en tu programa de correo y tú decides si la envías.
        {!mailUrl && ' (El correo de contacto aún no está configurado: usa “Copiar solicitud”.)'}
      </p>
    </section>
  );
}
