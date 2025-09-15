const { cloneRepo } = require("./gitRepoClone");
const { generateDockerFiles } = require("./dockerfile");
const { buildAndRun } = require("./buildService");
const { ensureProxyNetwork, ensureNginxProxy } = require("./nginxService");

/**
 * Full deployment flow
 */
async function handleDeploy(repoUrl, userId, appName, type, port,env, customDomain) {
  // 1. Clone repo
  const fullPath = await cloneRepo(repoUrl, userId, appName);

  // 2. Generate Dockerfile
  generateDockerFiles(fullPath, type);

  
  // 4. Proxy setup
  ensureProxyNetwork();
  ensureNginxProxy();
  // const containerName = buildAndRun(appName, userId, fullPath,type,port);
  // const deployedUrl = updateProxy(containerName, "app.emessmodasa.site",type,port,customDomain);
  const deployedUrl = buildAndRun(appName, userId, fullPath, type, port, env,customDomain);
  console.log(`[INFO] App deployed at: ${deployedUrl}`);
  return deployedUrl;
}

module.exports = { handleDeploy };
