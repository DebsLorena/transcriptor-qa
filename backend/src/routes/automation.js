import express from 'express';
import { 
  executeCommands, 
  executeSingleCommand, 
  initializeBrowser, 
  closeBrowser, 
  getStatus 
} from '../controllers/automationController.js';

const router = express.Router();

router.post('/execute', executeCommands);
router.post('/execute-single', executeSingleCommand);
router.post('/browser/init', initializeBrowser);
router.post('/browser/close', closeBrowser);
router.get('/status', getStatus);

export default router;