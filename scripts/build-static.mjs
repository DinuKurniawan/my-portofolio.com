import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
]) {
  await copyFile(join(root, file), join(dist, file));
}

for (const dir of ["public", ".well-known", "src/images"]) {
  await cp(join(root, dir), join(dist, dir), { recursive: true });
}

for (const file of [
  "src/css/output.css",
  "src/js/logo-loop.min.js",
  "src/js/main.min.js",
]) {
  await mkdir(join(dist, dirname(file)), { recursive: true });
  await copyFile(join(root, file), join(dist, file));
}
