import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agri-Mart",
    short_name: "Agri-Mart",
    description: "Track crop growth and connect farm supply with buyers.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7f2",
    theme_color: "#f6f7f2",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
