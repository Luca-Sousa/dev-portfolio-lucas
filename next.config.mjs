import { withSentryConfig } from "@sentry/nextjs";

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

export default withSentryConfig(nextConfig, {
    org: "lucas-sousa",
    project: "javascript-nextjs",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: {
        enabled: true,
    },
    tunnelRoute: "/monitoring",
    disableLogger: true,
    automaticVercelMonitors: true,
});
