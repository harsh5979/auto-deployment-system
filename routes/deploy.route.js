const express = require('express');
const  {deployApp ,getUserProjects,getLogs,checkAppname} = require('../controllers/deploy.controller');
const {verifyToken} = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/deploy', verifyToken, deployApp);
router.get('/myprojects',verifyToken,getUserProjects)
router.get('/logs/:projectId',verifyToken,getLogs)
router.post('/checkAppname',verifyToken,checkAppname)

module.exports = router;
