/* @type {import('next').NextConfig} */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aura usa `proxy.ts` para proteger las rutas administrativas. Next.js
  // almacena temporalmente ese cuerpo antes de llegar a la ruta de carga;
  // el límite por defecto de 10 MB impedía procesar videos válidos.
  experimental: {
    proxyClientMaxBodySize: "120mb",
  },
  allowedDevOrigins: [
    "10.0.1.137",
    "localhost",
    "10.0.1.198",
    "10.0.1.116",
    "192.168.0.103",
    "10.0.1.219",
    "10.0.1.63",
    "10.0.1.173",
    "192.168.40.26",
    "192.168.56.1",
    "10.0.1.194",
  ],
};

export default nextConfig;

// Configuración original

//const nextConfig = {
  //turbopack: {
    //root: __dirname,
  //},
//}

//module.exports = nextConfig
