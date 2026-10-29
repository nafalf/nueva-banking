import { Router } from 'express';
import { addPortfolioAsset, getPortfolioData } from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/', protect, getPortfolioData);
router.post('/assets', protect, addPortfolioAsset);
export default router;
