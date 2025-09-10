const { cloneRepo } = require("./gitRepoClone");
const { generateDockerFiles } = require("./dockerfile");
const { buildAndRun } = require("./buildService");
const { ensureProxyNetwork, ensureNginxProxy, updateProxy } = require("./nginxService");

/**
 * Full deployment flow
 */
async function handleDeploy(repoUrl, userId, appName, type ,port,customDomain) {
  // 1. Clone repo
  const fullPath = await cloneRepo(repoUrl, userId, appName);

  // 2. Generate Dockerfile
  generateDockerFiles(fullPath, type);

  // 3. Build + Run container
  const containerName = buildAndRun(appName, userId, fullPath,type,port);

  // 4. Proxy setup
  ensureProxyNetwork();
  ensureNginxProxy();
  const deployedUrl = updateProxy(containerName, "app.emessmodasa.site",type,port,customDomain);

  return deployedUrl;
}

module.exports = { handleDeploy };
