import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "switchtoled.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/bulk-sale",
        destination: "/quote-request",
        permanent: true,
      },
      {
        source: "/bulk-sale-inquiry",
        destination: "/quote-request",
        permanent: true,
      },
      {
        source: "/contractor-quote",
        destination: "/quote-request",
        permanent: true,
      },
      {
        source: "/bulk-quote",
        destination: "/quote-request",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
