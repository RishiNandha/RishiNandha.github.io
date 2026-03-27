import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url"; // add pathToFileURL
import blogData from "./src/assets/blog/blog.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const blogRoutes = blogData
  .filter((b) => b.publish === 1)
  .map((b) => `/blog/${b.url}`);

const routes = ["/", "/projects", "/music", "/blog", "/cv", "/research", ...blogRoutes];
const dist = path.resolve("dist");
const distClient = path.join(dist, "client");
const template = fs.readFileSync(path.join(distClient, "index.html"), "utf-8");

// Convert Windows absolute path to file:// URL
const serverEntry = pathToFileURL(
  path.join(dist, "server", "entry-server.js")
).href;

const { render } = await import(serverEntry);

for (const route of routes) {
  const { html } = render(route);
  const page = template.replace(
    `<div id="root"></div>`,
    `<div id="root">${html}</div>`
  );
  const dir = route === "/" ? distClient : path.join(distClient, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page);
  console.log("✔", route);
}