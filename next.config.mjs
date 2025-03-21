/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '<https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css>; rel="stylesheet"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;