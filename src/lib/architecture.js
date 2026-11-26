import { NODE_TYPES, TOOLS, CLOUD_OPTIONS, DATA_OPTIONS, PEOPLE_OPTIONS } from '../data/catalog.js';

export const DEFAULT_CONTEXT = {
  orgName: '',
  people: 'p1-5',
  devices: { router: 1, firewall: 0, switch: 0, wifi: 0, pc: 0, notebook: 0, server: 0, camera: 0, printer: 0, audio: 0, bluetooth: 0 },
  data: 'lt100gb',
  clouds: [],
};

const SELECTABLE_ORDER = ['wifi', 'pc', 'notebook', 'server', 'audio', 'camera', 'printer', 'bluetooth'];
const MIN_W = 960;
const GAP = 115; // separación mínima entre íconos de una misma fila
const ROW_H = 135;
const TOP = 95;

/**
 * Construye el diagrama de red a partir de lo que eligió el usuario.
 * Devuelve nodos (con coordenadas), conexiones y el alto del lienzo.
 */
export function buildArchitecture(ctx) {
  const d = ctx.devices;
  const nodes = [];
  const edges = [];
  const W = MIN_W; // se ajusta al final según la fila más ancha
  const add = (n) => nodes.push({ count: 1, recommended: false, ...n });

  // Nivel 0: Internet y servicios en la nube
  add({ id: 'internet', type: 'internet', level: 0 });
  ctx.clouds.forEach((id) => add({ id: `cloud-${id}`, type: 'cloud', level: 0, cloudId: id }));

  // Nivel 1: router (siempre existe: es la salida a internet)
  add({ id: 'router', type: 'router', level: 1, count: Math.max(1, d.router || 1) });

  // Nivel 2: firewall (se recomienda si no lo eligió)
  add({ id: 'firewall', type: 'firewall', level: 2, count: Math.max(1, d.firewall || 1), recommended: !(d.firewall > 0) });

  // Nivel 3: switch (solo si lo eligió)
  const hasSwitch = d.switch > 0;
  if (hasSwitch) add({ id: 'switch', type: 'switch', level: 3, count: d.switch });

  // Nivel 4: equipos finales + respaldo recomendado
  const hub = hasSwitch ? 'switch' : 'firewall';
  const endpoints = [];
  for (const t of SELECTABLE_ORDER) {
    if (d[t] > 0) endpoints.push({ id: t, type: t, count: d[t] });
  }
  endpoints.push({ id: 'backup', type: 'backup', count: 1, recommended: true });
  const endLevel = hasSwitch ? 4 : 3;
  endpoints.forEach((e) => add({ ...e, level: endLevel }));

  // Conexiones
  ctx.clouds.forEach((id) => edges.push({ from: 'internet', to: `cloud-${id}` }));
  edges.push({ from: 'internet', to: 'router' });
  edges.push({ from: 'router', to: 'firewall' });
  if (hasSwitch) edges.push({ from: 'firewall', to: 'switch' });
  endpoints.forEach((e) => {
    if (e.id === 'backup') edges.push({ from: d.server > 0 ? 'server' : hub, to: 'backup', dashed: true });
    else edges.push({ from: hub, to: e.id, dashed: e.id === 'bluetooth' }); // punteada = inalámbrica
  });

  // Posiciones
  const levels = {};
  nodes.forEach((n) => {
    (levels[n.level] ||= []).push(n);
  });
  // Internet al centro del nivel 0 y las nubes a ambos lados
  if (levels[0]) {
    const inet = levels[0].find((n) => n.type === 'internet');
    const clouds = levels[0].filter((n) => n.type === 'cloud');
    const half = Math.ceil(clouds.length / 2);
    levels[0] = [...clouds.slice(0, half), inet, ...clouds.slice(half)];
  }
  const width = Math.max(MIN_W, ...Object.values(levels).map((l) => (l.length + 1) * GAP));
  Object.entries(levels).forEach(([lv, list]) => {
    list.forEach((n, i) => {
      n.x = Math.round(((i + 1) * width) / (list.length + 1));
      n.y = TOP + Number(lv) * ROW_H;
    });
  });

  const maxLevel = Math.max(...nodes.map((n) => n.level));
  return { nodes, edges, width, height: TOP + maxLevel * ROW_H + 85 };
}

/**
 * Recomendación personalizada para un nodo, según el contexto del usuario.
 */
