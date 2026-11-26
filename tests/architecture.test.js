import { describe, it, expect } from 'vitest';
import { NODE_TYPES, TOOLS, CLOUD_OPTIONS, DATA_OPTIONS, PEOPLE_OPTIONS } from '../src/data/catalog.js';
import { DEFAULT_CONTEXT, buildArchitecture, recommend, buildPlan, planToMarkdown } from '../src/lib/architecture.js';

const full = {
  ...DEFAULT_CONTEXT,
  orgName: 'Caverna Producciones',
  devices: { router: 1, firewall: 0, switch: 1, wifi: 1, pc: 3, notebook: 2, server: 1, camera: 4, printer: 1, audio: 2, bluetooth: 3 },
  data: '1-5tb',
  clouds: ['gdrive', 'm365'],
};

describe('catálogo', () => {
  it('cada tipo (salvo internet) tiene acciones, herramientas y los 3 estándares', () => {
    for (const [id, t] of Object.entries(NODE_TYPES)) {
      if (id === 'internet') continue;
      expect(t.actions.length, id).toBeGreaterThanOrEqual(3);
      expect(t.tools.length, id).toBeGreaterThan(0);
      for (const k of ['iso', 'cis', 'nist']) expect(t.standards[k]?.length, `${id}.${k}`).toBeGreaterThan(0);
      t.tools.forEach((tool) => expect(TOOLS[tool], `${id} → ${tool}`).toBeTruthy());
    }
  });
  it('las referencias ISO usan numeración del Anexo A 2022 (A.5–A.8)', () => {
    for (const t of Object.values(NODE_TYPES)) {
      (t.standards?.iso || []).forEach((r) => expect(r).toMatch(/^A\.[5-8]\.\d+ /));
    }
  });
  it('todas las herramientas tienen URL https', () => {
    Object.values(TOOLS).forEach((t) => expect(t.url).toMatch(/^https:\/\//));
  });
});

describe('arquitectura', () => {
  it('siempre incluye internet, router, firewall y respaldo', () => {
    const a = buildArchitecture(DEFAULT_CONTEXT);
    const ids = a.nodes.map((n) => n.id);
    expect(ids).toEqual(expect.arrayContaining(['internet', 'router', 'firewall', 'backup']));
  });
  it('recomienda firewall si no se eligió y no lo marca si se eligió', () => {
    expect(buildArchitecture(DEFAULT_CONTEXT).nodes.find((n) => n.id === 'firewall').recommended).toBe(true);
    const ctx = { ...DEFAULT_CONTEXT, devices: { ...DEFAULT_CONTEXT.devices, firewall: 1 } };
    expect(buildArchitecture(ctx).nodes.find((n) => n.id === 'firewall').recommended).toBe(false);
  });
  it('agrega un nodo por proveedor de nube y los conecta a internet', () => {
    const a = buildArchitecture(full);
    expect(a.nodes.filter((n) => n.type === 'cloud')).toHaveLength(2);
    expect(a.edges.filter((e) => e.from === 'internet' && e.to.startsWith('cloud-'))).toHaveLength(2);
  });
  it('no superpone nodos ni deja conexiones huérfanas', () => {
    const a = buildArchitecture(full);
    const ids = new Set(a.nodes.map((n) => n.id));
    a.edges.forEach((e) => { expect(ids.has(e.from)).toBe(true); expect(ids.has(e.to)).toBe(true); });
    for (let i = 0; i < a.nodes.length; i++) for (let j = i + 1; j < a.nodes.length; j++) {
      const p = a.nodes[i], q = a.nodes[j];
      if (p.y === q.y) expect(Math.abs(p.x - q.x)).toBeGreaterThanOrEqual(90);
    }
    a.nodes.forEach((n) => { expect(n.x).toBeGreaterThan(40); expect(n.x).toBeLessThan(a.width - 40); });
  });
  it('el respaldo cuelga del servidor cuando existe', () => {
    expect(buildArchitecture(full).edges.find((e) => e.to === 'backup').from).toBe('server');
  });
});

describe('cámaras, impresora, audio y Bluetooth', () => {
  it('existen como dispositivos seleccionables con recomendaciones completas', () => {
    for (const id of ['camera', 'printer', 'audio', 'bluetooth']) {
      expect(NODE_TYPES[id].selectable).toBe(true);
      expect(NODE_TYPES[id].actions.length).toBeGreaterThanOrEqual(5);
    }
  });
  it('aparecen en el diagrama con todos los íconos separados y dentro del lienzo', () => {
    const a = buildArchitecture(full);
    ['camera', 'printer', 'audio', 'bluetooth'].forEach((id) => expect(a.nodes.some((n) => n.id === id)).toBe(true));
    expect(a.width).toBeGreaterThan(960);
  });
  it('la conexión Bluetooth se dibuja punteada (inalámbrica)', () => {
    expect(buildArchitecture(full).edges.find((e) => e.to === 'bluetooth').dashed).toBe(true);
  });
  it('avisa si hay cámaras pero no firewall', () => {
    const cam = buildArchitecture(full).nodes.find((n) => n.id === 'camera');
    expect(recommend(cam, full).notes.join(' ')).toMatch(/firewall/);
    const withFw = { ...full, devices: { ...full.devices, firewall: 1 } };
    expect(recommend(cam, withFw).notes.join(' ')).not.toMatch(/Sin un firewall/);
  });
});

describe('recomendaciones', () => {
  it('personaliza por volumen de datos, nube y tamaño del equipo', () => {
    const arch = buildArchitecture(full);
    const backup = recommend(arch.nodes.find((n) => n.id === 'backup'), full);
    expect(backup.actions[0]).toBe(DATA_OPTIONS.find((o) => o.id === '1-5tb').backup);
    const cloud = recommend(arch.nodes.find((n) => n.id === 'cloud-gdrive'), full);
    expect(cloud.title).toBe('Google Drive');
    expect(cloud.actions[0]).toBe(CLOUD_OPTIONS.find((c) => c.id === 'gdrive').tip);
    const wifiBig = recommend({ id: 'wifi', type: 'wifi', count: 1 }, { ...full, people: 'p16-50' });
    expect(wifiBig.actions.join(' ')).toMatch(/FreeRADIUS/);
  });
  it('el plan ordena prioridad alta antes que media y exporta Markdown', () => {
    const plan = buildPlan(full);
    const firstMid = plan.findIndex((p) => p.urgency === 'media');
    expect(plan.slice(firstMid).every((p) => p.urgency === 'media')).toBe(true);
    const md = planToMarkdown(full);
    expect(md).toContain('# Plan de protección — Caverna Producciones');
    expect(md).toContain('ISO/IEC 27001:2022');
  });
  it('PEOPLE_OPTIONS y DATA_OPTIONS tienen ids únicos', () => {
    for (const list of [PEOPLE_OPTIONS, DATA_OPTIONS, CLOUD_OPTIONS]) {
      expect(new Set(list.map((o) => o.id)).size).toBe(list.length);
    }
  });
});

import { DATA_OPTIONS as _DATA } from '../src/data/catalog.js';
import { buildArchitecture as _build, recommend as _rec, planToMarkdown as _md, DEFAULT_CONTEXT as _ctx } from '../src/lib/architecture.js';
describe('hardware de respaldo', () => {
  it('cada volumen de datos tiene hardware para 3-2-1', () => {
    for (const o of _DATA) expect(o.hardware.length, o.id).toBeGreaterThanOrEqual(3);
  });
  it('el nodo de respaldo muestra hardware y el plan lo incluye', () => {
    const ctx = { ..._ctx, data: '1-5tb' };
    const node = _build(ctx).nodes.find((n) => n.type === 'backup');
    expect(_rec(node, ctx).hardware.length).toBeGreaterThan(0);
    expect(_md(ctx)).toContain('Con qué hardware');
  });
});
