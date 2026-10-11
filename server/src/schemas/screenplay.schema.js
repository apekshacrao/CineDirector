import { Type } from '@google/genai';

/**
 * Story Structure Schema
 */
export const storyStructureSchema = {
  type: Type.OBJECT,
  description: 'Three-act dramatic narrative structure for the film.',
  properties: {
    actOne: {
      type: Type.OBJECT,
      description: 'Act 1: Setup, Inciting Incident, and First Plot Point.',
      properties: {
        summary: { type: Type.STRING, description: 'Summary of the ordinary world and setup.' },
        incitingIncident: { type: Type.STRING, description: 'The catalyst event that disrupts protagonist status quo.' },
        turningPoint: { type: Type.STRING, description: 'The point of no return leading into Act 2.' }
      },
      required: ['summary', 'incitingIncident', 'turningPoint']
    },
    actTwo: {
      type: Type.OBJECT,
      description: 'Act 2: Rising action, midpoint crisis, and darkest hour.',
      properties: {
        summary: { type: Type.STRING, description: 'Summary of rising stakes and trials.' },
        midpoint: { type: Type.STRING, description: 'Crucial revelation or shift raising the stakes dramatically.' },
        majorConflict: { type: Type.STRING, description: 'Core antagonists or obstacles faced.' },
        turningPoint: { type: Type.STRING, description: 'All hope seems lost / crisis before Act 3.' }
      },
      required: ['summary', 'midpoint', 'majorConflict', 'turningPoint']
    },
    actThree: {
      type: Type.OBJECT,
      description: 'Act 3: Climax, resolution, and aftermath.',
      properties: {
        summary: { type: Type.STRING, description: 'Summary of the final confrontation.' },
        climax: { type: Type.STRING, description: 'The peak dramatic climax where conflict is decided.' },
        resolution: { type: Type.STRING, description: 'The new equilibrium and emotional aftermath.' }
      },
      required: ['summary', 'climax', 'resolution']
    }
  },
  required: ['actOne', 'actTwo', 'actThree']
};

/**
 * Character Profile Item Schema
 */
export const characterItemSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'Unique identifier, e.g. char_1, char_2' },
    name: { type: Type.STRING, description: 'Full character name' },
    role: { type: Type.STRING, description: 'Dramatic role: Protagonist, Antagonist, Mentor, Ally, etc.' },
    age: { type: Type.STRING, description: 'Approximate age or age bracket' },
    personality: { type: Type.STRING, description: 'Psychological traits and demeanor' },
    motivation: { type: Type.STRING, description: 'Core goal and subconscious desire' },
    backstory: { type: Type.STRING, description: 'Crucial formative history and secrets' },
    characterArc: { type: Type.STRING, description: 'Internal transformation from beginning to end' },
    physicalDescription: { type: Type.STRING, description: 'Physical appearance, stature, facial features' },
    costumeNotes: { type: Type.STRING, description: 'Wardrobe, textures, silhouette, thematic colors' }
  },
  required: [
    'id',
    'name',
    'role',
    'age',
    'personality',
    'motivation',
    'backstory',
    'characterArc',
    'physicalDescription',
    'costumeNotes'
  ]
};

/**
 * Dialogue Item Schema
 */
export const dialogueItemSchema = {
  type: Type.OBJECT,
  properties: {
    character: { type: Type.STRING, description: 'Name of the speaking character (UPPERCASE)' },
    direction: { type: Type.STRING, description: 'Parenthetical emotion or action cue, e.g. (whispering, nervous)' },
    line: { type: Type.STRING, description: 'Spoken line of dialogue' }
  },
  required: ['character', 'direction', 'line']
};

/**
 * Scene Item Schema
 */
export const sceneItemSchema = {
  type: Type.OBJECT,
  properties: {
    sceneNumber: { type: Type.INTEGER, description: 'Sequential scene number' },
    heading: { type: Type.STRING, description: 'Industry standard scene heading slugline e.g. EXT. RAIN-SLICK ALLEY - NIGHT' },
    location: { type: Type.STRING, description: 'Specific environment or set' },
    timeOfDay: { type: Type.STRING, description: 'DAY, NIGHT, DUSK, DAWN, CONTINUOUS' },
    charactersPresent: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Names of characters present in the scene'
    },
    action: { type: Type.STRING, description: 'Cinematic visual scene action and atmosphere descriptions' },
    dialogue: {
      type: Type.ARRAY,
      items: dialogueItemSchema,
      description: 'Lines of dialogue in the scene'
    },
    emotionalPurpose: { type: Type.STRING, description: 'Dramatic subtext and intended emotional resonance' },
    transition: { type: Type.STRING, description: 'CUT TO:, DISSOLVE TO:, SMASH CUT TO:, FADE OUT.' }
  },
  required: [
    'sceneNumber',
    'heading',
    'location',
    'timeOfDay',
    'charactersPresent',
    'action',
    'dialogue',
    'emotionalPurpose',
    'transition'
  ]
};

