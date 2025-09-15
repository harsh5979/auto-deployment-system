const fs = require("fs");

/**
 * Write environment variables to a file in .env format
 * @param {string} filePath - Path to .env file
 * @param {object} envObj - Key/value environment variables
 */
function writeEnvFile(filePath, envObj ) {
    console.log(envObj);
    
  const lines = [];

  for (const [key, value] of Object.entries(envObj)) {
    if (value === undefined || value === null || value === "") continue;

    let finalValue = String(value).trim();

    // If already quoted -> keep as is
    if (/^".*"$/.test(finalValue) || /^'.*'$/.test(finalValue)) {
      lines.push(`${key}=${finalValue}`);
    } else {
      lines.push(`${key}=${finalValue}`);
    }
  }

  if (lines.length > 0) {
    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
    console.log(`📂 .env file written at ${filePath}`);
  }
}

module.exports = { writeEnvFile };
