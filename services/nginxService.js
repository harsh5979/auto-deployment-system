const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const NGINX_PROXY_CONTAINER = "nginx-proxy";
const PROXY_NETWORK = "proxy-net";

// Host folder for nginx configs (mounted to container)
const HOST_CONF_DIR = path.join(__dirname, "../nginx/conf.d");
if (!fs.existsSync(HOST_CONF_DIR)) {
  fs.mkdirSync(HOST_CONF_DIR, { recursive: true });
}

/**
 * Ensure Docker network exists
 */
function ensureProxyNetwork() {
  execSync(
    `docker network inspect ${PROXY_NETWORK} >/dev/null 2>&1 || docker network create ${PROXY_NETWORK}`,
    { stdio: "inherit", shell: true }
  );
}

/**
 * Ensure nginx proxy container is running
 */
function ensureNginxProxy() {
  try {
    execSync(`docker inspect -f "{{.State.Running}}" ${NGINX_PROXY_CONTAINER}`, {
      stdio: "ignore",
      shell: true,
    });
  } catch {
    // Run nginx proxy container if it doesn't exist
    execSync(
      `docker run -d --name ${NGINX_PROXY_CONTAINER} --network ${PROXY_NETWORK} -p 80:80 -v ${HOST_CONF_DIR}:/etc/nginx/conf.d nginx:alpine`,
      { stdio: "inherit", shell: true }
    );
  }
}

/**
 * Add or update proxy config for a container
 * @param {string} appName - container name
 * @param {string} domain - main domain (example.com)
 * @returns {string} full URL of the deployed app
 */
function updateProxy(appName, domain) {
  const serverName = `${appName}.${domain}`;
  const configPath = path.join(HOST_CONF_DIR, `${appName}.conf`);

  // Nginx server block with correct escaping
  const serverBlock = `
server {
    listen 80;
    server_name ${serverName};

    location / {
        proxy_pass http://${appName}:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
  `.trim();

  // Write config to host folder (mounted to container)
  fs.writeFileSync(configPath, serverBlock, "utf8");

  // Test Nginx config inside container
  try {
    execSync(`sudo docker exec ${NGINX_PROXY_CONTAINER} nginx -t`, {
      stdio: "inherit",
      shell: true,
    });
  } catch (err) {
    console.error("Nginx config test failed. Check generated file:", configPath);
    throw new Error("Failed to test nginx config, aborting reload");
  }

  // Reload nginx inside container
  execSync(`sudo docker exec ${NGINX_PROXY_CONTAINER} nginx -s reload`, {
    stdio: "inherit",
    shell: true,
  });

  return `http://${serverName}`;
}

module.exports = { ensureProxyNetwork, ensureNginxProxy, updateProxy };
