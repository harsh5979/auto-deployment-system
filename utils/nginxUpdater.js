import fs from 'fs';
const NGINX_CONF_PATH = './nginx/nginx.conf';

export const updateNginxConfig = (containerName) => {
  const upstreamBlock = `
upstream ${containerName} {
  server ${containerName}:80;
}

server {
  listen 80;

  location /${containerName}/ {
    proxy_pass http://${containerName}/;
    rewrite ^/${containerName}(/.*)$ $1 break;
  }
}
`;

  let config = fs.readFileSync(NGINX_CONF_PATH, 'utf-8');
  if (!config.includes(containerName)) {
    config = config.replace(/http\s*{/, `http {\n${upstreamBlock}`);
    fs.writeFileSync(NGINX_CONF_PATH, config);
  }
};
