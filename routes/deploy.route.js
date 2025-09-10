const express = require('express');
const  {deployApp ,getUserProjects} = require('../controllers/deploy.controller');
const {verifyToken} = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/deploy', verifyToken, deployApp);
router.get('/myprojects',verifyToken,getUserProjects)

module.exports = router;
