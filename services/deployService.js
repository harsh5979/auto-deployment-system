const { cloneRepo } = require("./gitRepoClone");
const { generateDockerFiles } = require("./dockerfile");
const { buildAndRun } = require("./buildService");
const { ensureProxyNetwork, ensureNginxProxy, updateProxy } = require("./nginxService");

/**
 * Full deployment flow
 */
async function handleDeploy(repoUrl, userId, appName, type = "frontend") {
  // 1. Clone repo
  const fullPath = await cloneRepo(repoUrl, userId, appName);

  // 2. Generate Dockerfile
  generateDockerFiles(fullPath, type);

  // 3. Build + Run container
  const containerName = buildAndRun(appName, userId, fullPath);

  // 4. Proxy setup
  ensureProxyNetwork();
  ensureNginxProxy();
  const deployedUrl = updateProxy(containerName, "app.emessmodasa.site");

  return deployedUrl;
}

module.exports = { handleDeploy };
