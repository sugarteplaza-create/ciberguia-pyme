import {
  Globe, Router, ShieldCheck, Network, Wifi, Monitor, Laptop, Server, Cloud, HardDrive,
  Cctv, Printer, AudioLines, Bluetooth,
} from 'lucide-react';

const MAP = { Globe, Router, ShieldCheck, Network, Wifi, Monitor, Laptop, Server, Cloud, HardDrive, Cctv, Printer, AudioLines, Bluetooth };

export function Icon({ name, ...props }) {
  const C = MAP[name] || Globe;
  return <C {...props} />;
}
