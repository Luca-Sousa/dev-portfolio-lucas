/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-14cdb793b4b54085abc21edea67d935a.r2.dev",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
