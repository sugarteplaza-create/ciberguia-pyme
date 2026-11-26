// Fuentes usadas para verificar las referencias a estándares (revisión del 25-nov-2026).
export const VERIFIED_ON = '25 de noviembre de 2026';

export const SOURCE_GROUPS = [
  {
    id: 'iso',
    title: 'ISO/IEC 27001:2022 (Anexo A)',
    checked: 'Se comprobó que los 22 controles citados existen con ese número y nombre.',
    links: [
      { title: 'Lista del Anexo A (QMS UK)', url: 'https://www.qmsuk.com/?p=3575', note: 'Nombres exactos de los controles A.5.14, A.5.15, A.5.23, A.5.30, A.7.4, A.7.8, A.7.9, A.7.14 y A.8.x.' },
      { title: 'Anexo A: 93 controles y los 11 nuevos (Modulos)', url: 'https://docs.modulos.ai/frameworks/iso-27001/annex-a.html', note: 'Confirma que A.5.30, A.7.4, A.8.9, A.8.16 y A.8.23 son controles nuevos de la edición 2022.' },
      { title: 'ISO/IEC 27001:2022 (Open Security Architecture)', url: 'https://opensecurityarchitecture.org/frameworks/iso-27001-2022', note: 'Descripción de A.5.14, A.5.15, A.7.8, A.7.9, A.7.14 y A.8.1.' },
      { title: 'Estándar oficial ISO/IEC 27001', url: 'https://www.iso.org/standard/27001', note: 'Sitio oficial (el texto completo es de pago). No se abrió en esta revisión.', official: true },
    ],
  },
  {
    id: 'cis',
    title: 'CIS Controls v8.1',
    checked: 'Se comprobó que los 13 controles citados existen con ese número y nombre.',
    links: [
      { title: 'Los 18 CIS Critical Security Controls (CIS)', url: 'https://www.cisecurity.org/controls/cis-controls-list', note: 'Lista oficial de controles 1 a 18.', official: true },
      { title: 'CIS Controls v8 y v8.1 (Diligent)', url: 'https://diligent.com/en-gb/insights/grc/cis-controls', note: 'Indica que v8.1 mantiene los mismos 18 controles y 153 salvaguardas que v8.' },
    ],
  },
  {
    id: 'nist',
    title: 'NIST Cybersecurity Framework 2.0',
    checked: 'Se comprobó que las 9 categorías citadas existen con ese código.',
    links: [
      { title: 'CSF 2.0 Core: funciones y categorías (NIST)', url: 'https://www.nist.gov/document/nist-csf-20-core-withdrawn-csf-11-elements', note: 'Funciones, categorías y subcategorías oficiales del Core.', official: true },
      { title: 'Preguntas frecuentes del CSF (NIST)', url: 'https://nist.gov/cyberframework/faqs', note: 'Cambios de la 1.1 a la 2.0: PR.PS y PR.IR nuevas, PR.AC pasa a PR.AA, ID.SC pasa a GV.SC.', official: true },
      { title: 'NIST CSWP 29: The NIST Cybersecurity Framework 2.0', url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf', note: 'Documento oficial del marco (febrero de 2024).', official: true },
    ],
  },
  {
    id: 'auth0',
    title: 'Autenticación multifactor (Auth0)',
    checked: 'Se comprobó cómo Auth0 indica que hubo MFA (claim amr = mfa) y cómo se solicita (acr_values).',
    links: [
      { title: 'Configurar step-up authentication para aplicaciones web (Auth0)', url: 'https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication/configure-step-up-authentication-for-web-apps', note: 'Base de la verificación de MFA que hace esta aplicación al iniciar sesión.', official: true },
    ],
  },
];

export const NOT_VERIFIED = [
  'Qué control ISO/CIS/NIST corresponde a cada dispositivo: es un criterio de este proyecto, no una asociación oficial de los estándares.',
  'Las recomendaciones prácticas por dispositivo (cámaras, impresoras, audio, Bluetooth, etc.) se basan en buenas prácticas generales y no se contrastaron una por una con una fuente específica.',
  'Las afirmaciones técnicas sobre Bluetooth (por ejemplo, fallas KNOB y BLURtooth o el emparejamiento “Just Works”) deben contrastarse antes de citarlas en un informe.',
  'Las herramientas open source enlazan a su sitio oficial; revisa su licencia y versión vigente antes de instalarlas.',
];
