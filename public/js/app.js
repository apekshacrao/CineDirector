/**
 * CineDirector AI — Main Frontend Application Orchestrator
 */

import {
  checkServerHealth,
  generateScreenplayApi,
  generateScenesApi,
  generateShotListApi,
  generatePromptsApi,
  generateAudioDesignApi
} from './api.js';

import {
  getAllProjects,
  getActiveProject,
  saveProject,
  deleteProject,
  duplicateProject,
  renameProject,
  setActiveProjectId,
  loadSampleProject
} from './storage.js';

import { exportProjectToTxt } from './export.js';

// Application State
const state = {
  currentProject: null,
  activeView: 'dashboard',
  activeStudioTab: 'overview',
  isEditMode: false,
  isUnsaved: false,
  geminiConfigured: false,
  serverStatus: 'checking',
  progressInterval: null,
  deleteTargetId: null
};

// DOM Elements
const DOM = {
  // Navigation & Shell
  sidebar: document.getElementById('sidebar'),
  sidebarCollapseBtn: document.getElementById('sidebarCollapseBtn'),
  sidebarBackdrop: document.getElementById('sidebarBackdrop'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  mobileNewBtn: document.getElementById('mobileNewBtn'),
  btnSidebarNewScript: document.getElementById('btnSidebarNewScript'),
  navItems: document.querySelectorAll('.nav-item'),
  viewPanes: document.querySelectorAll('.view-pane'),
  projectCountBadge: document.getElementById('projectCountBadge'),
  sidebarApiStatus: document.getElementById('sidebarApiStatus'),
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),

  // Topbar
  topbarProjectTitle: document.getElementById('topbarProjectTitle'),
  saveStatusPill: document.getElementById('saveStatusPill'),
  saveStatusLabel: document.getElementById('saveStatusLabel'),
  btnLoadSample: document.getElementById('btnLoadSample'),
  btnExportTxt: document.getElementById('btnExportTxt'),
  btnQuickSave: document.getElementById('btnQuickSave'),

  // Dashboard View
  inputMovieIdea: document.getElementById('inputMovieIdea'),
  ideaCharCount: document.getElementById('ideaCharCount'),
  exampleChipsGrid: document.getElementById('exampleChipsGrid'),
  selectGenre: document.getElementById('selectGenre'),
  selectTone: document.getElementById('selectTone'),
  selectRuntime: document.getElementById('selectRuntime'),
  selectAudience: document.getElementById('selectAudience'),
  selectLanguage: document.getElementById('selectLanguage'),
  inputConstraints: document.getElementById('inputConstraints'),
  btnGenerateScript: document.getElementById('btnGenerateScript'),
  dashboardApiNotice: document.getElementById('dashboardApiNotice'),
  recentProjectsGrid: document.getElementById('recentProjectsGrid'),
  btnViewAllProjects: document.getElementById('btnViewAllProjects'),

  // Studio View
  studioBadgeGenre: document.getElementById('studioBadgeGenre'),
  studioBadgeTone: document.getElementById('studioBadgeTone'),
  studioBadgeRuntime: document.getElementById('studioBadgeRuntime'),
  studioBadgeLanguage: document.getElementById('studioBadgeLanguage'),
  studioScriptTitle: document.getElementById('studioScriptTitle'),
  studioScriptLogline: document.getElementById('studioScriptLogline'),
  studioScriptTheme: document.getElementById('studioScriptTheme'),
  btnToggleEditMode: document.getElementById('btnToggleEditMode'),
  editModeLabel: document.getElementById('editModeLabel'),
  btnCopyEntireScript: document.getElementById('btnCopyEntireScript'),
  btnStudioExport: document.getElementById('btnStudioExport'),
  studioTabs: document.querySelectorAll('.studio-tab'),
  tabPanes: document.querySelectorAll('.tab-pane'),

  // Studio Content Areas
  overviewVisualStyle: document.getElementById('overviewVisualStyle'),
  overviewColorPalette: document.getElementById('overviewColorPalette'),
  overviewChallenges: document.getElementById('overviewChallenges'),
  overviewDecisions: document.getElementById('overviewDecisions'),
  structureActsContainer: document.getElementById('structureActsContainer'),
  charactersContainer: document.getElementById('charactersContainer'),
  scenesCountInfo: document.getElementById('scenesCountInfo'),
  screenplayScenesContainer: document.getElementById('screenplayScenesContainer'),
  btnToggleAllScenes: document.getElementById('btnToggleAllScenes'),
  btnTriggerAddScenes: document.getElementById('btnTriggerAddScenes'),
  shotsCountInfo: document.getElementById('shotsCountInfo'),
  shotListsContainer: document.getElementById('shotListsContainer'),
  btnTriggerAddShotList: document.getElementById('btnTriggerAddShotList'),
  subtabMidjourney: document.getElementById('subtabMidjourney'),
  subtabRunway: document.getElementById('subtabRunway'),
  paneMidjourney: document.getElementById('paneMidjourney'),
  paneRunway: document.getElementById('paneRunway'),
  imagePromptsGrid: document.getElementById('imagePromptsGrid'),
  videoPromptsGrid: document.getElementById('videoPromptsGrid'),
  audioDesignGrid: document.getElementById('audioDesignGrid'),

  // Projects Catalog View
  inputProjectSearch: document.getElementById('inputProjectSearch'),
  projectsFullCatalogGrid: document.getElementById('projectsFullCatalogGrid'),
  btnCatalogLoadSample: document.getElementById('btnCatalogLoadSample'),
  btnCatalogNew: document.getElementById('btnCatalogNew'),

  // Settings View
  settingsBackendVal: document.getElementById('settingsBackendVal'),
  settingsModelVal: document.getElementById('settingsModelVal'),
  settingsApiKeyStatus: document.getElementById('settingsApiKeyStatus'),
  settingsTotalProjectsVal: document.getElementById('settingsTotalProjectsVal'),
  btnRefreshHealth: document.getElementById('btnRefreshHealth'),
  btnExportAllProjectsJson: document.getElementById('btnExportAllProjectsJson'),
  btnClearCache: document.getElementById('btnClearCache'),

  // Modals & Overlays
  loadingModal: document.getElementById('loadingModal'),
  loadingStageMessage: document.getElementById('loadingStageMessage'),
  progressFill: document.getElementById('progressFill'),
  renameModal: document.getElementById('renameModal'),
  inputRenameTitle: document.getElementById('inputRenameTitle'),
  btnCancelRename: document.getElementById('btnCancelRename'),
  btnConfirmRename: document.getElementById('btnConfirmRename'),
  deleteModal: document.getElementById('deleteModal'),
  deleteProjectTargetTitle: document.getElementById('deleteProjectTargetTitle'),
  btnCancelDelete: document.getElementById('btnCancelDelete'),
  btnConfirmDelete: document.getElementById('btnConfirmDelete'),
  expandScenesModal: document.getElementById('expandScenesModal'),
  inputSceneRequest: document.getElementById('inputSceneRequest'),
  btnCancelExpandScenes: document.getElementById('btnCancelExpandScenes'),
  btnConfirmExpandScenes: document.getElementById('btnConfirmExpandScenes'),
  toastContainer: document.getElementById('toastContainer')
};

