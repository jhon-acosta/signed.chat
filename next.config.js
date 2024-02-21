/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API || 'http://localhost:3001',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost',
  },
}

module.exports = nextConfig
