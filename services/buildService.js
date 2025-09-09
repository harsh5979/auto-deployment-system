// services/buildService.js
const { execSync } = require("child_process");

function buildAndRun(appName, userId, fullPath) {
  const containerName = `${appName}-${userId}`;
  const imageName = containerName;

  // Build image
  execSync(`docker build -t ${imageName} ${fullPath}`, {
    stdio: "inherit",
    shell: true,
  });

  // Run container in proxy-net
  execSync(
    `docker run -d --restart=unless-stopped --name ${containerName} --network proxy-net ${imageName}`,
    { stdio: "inherit", shell: true }
  );

  return containerName;
}

module.exports = { buildAndRun };
