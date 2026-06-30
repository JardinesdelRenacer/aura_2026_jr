/* @type {import('next').NextConfig} */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "10.0.1.137",
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