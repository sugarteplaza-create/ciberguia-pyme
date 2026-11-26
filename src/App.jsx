import { useState } from 'react';
import { ShieldCheck, LogOut, BadgeCheck, BookOpen } from 'lucide-react';
import { auth0Configured, config } from './config.js';
import AuthGate from './components/AuthGate.jsx';
import Intro from './components/Intro.jsx';
import Wizard from './components/Wizard.jsx';
import Result from './components/Result.jsx';
import Sources from './components/Sources.jsx';
import Feedback from './components/Feedback.jsx';
import { DEFAULT_CONTEXT } from './lib/architecture.js';

function Shell({ user, mfa, onLogout }) {
  const [step, setStep] = useState('intro'); // intro | wizard | result | sources
  const [prev, setPrev] = useState('intro');
  const go = (next) => { if (next === 'sources') setPrev(step); setStep(next); window.scrollTo(0, 0); };
  const [ctx, setCtx] = useState(DEFAULT_CONTEXT);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><ShieldCheck size={22} /> CiberGuía Pyme</div>
        <div className="who">
          {mfa && <span className="chip ok" title="Sesión verificada con segundo factor"><BadgeCheck size={14} /> MFA</span>}
          <button className="btn ghost small" onClick={() => go('sources')}><BookOpen size={14} /> Fuentes</button>
          <span className="user">{user?.name || user?.email}</span>
          <button className="btn ghost small" onClick={onLogout}><LogOut size={14} /> Salir</button>
        </div>
      </header>
      <main className="content">
        {step === 'intro' && <Intro user={user} onStart={() => go('wizard')} />}
        {step === 'wizard' && (
          <Wizard ctx={ctx} setCtx={setCtx} onFinish={() => go('result')} onBack={() => go('intro')} />
        )}
        {step === 'result' && <Result ctx={ctx} onEdit={() => go('wizard')} onSources={() => go('sources')} />}
        {step === 'sources' && <Sources onBack={() => go(prev)} />}
        <Feedback />
      </main>
      <footer className="foot">
        Guía educativa basada en ISO/IEC 27001:2022, CIS Controls v8.1 y NIST CSF 2.0. No reemplaza una auditoría.
        Realiza pruebas de seguridad solo con autorización escrita.
      </footer>
    </div>
  );
}

function NeedsSetup() {
  return (
    <main className="login">
      <div className="login-card">
        <h1>Falta configurar Auth0</h1>
        <p className="lead">
          Copia <code>.env.example</code> a <code>.env.local</code> y completa
          <code> VITE_AUTH0_DOMAIN</code> y <code>VITE_AUTH0_CLIENT_ID</code>.
          Los pasos están en <code>docs/AUTH0.md</code>.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  if (!auth0Configured) {
    if (config.demoMode) {
      return <Shell user={{ name: 'Modo demostración' }} mfa={false} onLogout={() => window.location.reload()} />;
    }
    return <NeedsSetup />;
  }
  return (
    <AuthGate>
      {({ user, mfa, logout }) => <Shell user={user} mfa={mfa} onLogout={logout} />}
    </AuthGate>
  );
}
