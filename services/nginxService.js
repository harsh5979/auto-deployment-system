// services/nginxService.js
const { execSync } = require("child_process");

const NGINX_PROXY_CONTAINER = "nginx-proxy";
const ACME_CONTAINER = "nginx-proxy-acme";
const PROXY_NETWORK = "proxy-net";

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
 * Ensure nginx-proxy + letsencrypt companion are running
 */
function ensureNginxProxy() {
  try {
    execSync(`docker inspect -f "{{.State.Running}}" ${NGINX_PROXY_CONTAINER}`, {
      stdio: "ignore",
      shell: true,
    });
  } catch {
    // Create volumes for SSL certs
    execSync(`docker volume create nginx_certs`, { stdio: "inherit", shell: true });
    execSync(`docker volume create nginx_vhost`, { stdio: "inherit", shell: true });
    execSync(`docker volume create nginx_html`, { stdio: "inherit", shell: true });

    // Run nginx-proxy
    execSync(
      `docker run -d --name ${NGINX_PROXY_CONTAINER} --network ${PROXY_NETWORK} \
        -p 80:80 -p 443:443 \
        -v nginx_certs:/etc/nginx/certs \
        -v nginx_vhost:/etc/nginx/vhost.d \
        -v nginx_html:/usr/share/nginx/html \
        -v /var/run/docker.sock:/tmp/docker.sock:ro \
        jwilder/nginx-proxy`,
      { stdio: "inherit", shell: true }
    );

    // Run letsencrypt companion
    execSync(
      `docker run -d --name ${ACME_CONTAINER} --network ${PROXY_NETWORK} \
        --volumes-from ${NGINX_PROXY_CONTAINER} \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        jrcs/letsencrypt-nginx-proxy-companion`,
      { stdio: "inherit", shell: true }
    );
  }
}

module.exports = { ensureProxyNetwork, ensureNginxProxy };
