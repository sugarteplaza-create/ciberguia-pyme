# Configurar Auth0 con MFA

La app usa **Auth0** (Universal Login) y exige un **segundo factor** antes de mostrar cualquier contenido.

## 1. Crear la aplicación
1. Crea una cuenta/tenant en <https://auth0.com>.
2. *Applications → Create Application* → tipo **Single Page Application**.
3. En la pestaña **Settings** de la aplicación, completa (reemplaza el puerto/URL si usas otro):
   - **Allowed Callback URLs:** `http://localhost:5173`
   - **Allowed Logout URLs:** `http://localhost:5173`
   - **Allowed Web Origins:** `http://localhost:5173`
   - Si abres la app desde otro equipo (por ejemplo tu servidor), agrega también esa URL exacta, p. ej. `http://IP-DEL-SERVIDOR:5173`. Auth0 solo acepta `https` o `localhost`; para una IP sin HTTPS usa un túnel de VS Code (reenvío de puertos) y registra la URL `http://localhost:5173`.
4. Copia **Domain** y **Client ID** a `.env.local` (copia de `.env.example`).

## 2. Activar MFA en el tenant
1. *Security → Multi-factor Auth*.
2. Habilita al menos un factor, por ejemplo **One-time Password** (Google Authenticator, Aegis, Ente Auth, etc.).
3. En **Define policies** elige **Always** (exigir MFA a todos los usuarios). Según tu plan de Auth0, las opciones disponibles pueden variar.

## 3. (Opcional, recomendado) Action para pedir MFA desde la app
La app envía `acr_values=http://schemas.openid.net/pape/policies/2007/06/multi-factor` al iniciar sesión. Para que Auth0 lo respete:

*Actions → Library → Build Custom → Trigger: Login / Post Login*:

```js
exports.onExecutePostLogin = async (event, api) => {
  const MFA = 'http://schemas.openid.net/pape/policies/2007/06/multi-factor';
  if (event.transaction?.acr_values?.includes(MFA)) {
    api.multifactor.enable('any', { allowRememberBrowser: false });
  }
};
```
Despliégala y arrástrala al flujo *Login*.

## 4. Cómo comprueba la app que hubo MFA
Tras un MFA exitoso, Auth0 incluye en el ID token el claim `amr` con el valor `mfa`. `AuthGate.jsx` revisa ese claim; si no está, muestra la pantalla "Falta el segundo factor" y no deja ver la app. (Con renovaciones silenciosas Auth0 no repite `amr`, por eso la app recuerda en `sessionStorage` que esa pestaña ya verificó MFA.)

Puedes desactivar la comprobación con `VITE_REQUIRE_MFA=false` (no recomendado).

## 5. Probar
```bash
npm install
npm run dev
```
Abre la URL, pulsa **Iniciar sesión**, regístrate y configura el MFA la primera vez. Deberías ver la insignia **MFA** en la barra superior.

> Nunca subas `.env.local` a GitHub. El *Client ID* y el *Domain* de una SPA son públicos por diseño, pero nunca uses un *Client Secret* en el frontend.
