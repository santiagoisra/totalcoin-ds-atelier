import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

/**
 * Vite plugin that scans public/assets/*.svg and exposes the list
 * as a virtual module `virtual:assets-manifest`.
 *
 * In dev: re-reads on every request (HMR-friendly).
 * In build: resolves at build time.
 *
 * Usage in app: `import assets from "virtual:assets-manifest"`
 */
export function assetsManifestPlugin(): Plugin {
  const virtualId = "virtual:assets-manifest";
  const resolvedId = "\0" + virtualId;

  function scanAssets(root: string): string[] {
    const assetsDir = path.join(root, "public", "assets");
    if (!fs.existsSync(assetsDir)) return [];
    return fs
      .readdirSync(assetsDir)
      .filter((f) => f.endsWith(".svg"))
      .sort((a, b) => a.localeCompare(b));
  }

  return {
    name: "assets-manifest",
    enforce: "pre",

    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },

    load(id) {
      if (id !== resolvedId) return null;
      // In dev, re-scan on every load so new assets appear immediately
      const files = scanAssets(process.cwd());
      const manifest = files.map((name) => ({
        name,
        url: `/assets/${encodeURIComponent(name)}`,
        // Human-readable label: remove extension, replace dashes with spaces, capitalize
        label: name
          .replace(/\.svg$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      }));
      return `export default ${JSON.stringify(manifest, null, 2)}`;
    },

    handleHotUpdate({ file, server }) {
      // Trigger HMR when SVGs are added/removed from public/assets
      if (file.startsWith(path.join(process.cwd(), "public", "assets"))) {
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          return [mod];
        }
      }
    },
  };
}