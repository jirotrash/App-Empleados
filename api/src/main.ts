import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';
import { networkInterfaces } from 'os';

const getLocalIp = () =>
  Object.values(networkInterfaces())
    .flat()
    .find(i => i?.family === 'IPv4' && !i.internal)?.address || 'localhost';

const listLocalIps = () => {
  const nets = networkInterfaces();
  const results: Array<{ iface: string; address: string }> = [];
  Object.entries(nets).forEach(([name, addrs]) => {
    addrs?.forEach((addr) => {
      if (addr && addr.family === 'IPv4' && !addr.internal) {
        results.push({ iface: name, address: addr.address });
      }
    });
  });
  return results;
};

const getWirelessIp = () => {
  const nets = listLocalIps();
  // Common wireless interface name patterns across platforms
  const wifiRegex = /wi|wifi|wire|wlan|wl/i;
  const found = nets.find(n => wifiRegex.test(n.iface));
  if (found) return found.address;

  // On some systems the iface may be something like 'Ethernet 3' but the address belongs to Wi-Fi range.
  // Fallback: prefer typical private wifi ranges if multiple interfaces exist (192.168.x.x)
  const private192 = nets.find(n => /^192\.168\./.test(n.address));
  if (private192) return private192.address;

  // Last resort: return the first non-internal IPv4 (same as getLocalIp)
  return nets[0]?.address || 'localhost';
};

const capibara = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
      origin: [
          "http://localhost:8081",
          "http://10.42.119.230:8081"
      ],
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
      credentials: true
  });
  app.use(json({limit: "100mb"}));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.setGlobalPrefix("api/dsm44");
  await app.listen(3000);
  const wifiIp = getWirelessIp();
  console.log(`ya prednio tu  http://${wifiIp}:3000`);
}

capibara();
