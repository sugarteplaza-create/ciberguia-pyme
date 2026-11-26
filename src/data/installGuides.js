// Guía de instalación por herramienta: nivel de usuario, requisitos y enlaces.
// - `level` y `time` son JUICIO DEL PROYECTO (no lo declara cada proyecto oficial).
// - `reqs` con `verified: true` fueron contrastados con la documentación oficial citada (25-nov-2026).
//   Con `verified: false` son orientativos: confírmalos en la documentación oficial.
// - Solo se incluyen enlaces que aparecieron en la búsqueda o en el sitio oficial ya listado en TOOLS.
//   Los videos no se enlazan salvo los que las propias páginas referenciadas declaran.

export const LEVELS = {
  basico: { label: 'Básico', hint: 'Instalador con "siguiente, siguiente"; sin terminal.' },
  intermedio: { label: 'Intermedio', hint: 'Requiere terminal/Linux o Docker y seguir una guía.' },
  avanzado: { label: 'Avanzado', hint: 'Requiere administrar servidores/red; mejor con apoyo técnico.' },
};

const G = (title, url, kind = 'page') => ({ title, url, kind });

export const INSTALL_GUIDES = {
  opnsense: {
    level: 'avanzado', time: '2–4 h',
    verified: true,
    reqs: ['Equipo de 64 bits con 2 o más tarjetas de red (WAN/LAN)', 'Instalador: ≈40 GB SSD y ≥3 GB RAM; SSD recomendado de 120 GB', 'Alternativa: imagen "nano" en tarjeta SD/CF de al menos 4 GB', 'Pendrive para instalar'],
    docs: [G('Requisitos de hardware', 'https://docs.opnsense.org/manual/hardware.html'), G('Guía de instalación', 'https://docs.opnsense.org/manual/install.html'), G('Descargas', 'https://opnsense.org/get-started/')],
    tutorials: [],
  },
  pfsense: {
    level: 'avanzado', time: '2–4 h',
    verified: true,
    reqs: ['CPU amd64 de 64 bits, 1 GB RAM, 8 GB de disco', 'Tarjetas de red compatibles', 'Pendrive USB para instalar'],
    docs: [G('Requisitos mínimos', 'https://docs.netgate.com/pfsense/en/latest/hardware/minimum-requirements.html'), G('Realizar la instalación', 'https://docs.netgate.com/pfsense/en/latest/book/install/perform-install.html')],
    tutorials: [],
  },
  openwrt: {
    level: 'avanzado', time: '1–3 h',
    verified: true,
    reqs: ['Router/AP que figure en la Tabla de Hardware de OpenWrt', 'Recomendado: 16 MB flash y 128 MB RAM (8/64 MB solo como mínimo, "no comprar")', 'Riesgo de dejar el equipo inservible si se instala mal: respalda el firmware original'],
    docs: [G('Tabla de hardware compatible', 'https://openwrt.org/toh/start'), G('Dispositivos soportados', 'https://openwrt.org/supported_devices'), G('Instalación de fábrica (quick start)', 'https://openwrt.org/docs/guide-quick-start/factory_installation')],
    tutorials: [],
  },
  suricata: {
    level: 'avanzado', time: '2–3 h',
    verified: false,
    reqs: ['Linux (p. ej. Ubuntu) con acceso al tráfico de la red (puerto espejo o dentro del firewall)', 'Conocimientos de terminal y de reglas', 'Puede instalarse desde el repositorio PPA oficial en Ubuntu'],
    docs: [G('Instalación (documentación oficial)', 'https://docs.suricata.io/en/latest/install.html')],
    tutorials: [],
  },
  crowdsec: {
    level: 'intermedio', time: '30–60 min',
    verified: true,
    reqs: ['Servidor Linux con terminal', 'El motor detecta; para bloquear hace falta instalar además un "remediation component" (p. ej. para el firewall)', 'Usa puertos locales 8080 y 6060'],
    docs: [G('Introducción', 'https://docs.crowdsec.net/u/getting_started/intro'), G('Instalación en Linux', 'https://docs.crowdsec.net/u/getting_started/installation/linux')],
    tutorials: [],
  },
  wireguard: {
    level: 'intermedio', time: '30–60 min',
    verified: true,
    reqs: ['Un equipo siempre encendido con IP pública o un puerto UDP abierto en el router', 'Linux: incluido en el kernel desde la 5.6', 'Cliente disponible para Windows, macOS, Android e iOS'],
    docs: [G('Instalación', 'https://www.wireguard.com/install/'), G('Inicio rápido', 'https://www.wireguard.com/quickstart/')],
    tutorials: [],
  },
  adguard: {
    level: 'intermedio', time: '20–40 min',
    verified: true,
    reqs: ['Equipo siempre encendido (Raspberry Pi, mini-PC, VM o Docker)', 'Puertos: 3000/TCP (primera configuración), 80/TCP (panel), 53/UDP (DNS)', 'Luego configurar el router/DHCP para que use este DNS'],
    docs: [G('Primeros pasos', 'https://adguard-dns.io/kb/adguard-home/getting-started')],
    tutorials: [],
  },
  oxidized: {
    level: 'avanzado', time: '1–2 h',
    verified: true,
    reqs: ['Linux (Debian 12+/Ubuntu) con Ruby, o Docker', 'Acceso SSH/Telnet a los equipos de red con usuario de solo lectura', 'Repositorio (git) para guardar las configuraciones'],
    docs: [G('Repositorio y guía oficial', 'https://github.com/ytti/oxidized')],
    tutorials: [],
  },
  librenms: {
    level: 'avanzado', time: '1–2 h',
    verified: true,
    reqs: ['Servidor Linux con servidor web (nginx), MariaDB y PHP', 'SNMP activado en los equipos a monitorear'],
    docs: [G('Documentación oficial', 'https://docs.librenms.org')],
    tutorials: [G('Instalar en Ubuntu 22.04 (HowtoForge)', 'https://www.howtoforge.com/how-to-install-librenms-monitoring-tool-on-ubuntu-linux-22-04')],
  },
  nmap: { level: 'basico', time: '10 min', verified: false, reqs: ['Instalador para Windows, macOS y Linux en el sitio oficial', 'Úsalo solo en redes propias o con autorización'], docs: [G('Sitio oficial y descarga', 'https://nmap.org')], tutorials: [] },
  freeradius: { level: 'avanzado', time: '2–4 h', verified: false, reqs: ['Servidor Linux', 'Certificados y un punto de acceso compatible con WPA-Enterprise'], docs: [G('Sitio oficial', 'https://freeradius.org')], tutorials: [] },
  kismet: { level: 'avanzado', time: '1–2 h', verified: false, reqs: ['Linux y adaptador Wi-Fi compatible con modo monitor'], docs: [G('Sitio oficial', 'https://www.kismetwireless.net')], tutorials: [] },
  clamav: {
    level: 'basico', time: '15–30 min',
    verified: true,
    reqs: ['Windows, Linux o macOS (hay instaladores MSI, DEB/RPM y PKG)', 'RAM recomendada: 3 GiB o más', 'También disponible por gestor de paquetes o Docker'],
    docs: [G('Instalación (manual oficial)', 'https://docs.clamav.net/manual/Installing.html')],
    tutorials: [],
  },
  wazuh: {
    level: 'avanzado', time: '1–3 h',
    verified: true,
    reqs: ['Servidor Linux (Ubuntu/RHEL) con sudo e internet', 'Para 1–25 agentes: 4 vCPU, 8 GB RAM, 50 GB de disco (90 días)', 'Abrir puertos del panel (443/TCP) y de los agentes', 'Luego instalar el agente en cada PC (Windows/Linux)'],
    docs: [G('Quickstart (instalación todo en uno)', 'https://documentation.wazuh.com/current/quickstart.html'), G('Guía de instalación', 'https://documentation.wazuh.com/current/installation-guide/requirements.html')],
    tutorials: [],
  },
  osquery: { level: 'intermedio', time: '30 min', verified: false, reqs: ['Instalador para Windows, macOS y Linux', 'Consultas en lenguaje SQL'], docs: [G('Sitio oficial', 'https://osquery.io')], tutorials: [] },
  veracrypt: {
    level: 'basico', time: '15–30 min',
    verified: true,
    reqs: ['Windows, macOS o Linux', 'Una contraseña larga que NO olvides (sin ella los datos no se recuperan)', 'Para cifrar el disco del sistema se requieren permisos de administrador'],
    docs: [G('Tutorial para principiantes (oficial)', 'https://www.veracrypt.fr/en/Beginner%27s%20Tutorial.html')],
    tutorials: [G('Guía paso a paso (Freedom of the Press Foundation)', 'https://freedom.press/digisec/blog/veracrypt-guide/')],
  },
  keepassxc: {
    level: 'basico', time: '10–15 min',
    verified: true,
    reqs: ['Windows, macOS o Linux', 'Una contraseña maestra larga y un respaldo de la base de datos'],
    docs: [G('Guía de inicio (oficial)', 'https://keepassxc.org/'), G('Wiki oficial (QuickStart)', 'https://www.github.com/keepassxreboot/keepassxc/wiki')],
    tutorials: [G('Cómo usar KeePassXC (EFF)', 'https://ssd.eff.org/module/how-use-keepassxc')],
  },
  bitwarden: { level: 'intermedio', time: '10 min (nube) / 1 h (servidor propio)', verified: false, reqs: ['Usar la versión en la nube es sencillo; alojarlo tú requiere servidor con Docker'], docs: [G('Sitio oficial', 'https://bitwarden.com')], tutorials: [] },
  lynis: { level: 'intermedio', time: '15 min', verified: false, reqs: ['Linux/Unix con terminal', 'Ejecutar con permisos de administrador'], docs: [G('Sitio oficial', 'https://cisofy.com/lynis/')], tutorials: [] },
  openvas: {
    level: 'avanzado', time: '1–3 h',
    verified: true,
    reqs: ['Linux con Docker (contenedores oficiales) o compilación desde código fuente', 'Conocimientos de terminal; en contenedores, nociones de Docker', 'Descarga inicial de las bases de vulnerabilidades (tarda y consume disco)'],
    docs: [G('Documentación oficial', 'https://greenbone.github.io/docs/latest'), G('Contenedores comunitarios (Docker)', 'https://greenbone.github.io/docs/latest/22.4/container/index.html')],
    tutorials: [],
  },
  fail2ban: { level: 'intermedio', time: '20 min', verified: false, reqs: ['Servidor Linux con terminal'], docs: [G('Repositorio oficial', 'https://github.com/fail2ban/fail2ban')], tutorials: [] },
  truenas: { level: 'avanzado', time: '2–3 h', verified: false, reqs: ['Equipo dedicado con varios discos y RAM suficiente para ZFS'], docs: [G('Sitio oficial', 'https://www.truenas.com')], tutorials: [] },
  restic: {
    level: 'intermedio', time: '30 min',
    verified: true,
    reqs: ['Terminal (Windows, macOS o Linux)', 'Un destino: disco externo, NAS (SFTP) o almacenamiento en la nube', 'Contraseña del repositorio: si se pierde, los respaldos no se pueden abrir'],
    docs: [G('Preparar un repositorio nuevo', 'https://restic.readthedocs.io/en/latest/030_preparing_a_new_repo.html'), G('Introducción y guía rápida', 'https://restic.readthedocs.io/en/latest/010_introduction.html')],
    tutorials: [],
  },
  borg: { level: 'intermedio', time: '30 min', verified: false, reqs: ['Terminal (Linux/macOS); destino por SSH o disco'], docs: [G('Sitio oficial', 'https://www.borgbackup.org')], tutorials: [] },
  kopia: { level: 'basico', time: '20 min', verified: false, reqs: ['Instalador con interfaz gráfica para Windows, macOS y Linux'], docs: [G('Sitio oficial', 'https://kopia.io')], tutorials: [] },
  urbackup: { level: 'intermedio', time: '1 h', verified: false, reqs: ['Un servidor y un cliente en cada equipo; panel web'], docs: [G('Sitio oficial', 'https://www.urbackup.org')], tutorials: [] },
  rclone: { level: 'intermedio', time: '30 min', verified: false, reqs: ['Terminal y autorizar tu cuenta de la nube (OAuth)'], docs: [G('Sitio oficial', 'https://rclone.org')], tutorials: [] },
  cryptomator: { level: 'basico', time: '10 min', verified: false, reqs: ['Instalador para Windows, macOS y Linux; apps móviles'], docs: [G('Sitio oficial', 'https://cryptomator.org')], tutorials: [] },
  frigate: {
    level: 'avanzado', time: '2–4 h',
    verified: true,
    reqs: ['Anfitrión con Docker (idealmente Debian/Linux)', 'CPU con instrucciones AVX/AVX2 para detección en CPU (algunos Intel anteriores a 2020 no la tienen)', 'Cámaras IP con H.264 (+AAC) para máxima compatibilidad', 'Disco SSD o de grabación (NVR) para las grabaciones', 'MQTT es opcional (necesario solo con Home Assistant)'],
    docs: [G('Planificar la instalación', 'https://docs.frigate.video/frigate/planning_setup'), G('Instalación', 'https://docs.frigate.video/frigate/installation'), G('Hardware recomendado', 'https://docs.frigate.video/frigate/hardware')],
    tutorials: [G('Guía de NetworkChuck (repositorio con video enlazado)', 'https://github.com/theNetworkChuck/frigate-nvr-guide', 'video')],
  },
  zoneminder: { level: 'avanzado', time: '2–3 h', verified: false, reqs: ['Servidor Linux con web, base de datos y mucho disco'], docs: [G('Sitio oficial', 'https://zoneminder.com')], tutorials: [] },
  cups: { level: 'intermedio', time: '30 min', verified: false, reqs: ['Servidor Linux/macOS con CUPS; impresora con driver compatible'], docs: [G('Sitio oficial', 'https://openprinting.github.io/cups/')], tutorials: [] },
  syncthing: {
    level: 'basico', time: '15–30 min',
    verified: true,
    reqs: ['Instalar en cada equipo que sincronizará (Windows, macOS, Linux, Android)', 'Panel local en http://localhost:8384', 'Si no conecta, revisar el cortafuegos'],
    docs: [G('Primeros pasos (la página enlaza a un video de instalación en Windows)', 'https://docs.syncthing.net/intro/getting-started', 'video'), G('Documentación', 'https://docs.syncthing.net')],
    tutorials: [],
  },
  nextcloud: {
    level: 'avanzado', time: '2–4 h',
    verified: true,
    reqs: ['Linux de 64 bits (p. ej. Ubuntu LTS) con servidor web, base de datos y PHP', 'Hay opciones automatizadas comunitarias (Docker, NextcloudPi) sin soporte oficial', 'Certificado HTTPS recomendado'],
    docs: [G('Requisitos del sistema', 'https://docs.nextcloud.com/server/stable/admin_manual/installation/system_requirements.html'), G('Instalación en Linux', 'https://docs.nextcloud.com/server/stable/admin_manual/installation/source_installation.html')],
    tutorials: [],
  },
  bluez: { level: 'intermedio', time: '10 min', verified: false, reqs: ['Linux con adaptador Bluetooth; suele venir preinstalado'], docs: [G('Sitio oficial', 'https://www.bluez.org')], tutorials: [] },
  aegis: { level: 'basico', time: '5 min', verified: false, reqs: ['Teléfono Android', 'Guarda copias cifradas de tus códigos'], docs: [G('Sitio oficial', 'https://getaegis.app')], tutorials: [] },
  enteauth: { level: 'basico', time: '5 min', verified: false, reqs: ['Teléfono o computador; cuenta opcional para respaldo'], docs: [G('Sitio oficial', 'https://ente.io/auth/')], tutorials: [] },
};

export function guideFor(id) { return INSTALL_GUIDES[id] || null; }
export function levelLabel(id) { const g = INSTALL_GUIDES[id]; return g ? LEVELS[g.level].label : null; }
