const express = require('express');
const  {deployApp ,getUserProjects,getLogs,checkAppname,getProject,editProject,pauseProject,deleteProject} = require('../controllers/deploy.controller');
const {verifyToken} = require('../middlewares/verifyToken');
const { getProjects } = require('../controllers/admin.controller');
const router = express.Router();

router.post('/deploy', verifyToken, deployApp);
router.get('/myprojects',verifyToken,getUserProjects)
router.get('/myprojects/:projectId',verifyToken,getProject)
router.get('/logs/:projectId',verifyToken,getLogs)
router.post('/checkAppname',verifyToken,checkAppname)

router.put('/myprojects/:projectId/edit', verifyToken, editProject);
router.put('/myprojects/pause/:id', verifyToken, pauseProject);
router.delete('/myprojects/delete/:id', verifyToken, deleteProject);


module.exports = router;
