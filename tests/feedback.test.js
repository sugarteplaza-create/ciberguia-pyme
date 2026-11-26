import { describe, it, expect } from 'vitest';
import { buildIssueUrl, buildMailto, buildTitle, buildBody, MAX_LEN } from '../src/lib/feedback.js';
import { SOURCE_GROUPS, NOT_VERIFIED } from '../src/data/sources.js';

const d = { type: 'error', message: 'El control A.8.1 está mal escrito', contact: 'yo@correo.cl' };

describe('comentarios', () => {
  it('arma un issue de GitHub con título y cuerpo codificados', () => {
    const u = new URL(buildIssueUrl('usuario/ciberguia-pyme', d));
    expect(u.origin + u.pathname).toBe('https://github.com/usuario/ciberguia-pyme/issues/new');
    expect(u.searchParams.get('title')).toMatch(/^\[Error o dato incorrecto\] El control/);
    expect(u.searchParams.get('body')).toContain('yo@correo.cl');
  });
  it('rechaza repositorios inválidos o URL maliciosas', () => {
    expect(buildIssueUrl('', d)).toBeNull();
    expect(buildIssueUrl('https://evil.com/x', d)).toBeNull();
    expect(buildIssueUrl('a/b/c', d)).toBeNull();
  });
  it('valida el correo y limita el largo del mensaje', () => {
    expect(buildMailto('no-es-correo', d)).toBeNull();
    expect(buildMailto('a@b.cl', d)).toMatch(/^mailto:a@b\.cl\?subject=/);
    expect(buildBody({ message: 'x'.repeat(5000) }).length).toBeLessThan(MAX_LEN + 100);
    expect(buildTitle('otro', 'hola').startsWith('[Otro comentario]')).toBe(true);
  });
});

describe('fuentes', () => {
  it('todas las fuentes tienen URL https y nota', () => {
    for (const g of SOURCE_GROUPS) for (const l of g.links) {
      expect(l.url).toMatch(/^https:\/\//);
      expect(l.note.length).toBeGreaterThan(10);
    }
    expect(NOT_VERIFIED.length).toBeGreaterThan(0);
  });
  it('hay fuentes para ISO, CIS, NIST y Auth0', () => {
    expect(SOURCE_GROUPS.map((g) => g.id)).toEqual(['iso', 'cis', 'nist', 'auth0']);
  });
});
