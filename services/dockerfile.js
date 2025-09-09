const fs = require("fs");
const path = require("path");

/**
 * Generates Dockerfile and nginx.conf (if frontend) for a project
 * @param {string} fullPath - Absolute path to the project folder
 * @returns {string} - Detected build folder or entry point
 */
function generateDockerFiles(fullPath) {
  const pkgPath = path.join(fullPath, "package.json");
  if (!fs.existsSync(pkgPath)) {
    throw new Error("package.json not found, cannot detect project type");
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  const isFrontend =
    (pkg.dependencies && (pkg.dependencies.react || pkg.dependencies.vite)) ||
    (pkg.devDependencies && pkg.devDependencies.vite);

  let dockerfile = "";
  var outputDir = "dist";

  if (isFrontend) {
    // Detect build folder
    // outputDir = fs.existsSync(path.join(fullPath, "dist")) ? "dist" : "build";

    dockerfile = `
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/${outputDir} /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
    `.trim();

    // Write nginx.conf for SPA routing
    const nginxConf = `
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
    `.trim();

    fs.writeFileSync(path.join(fullPath, "nginx.conf"), nginxConf, "utf8");

  } else {
    // Backend
    const entryFile = pkg.main || "server.js";

    dockerfile = `
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["node","${entryFile}"]
    `.trim();

    outputDir = entryFile;
  }

  fs.writeFileSync(path.join(fullPath, "Dockerfile"), dockerfile, "utf8");
  console.log("Dockerfile generated for", isFrontend ? "frontend" : "backend");
  return outputDir;
}

module.exports = { generateDockerFiles };