/**
 * Toast Notification Utility
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  
  const icon = document.createElement('span');
  icon.textContent = type === 'error' ? '⚠️' : '✦';
  
  const text = document.createElement('span');
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Copy to Clipboard with Feedback
 */
async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (err) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(successMessage);
  }
}

/**
 * Safe Element Creation Utility (XSS Prevention)
 */
function createEl(tag, className = '', textContent = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent) el.textContent = textContent;
  return el;
}

/**
 * Switch Active View
 */
function switchView(viewName, tabName = null) {
  state.activeView = viewName;

  // Update Navigation Active State
  DOM.navItems.forEach(item => {
    const itemTargetView = item.dataset.view;
    const itemTargetTab = item.dataset.tab;

    if (itemTargetView === viewName) {
      if (tabName && itemTargetTab) {
        item.classList.toggle('active', itemTargetTab === tabName);
      } else if (!tabName && !itemTargetTab) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    } else {
      item.classList.remove('active');
    }
  });

  // Switch View Panes
  DOM.viewPanes.forEach(pane => {
    const paneId = pane.id.toLowerCase();
    const isTarget = paneId === `view${viewName}`;
    pane.classList.toggle('active', isTarget);
  });

  if (viewName === 'studio') {
    if (tabName) {
      switchStudioTab(tabName);
    }
    renderStudio();
  } else if (viewName === 'projects') {
    renderProjectsCatalog();
  } else if (viewName === 'dashboard') {
    renderRecentProjects();
  } else if (viewName === 'settings') {
    renderSettings();
  }

  // Close Mobile Drawer
  DOM.sidebar.classList.remove('mobile-open');
  DOM.sidebarBackdrop.classList.remove('active');
}

/**
 * Switch Studio Internal Tab
 */
