import { describe, it, expect } from 'vitest';
import { TOOLS, NODE_TYPES } from '../src/data/catalog.js';
import { INSTALL_GUIDES, LEVELS } from '../src/data/installGuides.js';

describe('guías de instalación', () => {
  it('toda herramienta del catálogo tiene guía', () => {
    for (const id of Object.keys(TOOLS)) expect(INSTALL_GUIDES[id], id).toBeTruthy();
  });
  it('cada guía tiene nivel válido, requisitos y al menos un enlace https', () => {
    for (const [id, g] of Object.entries(INSTALL_GUIDES)) {
      expect(LEVELS[g.level], id).toBeTruthy();
      expect(g.reqs.length, id).toBeGreaterThan(0);
      expect(g.docs.length, id).toBeGreaterThan(0);
      for (const l of [...g.docs, ...g.tutorials]) expect(l.url.startsWith('https://'), l.url).toBe(true);
    }
  });
  it('no hay guías huérfanas', () => {
    for (const id of Object.keys(INSTALL_GUIDES)) expect(TOOLS[id], id).toBeTruthy();
  });
  it('las herramientas usadas por los nodos existen', () => {
    for (const n of Object.values(NODE_TYPES)) for (const t of n.tools || []) expect(TOOLS[t], t).toBeTruthy();
  });
});
