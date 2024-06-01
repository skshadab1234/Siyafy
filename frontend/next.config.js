/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        WEBSITE_NAME: process.env.WEBSITE_NAME,
        ADMINURL: process.env.ADMINURL,
    },
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
