/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-a799d58abf144b4884f2f12dbde049ed.r2.dev',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
