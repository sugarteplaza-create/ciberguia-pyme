# Mostrar el avance: VS Code + servidor + GitHub

Objetivo: evidenciar el **avance del producto** (Entregable II, Avance 2) con commits visibles en GitHub y la app corriendo en tu servidor.

## 1. Conectar VS Code a tu servidor
1. Instala la extensión **Remote - SSH** (Microsoft).
2. `F1 → Remote-SSH: Connect to Host…` → `usuario@IP-del-servidor`.
3. `File → Open Folder…` y abre la carpeta del proyecto en el servidor.
4. Abre la terminal integrada (`Ctrl+ñ`) y ejecuta:
   ```bash
   cp .env.example .env.local   # completa tus datos de Auth0
   npm install
   npm run dev
   ```
5. En la pestaña **PORTS** de VS Code aparece el puerto `5173`: pulsa *Open in Browser*. VS Code lo reenvía a `http://localhost:5173`, que es la URL registrada en Auth0.

Así puedes mostrar en una sola pantalla: el código en VS Code, la terminal con el servidor y la app en el navegador (graba un video corto o toma capturas para la evidencia).

## 2. Subir a GitHub con historial de avance
Haz commits pequeños y descriptivos para que el historial muestre cómo se construyó:

```bash
git init && git branch -M main
git add package.json vite.config.js index.html .gitignore .env.example
git commit -m "chore: estructura inicial con Vite y React"
git add src/config.js src/main.jsx src/components/AuthGate.jsx docs/AUTH0.md
git commit -m "feat: autenticación con Auth0 y verificación de MFA"
git add src/data src/lib tests
git commit -m "feat: catálogo de controles ISO 27001 / CIS / NIST y lógica de arquitectura"
git add src/components/Intro.jsx src/components/Wizard.jsx src/App.jsx
git commit -m "feat: introducción y asistente para elegir la red con íconos"
git add src/components/Diagram.jsx src/components/Result.jsx src/components/icons.jsx src/styles.css public
git commit -m "feat: diagrama interactivo con nubes de recomendaciones"
git add README.md .github docs
git commit -m "docs: README, guía de Auth0 y CI"
git remote add origin https://github.com/TU-USUARIO/ciberguia-pyme.git
git push -u origin main
```
La pestaña **Actions** de GitHub mostrará la ejecución de pruebas y compilación (CI) como evidencia adicional.

## 3. Qué capturar como evidencia
- Pantalla de inicio de sesión de Auth0 solicitando el segundo factor.
- Introducción de la app y el asistente (pasos 1–3).
- Diagrama de red con una nube abierta.
- Pestaña **Plan de protección** y el archivo `.md` descargado.
- VS Code conectado al servidor con el árbol de archivos y la terminal.
- Historial de commits y ejecución verde de *Actions* en GitHub.
- Salida de `npm test` (11 pruebas) .

## 4. Publicar (opcional)
Para GitHub Pages, compila con `VITE_BASE=/ciberguia-pyme/ npm run build` y registra en Auth0 la URL de Pages (`https://TU-USUARIO.github.io/ciberguia-pyme/`) en Callback, Logout y Web Origins.
