import { serve } from "bun";
import { join } from "path";

const PORT = 3002;
const DIST_DIR = join(import.meta.dir, "dist");

console.log(`Starting server on port ${PORT}...`);

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Try finding the file in dist/
    const filePath = join(DIST_DIR, path === "/" ? "index.html" : path);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    // Fallback to index.html for SPA (client-side routing)
    return new Response(Bun.file(join(DIST_DIR, "index.html")));
  },
});

console.log(`Bun server is running at http://localhost:${PORT}`);
