# CiberGuía Pyme

Aplicación web que guía a una **micro o pequeña empresa** para proteger su red con **herramientas open source**, según **ISO/IEC 27001:2022**, **CIS Controls v8.1** y **NIST CSF 2.0**.

Producto del proyecto de título *«Diagnóstico de vulnerabilidades y validación de controles básicos de seguridad para una pequeña organización»* (AIEP · Ingeniería en Ciberseguridad · piloto: Caverna Producciones).

## Cómo funciona
1. **Inicio de sesión con Auth0 + MFA.** Sin segundo factor no se muestra la app.
2. **Introducción:** qué es la guía y cómo usarla.
3. **Asistente (3 pasos, con íconos):** tamaño del equipo → router, firewall, switch, Wi-Fi, PC, notebooks, servidor/NAS → volumen de datos y nubes (Google Drive, Microsoft 365, Dropbox, otra).
4. **Arquitectura:** el diagrama de tu red. Los elementos recomendados que faltan (firewall, respaldo 3-2-1) aparecen punteados.
5. **Nube de recomendaciones:** al pulsar un ícono aparece una nube con qué hacer, herramientas open source y controles ISO 27001 / CIS / NIST, ajustados a tus respuestas.
6. **Plan de protección:** lista priorizada, descargable en Markdown o imprimible.

## Ejecutar
```bash
npm install
cp .env.example .env.local      # completa VITE_AUTH0_DOMAIN y VITE_AUTH0_CLIENT_ID
npm run dev                     # http://localhost:5173
npm test                        # pruebas del catálogo y la lógica
npm run build                   # compilación de producción
```
Configuración de Auth0 y MFA: [`docs/AUTH0.md`](docs/AUTH0.md). Demostración con VS Code y GitHub: [`docs/DEMOSTRACION_VSCODE_GITHUB.md`](docs/DEMOSTRACION_VSCODE_GITHUB.md).

## Estructura
```
src/
  data/catalog.js        Dispositivos, herramientas open source y controles
  lib/architecture.js    Construcción del diagrama y recomendaciones
  components/            AuthGate, Intro, Wizard, Diagram (nubes), Result
tests/                   Pruebas con Vitest
```

## Alcance y limitaciones
- Guía **educativa** y de primer nivel (MVP): no reemplaza una auditoría ni una evaluación de riesgos.
- Las referencias a controles son orientativas; revisa el texto oficial de cada estándar.
- No ejecuta escaneos. Cualquier prueba sobre una red real requiere **autorización escrita** del dueño (Ley 21.459).
- Las herramientas listadas se mantienen por sus comunidades: revisa licencia y versión vigente antes de instalar.

## Licencia
Código del proyecto: define la licencia de tu preferencia (p. ej. MIT).
