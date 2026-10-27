/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Capitol Pulse pages that were merged into the current layout
    return [
      { source: "/capitol-pulse/dashboard", destination: "/capitol-pulse", permanent: false },
      { source: "/capitol-pulse/search", destination: "/capitol-pulse/bills", permanent: false },
      { source: "/capitol-pulse/data", destination: "/capitol-pulse/methodology", permanent: false },
      { source: "/capitol-pulse/statements/:id*", destination: "/capitol-pulse/bills", permanent: false },
      { source: "/capitol-pulse/votes/:id*", destination: "/capitol-pulse/bills", permanent: false }
    ];
  }
};

export default nextConfig;
