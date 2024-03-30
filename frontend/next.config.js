/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        WEBSITE_NAME: process.env.WEBSITE_NAME,
        ADMINURL: process.env.ADMINURL,
        DOCS_WEBSITE_NAME: process.env.DOCS_WEBSITE_NAME,
    },
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
