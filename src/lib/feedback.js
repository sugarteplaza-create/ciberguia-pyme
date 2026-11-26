export const FEEDBACK_TYPES = [
  { id: 'sugerencia', label: 'Sugerencia' },
  { id: 'error', label: 'Error o dato incorrecto' },
  { id: 'fuente', label: 'Fuente o referencia' },
  { id: 'otro', label: 'Otro comentario' },
];

export const MAX_LEN = 1500;

const clean = (s) => String(s ?? '').replace(/\r/g, '').trim().slice(0, MAX_LEN);

export function buildBody({ message, contact }) {
  const c = clean(contact).slice(0, 120);
  return `${clean(message)}\n\n---\n${c ? `Contacto (opcional): ${c}\n` : ''}Enviado desde CiberGuía Pyme`;
}

export function buildTitle(type, message) {
  const t = FEEDBACK_TYPES.find((x) => x.id === type)?.label || 'Comentario';
  const first = clean(message).split('\n')[0].slice(0, 70);
  return `[${t}] ${first}`;
}

/** Abre un issue de GitHub ya redactado. repo = "usuario/repositorio". */
export function buildIssueUrl(repo, data) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo || '')) return null;
  const q = new URLSearchParams({ title: buildTitle(data.type, data.message), body: buildBody(data) });
  return `https://github.com/${repo}/issues/new?${q.toString()}`;
}

export function buildMailto(email, data) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) return null;
  const q = new URLSearchParams({ subject: buildTitle(data.type, data.message), body: buildBody(data) });
  return `mailto:${email}?${q.toString().replace(/\+/g, '%20')}`;
}
