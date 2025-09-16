import express from 'express';
const router = express.Router();
import { getLocation } from '../controllers/mapController.js';

// router.post('/', giveCredit);
router.get('/getlocation', getLocation);

export default router