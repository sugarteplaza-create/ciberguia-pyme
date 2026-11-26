import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { config, auth0Configured, MFA_ACR } from './config.js';
import App from './App.jsx';
import './styles.css';

const root = createRoot(document.getElementById('root'));

const app = <App />;

root.render(
  <React.StrictMode>
    {auth0Configured ? (
      <Auth0Provider
        domain={config.domain}
        clientId={config.clientId}
        authorizationParams={{
          redirect_uri: window.location.origin + import.meta.env.BASE_URL,
          // Pide MFA desde el inicio. Requiere la Action descrita en docs/AUTH0.md
          // (o la política "Siempre" de MFA en el panel de Auth0).
          acr_values: MFA_ACR,
        }}
      >
        {app}
      </Auth0Provider>
    ) : (
      app
    )}
  </React.StrictMode>,
);
