/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },

  modularizeImports: {
    antd: {
      transform: "antd/lib/{{ kebabCase member }}",
    },
    "@ant-design/icons": {
      transform: "@ant-design/icons/{{ member }}",
    },
    "@ant-design": {
      transform: "@ant-design/{{ kebabCase member }}",
    },
  },

  transpilePackages: ["@ant-design"],

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