export function recommend(node, ctx) {
  const base = NODE_TYPES[node.type];
  const actions = [...base.actions];
  const toolIds = [...base.tools];
  const people = PEOPLE_OPTIONS.find((p) => p.id === ctx.people) || PEOPLE_OPTIONS[0];
  const data = DATA_OPTIONS.find((o) => o.id === ctx.data) || DATA_OPTIONS[0];
  let title = base.label;
  const notes = [];

  if (node.type === 'cloud') {
    const provider = CLOUD_OPTIONS.find((c) => c.id === node.cloudId);
    if (provider) {
      title = provider.label;
      actions.unshift(provider.tip);
    }
  }

  if (node.type === 'backup') {
    actions.unshift(data.backup);
  }

  if (node.type === 'wifi' && people.max > 15) {
    actions.push('Con más de 15 personas conviene Wi-Fi empresarial (cuenta individual por persona con FreeRADIUS) en vez de una clave compartida.');
  }

  if (node.type === 'server' && (ctx.data === '1-5tb' || ctx.data === 'gt5tb')) {
    actions.push('Con este volumen de datos usa snapshots (ZFS) además del respaldo, y programa copias incrementales fuera del horario de trabajo.');
  }

  if ((node.type === 'pc' || node.type === 'notebook') && node.count > 5) {
    actions.push('Con varios equipos, centraliza el monitoreo con un agente Wazuh en cada uno para ver todos desde un solo panel.');
  }

  if (node.type === 'camera' && !(ctx.devices.firewall > 0)) {
    notes.push('Sin un firewall no puedes aislar las cámaras en su propia red: prioriza instalar uno.');
  }
  if (node.type === 'audio' && (ctx.data === '1-5tb' || ctx.data === 'gt5tb')) {
    actions.push('Con proyectos de audio pesados, programa la copia automática de cada sesión al NAS apenas termine la grabación.');
  }
  if (node.type === 'bluetooth' && (ctx.devices.pc > 0 || ctx.devices.audio > 0)) {
    actions.push('Haz una lista de qué dispositivos Bluetooth están permitidos en el PC de grabación y revisa los emparejados una vez al mes.');
  }

  if (node.type === 'firewall' && node.recommended) {
    notes.push('No marcaste un firewall: te lo recomendamos porque es el control más importante para proteger y segmentar tu red.');
  }
  if (node.type === 'backup') {
    notes.push('Este elemento no es un equipo: es una práctica que todo negocio debería tener.');
  }

  return {
    id: node.id,
    type: node.type,
    title,
    summary: base.summary,
    urgency: base.urgency,
    actions,
    tools: toolIds.map((id) => ({ id, ...TOOLS[id] })),
    standards: base.standards,
    notes,
    count: node.count,
  };
}

/** Plan completo: una recomendación por nodo (excepto Internet), ordenado por prioridad. */
export function buildPlan(ctx) {
  const arch = buildArchitecture(ctx);
  const plan = arch.nodes
    .filter((n) => n.type !== 'internet')
    .map((n) => recommend(n, ctx));
  const rank = { alta: 0, media: 1 };
  return plan.sort((a, b) => rank[a.urgency] - rank[b.urgency]);
}

/** Exporta el plan en Markdown para entregarlo o imprimirlo. */
export function planToMarkdown(ctx) {
  const plan = buildPlan(ctx);
  const people = PEOPLE_OPTIONS.find((p) => p.id === ctx.people);
  const data = DATA_OPTIONS.find((o) => o.id === ctx.data);
  const lines = [];
  lines.push(`# Plan de protección${ctx.orgName ? ` — ${ctx.orgName}` : ''}`);
  lines.push('');
  lines.push(`- Tamaño del equipo: ${people?.label}`);
  lines.push(`- Volumen de datos: ${data?.label}`);
  lines.push(`- Nubes en uso: ${ctx.clouds.length ? ctx.clouds.map((c) => CLOUD_OPTIONS.find((o) => o.id === c)?.label).join(', ') : 'ninguna'}`);
  lines.push('');
  lines.push('> Guía educativa basada en ISO/IEC 27001:2022, CIS Controls v8.1 y NIST CSF 2.0. No reemplaza una auditoría.');
  lines.push('');
  plan.forEach((p) => {
    lines.push(`## ${p.title}${p.count > 1 ? ` (×${p.count})` : ''} — prioridad ${p.urgency}`);
    lines.push('');
    lines.push(p.summary);
    lines.push('');
    p.notes.forEach((n) => lines.push(`*${n}*`));
    lines.push('**Qué hacer**');
    p.actions.forEach((a) => lines.push(`- [ ] ${a}`));
    lines.push('');
    lines.push('**Herramientas open source:** ' + p.tools.map((t) => `[${t.name}](${t.url})`).join(', '));
    lines.push('');
    lines.push('**Estándares**');
    lines.push(`- ISO/IEC 27001:2022: ${p.standards.iso.join('; ')}`);
    lines.push(`- CIS Controls v8.1: ${p.standards.cis.join('; ')}`);
    lines.push(`- NIST CSF 2.0: ${p.standards.nist.join('; ')}`);
    lines.push('');
  });
  return lines.join('\n');
}
