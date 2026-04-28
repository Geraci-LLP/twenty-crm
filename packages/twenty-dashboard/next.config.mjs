/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TWENTY_API_URL: process.env.NEXT_PUBLIC_TWENTY_API_URL,
    NEXT_PUBLIC_CRM_BASE_URL: process.env.NEXT_PUBLIC_CRM_BASE_URL,
  },
};

export default nextConfig;
