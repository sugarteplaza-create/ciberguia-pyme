import { describe, it, expect } from 'vitest';
import { validateContact, buildContactBody, buildContactMailto } from '../src/lib/contact.js';

const ok = { name: 'Ana Pérez', email: 'ana@correo.cl', phone: '+56 9 1234 5678', reason: 'asesoria', comment: '' };

describe('formulario de contacto', () => {
  it('acepta datos válidos', () => { expect(validateContact(ok)).toEqual({}); });
  it('exige nombre, correo, teléfono y motivo', () => {
    const e = validateContact({ name: '', email: 'x', phone: 'abc', reason: '', comment: '' });
    expect(Object.keys(e).sort()).toEqual(['email', 'name', 'phone', 'reason']);
  });
  it('"Otros" exige comentario', () => {
    expect(validateContact({ ...ok, reason: 'otros' }).comment).toBeTruthy();
    expect(validateContact({ ...ok, reason: 'otros', comment: 'Necesito algo distinto' })).toEqual({});
  });
  it('arma el correo con todos los datos', () => {
    const u = buildContactMailto('contacto@x.cl', { ...ok, reason: 'otros', comment: 'Hola' }, 'Caverna');
    expect(u.startsWith('mailto:contacto@x.cl?')).toBe(true);
    const body = decodeURIComponent(u.split('body=')[1]);
    expect(body).toContain('Ana Pérez'); expect(body).toContain('Caverna'); expect(body).toContain('Hola');
    expect(buildContactBody(ok)).toContain('Teléfono: +56 9 1234 5678');
  });
  it('sin correo configurado no hay mailto', () => { expect(buildContactMailto('', ok)).toBeNull(); });
});