function switchStudioTab(tabName) {
  state.activeStudioTab = tabName;

  DOM.studioTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  DOM.tabPanes.forEach(pane => {
    const targetId = `tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    pane.classList.toggle('active', pane.id === targetId);
  });
}

/**
 * Check Server & Gemini Health
 */
async function initializeHealth() {
  const health = await checkServerHealth();
  state.geminiConfigured = Boolean(health.geminiConfigured);
  state.serverStatus = health.status;

  if (health.status === 'healthy') {
    DOM.statusDot.className = 'status-indicator-dot online';
    if (state.geminiConfigured) {
      DOM.statusText.textContent = 'Gemini 2.5 Flash Online';
      DOM.dashboardApiNotice.textContent = '⚡ Gemini 2.5 Flash engine active & ready.';
      DOM.dashboardApiNotice.className = 'api-notice';
    } else {
      DOM.statusDot.className = 'status-indicator-dot';
      DOM.statusText.textContent = 'Key Not Configured';
      DOM.dashboardApiNotice.textContent = '⚠️ GEMINI_API_KEY is not configured in server/.env. You can explore the sample project or add your key.';
      DOM.dashboardApiNotice.className = 'api-notice warning';
    }
  } else {
    DOM.statusDot.className = 'status-indicator-dot offline';
    DOM.statusText.textContent = 'Server Offline';
    DOM.dashboardApiNotice.textContent = '⚠️ Backend connection offline. Start server with `npm start`.';
    DOM.dashboardApiNotice.className = 'api-notice warning';
  }
}

/**
 * Update Topbar Script Status
 */
function updateTopbarStatus() {
  if (!state.currentProject) return;

  DOM.topbarProjectTitle.textContent = state.currentProject.project.title || 'Untitled Screenplay';
  
  const dot = DOM.saveStatusPill.querySelector('.save-dot');
  if (state.isUnsaved) {
    dot.className = 'save-dot unsaved';
    DOM.saveStatusLabel.textContent = 'Unsaved Changes';
  } else {
    dot.className = 'save-dot saved';
    DOM.saveStatusLabel.textContent = 'Saved to Studio';
  }

  // Update total projects count
  const allProjects = getAllProjects();
  DOM.projectCountBadge.textContent = allProjects.length;
}

/**
 * Render Screenplay Studio Content
 */
function renderStudio() {
  const p = state.currentProject;
  if (!p) return;

  const proj = p.project || {};

  // Header info
  DOM.studioScriptTitle.textContent = proj.title || 'Untitled';
  DOM.studioScriptLogline.textContent = proj.logline || 'No logline available.';
  DOM.studioScriptTheme.innerHTML = `<strong>Thematic Core:</strong> ${proj.theme || 'Exploration of human condition.'}`;

  DOM.studioBadgeGenre.textContent = proj.genre || 'Drama';
  DOM.studioBadgeTone.textContent = proj.tone || 'Cinematic';
  DOM.studioBadgeRuntime.textContent = `${proj.runtimeMinutes || 110} Min`;
  DOM.studioBadgeLanguage.textContent = proj.language || 'English';

  updateTopbarStatus();

  // Tab 1: Overview
  const summary = p.productionSummary || {};
  DOM.overviewVisualStyle.textContent = summary.visualStyle || 'No visual style declared.';

  // Color Palette
  DOM.overviewColorPalette.innerHTML = '';
  if (Array.isArray(summary.colorPalette)) {
    summary.colorPalette.forEach(col => {
      const parts = col.split(' ');
      const hex = parts[0].startsWith('#') ? parts[0] : '#D8AD62';
      const name = parts.slice(1).join(' ') || hex;

      const card = createEl('div', 'color-swatch-card');
      const box = createEl('div', 'swatch-color-box');
      box.style.backgroundColor = hex;
      box.title = `Click to copy ${hex}`;

      const info = createEl('div', 'swatch-info');
      const hexSpan = createEl('span', 'swatch-hex', hex);
      const nameSpan = createEl('span', 'swatch-name', name);

      info.appendChild(hexSpan);
      info.appendChild(nameSpan);
      card.appendChild(box);
      card.appendChild(info);

      card.addEventListener('click', () => copyToClipboard(hex, `Copied ${hex} to clipboard!`));
      DOM.overviewColorPalette.appendChild(card);
    });
  }

  // Challenges
  DOM.overviewChallenges.innerHTML = '';
  if (Array.isArray(summary.productionChallenges)) {
    summary.productionChallenges.forEach(item => {
      const li = createEl('li', '', item);
      DOM.overviewChallenges.appendChild(li);
    });
  }

  // Decisions
  DOM.overviewDecisions.innerHTML = '';
  if (Array.isArray(summary.keyCreativeDecisions)) {
    summary.keyCreativeDecisions.forEach(item => {
      const li = createEl('li', '', item);
      DOM.overviewDecisions.appendChild(li);
    });
  }

  // Tab 2: Three-Act Structure
  const ss = p.storyStructure || {};
  DOM.structureActsContainer.innerHTML = '';

  const acts = [
    { name: 'Act I: The Setup & Catalyst', data: ss.actOne, beats: ['incitingIncident', 'turningPoint'], labels: ['Inciting Incident', 'First Turning Point'] },
    { name: 'Act II: Rising Stakes & Midpoint', data: ss.actTwo, beats: ['midpoint', 'majorConflict', 'turningPoint'], labels: ['Midpoint Turning Point', 'Core Antagonist Conflict', 'Crisis / Low Point'] },
    { name: 'Act III: Climax & Resolution', data: ss.actThree, beats: ['climax', 'resolution'], labels: ['The Climax Confrontation', 'Final Resolution & New World'] }
  ];

  acts.forEach((act, idx) => {
    const card = createEl('div', 'act-card');
    const badge = createEl('div', 'act-badge', `ACT 0${idx + 1}`);
    const title = createEl('h3', 'act-title', act.name);
    const summaryP = createEl('p', 'act-summary', act.data?.summary || 'Act details pending.');

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(summaryP);

    if (act.data && act.beats) {
      act.beats.forEach((beatKey, bIdx) => {
        const beatVal = act.data[beatKey];
        if (beatVal) {
          const beatBox = createEl('div', 'act-beat-box');
          const beatLabel = createEl('div', 'beat-label', act.labels[bIdx]);
          const beatText = createEl('div', 'beat-text', beatVal);
          beatBox.appendChild(beatLabel);
          beatBox.appendChild(beatText);
          card.appendChild(beatBox);
        }
      });
    }

    DOM.structureActsContainer.appendChild(card);
  });

  // Tab 3: Characters
  DOM.charactersContainer.innerHTML = '';
  if (Array.isArray(p.characters)) {
    p.characters.forEach(char => {
      const card = createEl('div', 'character-card');

      const header = createEl('div', 'char-header');
      const avatar = createEl('div', 'char-avatar', char.name.charAt(0));
      const titleWrap = createEl('div', 'char-title-wrap');
      const name = createEl('h3', 'char-name', char.name);
      const meta = createEl('div', 'char-meta-line', `${char.role} • Age ${char.age}`);

      titleWrap.appendChild(name);
      titleWrap.appendChild(meta);
      header.appendChild(avatar);
      header.appendChild(titleWrap);
      card.appendChild(header);

      // Personality & Motivation
      const pLabel = createEl('div', 'char-field-label', 'Psychology & Traits');
      const pVal = createEl('div', 'char-field-val', char.personality);
      card.appendChild(pLabel);
      card.appendChild(pVal);

      const mLabel = createEl('div', 'char-field-label', 'Core Motivation & Arc');
      const mVal = createEl('div', 'char-field-val', `${char.motivation} — ${char.characterArc}`);
      card.appendChild(mLabel);
      card.appendChild(mVal);

      // Backstory
      const bLabel = createEl('div', 'char-field-label', 'Backstory & Secrets');
      const bVal = createEl('div', 'char-field-val', char.backstory);
      card.appendChild(bLabel);
      card.appendChild(bVal);

      // Wardrobe / Costume
      const cBox = createEl('div', 'char-costume-box');
      const cLabel = createEl('div', 'char-field-label', 'Wardrobe & Costume Notes');
      const cVal = createEl('div', 'char-field-val', char.costumeNotes);
      cBox.appendChild(cLabel);
      cBox.appendChild(cVal);
      card.appendChild(cBox);

      // Copy Button
      const copyBtn = createEl('button', 'btn btn-secondary btn-sm', 'Copy Character Bio');
      copyBtn.addEventListener('click', () => {
        copyToClipboard(
          `${char.name} (${char.role}, Age ${char.age})\nPersonality: ${char.personality}\nMotivation: ${char.motivation}\nArc: ${char.characterArc}\nBackstory: ${char.backstory}\nCostume: ${char.costumeNotes}`,
          `Copied ${char.name}'s bio!`
        );
      });
      card.appendChild(copyBtn);

      DOM.charactersContainer.appendChild(card);
    });
  }

  // Tab 4: Screenplay Scenes
  DOM.screenplayScenesContainer.innerHTML = '';
  const scenes = p.scenes || [];
  DOM.scenesCountInfo.textContent = `${scenes.length} Screenplay Scene${scenes.length === 1 ? '' : 's'} Formatted`;

  scenes.forEach(scene => {
    const block = createEl('div', 'scene-block');

    const header = createEl('div', 'scene-header-bar');
    const slug = createEl('div', 'scene-slugline', `SCENE ${scene.sceneNumber}: ${scene.heading}`);
    
    const actions = createEl('div', 'scene-header-actions');
    const copySceneBtn = createEl('button', 'btn btn-secondary btn-sm', 'Copy Scene');
    const genShotsBtn = createEl('button', 'btn btn-gold btn-sm', '🎥 Gen Shots');

    copySceneBtn.addEventListener('click', () => {
      let scriptText = `${scene.heading}\n\n${scene.action}\n\n`;
      if (Array.isArray(scene.dialogue)) {
        scene.dialogue.forEach(d => {
          scriptText += `                  ${d.character}\n`;
          if (d.direction) scriptText += `               ${d.direction}\n`;
          scriptText += `         ${d.line}\n\n`;
        });
      }
      scriptText += `                                       ${scene.transition || 'CUT TO:'}`;
      copyToClipboard(scriptText, `Copied Scene ${scene.sceneNumber} script!`);
    });

    genShotsBtn.addEventListener('click', () => triggerSingleSceneShotList(scene));

    actions.appendChild(copySceneBtn);
    actions.appendChild(genShotsBtn);
    header.appendChild(slug);
    header.appendChild(actions);
    block.appendChild(header);

    // Characters present
    if (Array.isArray(scene.charactersPresent)) {
      const charsTag = createEl('div', 'scene-characters-tag', `Characters Present: ${scene.charactersPresent.join(', ')}`);
      block.appendChild(charsTag);
    }

    // Action Block
    const actionP = createEl('div', 'scene-action-text', scene.action);
    block.appendChild(actionP);

    // Dialogue Stack
    if (Array.isArray(scene.dialogue) && scene.dialogue.length > 0) {
      const stack = createEl('div', 'dialogue-stack');
      scene.dialogue.forEach(dia => {
        const item = createEl('div', 'dialogue-item');
        const cue = createEl('div', 'character-cue', dia.character);
        item.appendChild(cue);

        if (dia.direction) {
          const dir = createEl('div', 'parenthetical-direction', dia.direction);
          item.appendChild(dir);
        }

        const line = createEl('div', 'spoken-line', dia.line);
        item.appendChild(line);

        stack.appendChild(item);
      });
      block.appendChild(stack);
    }

    // Footer
    const footer = createEl('div', 'scene-footer-meta');
    const purpose = createEl('div', 'scene-purpose', `Emotional Subtext: ${scene.emotionalPurpose || 'Dramatic progress.'}`);
    const trans = createEl('div', 'scene-transition', scene.transition || 'CUT TO:');
    footer.appendChild(purpose);
    footer.appendChild(trans);
    block.appendChild(footer);

    DOM.screenplayScenesContainer.appendChild(block);
  });

  // Tab 5: Director's Shot Lists
  DOM.shotListsContainer.innerHTML = '';
  const shotLists = p.shotLists || [];
  DOM.shotsCountInfo.textContent = `${shotLists.reduce((acc, curr) => acc + (curr.shots?.length || 0), 0)} Camera Setups Across ${shotLists.length} Scene(s)`;

  shotLists.forEach(sl => {
    const group = createEl('div', 'shot-scene-group');
    const header = createEl('h3', 'shot-scene-header', `Director Shots: Scene ${sl.sceneNumber}`);
    group.appendChild(header);

    const grid = createEl('div', 'shots-table-grid');
    if (Array.isArray(sl.shots)) {
      sl.shots.forEach(shot => {
        const card = createEl('div', 'shot-card');

        const top = createEl('div', 'shot-card-top');
        const badge = createEl('span', 'shot-number-badge', `SHOT ${shot.shotNumber}`);
        const copyShot = createEl('button', 'icon-btn', '');
        copyShot.title = 'Copy Shot Details';
        copyShot.innerHTML = '📋';
        copyShot.addEventListener('click', () => {
          copyToClipboard(
            `Shot #${shot.shotNumber} (${shot.shotType}) - Lens: ${shot.lens}, Move: ${shot.cameraMovement}\nFraming: ${shot.framing}, Light: ${shot.lighting}\nComposition: ${shot.visualDescription}\nDirector Notes: ${shot.directorNotes}`,
            `Copied Shot #${shot.shotNumber} details!`
          );
        });

        top.appendChild(badge);
        top.appendChild(copyShot);
        card.appendChild(top);

        const specs = createEl('div', 'shot-specs-line');
        specs.appendChild(createEl('span', 'spec-pill', shot.shotType || 'MS'));
        specs.appendChild(createEl('span', 'spec-pill', shot.cameraMovement || 'Static'));
        specs.appendChild(createEl('span', 'spec-pill', shot.lens || '35mm'));
        specs.appendChild(createEl('span', 'spec-pill', shot.framing || 'Rule of thirds'));
        card.appendChild(specs);

        const desc = createEl('p', 'shot-desc', shot.visualDescription);
        card.appendChild(desc);

        if (shot.lighting) {
          const lightPill = createEl('div', 'spec-pill', `Lighting: ${shot.lighting}`);
          card.appendChild(lightPill);
        }

        if (shot.directorNotes) {
          const notes = createEl('div', 'shot-director-notes', `Notes: ${shot.directorNotes}`);
          card.appendChild(notes);
        }

        grid.appendChild(card);
      });
    }

    group.appendChild(grid);
    DOM.shotListsContainer.appendChild(group);
  });

  // Tab 6: AI Prompts
  // Midjourney
  DOM.imagePromptsGrid.innerHTML = '';
  if (Array.isArray(p.imagePrompts)) {
    p.imagePrompts.forEach((ip, idx) => {
      const card = createEl('div', 'prompt-card');

      const top = createEl('div', 'prompt-card-header');
      const badge = createEl('span', 'prompt-purpose-badge', `Scene ${ip.sceneNumber || idx + 1}: ${ip.purpose || 'Concept Keyframe'}`);
      top.appendChild(badge);
      card.appendChild(top);

      const promptBox = createEl('div', 'prompt-box', `/imagine prompt: ${ip.prompt}`);
      card.appendChild(promptBox);

      if (ip.negativePrompt) {
        const negBox = createEl('div', 'negative-prompt-box', `Negative: --no ${ip.negativePrompt}`);
        card.appendChild(negBox);
      }

      const actions = createEl('div', 'prompt-card-actions');
      const copyBtn = createEl('button', 'btn btn-gold btn-sm', 'Copy Midjourney Prompt');
      copyBtn.addEventListener('click', () => {
        copyToClipboard(`/imagine prompt: ${ip.prompt}`, 'Copied Midjourney prompt!');
      });
      actions.appendChild(copyBtn);
      card.appendChild(actions);

      DOM.imagePromptsGrid.appendChild(card);
    });
  }

  // Runway
  DOM.videoPromptsGrid.innerHTML = '';
  if (Array.isArray(p.videoPrompts)) {
    p.videoPrompts.forEach((vp, idx) => {
      const card = createEl('div', 'prompt-card');

      const top = createEl('div', 'prompt-card-header');
      const badge = createEl('span', 'prompt-purpose-badge', `Scene ${vp.sceneNumber || idx + 1} (${vp.durationSeconds || 8}s Clip)`);
      top.appendChild(badge);
      card.appendChild(top);

      const promptBox = createEl('div', 'prompt-box', vp.prompt);
      card.appendChild(promptBox);

      const motionBox = createEl('div', 'negative-prompt-box', `Camera Motion: ${vp.cameraMotion} • Style: ${vp.visualStyle}`);
      card.appendChild(motionBox);

      const actions = createEl('div', 'prompt-card-actions');
      const copyBtn = createEl('button', 'btn btn-gold btn-sm', 'Copy Runway Prompt');
      copyBtn.addEventListener('click', () => {
        copyToClipboard(vp.prompt, 'Copied Runway video prompt!');
      });
      actions.appendChild(copyBtn);
      card.appendChild(actions);

      DOM.videoPromptsGrid.appendChild(card);
    });
  }

  // Tab 7: Sound Design
  DOM.audioDesignGrid.innerHTML = '';
  if (Array.isArray(p.audioDesign)) {
    p.audioDesign.forEach(ad => {
      const card = createEl('div', 'audio-card');

      const top = createEl('div', 'audio-card-header');
      const title = createEl('span', 'audio-scene-badge', `Scene ${ad.sceneNumber} Soundscape`);
      const copyBtn = createEl('button', 'btn btn-secondary btn-sm', 'Copy Audio Cues');
      copyBtn.addEventListener('click', () => {
        copyToClipboard(
          `Scene ${ad.sceneNumber} Audio Design:\nAmbience: ${ad.ambience}\nScore Cue: ${ad.musicCue}\nSFX: ${ad.soundEffects?.join(', ')}\nEmotional Intent: ${ad.emotionalIntent}`,
          `Copied Scene ${ad.sceneNumber} audio design!`
        );
      });
      top.appendChild(title);
      top.appendChild(copyBtn);
      card.appendChild(top);

      // Ambience
      const ambBlock = createEl('div', 'audio-cue-block');
      ambBlock.appendChild(createEl('span', 'audio-cue-title', 'Spatial Room Tone & Ambience'));
      ambBlock.appendChild(createEl('p', 'audio-cue-text', ad.ambience));
      card.appendChild(ambBlock);

      // Music
      const musBlock = createEl('div', 'audio-cue-block');
      musBlock.appendChild(createEl('span', 'audio-cue-title', 'Score & Motif'));
      musBlock.appendChild(createEl('p', 'audio-cue-text', ad.musicCue));
      card.appendChild(musBlock);

      // SFX
      if (Array.isArray(ad.soundEffects)) {
        const sfxBlock = createEl('div', 'audio-cue-block');
        sfxBlock.appendChild(createEl('span', 'audio-cue-title', 'Foley Sound Effects'));
        sfxBlock.appendChild(createEl('p', 'audio-cue-text', ad.soundEffects.join(' • ')));
        card.appendChild(sfxBlock);
      }

      // Emotional
      const emoBlock = createEl('div', 'audio-cue-block');
      emoBlock.appendChild(createEl('span', 'audio-cue-title', 'Subconscious Emotional Resonance'));
      emoBlock.appendChild(createEl('p', 'audio-cue-text', ad.emotionalIntent));
      card.appendChild(emoBlock);

      DOM.audioDesignGrid.appendChild(card);
    });
  }
}

