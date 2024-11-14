// /** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true
});

const nextConfig = withPWA({
    reactStrictMode: true,
    // put other next js options here
});

module.exports = nextConfig;
