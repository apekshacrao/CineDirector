import { getGeminiClient, getModelName, isGeminiConfigured } from '../config/gemini.js';
import {
  fullScreenplaySchema,
  scenesArraySchema,
  shotListsArraySchema,
  promptsPackageSchema,
  audioDesignArraySchema
} from '../schemas/screenplay.schema.js';

/**
 * Helper to safely parse JSON response from Gemini
 */
function parseGeminiJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Gemini returned an empty or invalid response.');
  }

  // Clean markdown code blocks if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON response from Gemini:', cleaned.slice(0, 500));
    const parseError = new Error('Malformed JSON received from AI model.');
    parseError.statusCode = 502;
    parseError.code = 'AI_MALFORMED_OUTPUT';
    throw parseError;
  }
}

/**
 * Service to generate a complete Screenplay Production Bible
 */
export async function generateFullScreenplayBible({
  idea,
  genre = 'Sci-Fi / Drama',
  tone = 'Atmospheric & Cinematic',
  runtimeMinutes = 110,
  language = 'English',
  targetAudience = 'General Cinema Audience',
  creativeConstraints = ''
}) {
  const client = getGeminiClient();
  const model = getModelName();

  const systemInstructions = `You are CineDirector AI, an elite Hollywood Screenwriter, Visionary Feature Film Director, Cinematographer, and Production Designer.
Your job is to transform the provided movie premise into an extraordinary, professional-grade Screenplay and Complete Production Bible.

GUIDELINES FOR GENERATION:
1. Title: Make it unforgettable, cinematic, and distinctive.
2. Logline: 1-2 punchy sentences capturing the protagonist, conflict, and high stakes.
3. Three-Act Structure: Craft a compelling, airtight dramatic progression with high stakes, sharp reversals, and emotional catharsis.
4. Characters: Deep psychological nuance, distinct voices, clear flaws, conflicting motivations, and vivid costume descriptions.
5. Scenes: Provide at least 3-4 pivotal scenes (Opening Hook, Inciting Catalyst, Midpoint Turning Point, Climax Confrontation). Format scene headings with standard industry sluglines (e.g. EXT. RAIN-SLICKED HIGHWAY - NIGHT), visceral action descriptions, and sharp, natural dialogue with parentheticals.
6. Director's Shot List: Technical precision with specific focal lengths (e.g., 35mm Anamorphic, 85mm T1.5), camera movements (Steadicam tracking, slow push-in, crane descents), framing (rule of thirds, center symmetrical), and high-contrast lighting notes.
7. Midjourney Image Prompts: Highly detailed, photorealistic prompts with cinematic photography tags, director aesthetic references, lighting cues, aspect ratios (--ar 16:9 --style raw --v 6.1), and negative prompts.
8. Runway Video Prompts: Motion-focused prompts with camera movement instructions (pan, tilt, zoom, motion brush) and visual style notes.
9. Audio Design: Immersive soundscapes, spatial acoustics, diegetic foley SFX, and orchestral/electronic music cues with psychological intent.
10. Production Summary: World-class visual style statement, evocative 4-5 color palette (with hex codes), key production hurdles, and directorial vision.

Ensure the output strictly conforms to the requested JSON schema.`;

  const userPrompt = `Generate a full Screenplay Production Bible based on the following movie premise:

Premise / Core Idea:
"${idea}"

Specifications:
- Genre: ${genre}
- Tone / Mood: ${tone}
- Target Runtime: ${runtimeMinutes} minutes
- Primary Language: ${language}
- Target Audience: ${targetAudience}
${creativeConstraints ? `- Director's Creative Constraints: ${creativeConstraints}` : ''}

Generate the complete production package according to the structured JSON schema.`;

  try {
    const response = await client.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstructions}\n\n${userPrompt}` }]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: fullScreenplaySchema,
        temperature: 0.75,
        maxOutputTokens: 8192
      }
    });

    const parsedData = parseGeminiJson(response.text);

    // Validate essential keys
    if (!parsedData.project || !parsedData.storyStructure || !parsedData.characters || !parsedData.scenes) {
      throw new Error('Generated screenplay bible missing essential schema structures.');
    }

    return parsedData;
  } catch (err) {
    if (err.statusCode) throw err;
    console.error('Gemini generateScreenplay error:', err);
    const customErr = new Error(`Screenplay generation failed: ${err.message}`);
    customErr.statusCode = 500;
    customErr.code = 'GENERATION_FAILED';
    throw customErr;
  }
}

/**
 * Service to generate or expand scenes
 */