/**
 * Render Recent Projects on Dashboard
 */
function renderRecentProjects() {
  const projects = getAllProjects();
  DOM.recentProjectsGrid.innerHTML = '';

  if (projects.length === 0) {
    const empty = createEl('div', 'empty-state-card');
    empty.textContent = 'No screenplay projects created yet. Start with the generator above!';
    DOM.recentProjectsGrid.appendChild(empty);
    return;
  }

  // Show top 3 most recent
  const recents = projects.slice(0, 3);
  recents.forEach(p => {
    DOM.recentProjectsGrid.appendChild(createProjectCardElement(p));
  });
}

/**
 * Render Full Projects Catalog
 */
function renderProjectsCatalog() {
  const query = (DOM.inputProjectSearch.value || '').toLowerCase().trim();
  let projects = getAllProjects();

  if (query) {
    projects = projects.filter(p => {
      const title = (p.project?.title || '').toLowerCase();
      const genre = (p.project?.genre || '').toLowerCase();
      const logline = (p.project?.logline || '').toLowerCase();
      return title.includes(query) || genre.includes(query) || logline.includes(query);
    });
  }

  DOM.projectsFullCatalogGrid.innerHTML = '';
  if (projects.length === 0) {
    const empty = createEl('div', 'empty-catalog-message', 'No matching screenplays found.');
    DOM.projectsFullCatalogGrid.appendChild(empty);
    return;
  }

  projects.forEach(p => {
    DOM.projectsFullCatalogGrid.appendChild(createProjectCardElement(p, true));
  });
}

