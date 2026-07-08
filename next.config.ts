/* @type {import('next').NextConfig} */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "10.0.1.137",
    "localhost",
    "10.0.1.198",
    "10.0.1.116",
    "192.168.0.103",
    "10.0.1.219",
    "10.0.1.63"
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