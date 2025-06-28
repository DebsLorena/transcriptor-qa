import express from 'express';
import { parseTextCommands, transcribeAndParse, getExamples } from '../controllers/nlpController.js';

const router = express.Router();

router.post('/parse', parseTextCommands);
router.post('/transcribe-and-parse', transcribeAndParse);
router.get('/examples', getExamples);

export default router;