import express from 'express';
const router = express.Router();
import {createProblem,getProblem,deleteProblem,representativeProblem,problemUnderRep,updateStatus,getProblemData,updateIsSolved, problemUnderUser,updateUserReport,decrementLike} from '../controllers/problemController.js'
import authenticate from '../middleware/authMiddleware.js';

router.post('/createProblem',authenticate, createProblem);
router.get('/:id', getProblem);
router.delete('/delete/:id', deleteProblem);
router.get('/representativeProblem/:id', representativeProblem);
router.get('/problemUnderRep/:id', problemUnderRep);
router.get('/problemUnderUser/all', problemUnderUser);
router.get('/getProblemData/:id',getProblemData)
router.put('/updateStatus/:id',updateStatus)
router.put('/updateIsSolved/:id',updateIsSolved)
router.put('/updateuserreport/:id',updateUserReport)
router.put('/decrementLike/:id',decrementLike)
router.post('/aiDesc',decrementLike)

export default router