export async function generateScenesService({
  projectTitle = 'Untitled Feature',
  logline = '',
  genre = 'Drama',
  tone = 'Cinematic',
  characters = [],
  existingScenes = [],
  sceneRequest = 'Generate the next sequence of scenes'
}) {
  const client = getGeminiClient();
  const model = getModelName();

  const characterSummaries = characters.map(c => `${c.name} (${c.role}): ${c.personality}`).join('\n');
  const existingSceneCount = existingScenes.length;

  const prompt = `You are CineDirector AI. Generate a sequence of 2-3 detailed, formatted screenplay scenes for the following film project:

Title: ${projectTitle}
Genre: ${genre}
Tone: ${tone}
Logline: ${logline}

Key Characters:
${characterSummaries || 'Protagonist and Antagonist'}

Context / Existing Scenes Count: ${existingSceneCount}
Director's Scene Request: "${sceneRequest}"

Generate scene items starting with sceneNumber ${existingSceneCount + 1}. Include industry sluglines, rich action blocks, character dialogue with parenthetical directions, and dramatic purpose. Conforming to the scenes JSON schema.`;

  const response = await client.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: scenesArraySchema,
      temperature: 0.7
    }
  });

  return parseGeminiJson(response.text);
}

/**
 * Service to generate director's shot list for scenes
 */
export async function generateShotListService({
  projectTitle = 'Untitled Feature',
  genre = 'Cinematic',
  tone = 'Atmospheric',
  scenes = []
}) {
  const client = getGeminiClient();
  const model = getModelName();

  const scenesContext = scenes.map(s => `Scene ${s.sceneNumber}: ${s.heading}\nAction: ${s.action.slice(0, 300)}`).join('\n\n');

  const prompt = `You are a master Feature Cinematographer (DP) and Director.
Generate a comprehensive, technically precise Director's Shot List for the following scenes:

Film: ${projectTitle} (${genre}, ${tone})

Scenes to break down into shots:
${scenesContext}

For each scene, provide 3 to 5 cinematic shots with specific camera movements (Steadicam, dolly, crane, handheld), precise lenses (e.g. 28mm Anamorphic T2.0), framing, chiaroscuro/lighting setup, and directorial intent. Conform to the shotLists JSON schema.`;

  const response = await client.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: shotListsArraySchema,
      temperature: 0.65
    }
  });

  return parseGeminiJson(response.text);
}

/**
 * Service to generate Midjourney & Runway prompts
 */
export async function generatePromptsService({
  projectTitle = 'Untitled Feature',
  genre = 'Cinematic',
  tone = 'Atmospheric',
  visualStyle = '',
  scenes = [],
  characters = []
}) {
  const client = getGeminiClient();
  const model = getModelName();

  const scenesText = scenes.map(s => `Scene ${s.sceneNumber} (${s.heading}): ${s.action.slice(0, 200)}`).join('\n');
  const charsText = characters.map(c => `${c.name}: ${c.physicalDescription}, Costume: ${c.costumeNotes}`).join('\n');

  const prompt = `You are a leading AI Film Visualist and Concept Artist.
Generate Midjourney image prompts and Runway video motion prompts for the following film scenes:

Film: ${projectTitle} (${genre}, ${tone})
Visual Style / Aesthetic: ${visualStyle || '35mm anamorphic cinematic lighting, volumetric atmosphere'}

Characters Visuals:
${charsText || 'Protagonist in atmospheric setting'}

Scenes:
${scenesText}

For each scene:
1. Midjourney prompt: Highly detailed prompt string including aspect ratio (--ar 16:9 --style raw --v 6.1), lighting, lens parameters, plus negative prompt string.
2. Runway video prompt: Duration (5-8s), motion direction, camera movement, and visual style.
Conform to the promptsPackage JSON schema.`;

  const response = await client.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: promptsPackageSchema,
      temperature: 0.7
    }
  });

  return parseGeminiJson(response.text);
}

/**
 * Service to generate audio and sound design
 */
export async function generateAudioDesignService({
  projectTitle = 'Untitled Feature',
  genre = 'Cinematic',
  tone = 'Atmospheric',
  scenes = []
}) {
  const client = getGeminiClient();
  const model = getModelName();

  const scenesText = scenes.map(s => `Scene ${s.sceneNumber} (${s.heading}): ${s.emotionalPurpose || s.action.slice(0, 200)}`).join('\n');

  const prompt = `You are an Academy Award-winning Sound Designer and Film Composer.
Design the complete audio atmosphere, foley effects, and score cues for the following scenes:

Film: ${projectTitle} (${genre}, ${tone})

Scenes:
${scenesText}

For each scene, design:
- Spatial Room Tone & Ambience
- Specific Foley Sound Effects list
- Musical Score Cue (instruments, tempo, motif)
- Subconscious Emotional Psychological Intent
Conform to the audioDesign JSON schema.`;

  const response = await client.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: audioDesignArraySchema,
      temperature: 0.65
    }
  });

  return parseGeminiJson(response.text);
}
