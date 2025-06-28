import express from 'express';
import upload from '../config/multer.js';
import { uploadAudio } from '../controllers/transcribeController.js';

const router = express.Router();

router.post('/transcribe', upload.single('audio'), uploadAudio);

export default router;