/**
 * Helper to build Project Card DOM element
 */
function createProjectCardElement(p, showAllActions = false) {
  const card = createEl('div', 'project-card');

  const header = createEl('div', 'project-card-header');
  const badges = createEl('div', 'project-card-badges');
  badges.appendChild(createEl('span', 'meta-badge genre-badge', p.project?.genre || 'Drama'));
  badges.appendChild(createEl('span', 'meta-badge runtime-badge', `${p.project?.runtimeMinutes || 110}m`));

  const title = createEl('h3', 'project-card-title', p.project?.title || 'Untitled');
  header.appendChild(badges);
  header.appendChild(title);
  card.appendChild(header);

  const logline = createEl('p', 'project-card-logline', p.project?.logline || 'No logline available.');
  card.appendChild(logline);

  const footer = createEl('div', 'project-card-footer');
  const timeStr = new Date(p.lastModified || Date.now()).toLocaleDateString();
  const time = createEl('span', 'project-modified-time', `Updated: ${timeStr}`);

  const btns = createEl('div', 'card-action-btns');

  // Open Button
  const openBtn = createEl('button', 'btn btn-gold btn-sm', 'Open');
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.currentProject = p;
    setActiveProjectId(p.id);
    switchView('studio');
  });
  btns.appendChild(openBtn);

  // Duplicate Button
  const dupBtn = createEl('button', 'icon-btn', '📋');
  dupBtn.title = 'Duplicate Project';
  dupBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const cloned = duplicateProject(p.id);
    if (cloned) {
      showToast(`Duplicated into "${cloned.project.title}"`);
      renderRecentProjects();
      renderProjectsCatalog();
      updateTopbarStatus();
    }
  });
  btns.appendChild(dupBtn);

  // Rename Button
  const renBtn = createEl('button', 'icon-btn', '✏️');
  renBtn.title = 'Rename Script';
  renBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    promptRenameProject(p);
  });
  btns.appendChild(renBtn);

  // Delete Button
  const delBtn = createEl('button', 'icon-btn', '🗑️');
  delBtn.title = 'Delete Script';
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    promptDeleteProject(p);
  });
  btns.appendChild(delBtn);

  footer.appendChild(time);
  footer.appendChild(btns);
  card.appendChild(footer);

  // Card click opens project
  card.addEventListener('click', () => {
    state.currentProject = p;
    setActiveProjectId(p.id);
    switchView('studio');
  });

  return card;
}

