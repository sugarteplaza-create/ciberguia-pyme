import { ArrowRight, Network, Boxes, Cloud, ShieldCheck } from 'lucide-react';

export default function Intro({ user, onStart }) {
  const first = (user?.given_name || user?.name || '').split(' ')[0];
  return (
    <section className="intro">
      <h1>{first ? `Hola, ${first}.` : 'Hola.'} Protejamos tu red.</h1>
      <p className="lead">
        Las micro y pequeñas empresas también son blanco de ataques, pero casi nunca tienen un
        equipo de TI. Esta guía te ayuda a ordenar tu red y a protegerla con herramientas
        <strong> open source</strong>, sin costo de licencias.
      </p>

      <div className="how">
        <div className="how-step"><span className="num">1</span><Boxes size={26} /><h3>Arma tu red</h3><p>Elige con íconos tu router, equipos y servidores, y cuántos datos guardas.</p></div>
        <div className="how-step"><span className="num">2</span><Cloud size={26} /><h3>Dinos dónde guardas datos</h3><p>Indica si usas Google Drive, Microsoft 365 u otra nube.</p></div>
        <div className="how-step"><span className="num">3</span><Network size={26} /><h3>Mira tu arquitectura</h3><p>Verás tu red dibujada. Toca cada ícono y aparecerá una nube con lo que debes hacer.</p></div>
        <div className="how-step"><span className="num">4</span><ShieldCheck size={26} /><h3>Recibe tu plan</h3><p>Herramientas open source y controles según ISO 27001, CIS Controls y NIST CSF 2.0.</p></div>
      </div>

      <div className="note">
        <strong>Cómo usarla:</strong> es una guía educativa. Prioriza lo marcado como <em>alta</em> y
        avanza por etapas. Si más adelante quieres validar tu red con un escaneo, hazlo solo con
        autorización escrita del dueño.
      </div>

      <button className="btn primary big" onClick={onStart}>Comenzar <ArrowRight size={18} /></button>
    </section>
  );
}
