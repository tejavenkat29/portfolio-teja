import type { MetadataRoute } from "next";

import { profile } from "@/lib/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — Backend Software Engineer`,
    short_name: profile.name,
    description:
      "Portfolio of Teja Venkat Kundem — backend engineer building real-time AI systems, distributed architectures and production APIs.",
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#050816",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
