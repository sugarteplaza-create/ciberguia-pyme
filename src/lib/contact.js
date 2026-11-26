export const CONTACT_REASONS = [
  { id: 'asesoria', label: 'Asesoría en ciberseguridad' },
  { id: 'instalacion', label: 'Instalación en persona de las herramientas' },
  { id: 'diagnostico', label: 'Diagnóstico de vulnerabilidades de mi red' },
  { id: 'capacitacion', label: 'Capacitación para mi equipo' },
  { id: 'respaldos', label: 'Configuración de respaldos' },
  { id: 'otros', label: 'Otros' },
];

export const MAX_COMMENT = 500;
const clean = (s, n) => String(s ?? '').replace(/\r/g, '').trim().slice(0, n);

export function validateContact({ name, email, phone, reason, comment }) {
  const errors = {};
  if (clean(name, 80).length < 2) errors.name = 'Escribe tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(email, 120))) errors.email = 'Escribe un correo válido.';
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!/^[\d\s+()-]+$/.test(String(phone ?? '').trim()) || digits.length < 8 || digits.length > 15) errors.phone = 'Escribe un teléfono válido (8 a 15 dígitos).';
  if (!CONTACT_REASONS.some((r) => r.id === reason)) errors.reason = 'Elige un motivo.';
  if (reason === 'otros' && clean(comment, MAX_COMMENT).length < 5) errors.comment = 'Cuéntanos brevemente qué necesitas.';
  return errors;
}

export function buildContactBody(d, orgName = '') {
  const reason = CONTACT_REASONS.find((r) => r.id === d.reason)?.label || '';
  const lines = [
    `Nombre: ${clean(d.name, 80)}`,
    `Correo: ${clean(d.email, 120)}`,
    `Teléfono: ${clean(d.phone, 30)}`,
    `Motivo: ${reason}`,
  ];
  if (orgName) lines.push(`Organización: ${clean(orgName, 80)}`);
  if (clean(d.comment, MAX_COMMENT)) lines.push('', 'Comentario:', clean(d.comment, MAX_COMMENT));
  lines.push('', '---', 'Enviado desde CiberGuía Pyme');
  return lines.join('\n');
}

export function buildContactMailto(email, d, orgName) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) return null;
  const reason = CONTACT_REASONS.find((r) => r.id === d.reason)?.label || 'Contacto';
  const q = new URLSearchParams({ subject: `[Contacto] ${reason}`, body: buildContactBody(d, orgName) });
  return `mailto:${email}?${q.toString().replace(/\+/g, '%20')}`;
}
