import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ShieldCheck, LogIn, KeyRound } from 'lucide-react';
import { config, MFA_ACR } from '../config.js';

const KEY = 'ciberguia.mfa_sub';

/** Pantalla pública antes de iniciar sesión. */
function Landing({ onLogin, children }) {
  return (
    <main className="login">
      <div className="login-card">
        <div className="login-badge"><ShieldCheck size={30} /></div>
        <h1>CiberGuía Pyme</h1>
        <p className="lead">
          Descubre cómo proteger la red de tu micro o pequeña empresa con herramientas
          open source y buenas prácticas internacionales.
        </p>
        <button className="btn primary big" onClick={onLogin}>
          <LogIn size={18} /> Iniciar sesión
        </button>
        <p className="fine">
          <KeyRound size={14} /> El acceso usa autenticación multifactor (MFA) con Auth0.
        </p>
        {children}
      </div>
    </main>
  );
}

/**
 * Protege la app: exige sesión y, si VITE_REQUIRE_MFA=true, que el ID token
 * confirme MFA (claim `amr` con valor `mfa`).
 * Nota: en renovaciones silenciosas Auth0 no repite `amr`; por eso se recuerda
 * en sessionStorage que ESTA pestaña ya verificó MFA para el mismo usuario.
 */
export default function AuthGate({ children }) {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout, getIdTokenClaims } = useAuth0();
  const [mfa, setMfa] = useState(null); // null = verificando

  useEffect(() => {
    if (!isAuthenticated) return;
    let alive = true;
    (async () => {
      const claims = await getIdTokenClaims();
      const ok = Array.isArray(claims?.amr) && claims.amr.includes('mfa');
      if (ok) sessionStorage.setItem(KEY, claims.sub);
      const remembered = sessionStorage.getItem(KEY) === claims?.sub;
      if (alive) setMfa(ok || remembered);
    })();
    return () => { alive = false; };
  }, [isAuthenticated, getIdTokenClaims]);

  const login = () =>
    loginWithRedirect({ authorizationParams: { acr_values: MFA_ACR } });
  const doLogout = () => {
    sessionStorage.removeItem(KEY);
    logout({ logoutParams: { returnTo: window.location.origin + import.meta.env.BASE_URL } });
  };

  if (isLoading) return <main className="login"><p className="lead">Cargando…</p></main>;
  if (error) {
    return (
      <Landing onLogin={login}>
        <p className="error">Error de autenticación: {error.message}</p>
      </Landing>
    );
  }
  if (!isAuthenticated) return <Landing onLogin={login} />;
  if (config.requireMfa && mfa === null) return <main className="login"><p className="lead">Verificando segundo factor…</p></main>;
  if (config.requireMfa && !mfa) {
    return (
      <main className="login">
        <div className="login-card">
          <h1>Falta el segundo factor</h1>
          <p className="lead">
            Tu sesión no confirmó la autenticación multifactor. Por seguridad, la app no se
            muestra sin MFA.
          </p>
          <button className="btn primary big" onClick={login}>Verificar con MFA</button>
          <button className="btn ghost" onClick={doLogout}>Cerrar sesión</button>
        </div>
      </main>
    );
  }
  return children({ user, mfa: Boolean(mfa), logout: doLogout });
}