/**
 * Shot Detail Schema
 */
export const shotDetailSchema = {
  type: Type.OBJECT,
  properties: {
    shotNumber: { type: Type.INTEGER, description: 'Sequential shot number within the scene' },
    shotType: { type: Type.STRING, description: 'Extreme Wide Shot (EWS), Wide Shot (WS), Medium Shot (MS), Close-Up (CU), Extreme Close-Up (ECU), Over-the-Shoulder (OTS)' },
    cameraMovement: { type: Type.STRING, description: 'Static, Slow Dolly In, Handheld Tracking, Crane Down, Steadicam Orbit, Whip Pan' },
    lens: { type: Type.STRING, description: 'e.g. 24mm Anamorphic, 35mm Prime, 50mm f/1.2, 85mm Portrait, Macro 100mm' },
    framing: { type: Type.STRING, description: 'Rule of thirds, Dutch angle, Low angle hero shot, Symmetrical center frame' },
    lighting: { type: Type.STRING, description: 'Key light ratio, Rembrandt lighting, Chiaroscuro high contrast, Golden hour bounce' },
    visualDescription: { type: Type.STRING, description: 'Precise visual composition and blocking' },
    directorNotes: { type: Type.STRING, description: 'Directorial intent, lens flare, depth of field notes' }
  },
  required: [
    'shotNumber',
    'shotType',
    'cameraMovement',
    'lens',
    'framing',
    'lighting',
    'visualDescription',
    'directorNotes'
  ]
};

/**
 * Shot List for a Scene Schema
 */
export const shotListSceneSchema = {
  type: Type.OBJECT,
  properties: {
    sceneNumber: { type: Type.INTEGER, description: 'Corresponding scene number' },
    shots: {
      type: Type.ARRAY,
      items: shotDetailSchema,
      description: 'Individual camera setups and shots for this scene'
    }
  },
  required: ['sceneNumber', 'shots']
};

/**
 * Midjourney Image Prompt Schema
 */
export const imagePromptSchema = {
  type: Type.OBJECT,
  properties: {
    sceneNumber: { type: Type.INTEGER, description: 'Corresponding scene number' },
    purpose: { type: Type.STRING, description: 'Concept Art, Moodboard Keyframe, Costume Still, Lighting Concept' },
    prompt: { type: Type.STRING, description: 'Detailed Midjourney prompt with cinematic photographic keywords, camera model, lighting, color grading --ar 16:9 --style raw --v 6.1' },
    negativePrompt: { type: Type.STRING, description: 'Undesired visual elements e.g. text, watermark, cartoon, oversaturated, blurry' }
  },
  required: ['sceneNumber', 'purpose', 'prompt', 'negativePrompt']
};

/**
 * Runway Video Prompt Schema
 */
export const videoPromptSchema = {
  type: Type.OBJECT,
  properties: {
    sceneNumber: { type: Type.INTEGER, description: 'Corresponding scene number' },
    durationSeconds: { type: Type.INTEGER, description: 'Suggested generation clip length in seconds (e.g. 4, 8, 10)' },
    prompt: { type: Type.STRING, description: 'Photorealistic cinematic video prompt describing motion, action, and lighting' },
    cameraMotion: { type: Type.STRING, description: 'Runway camera motion parameters e.g. Pan Left 2, Zoom In 3, Motion Brush on smoke' },
    visualStyle: { type: Type.STRING, description: 'Cinematic visual texture, 35mm film grain, anamorphic flare, Kodak Vision3' }
  },
  required: ['sceneNumber', 'durationSeconds', 'prompt', 'cameraMotion', 'visualStyle']
};

/**
 * Audio Design Schema
 */
