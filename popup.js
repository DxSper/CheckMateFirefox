// =============================================
// Pointage Auto — Script du popup
// Gestion de la configuration et du canvas signature
// Compatible Firefox (WebExtension API)
// =============================================

const EXECUTION_LOG_KEY = 'executionLogs';
const MAX_EXECUTION_LOGS = 40;

document.addEventListener('DOMContentLoaded', () => {
  // --- Références DOM ---
  const body = document.body;
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const canvas = document.getElementById('signature-canvas');
  const ctx = canvas.getContext('2d');
  const placeholder = document.getElementById('canvas-placeholder');
  const btnClear = document.getElementById('btn-clear');
  const btnSave = document.getElementById('btn-save');
  const btnStart = document.getElementById('btn-start');
  const btnReportBug = document.getElementById('btn-report-bug');
  const btnClearLogs = document.getElementById('btn-clear-logs');
  const configStatus = document.getElementById('config-status');
  const configStatusText = document.getElementById('config-status-text');
  const statusIconWarn = document.getElementById('status-icon-warn');
  const statusIconOk = document.getElementById('status-icon-ok');
  const statusBarText = document.getElementById('status-bar-text');
  const executionLogList = document.getElementById('execution-log-list');
  const configPanel = document.getElementById('config-panel');
  const updateModal = document.getElementById('update-modal');
  const updateModalClose = document.getElementById('update-modal-close');
  const updateModalConfirm = document.getElementById('update-modal-confirm');
  const updateModalMessage = document.getElementById('update-modal-message');

  // --- Onboarding references ---
  const onboardingBanner = document.getElementById('onboarding-banner');
  const stepElements = document.querySelectorAll('.onboarding-step');
  const stepConnectors = document.querySelectorAll('.step-connector');

  // --- État du dessin ---
  let isDrawing = false;
  let signatureData = []; // Tableau de coordonnées [{x, y, type}]
  let hasSignature = false;

  // =============================================
  // UTILITAIRE — Formatage date/heure
  // =============================================

  function formatDateHeure() {
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${date} à ${heure}`;
  }

  /**
   * Formate un timestamp ISO en heure locale courte
   * @param {string} isoString
   * @returns {string}
   */
  function formatHeureCourte(isoString) {
    if (!isoString) return '--:--:--';
    return new Date(isoString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Met le bouton principal dans son état par défaut
   */
  function setStartButtonIdle() {
    btnStart.disabled = false;
    btnStart.classList.remove('loading');
    btnStart.innerHTML = '<svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6,3 20,12 6,21"/></svg><span id="btn-start-label">Pointer ma présence</span>';
  }

  /**
   * Met le bouton principal en état de chargement
   */
  function setStartButtonLoading() {
    btnStart.disabled = true;
    btnStart.classList.add('loading');
    btnStart.innerHTML = '<svg class="btn-icon spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Pointage en cours...</span>';
  }

  /**
   * Ajoute une entrée dans le journal d'exécution (stockage persistant)
   * @param {string} tag
   * @param {string} message
   * @param {'info'|'success'|'error'} level
   */
  async function appendExecutionLog(tag, message, level = 'info') {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      ts: new Date().toISOString(),
      source: 'popup',
      tag,
      message,
      level
    };

    try {
      const result = await browser.storage.local.get([EXECUTION_LOG_KEY]);
      const logs = Array.isArray(result[EXECUTION_LOG_KEY]) ? result[EXECUTION_LOG_KEY] : [];
      logs.unshift(entry);
      await browser.storage.local.set({ [EXECUTION_LOG_KEY]: logs.slice(0, MAX_EXECUTION_LOGS) });
    } catch (e) {
      console.error('Erreur appendExecutionLog:', e);
    }
  }

  /**
   * Ouvre la modale d'information de mise à jour
   * @param {string} message
   */
  function ouvrirModaleMiseAJour(message) {
    if (!updateModal || !updateModalMessage) return;
    updateModalMessage.textContent = message;
    updateModal.classList.add('open');
    updateModal.setAttribute('aria-hidden', 'false');
  }

  /**
   * Ferme la modale de mise à jour
   */
  function fermerModaleMiseAJour() {
    if (!updateModal) return;
    updateModal.classList.remove('open');
    updateModal.setAttribute('aria-hidden', 'true');
  }

  /**
   * Rend le journal dans l'interface popup
   * @param {Array<{ts:string,tag:string,message:string,level:string}>} logs
   */
  function renderExecutionLogs(logs) {
    executionLogList.textContent = '';

    if (!Array.isArray(logs) || logs.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'empty';
      emptyItem.textContent = 'Aucune execution recente';
      executionLogList.appendChild(emptyItem);
      return;
    }

    logs.slice(0, 12).forEach((entry) => {
      const item = document.createElement('li');
      item.className = `log-level-${entry.level || 'info'}`;

      const line = document.createElement('div');
      line.className = 'log-line';

      const tag = document.createElement('span');
      tag.className = 'log-tag';
      tag.textContent = entry.tag || 'Log';

      const time = document.createElement('span');
      time.className = 'log-time';
      time.textContent = formatHeureCourte(entry.ts);

      line.appendChild(tag);
      line.appendChild(time);

      const message = document.createElement('div');
      message.className = 'log-message';
      message.textContent = entry.message || '';

      item.appendChild(line);
      item.appendChild(message);
      executionLogList.appendChild(item);
    });
  }

  // =============================================
  // ONBOARDING — Step indicators et banner
  // =============================================

  /**
   * Met a jour les indicateurs d'etape (1/2/3) en fonction de l'etat des champs
   * @param {'username'|'password'|'signature'|'save'} completedStep
   */
  function updateOnboardingStep(completedStep) {
    if (!onboardingBanner || onboardingBanner.classList.contains('hidden')) return;

    const steps = Array.from(stepElements);
    let activeIndex = 0;

    if (completedStep === 'username' || completedStep === 'password') {
      activeIndex = 0; // step 1 (identifiants)
    } else if (completedStep === 'signature') {
      activeIndex = 1; // step 2 (signature)
    } else if (completedStep === 'save') {
      activeIndex = 2; // step 3 (sauvegarder) - done
    }

    steps.forEach((el, i) => {
      el.classList.remove('active', 'done');
      if (i < activeIndex) {
        el.classList.add('done');
        el.querySelector('.step-num').innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      } else if (i === activeIndex) {
        el.classList.add('active');
        el.querySelector('.step-num').textContent = i + 1;
      } else {
        el.querySelector('.step-num').textContent = i + 1;
      }
    });

    stepConnectors.forEach((conn, i) => {
      conn.classList.toggle('active', i < activeIndex);
    });
  }

  /**
   * Affiche la banniere d'onboarding (premiere utilisation)
   */
  function showOnboardingBanner() {
    if (!onboardingBanner) return;
    onboardingBanner.classList.remove('hidden');
    body.classList.add('onboarding-active');
    updateOnboardingStep(null);
  }

  function hideOnboardingBanner() {
    if (!onboardingBanner) return;
    onboardingBanner.classList.add('hidden');
    body.classList.remove('onboarding-active');
  }

  /**
   * Cache la banniere d'onboarding (appelee apres la premiere sauvegarde reussie)
   */
  function hideOnboardingBanner() {
    if (!onboardingBanner) return;
    onboardingBanner.classList.add('hidden');
  }

  /**
   * Reinitialise les icones des etapes (checkmarks -> nombres)
   */
  function resetStepIcons() {
    stepElements.forEach((el, i) => {
      el.querySelector('.step-num').textContent = i + 1;
    });
  }

  // =============================================
  // CANVAS — Gestion du dessin de signature
  // =============================================

  /**
   * Initialise le style de trait du canvas
   */
  function initCanvasStyle() {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  initCanvasStyle();

  /**
   * Récupère les coordonnées de la souris relativement au canvas
   */
  function getCanvasCoords(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const rawX = (event.clientX - rect.left) * scaleX;
    const rawY = (event.clientY - rect.top) * scaleY;

    return {
      x: Math.max(0, Math.min(canvas.width, rawX)),
      y: Math.max(0, Math.min(canvas.height, rawY))
    };
  }

  /**
   * Début du tracé (mousedown)
   */
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const coords = getCanvasCoords(e);
    signatureData.push({ x: coords.x, y: coords.y, type: 'start' });
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    // Masquer le placeholder dès le premier tracé
    if (!hasSignature) {
      hasSignature = true;
      placeholder.classList.add('hidden');
    }
  });

  /**
   * Tracé en cours (mousemove)
   */
  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    signatureData.push({ x: coords.x, y: coords.y, type: 'move' });
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  });

  /**
   * Fin du tracé (mouseup / mouseleave)
   */
  function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;
    const coords = getCanvasCoords(e);
    signatureData.push({ x: coords.x, y: coords.y, type: 'end' });
    ctx.closePath();
  }

  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  /**
   * Efface le canvas et réinitialise les données de signature
   */
  btnClear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    signatureData = [];
    hasSignature = false;
    placeholder.classList.remove('hidden');
  });

  /**
   * Redessine une signature à partir d'un tableau de coordonnées
   * Utilisé lors du chargement de données sauvegardées
   */
  function redrawSignature(data) {
    if (!data || data.length === 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvasStyle();

    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      if (point.type === 'start') {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
      } else if (point.type === 'move') {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      } else if (point.type === 'end') {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  // =============================================
  // STOCKAGE — Sauvegarde et chargement
  // =============================================

  /**
   * Met à jour l'indicateur de configuration visuel
   */
  function updateConfigStatus(isConfigured) {
    if (isConfigured) {
      configStatusText.textContent = 'Configuration sauvegardée';
      configStatus.className = 'config-status configured';
      statusIconWarn.style.display = 'none';
      statusIconOk.style.display = '';
      btnStart.disabled = false;
      configPanel.removeAttribute('open');
    } else {
      configStatusText.textContent = 'Non configuré';
      configStatus.className = 'config-status not-configured';
      statusIconWarn.style.display = '';
      statusIconOk.style.display = 'none';
      btnStart.disabled = true;
      configPanel.setAttribute('open', '');
    }
  }

  /**
   * Met à jour la barre de statut avec un message et la date/heure
   */
  function updateStatusBar(message) {
    statusBarText.textContent = `${message} — ${formatDateHeure()}`;
  }

  /**
   * Charge les données sauvegardées depuis browser.storage.local
   * et pré-remplit les champs du popup
   */
  async function loadSavedData() {
    try {
      const result = await browser.storage.local.get(['username', 'password', 'signatureData', 'lastAction', EXECUTION_LOG_KEY]);
      
      // Pré-remplir l'identifiant
      if (result.username) {
        usernameInput.value = result.username;
      }

      // Pré-remplir le mot de passe
      if (result.password) {
        passwordInput.value = result.password;
      }

      // Redessiner la signature si elle existe
      if (result.signatureData && result.signatureData.length > 0) {
        signatureData = result.signatureData;
        hasSignature = true;
        placeholder.classList.add('hidden');
        redrawSignature(signatureData);
      }

      // Vérifier si la configuration est complète
      const isConfigured = !!(result.username && result.password && result.signatureData && result.signatureData.length > 0);
      updateConfigStatus(isConfigured);

      if (isConfigured) {
        hideOnboardingBanner();
        resetStepIcons();
      } else {
        showOnboardingBanner();
      }

      // Afficher la dernière action si présente
      if (result.lastAction) {
        statusBarText.textContent = result.lastAction;
      }

      // Initialiser le journal
      renderExecutionLogs(result[EXECUTION_LOG_KEY]);
    } catch (e) {
      console.error('Erreur loadSavedData:', e);
    }
  }

  // Charger les données au démarrage du popup
  loadSavedData();

  // Mettre à jour le journal en temps réel
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;
    if (changes[EXECUTION_LOG_KEY]) {
      renderExecutionLogs(changes[EXECUTION_LOG_KEY].newValue);
    }
  });

  // =============================================
  // ONBOARDING — Mise a jour des etapes en temps reel
  // =============================================

  function handleFieldChange() {
    const hasUsername = usernameInput.value.trim().length > 0;
    const hasPassword = passwordInput.value.length > 0;
    const hasSig = signatureData.length > 0;

    if (hasSig) {
      updateOnboardingStep('signature');
    } else if (hasUsername && hasPassword) {
      updateOnboardingStep('password');
    } else if (hasUsername || hasPassword) {
      updateOnboardingStep('username');
    } else {
      updateOnboardingStep(null);
    }
  }

  usernameInput.addEventListener('input', handleFieldChange);
  passwordInput.addEventListener('input', handleFieldChange);

  // Canvas mouse events for signature step
  canvas.addEventListener('mousedown', () => {
    setTimeout(handleFieldChange, 50);
  });

  btnClear.addEventListener('click', () => {
    setTimeout(handleFieldChange, 50);
  });

  if (btnReportBug) {
    btnReportBug.addEventListener('click', () => {
      const manifest = browser.runtime.getManifest();
      const version = manifest?.version || 'inconnue';
      const browserInfo = navigator.userAgent || 'inconnu';
      const title = encodeURIComponent('[Bug] Decrire le probleme en une phrase');
      const bodyContent = encodeURIComponent(
        '## Description\n' +
        'Expliquez le comportement observe.\n\n' +
        '## Etapes pour reproduire\n' +
        '1. ...\n' +
        '2. ...\n' +
        '3. ...\n\n' +
        '## Resultat attendu\n' +
        '...\n\n' +
        '## Resultat obtenu\n' +
        '...\n\n' +
        `## Infos techniques\n- Version CheckMate: ${version}\n- Navigateur: Firefox ${browserInfo}`
      );
      const url = `https://github.com/DxSper/CheckMateFirefox/issues/new?title=${title}&body=${bodyContent}`;
      browser.tabs.create({ url });
    });
  }

  btnClearLogs.addEventListener('click', async () => {
    await browser.storage.local.set({ [EXECUTION_LOG_KEY]: [] });
    renderExecutionLogs([]);
    updateStatusBar('Journal vide');
  });

  if (updateModalClose) {
    updateModalClose.addEventListener('click', fermerModaleMiseAJour);
  }

  if (updateModalConfirm) {
    updateModalConfirm.addEventListener('click', fermerModaleMiseAJour);
  }

  if (updateModal) {
    updateModal.addEventListener('click', (e) => {
      if (e.target === updateModal) {
        fermerModaleMiseAJour();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && updateModal && updateModal.classList.contains('open')) {
      fermerModaleMiseAJour();
    }
  });

  // =============================================
  // BOUTON SAUVEGARDER
  // =============================================

  btnSave.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validation des champs
    if (!username) {
      updateStatusBar('Veuillez saisir un identifiant');
      appendExecutionLog('Configuration', 'Identifiant manquant', 'error');
      return;
    }
    if (!password) {
      updateStatusBar('Veuillez saisir un mot de passe');
      appendExecutionLog('Configuration', 'Mot de passe manquant', 'error');
      return;
    }
    if (signatureData.length === 0) {
      updateStatusBar('Veuillez dessiner votre signature');
      appendExecutionLog('Configuration', 'Signature manquante', 'error');
      return;
    }

    // Sauvegarde dans browser.storage.local
    const lastAction = `Configuration sauvegardée — ${formatDateHeure()}`;

    try {
      await browser.storage.local.set({
        username: username,
        password: password,
        signatureData: signatureData,
        lastAction: lastAction
      });
      updateConfigStatus(true);
      hideOnboardingBanner();
      resetStepIcons();
      statusBarText.textContent = lastAction;
      appendExecutionLog('Configuration', 'Configuration sauvegardee', 'success');
    } catch (e) {
      updateStatusBar('Erreur lors de la sauvegarde');
      appendExecutionLog('Configuration', 'Erreur lors de la sauvegarde', 'error');
      console.error('Erreur de sauvegarde:', e);
    }
  });

  // =============================================
  // BOUTON LANCER LE POINTAGE
  // =============================================

  btnStart.addEventListener('click', () => {
    // Vérifier que la configuration est complète avant de lancer
    browser.storage.local.get(['username', 'password', 'signatureData']).then((result) => {
      if (!result.username || !result.password) {
        updateStatusBar('Sauvegardez vos identifiants d\'abord');
        appendExecutionLog('Pointage', 'Tentative de lancement sans identifiants', 'error');
        return;
      }
      if (!result.signatureData || result.signatureData.length === 0) {
        updateStatusBar('Sauvegardez votre signature d\'abord');
        appendExecutionLog('Pointage', 'Tentative de lancement sans signature', 'error');
        return;
      }

      // Désactiver le bouton pendant l'exécution
      setStartButtonLoading();
      updateStatusBar('Lancement du pointage...');
      appendExecutionLog('Pointage', 'Demarrage du pointage', 'info');

      // Envoyer le message au background.js pour démarrer le processus
      browser.runtime.sendMessage({ action: 'lancerPointage' }).then((response) => {
        // Réactiver le bouton
        setStartButtonIdle();

        // Afficher un popup à chaque pointage si l'extension n'est pas à jour
        if (response && response.outdated) {
          const latest = response.latestVersion || 'inconnue';
          const current = response.currentVersion || 'inconnue';
          ouvrirModaleMiseAJour(
            `Votre extension n'est pas à jour.\n\nVersion installee: ${current}\nDerniere version: ${latest}\n\nVeuillez telecharger la derniere version sur GitHub.`
          );
          appendExecutionLog('Mise à jour', `Extension obsolète détectée (${current} -> ${latest})`, 'error');
        }

        if (response && response.success) {
          const lastActionText = `${response.message} — ${formatDateHeure()}`;
          statusBarText.textContent = lastActionText;
          browser.storage.local.set({ lastAction: lastActionText });
          appendExecutionLog('Pointage', response.message, 'success');
        } else if (response && response.error) {
          updateStatusBar(response.error);
          appendExecutionLog('Pointage', response.error, 'error');
        }
      }).catch((error) => {
        // Réactiver le bouton
        setStartButtonIdle();
        updateStatusBar('Erreur de communication avec le service worker');
        appendExecutionLog('Pointage', 'Erreur de communication avec le service worker', 'error');
        console.error('Erreur:', error);
      });
    }).catch((error) => {
      console.error('Erreur lecture storage:', error);
    });
  });
});
