// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config) => {
//     // Handle sodium-native native dependencies
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//       net: false,
//       tls: false,
//       crypto: false,
//     };
//     return config;
//   },
//   experimental: {
//     serverMinification: false,
//   },
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these server-side only modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };
    }
    
    // Ignore the critical dependency warnings from stellar-sdk
    config.ignoreWarnings = [
      { module: /node_modules\/sodium-native/ },
      { module: /node_modules\/require-addon/ },
    ];

    return config;
  },
};

module.exports = nextConfig;