import type { NextConfig } from "next";

const imageDomains = [
  "picsum.photos",
  "res.cloudinary.com",
  "images.unsplash.com",
  "i.pravatar.cc",
  "github.com",
  "images.unsplash.com",
  "i.pinimg.com",
];

const nextConfig: NextConfig = {
  images: {
    domains: imageDomains,
  },
};

export default nextConfig;
