const express = require('express');
const  {deployApp ,getUserProjects,getLogs,checkAppname,getProject} = require('../controllers/deploy.controller');
const {verifyToken} = require('../middlewares/verifyToken');
const { getProjects } = require('../controllers/admin.controller');
const router = express.Router();

router.post('/deploy', verifyToken, deployApp);
router.get('/myprojects',verifyToken,getUserProjects)
router.get('/myprojects/:projectId',verifyToken,getProject)
router.get('/logs/:projectId',verifyToken,getLogs)
router.post('/checkAppname',verifyToken,checkAppname)

module.exports = router;
