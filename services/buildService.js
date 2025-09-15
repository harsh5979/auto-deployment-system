const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { writeEnvFile } = require("../helpers/envHelper");

function buildAndRun(appName, userId, fullPath, type, port, env, customDomain = "") {
  const containerName = appName.toString().toLowerCase();
  const imageName = containerName;

  console.log(`🚀 Building & running app: ${appName}`);

  // ✅ 1. Build-time .env
  const envFile = path.join(fullPath, ".env");
  writeEnvFile(envFile, env);

  // ✅ 2. Build Docker image
  execSync(`docker build -t ${imageName} ${fullPath}`, {
    stdio: "inherit",
    shell: true,
  });

  // ✅ 3. Domain (custom or auto-generated)
  const domain =
    typeof customDomain === "string" && customDomain.trim() !== ""
      ? customDomain
      : `${appName}.app.emessmodasa.site`;

  // ✅ 4. Runtime .env
  const runtimeEnvFile = path.join(fullPath, ".env");
  writeEnvFile(runtimeEnvFile, env);

  // ✅ 5. Run Docker container
  let runCmd = `docker run -d --restart=unless-stopped \
    --name ${containerName} \
    --network proxy-net \
    -e VIRTUAL_HOST=${domain} \
    -e LETSENCRYPT_HOST=${domain} \
    -e LETSENCRYPT_EMAIL=harshprajapati0018@gmail.com`;

  if (fs.existsSync(runtimeEnvFile)) {
    runCmd += ` --env-file ${runtimeEnvFile}`;
  }

  runCmd += ` ${imageName}`;

  execSync(runCmd, { stdio: "inherit", shell: true });

  console.log(`✅ Deployment successful: https://${domain}`);
  return domain.startsWith("http") ? domain : `https://${domain}`;
}

module.exports = { buildAndRun };
