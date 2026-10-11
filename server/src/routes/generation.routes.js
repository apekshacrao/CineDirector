import { Router } from 'express';
import {
  getHealthStatus,
  handleGenerateScreenplay,
  handleGenerateScenes,
  handleGenerateShotList,
  handleGeneratePrompts,
  handleGenerateAudioDesign
} from '../controllers/generation.controller.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import { notFoundHandler } from '../middleware/errorHandler.js';

const router = Router();

// Rate limiter for generation endpoints (30 requests per minute per IP)
const generationLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: 'Screenplay generation rate limit reached. Please wait a minute before requesting more AI generations.'
});

// Health check endpoint
router.get('/health', getHealthStatus);

// Core Generation Endpoints
router.post('/generate-screenplay', generationLimiter, handleGenerateScreenplay);
router.post('/generate-scenes', generationLimiter, handleGenerateScenes);
router.post('/generate-shotlist', generationLimiter, handleGenerateShotList);
router.post('/generate-prompts', generationLimiter, handleGeneratePrompts);
router.post('/generate-audio-design', generationLimiter, handleGenerateAudioDesign);

// Route 404 within /api
router.use(notFoundHandler);

export default router;