/**
 * Render Settings View
 */
function renderSettings() {
  DOM.settingsBackendVal.textContent = state.serverStatus === 'healthy' ? 'Connected (Port 3000)' : 'Offline';
  DOM.settingsApiKeyStatus.textContent = state.geminiConfigured ? 'Configured & Active' : 'Missing in server/.env';
  DOM.settingsTotalProjectsVal.textContent = getAllProjects().length;
}

/**
 * Handle Primary Generation Workflow
 */
async function handleGenerateClick() {
  const idea = (DOM.inputMovieIdea.value || '').trim();

  if (!idea || idea.length < 10) {
    showToast('Please provide a movie premise of at least 10 characters.', 'error');
    DOM.inputMovieIdea.focus();
    return;
  }

  // Check if API key is missing
  if (!state.geminiConfigured) {
    const proceed = confirm(
      'Notice: Google Gemini API key is not yet configured in server/.env.\n\nWould you like to load the rich demonstration Screenplay Bible ("Dream Echoes") to preview all features immediately?'
    );
    if (proceed) {
      const sample = loadSampleProject();
      state.currentProject = sample;
      switchView('studio');
      showToast('Loaded sample production bible!');
      return;
    }
  }

  const payload = {
    idea,
    genre: DOM.selectGenre.value,
    tone: DOM.selectTone.value,
    runtimeMinutes: Number(DOM.selectRuntime.value),
    targetAudience: DOM.selectAudience.value,
    language: DOM.selectLanguage.value,
    creativeConstraints: DOM.inputConstraints.value.trim()
  };

  // Start Multi-Stage Loading
  startLoadingProgress();

  try {
    const response = await generateScreenplayApi(payload);
    stopLoadingProgress();

    if (response.success && response.data) {
      const newProject = {
        id: 'proj_' + Date.now(),
        lastModified: new Date().toISOString(),
        ...response.data
      };

      saveProject(newProject);
      state.currentProject = newProject;
      state.isUnsaved = false;

      showToast(`🎬 Screenplay "${newProject.project?.title}" generated!`);
      switchView('studio');
    }
  } catch (err) {
    stopLoadingProgress();
    console.error('Generation Error:', err);

    let friendly = err.message || 'Generation failed.';
    if (err.code === 'GEMINI_KEY_MISSING') {
      friendly = 'Gemini API key is missing. Please set GEMINI_API_KEY in your server/.env file.';
    } else if (err.code === 'RATE_LIMIT_EXCEEDED') {
      friendly = 'Too many requests. Please wait a minute before requesting more generations.';
    }

    alert(`Directorial Engine Notice:\n\n${friendly}`);
    showToast(friendly, 'error');
  }
}

/**
 * Multi-Stage Loading Progress Orchestrator
 */
function startLoadingProgress() {
  DOM.loadingModal.classList.add('active');
  DOM.btnGenerateScript.disabled = true;

  const stages = [
    { text: 'Analyzing premise, themes & dramatic stakes...', percent: '15%' },
    { text: 'Architecting Three-Act dramatic structure...', percent: '32%' },
    { text: 'Developing deep character psychologies & costume bibles...', percent: '50%' },
    { text: 'Composing screenplay scenes & authentic dialogue...', percent: '68%' },
    { text: 'Calculating cinematographer shot lists & lens choices...', percent: '82%' },
    { text: 'Formulating Midjourney & Runway visual prompts...', percent: '92%' },
    { text: 'Designing spatial acoustic landscape & score cues...', percent: '97%' }
  ];

  let currentStage = 0;
  DOM.loadingStageMessage.textContent = stages[0].text;
  DOM.progressFill.style.width = stages[0].percent;

  state.progressInterval = setInterval(() => {
    currentStage++;
    if (currentStage < stages.length) {
      DOM.loadingStageMessage.textContent = stages[currentStage].text;
      DOM.progressFill.style.width = stages[currentStage].percent;
    }
  }, 2800);
}

