import { SAMPLE_PROJECT } from './sampleProject.js';

const STORAGE_KEY = 'cinedirector_projects_v1';
const ACTIVE_PROJECT_KEY = 'cinedirector_active_project_id_v1';

/**
 * Retrieves all saved projects from LocalStorage.
 * Seeds with sample project if storage is fresh.
 */
export function getAllProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample project
      const initial = [SAMPLE_PROJECT];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [SAMPLE_PROJECT];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading projects from LocalStorage:', err);
    return [SAMPLE_PROJECT];
  }
}

/**
 * Retrieves a single project by ID
 */
export function getProjectById(id) {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
}

/**
 * Saves or updates a project in LocalStorage
 */
export function saveProject(project) {
  if (!project) return false;

  const projects = getAllProjects();
  const now = new Date().toISOString();

  // Ensure project has an ID
  if (!project.id) {
    project.id = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  }

  project.lastModified = now;

  const index = projects.findIndex(p => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.unshift(project);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    setActiveProjectId(project.id);
    return true;
  } catch (err) {
    console.error('Error saving project to LocalStorage:', err);
    return false;
  }
}

/**
 * Duplicates an existing project
 */
export function duplicateProject(id) {
  const existing = getProjectById(id);
  if (!existing) return null;

  const clone = JSON.parse(JSON.stringify(existing));
  clone.id = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  clone.project.title = `Copy of ${existing.project.title}`;
  clone.lastModified = new Date().toISOString();

  saveProject(clone);
  return clone;
}

/**
 * Renames a project
 */
export function renameProject(id, newTitle) {
  const existing = getProjectById(id);
  if (!existing || !newTitle.trim()) return false;

  existing.project.title = newTitle.trim();
  return saveProject(existing);
}

/**
 * Deletes a project by ID
 */
export function deleteProject(id) {
  const projects = getAllProjects().filter(p => p.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    // If active project was deleted, change active to first available
    const activeId = getActiveProjectId();
    if (activeId === id) {
      const next = projects[0] ? projects[0].id : null;
      setActiveProjectId(next);
    }
    return true;
  } catch (err) {
    console.error('Error deleting project:', err);
    return false;
  }
}

/**
 * Retrieves the currently active project ID
 */
export function getActiveProjectId() {
  return localStorage.getItem(ACTIVE_PROJECT_KEY) || SAMPLE_PROJECT.id;
}

/**
 * Sets the active project ID
 */
export function setActiveProjectId(id) {
  if (id) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}

/**
 * Retrieves the currently active project object
 */
export function getActiveProject() {
  const activeId = getActiveProjectId();
  let project = getProjectById(activeId);
  if (!project) {
    const all = getAllProjects();
    project = all[0] || SAMPLE_PROJECT;
    if (project) {
      setActiveProjectId(project.id);
    }
  }
  return project;
}

/**
 * Forces reloading the original sample project
 */
export function loadSampleProject() {
  const clone = JSON.parse(JSON.stringify(SAMPLE_PROJECT));
  clone.id = 'proj_sample_' + Date.now();
  clone.lastModified = new Date().toISOString();
  saveProject(clone);
  setActiveProjectId(clone.id);
  return clone;
}
