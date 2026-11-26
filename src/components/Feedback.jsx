import { useState } from 'react';
import { MessageSquare, Github, Mail, Copy, Check } from 'lucide-react';
import { config } from '../config.js';
import { FEEDBACK_TYPES, MAX_LEN, buildIssueUrl, buildMailto, buildBody } from '../lib/feedback.js';

export default function Feedback() {
  const [type, setType] = useState('sugerencia');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [copied, setCopied] = useState(false);
  const data = { type, message, contact };
  const ready = message.trim().length >= 5;
  const issueUrl = buildIssueUrl(config.githubRepo, data);
  const mailUrl = buildMailto(config.feedbackEmail, data);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildBody(data));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* el navegador puede bloquear el portapapeles */ }
  };

  return (
    <section className="feedback" aria-labelledby="fb-title">
      <h2 id="fb-title"><MessageSquare size={20} /> Comentarios y sugerencias</h2>
      <p className="lead small">
        ¿Encontraste un error, tienes una fuente mejor o una idea para mejorar la guía? Cuéntanos: así la hacemos crecer.
      </p>
      <label className="field">
        Tipo de comentario
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {FEEDBACK_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </label>
      <label className="field wide">
        Tu comentario
        <textarea rows={5} maxLength={MAX_LEN} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe aquí…" />
        <span className="fine">{message.length}/{MAX_LEN}</span>
      </label>
      <label className="field">
        Contacto (opcional)
        <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Correo, si quieres respuesta" maxLength={120} />
      </label>
      <div className="actions inline">
        {issueUrl && <a className={`btn primary ${ready ? '' : 'disabled'}`} href={ready ? issueUrl : undefined} target="_blank" rel="noreferrer" aria-disabled={!ready}><Github size={16} /> Enviar en GitHub</a>}
        {mailUrl && <a className={`btn ${ready ? '' : 'disabled'}`} href={ready ? mailUrl : undefined} aria-disabled={!ready}><Mail size={16} /> Enviar por correo</a>}
        <button className="btn ghost" onClick={copy} disabled={!ready}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copiado' : 'Copiar texto'}</button>
      </div>
      <p className="fine">
        Esta aplicación no guarda tus comentarios: se abren listos para enviar en GitHub o en tu correo, y tú decides si los mandas.
        {!issueUrl && !mailUrl && ' (El envío directo no está configurado; usa “Copiar texto”.)'}
      </p>
    </section>
  );
}