export const audioDesignSchema = {
  type: Type.OBJECT,
  properties: {
    sceneNumber: { type: Type.INTEGER, description: 'Corresponding scene number' },
    ambience: { type: Type.STRING, description: 'Environmental room tone, weather, acoustic spatial reverb' },
    soundEffects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Foley sound effects and diegetic audio cues'
    },
    musicCue: { type: Type.STRING, description: 'Score description, instrumentation, tempo, thematic leitmotif' },
    emotionalIntent: { type: Type.STRING, description: 'Intended subconscious psychological audio effect on viewer' }
  },
  required: ['sceneNumber', 'ambience', 'soundEffects', 'musicCue', 'emotionalIntent']
};

/**
 * Production Summary Schema
 */
export const productionSummarySchema = {
  type: Type.OBJECT,
  properties: {
    visualStyle: { type: Type.STRING, description: 'Overall directorial aesthetic and cinematic reference influences' },
    colorPalette: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key color names or hex codes defining the visual world (e.g. #0B0D10 Deep Void, #D8AD62 Antique Gold)'
    },
    productionChallenges: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key technical, budget, location, or visual effects production challenges'
    },
    keyCreativeDecisions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Core directorial choices regarding tone, pacing, casting, and sound'
    }
  },
  required: ['visualStyle', 'colorPalette', 'productionChallenges', 'keyCreativeDecisions']
};

/**
 * Complete Screenplay Production Bible Schema
 */
export const fullScreenplaySchema = {
  type: Type.OBJECT,
  properties: {
    project: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Cinematic and compelling movie title' },
        genre: { type: Type.STRING, description: 'Film genre, e.g. Sci-Fi Neo-Noir, Psychological Thriller' },
        tone: { type: Type.STRING, description: 'Tone and mood, e.g. Atmospheric, Tense, Haunting' },
        logline: { type: Type.STRING, description: 'Punchy 1-2 sentence industry logline capturing hook, protagonist, stakes' },
        runtimeMinutes: { type: Type.INTEGER, description: 'Target runtime in minutes' },
        language: { type: Type.STRING, description: 'Primary language of the film' },
        theme: { type: Type.STRING, description: 'Underlying thematic moral question or thesis' }
      },
      required: ['title', 'genre', 'tone', 'logline', 'runtimeMinutes', 'language', 'theme']
    },
    storyStructure: storyStructureSchema,
    characters: {
      type: Type.ARRAY,
      items: characterItemSchema,
      description: 'Core cast of characters'
    },
    scenes: {
      type: Type.ARRAY,
      items: sceneItemSchema,
      description: 'Key sequence of screenplay scenes representing key acts'
    },
    shotLists: {
      type: Type.ARRAY,
      items: shotListSceneSchema,
      description: 'Director shot lists for the key scenes'
    },
    imagePrompts: {
      type: Type.ARRAY,
      items: imagePromptSchema,
      description: 'Midjourney keyframe concept art prompts'
    },
    videoPrompts: {
      type: Type.ARRAY,
      items: videoPromptSchema,
      description: 'Runway video generation prompts'
    },
    audioDesign: {
      type: Type.ARRAY,
      items: audioDesignSchema,
      description: 'Sound design, ambience, and score cues'
    },
    productionSummary: productionSummarySchema
  },
  required: [
    'project',
    'storyStructure',
    'characters',
    'scenes',
    'shotLists',
    'imagePrompts',
    'videoPrompts',
    'audioDesign',
    'productionSummary'
  ]
};

/**
 * Dedicated Sub-schemas for Modular Endpoints
 */
export const scenesArraySchema = {
  type: Type.OBJECT,
  properties: {
    scenes: {
      type: Type.ARRAY,
      items: sceneItemSchema
    }
  },
  required: ['scenes']
};

export const shotListsArraySchema = {
  type: Type.OBJECT,
  properties: {
    shotLists: {
      type: Type.ARRAY,
      items: shotListSceneSchema
    }
  },
  required: ['shotLists']
};

export const promptsPackageSchema = {
  type: Type.OBJECT,
  properties: {
    imagePrompts: {
      type: Type.ARRAY,
      items: imagePromptSchema
    },
    videoPrompts: {
      type: Type.ARRAY,
      items: videoPromptSchema
    }
  },
  required: ['imagePrompts', 'videoPrompts']
};

export const audioDesignArraySchema = {
  type: Type.OBJECT,
  properties: {
    audioDesign: {
      type: Type.ARRAY,
      items: audioDesignSchema
    }
  },
  required: ['audioDesign']
};
