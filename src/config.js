const env = import.meta.env;

export const config = {
  domain: env.VITE_AUTH0_DOMAIN || '',
  clientId: env.VITE_AUTH0_CLIENT_ID || '',
  requireMfa: env.VITE_REQUIRE_MFA !== 'false',
  demoMode: env.VITE_DEMO_MODE === 'true',
  githubRepo: env.VITE_GITHUB_REPO || '', // usuario/repositorio para enviar comentarios como issue
  feedbackEmail: env.VITE_FEEDBACK_EMAIL || '',
};

export const auth0Configured = Boolean(config.domain && config.clientId);

// Valor estándar que Auth0 usa para pedir un segundo factor (step-up).
export const MFA_ACR = 'http://schemas.openid.net/pape/policies/2007/06/multi-factor';