function stopLoadingProgress() {
  if (state.progressInterval) {
    clearInterval(state.progressInterval);
    state.progressInterval = null;
  }
  DOM.loadingModal.classList.remove('active');
  DOM.btnGenerateScript.disabled = false;
  DOM.progressFill.style.width = '0%';
}

/**
 * Sub-generation: Expand Scenes
 */
async function handleExpandScenesConfirm() {
  if (!state.currentProject) return;

  const requestText = DOM.inputSceneRequest.value.trim() || 'Write subsequent scenes advancing the plot';
  DOM.expandScenesModal.classList.remove('active');

  showToast('Generating additional scenes with Gemini...');

  try {
    const res = await generateScenesApi({
      projectTitle: state.currentProject.project.title,
      logline: state.currentProject.project.logline,
      genre: state.currentProject.project.genre,
      tone: state.currentProject.project.tone,
      characters: state.currentProject.characters || [],
      existingScenes: state.currentProject.scenes || [],
      sceneRequest: requestText
    });

    if (res.success && res.data?.scenes) {
      state.currentProject.scenes = [...(state.currentProject.scenes || []), ...res.data.scenes];
      saveProject(state.currentProject);
      renderStudio();
      showToast(`Added ${res.data.scenes.length} new scenes!`);
    }
  } catch (err) {
    console.error('Error expanding scenes:', err);
    showToast(err.message || 'Failed to expand scenes.', 'error');
  }
}

/**
 * Sub-generation: Single Scene Shot List
 */
async function triggerSingleSceneShotList(scene) {
  if (!state.currentProject) return;

  showToast(`Directing camera shots for Scene ${scene.sceneNumber}...`);

  try {
    const res = await generateShotListApi({
      projectTitle: state.currentProject.project.title,
      genre: state.currentProject.project.genre,
      tone: state.currentProject.project.tone,
      scenes: [scene]
    });

    if (res.success && res.data?.shotLists) {
      const newShots = res.data.shotLists;
      const existing = state.currentProject.shotLists || [];

      // Merge or append
      newShots.forEach(ns => {
        const idx = existing.findIndex(e => e.sceneNumber === ns.sceneNumber);
        if (idx >= 0) existing[idx] = ns;
        else existing.push(ns);
      });

      state.currentProject.shotLists = existing;
      saveProject(state.currentProject);
      renderStudio();
      switchStudioTab('shots');
      showToast(`Shot list generated for Scene ${scene.sceneNumber}!`);
    }
  } catch (err) {
    console.error('Error generating shot list:', err);
    showToast(err.message || 'Failed to generate shot list.', 'error');
  }
}

/**
 * Rename Project Modal handlers
 */
let targetRenameProject = null;

function promptRenameProject(p) {
  targetRenameProject = p;
  DOM.inputRenameTitle.value = p.project?.title || '';
  DOM.renameModal.classList.add('active');
  DOM.inputRenameTitle.focus();
}

function handleConfirmRename() {
  const newTitle = DOM.inputRenameTitle.value.trim();
  if (targetRenameProject && newTitle) {
    renameProject(targetRenameProject.id, newTitle);
    if (state.currentProject?.id === targetRenameProject.id) {
      state.currentProject.project.title = newTitle;
    }
    showToast(`Renamed project to "${newTitle}"`);
    updateTopbarStatus();
    renderRecentProjects();
    renderProjectsCatalog();
    if (state.activeView === 'studio') renderStudio();
  }
  DOM.renameModal.classList.remove('active');
  targetRenameProject = null;
}

/**
 * Delete Project Modal handlers
 */
function promptDeleteProject(p) {
  state.deleteTargetId = p.id;
  DOM.deleteProjectTargetTitle.textContent = `"${p.project?.title || 'this script'}"`;
  DOM.deleteModal.classList.add('active');
}

function handleConfirmDelete() {
  if (state.deleteTargetId) {
    deleteProject(state.deleteTargetId);
    showToast('Project deleted.');

    // If current project was deleted, fallback to remaining
    if (state.currentProject?.id === state.deleteTargetId) {
      state.currentProject = getActiveProject();
      if (state.activeView === 'studio') renderStudio();
    }

    renderRecentProjects();
    renderProjectsCatalog();
    updateTopbarStatus();
  }
  DOM.deleteModal.classList.remove('active');
  state.deleteTargetId = null;
}

/**
 * Toggle Inline Edit Mode
 */
function toggleEditMode() {
  state.isEditMode = !state.isEditMode;
  DOM.btnToggleEditMode.classList.toggle('active', state.isEditMode);
  DOM.editModeLabel.textContent = state.isEditMode ? 'Done Editing' : 'Edit Mode';

  DOM.studioScriptTitle.setAttribute('contenteditable', state.isEditMode ? 'true' : 'false');
  DOM.studioScriptLogline.setAttribute('contenteditable', state.isEditMode ? 'true' : 'false');

  if (state.isEditMode) {
    showToast('✏️ Edit mode enabled: click on titles or loglines to customize.');
    DOM.studioScriptTitle.focus();
  } else {
    // Save inline edits
    if (state.currentProject) {
      state.currentProject.project.title = DOM.studioScriptTitle.textContent.trim();
      state.currentProject.project.logline = DOM.studioScriptLogline.textContent.trim();
      saveProject(state.currentProject);
      updateTopbarStatus();
      showToast('Changes saved.');
    }
  }
}

/**
 * Attach Event Listeners
 */
