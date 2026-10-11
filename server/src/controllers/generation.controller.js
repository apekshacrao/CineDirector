import { isGeminiConfigured, getModelName } from '../config/gemini.js';
import {
  generateFullScreenplayBible,
  generateScenesService,
  generateShotListService,
  generatePromptsService,
  generateAudioDesignService
} from '../services/screenplay.service.js';

/**
 * GET /api/health
 * Returns server health and configuration status without exposing credentials
 */
export async function getHealthStatus(req, res) {
  const configured = isGeminiConfigured();
  return res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'CineDirector AI Engine',
    version: '1.0.0',
    geminiConfigured: configured,
    model: getModelName(),
    timestamp: new Date().toISOString()
  });
}

/**
 * POST /api/generate-screenplay
 * Generates complete screenplay bible from one-line premise
 */
export async function handleGenerateScreenplay(req, res, next) {
  try {
    const {
      idea,
      genre,
      tone,
      runtimeMinutes,
      language,
      targetAudience,
      creativeConstraints
    } = req.body || {};

    // Validation
    if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'A movie idea of at least 10 characters is required to generate a screenplay.'
        }
      });
    }

    if (idea.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INPUT_TOO_LONG',
          message: 'The movie idea must not exceed 2000 characters.'
        }
      });
    }

    const sanitizedRuntime = Number(runtimeMinutes) || 110;
    if (sanitizedRuntime < 5 || sanitizedRuntime > 360) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_RUNTIME',
          message: 'Runtime must be between 5 and 360 minutes.'
        }
      });
    }

    const screenplayBible = await generateFullScreenplayBible({
      idea: idea.trim(),
      genre: (genre || 'Sci-Fi / Drama').trim().slice(0, 100),
      tone: (tone || 'Atmospheric & Cinematic').trim().slice(0, 100),
      runtimeMinutes: sanitizedRuntime,
      language: (language || 'English').trim().slice(0, 50),
      targetAudience: (targetAudience || 'General Cinema Audience').trim().slice(0, 100),
      creativeConstraints: creativeConstraints ? String(creativeConstraints).trim().slice(0, 1000) : ''
    });

    return res.status(200).json({
      success: true,
      message: 'Screenplay Production Bible generated successfully.',
      data: screenplayBible
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/generate-scenes
 * Generates additional or expanded screenplay scenes
 */
export async function handleGenerateScenes(req, res, next) {
  try {
    const {
      projectTitle,
      logline,
      genre,
      tone,
      characters,
      existingScenes,
      sceneRequest
    } = req.body || {};

    if (!Array.isArray(existingScenes)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SCENES_INPUT',
          message: 'existingScenes must be an array.'
        }
      });
    }

    const result = await generateScenesService({
      projectTitle: projectTitle ? String(projectTitle).slice(0, 150) : 'Untitled Project',
      logline: logline ? String(logline).slice(0, 500) : '',
      genre: genre ? String(genre).slice(0, 100) : 'Drama',
      tone: tone ? String(tone).slice(0, 100) : 'Cinematic',
      characters: Array.isArray(characters) ? characters : [],
      existingScenes,
      sceneRequest: sceneRequest ? String(sceneRequest).slice(0, 500) : 'Generate subsequent scenes'
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/generate-shotlist
 * Generates director shot lists for selected scenes
 */
export async function handleGenerateShotList(req, res, next) {
  try {
    const { projectTitle, genre, tone, scenes } = req.body || {};

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_SCENES',
          message: 'At least one scene is required to generate a director shot list.'
        }
      });
    }

    const result = await generateShotListService({
      projectTitle: projectTitle ? String(projectTitle).slice(0, 150) : 'Feature',
      genre: genre ? String(genre).slice(0, 100) : 'Cinematic',
      tone: tone ? String(tone).slice(0, 100) : 'Atmospheric',
      scenes
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/generate-prompts
 * Generates Midjourney and Runway visual prompts
 */
export async function handleGeneratePrompts(req, res, next) {
  try {
    const { projectTitle, genre, tone, visualStyle, scenes, characters } = req.body || {};

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_SCENES',
          message: 'At least one scene is required to generate visual prompts.'
        }
      });
    }

    const result = await generatePromptsService({
      projectTitle: projectTitle ? String(projectTitle).slice(0, 150) : 'Feature',
      genre: genre ? String(genre).slice(0, 100) : 'Cinematic',
      tone: tone ? String(tone).slice(0, 100) : 'Atmospheric',
      visualStyle: visualStyle ? String(visualStyle).slice(0, 300) : '',
      scenes,
      characters: Array.isArray(characters) ? characters : []
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/generate-audio-design
 * Generates audio cues and sound design for scenes
 */
export async function handleGenerateAudioDesign(req, res, next) {
  try {
    const { projectTitle, genre, tone, scenes } = req.body || {};

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_SCENES',
          message: 'At least one scene is required to generate sound design cues.'
        }
      });
    }

    const result = await generateAudioDesignService({
      projectTitle: projectTitle ? String(projectTitle).slice(0, 150) : 'Feature',
      genre: genre ? String(genre).slice(0, 100) : 'Cinematic',
      tone: tone ? String(tone).slice(0, 100) : 'Atmospheric',
      scenes
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}
