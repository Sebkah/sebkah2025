/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Turbopack configuration for GLSL shader files

    turbopack: {
        rules: {
            "*.vert": {
                loaders: ["raw-loader"],
                as: "*.js",
            },
            "*.frag": {
                loaders: ["raw-loader"],
                as: "*.js",
            },
        },
    },




    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',

            },
        ],
    },
    webpack: (config, { isServer }) => {
        // Add custom rules for GLSL files
        config.module.rules.push({
            test: /\.(glsl|vert|frag)$/,
            type: 'asset/source',
        });

        // Remove unnecessary alias for shader types

        return config;
    },

    typescript: {
        ignoreBuildErrors: true, // Disable type checking during build
    },

};

export default nextConfig;