function initEventListeners() {
  // Navigation Links
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.dataset.view;
      const targetTab = item.dataset.tab;
      switchView(targetView, targetTab);
    });
  });

  // Mobile drawer controls
  DOM.mobileMenuBtn.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('mobile-open');
    DOM.sidebarBackdrop.classList.toggle('active');
  });

  DOM.sidebarBackdrop.addEventListener('click', () => {
    DOM.sidebar.classList.remove('mobile-open');
    DOM.sidebarBackdrop.classList.remove('active');
  });

  DOM.mobileNewBtn.addEventListener('click', () => switchView('dashboard'));
  DOM.btnSidebarNewScript.addEventListener('click', () => switchView('dashboard'));

  // Sidebar Desktop Collapse
  DOM.sidebarCollapseBtn.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('collapsed');
  });

  // Topbar Actions
  DOM.btnLoadSample.addEventListener('click', () => {
    state.currentProject = loadSampleProject();
    switchView('studio');
    showToast('Loaded complete sample screenplay bible!');
  });

  DOM.btnExportTxt.addEventListener('click', () => {
    if (state.currentProject) exportProjectToTxt(state.currentProject);
  });

  DOM.btnStudioExport.addEventListener('click', () => {
    if (state.currentProject) exportProjectToTxt(state.currentProject);
  });

  DOM.btnQuickSave.addEventListener('click', () => {
    if (state.currentProject) {
      saveProject(state.currentProject);
      state.isUnsaved = false;
      updateTopbarStatus();
      showToast('Project saved successfully.');
    }
  });

  DOM.topbarProjectTitle.addEventListener('click', () => {
    if (state.currentProject) promptRenameProject(state.currentProject);
  });

  // Dashboard Idea character count
  DOM.inputMovieIdea.addEventListener('input', () => {
    DOM.ideaCharCount.textContent = `${DOM.inputMovieIdea.value.length} / 2000`;
  });

  // Inspiration Chips
  DOM.exampleChipsGrid.querySelectorAll('.idea-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.inputMovieIdea.value = chip.dataset.idea || '';
      DOM.ideaCharCount.textContent = `${DOM.inputMovieIdea.value.length} / 2000`;
      if (chip.dataset.genre) DOM.selectGenre.value = chip.dataset.genre;
      if (chip.dataset.tone) DOM.selectTone.value = chip.dataset.tone;
      DOM.inputMovieIdea.focus();
    });
  });

  // Generate Screenplay Button
  DOM.btnGenerateScript.addEventListener('click', handleGenerateClick);

  DOM.btnViewAllProjects.addEventListener('click', () => switchView('projects'));
  DOM.btnCatalogNew.addEventListener('click', () => switchView('dashboard'));
  DOM.btnCatalogLoadSample.addEventListener('click', () => {
    state.currentProject = loadSampleProject();
    switchView('studio');
    showToast('Sample Bible loaded.');
  });

  // Studio Tabs Bar
  DOM.studioTabs.forEach(tab => {
    tab.addEventListener('click', () => switchStudioTab(tab.dataset.tab));
  });

  // Studio Edit Mode
  DOM.btnToggleEditMode.addEventListener('click', toggleEditMode);

  // Copy Entire Script
  DOM.btnCopyEntireScript.addEventListener('click', () => {
    if (state.currentProject) exportProjectToTxt(state.currentProject);
  });

  // Expand Scenes Dialog
  DOM.btnTriggerAddScenes.addEventListener('click', () => {
    DOM.expandScenesModal.classList.add('active');
    DOM.inputSceneRequest.focus();
  });

  DOM.btnCancelExpandScenes.addEventListener('click', () => {
    DOM.expandScenesModal.classList.remove('active');
  });

  DOM.btnConfirmExpandScenes.addEventListener('click', handleExpandScenesConfirm);

  // Generate shots for next scene
  DOM.btnTriggerAddShotList.addEventListener('click', () => {
    const scenes = state.currentProject?.scenes || [];
    if (scenes.length === 0) {
      showToast('No scenes available to break down.', 'error');
      return;
    }
    triggerSingleSceneShotList(scenes[0]);
  });

  // AI Prompts Subtabs
  DOM.subtabMidjourney.addEventListener('click', () => {
    DOM.subtabMidjourney.classList.add('active');
    DOM.subtabRunway.classList.remove('active');
    DOM.paneMidjourney.classList.add('active');
    DOM.paneRunway.classList.remove('active');
  });

  DOM.subtabRunway.addEventListener('click', () => {
    DOM.subtabRunway.classList.add('active');
    DOM.subtabMidjourney.classList.remove('active');
    DOM.paneRunway.classList.add('active');
    DOM.paneMidjourney.classList.remove('active');
  });

  // Projects Catalog Search Filter
  DOM.inputProjectSearch.addEventListener('input', renderProjectsCatalog);

  // Modals confirmation
  DOM.btnCancelRename.addEventListener('click', () => {
    DOM.renameModal.classList.remove('active');
  });
  DOM.btnConfirmRename.addEventListener('click', handleConfirmRename);

  DOM.btnCancelDelete.addEventListener('click', () => {
    DOM.deleteModal.classList.remove('active');
  });
  DOM.btnConfirmDelete.addEventListener('click', handleConfirmDelete);

  // Settings Actions
  DOM.btnRefreshHealth.addEventListener('click', async () => {
    await initializeHealth();
    renderSettings();
    showToast('Engine status refreshed.');
  });

  DOM.btnExportAllProjectsJson.addEventListener('click', () => {
    const data = JSON.stringify(getAllProjects(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinedirector_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('All projects exported as JSON.');
  });

  DOM.btnClearCache.addEventListener('click', () => {
    if (confirm('Reset LocalStorage to original sample project? All custom scripts will be cleared.')) {
      localStorage.clear();
      state.currentProject = loadSampleProject();
      renderRecentProjects();
      renderProjectsCatalog();
      renderSettings();
      showToast('Storage reset.');
    }
  });
}

/**
 * Application Entry Point
 */
async function initApp() {
  initEventListeners();
  state.currentProject = getActiveProject();

  await initializeHealth();
  updateTopbarStatus();
  renderRecentProjects();

  // Initialize Lucide icons if available
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// Start application on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
