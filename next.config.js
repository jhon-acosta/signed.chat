/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MONGO_URI: process.env.NEXT_PUBLIC_MONGO_URI || 'mongo_default',
  }
}

module.exports = nextConfig
