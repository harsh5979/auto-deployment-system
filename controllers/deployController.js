const { handleDeploy } = require('../services/deployService');

const deployApp = async (req, res) => {
  const { repoUrl, userId, appName } = req.body;

  if (!repoUrl || !userId || !appName) {
    return res.status(400).json({ error: 'Missing repoUrl, userId or appName' });
  }


  try {
    const deployedUrl = await handleDeploy(repoUrl, userId, appName);
    console.log('Deployed URL:', deployedUrl);
    return res.json({ success: true, deployedUrl });
  } catch (err) {
    console.error('Deployment Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { deployApp };
