/**
 * CineDirector AI - Frontend API Client
 * Connects to Express backend endpoints
 */

const BASE_URL = '/api';

/**
 * Helper to handle fetch responses safely
 */
async function handleResponse(response) {
  let json;
  try {
    json = await response.json();
  } catch (err) {
    throw new Error('Server returned an unparseable response.');
  }

  if (!response.ok) {
    const errorMsg = json.error?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.code = json.error?.code || 'API_ERROR';
    error.status = response.status;
    error.details = json.error?.details;
    throw error;
  }

  return json;
}

/**
 * Check backend health and Gemini configuration status
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await handleResponse(response);
  } catch (err) {
    return {
      success: false,
      status: 'offline',
      geminiConfigured: false,
      error: err.message
    };
  }
}

/**
 * Generate full screenplay bible
 */
export async function generateScreenplayApi(payload) {
  const response = await fetch(`${BASE_URL}/generate-screenplay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await handleResponse(response);
}

/**
 * Generate additional scenes
 */
export async function generateScenesApi(payload) {
  const response = await fetch(`${BASE_URL}/generate-scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await handleResponse(response);
}

/**
 * Generate director's shot list
 */
export async function generateShotListApi(payload) {
  const response = await fetch(`${BASE_URL}/generate-shotlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await handleResponse(response);
}

/**
 * Generate visual Midjourney and Runway prompts
 */
export async function generatePromptsApi(payload) {
  const response = await fetch(`${BASE_URL}/generate-prompts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await handleResponse(response);
}

/**
 * Generate audio design cues
 */
export async function generateAudioDesignApi(payload) {
  const response = await fetch(`${BASE_URL}/generate-audio-design`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await handleResponse(response);
}
