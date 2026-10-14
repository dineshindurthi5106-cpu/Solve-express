/**
 * Solve-exp / GRIV Express - Application Orchestrator
 * Integrates Citizen Grievance UI, AI Classifier Engine, Speech Synthesis,
 * Triage Pipeline Visualization, and Municipal Registry Management.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Classifier
  const classifier = new CitizenComplaintClassifier();

  // DOM Elements
  const complaintInput = document.getElementById('complaintInput');
  const charCount = document.getElementById('charCount');
  const detectedLangPreview = document.getElementById('detectedLangPreview');
  const btnClearInput = document.getElementById('btnClearInput');
  const btnRandomPreset = document.getElementById('btnRandomPreset');
  const btnProcessComplaint = document.getElementById('btnProcessComplaint');

  // Pipeline elements
  const pipelineOverlay = document.getElementById('pipelineOverlay');
  const pipelineTimer = document.getElementById('pipelineTimer');
  const stepLang = document.getElementById('step-lang');
  const stepDept = document.getElementById('step-dept');
  const stepSev = document.getElementById('step-sev');
  const stepSum = document.getElementById('step-sum');
  const stepRep = document.getElementById('step-rep');

  // Result metadata
  const resultsEngineTag = document.getElementById('resultsEngineTag');
  const metaLangFlag = document.getElementById('metaLangFlag');
  const metaLangName = document.getElementById('metaLangName');
  const metaTimestamp = document.getElementById('metaTimestamp');

  // Card 1: Department Elements
  const cardDepartment = document.getElementById('cardDepartment');
  const deptIconBox = document.getElementById('deptIconBox');
  const deptNameBig = document.getElementById('deptNameBig');
  const deptRouteCode = document.getElementById('deptRouteCode');
  const deptDivisionName = document.getElementById('deptDivisionName');
  const deptHotline = document.getElementById('deptHotline');
  const deptConfidence = document.getElementById('deptConfidence');

  // Card 2: Severity Elements
  const cardSeverity = document.getElementById('cardSeverity');
  const sevScoreNumber = document.getElementById('sevScoreNumber');
  const sevStatusPill = document.getElementById('sevStatusPill');
  const sevThreatDesc = document.getElementById('sevThreatDesc');
  const sevSlaBadge = document.getElementById('sevSlaBadge');
  const sevLevelDetail = document.getElementById('sevLevelDetail');
  const sevImpactBox = document.getElementById('sevImpactBox');
  const sevColorNote = document.getElementById('sevColorNote');
  const sevLifeThreatBadge = document.getElementById('sevLifeThreatBadge');
  const meterSteps = [
    document.getElementById('meterStep1'),
    document.getElementById('meterStep2'),
    document.getElementById('meterStep3'),
    document.getElementById('meterStep4'),
    document.getElementById('meterStep5')
  ];

  // Card 3: Summary Elements
  const summaryText = document.getElementById('summaryText');
  const wordCountBadge = document.getElementById('wordCountBadge');
  const wordCountNumber = document.getElementById('wordCountNumber');
  const summaryWordStatus = document.getElementById('summaryWordStatus');
  const summaryTag1 = document.getElementById('summaryTag1');
  const summaryTag2 = document.getElementById('summaryTag2');
  const summaryTag3 = document.getElementById('summaryTag3');
  const btnCopySummary = document.getElementById('btnCopySummary');

  // Card 4: Citizen Reply Elements
  const replyDialectTag = document.getElementById('replyDialectTag');
  const replyFlag = document.getElementById('replyFlag');
  const replyLangTitle = document.getElementById('replyLangTitle');
  const citizenReplyText = document.getElementById('citizenReplyText');
  const btnSpeakReply = document.getElementById('btnSpeakReply');
  const btnCopyReply = document.getElementById('btnCopyReply');
  const btnToggleTranslation = document.getElementById('btnToggleTranslation');
  const translationDrawer = document.getElementById('translationDrawer');
  const translationText = document.getElementById('translationText');
  const btnDispatchRecord = document.getElementById('btnDispatchRecord');

  // History & Table Elements
  const historyTableBody = document.getElementById('historyTableBody');
  const countAll = document.getElementById('countAll');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const btnExportJson = document.getElementById('btnExportJson');
  const btnClearHistory = document.getElementById('btnClearHistory');

  // Modals & Settings
  const btnSettingsModal = document.getElementById('btnSettingsModal');
  const modalSettings = document.getElementById('modalSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const btnSaveSettings = document.getElementById('btnSaveSettings');

  const btnInfoModal = document.getElementById('btnInfoModal');
  const modalInfo = document.getElementById('modalInfo');
  const btnCloseInfo = document.getElementById('btnCloseInfo');
  const btnCloseInfoBottom = document.getElementById('btnCloseInfoBottom');

  // Current active result state
  let currentResult = null;
  let historyRecords = [];
  let currentFilter = 'All';

  // Department Config Catalog
  const DEPT_CATALOG = {
    Water: {
      icon: '💧',
      code: 'DIV-WAT-01',
      division: 'Water Works & Pipeline Bureau',
      hotline: '1800-WATER-SOS',
      tags: ['#water-supply', '#pipeline', '#municipal-utilities']
    },
    Roads: {
      icon: '🛣️',
      code: 'DIV-ROA-02',
      division: 'Highways & Pavement Engineering',
      hotline: '1800-ROADS-FIX',
      tags: ['#road-safety', '#pothole-repair', '#traffic-flow']
    },
    Sanitation: {
      icon: '🗑️',
      code: 'DIV-SAN-03',
      division: 'Waste Management & Public Hygiene',
      hotline: '1800-CLEAN-CITY',
      tags: ['#waste-disposal', '#sanitation', '#neighborhood-clean']
    },
    Electricity: {
      icon: '⚡',
      code: 'DIV-ELE-04',
      division: 'Power Distribution & Grid Safety',
      hotline: '1800-POWER-911',
      tags: ['#high-voltage', '#power-grid', '#public-safety']
    },
    Health: {
      icon: '🏥',
      code: 'DIV-HEA-05',
      division: 'Public Health & Emergency Response',
      hotline: '1800-HEALTH-EMERG',
      tags: ['#public-health', '#epidemic-control', '#medical-dispatch']
    },
    Police: {
      icon: '👮',
      code: 'DIV-POL-06',
      division: 'Civic Security & Law Enforcement',
      hotline: '1800-POLICE-SOS',
      tags: ['#law-enforcement', '#rapid-response', '#public-security']
    },
    Other: {
      icon: '🏢',
      code: 'DIV-GEN-07',
      division: 'General Municipal Administration',
      hotline: '1800-CIVIC-INFO',
      tags: ['#civic-affairs', '#general-inquiry', '#community-support']
    }
  };

  // --- INITIALIZATION ---
  initHistory();
  initSettings();
  loadInitialScenario();

  // --- EVENT LISTENERS ---

  // Live input typing feedback
  complaintInput.addEventListener('input', () => {
    const text = complaintInput.value;
    charCount.textContent = `${text.length} characters`;

    if (text.trim().length > 3) {
      const detected = classifier.detectLanguage(text);
      detectedLangPreview.textContent = `${detected.flag} Detected Dialect: ${detected.name} (${detected.nativeName})`;
    } else {
      detectedLangPreview.textContent = '🌐 Auto-detecting dialect & script...';
    }
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetId = btn.getAttribute('data-preset');
      const sample = SAMPLE_COMPLAINTS.find(s => s.id === presetId);
      if (sample) {
        complaintInput.value = sample.text;
        complaintInput.dispatchEvent(new Event('input'));
        showToast(`Loaded ${sample.language} sample grievance`, 'info');
        processComplaint();
      }
    });
  });

  // Random preset button
  btnRandomPreset.addEventListener('click', () => {
    const randomSample = SAMPLE_COMPLAINTS[Math.floor(Math.random() * SAMPLE_COMPLAINTS.length)];
    complaintInput.value = randomSample.text;
    complaintInput.dispatchEvent(new Event('input'));
    showToast(`Loaded ${randomSample.language} scenario`, 'info');
    processComplaint();
  });

  // Clear button
  btnClearInput.addEventListener('click', () => {
    complaintInput.value = '';
    complaintInput.dispatchEvent(new Event('input'));
    complaintInput.focus();
  });

  // Main Triage Button
  btnProcessComplaint.addEventListener('click', () => {
    processComplaint();
  });

  // Copy Summary
  btnCopySummary.addEventListener('click', () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult.summary.text).then(() => {
      showToast('15-word summary copied to clipboard!', 'success');
    });
  });

  // Copy Citizen Reply
  btnCopyReply.addEventListener('click', () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult.citizenReply.text).then(() => {
      showToast(`Reply in ${currentResult.language.name} copied to clipboard!`, 'success');
    });
  });

  // Toggle Translation
  btnToggleTranslation.addEventListener('click', () => {
    translationDrawer.classList.toggle('open');
    btnToggleTranslation.classList.toggle('speaking');
  });

  // Speech Synthesis for Citizen Reply in complaint's language
  btnSpeakReply.addEventListener('click', () => {
    if (!currentResult) return;
    speakReply(currentResult.citizenReply.text, currentResult.language.code);
  });

  // Log to Registry manually
  btnDispatchRecord.addEventListener('click', () => {
    if (!currentResult) return;
    addRecordToHistory(currentResult);
    showToast('Complaint archived to Municipal Dispatch Registry', 'success');
  });

  // History Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderHistoryTable();
    });
  });

  // Export JSON
  btnExportJson.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `solve_exp_registry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Municipal Registry exported to JSON', 'success');
  });

  // Clear History
  btnClearHistory.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all archived triage records?')) {
      historyRecords = [];
      saveHistory();
      renderHistoryTable();
      showToast('Registry cleared', 'info');
    }
  });

  // Settings Modal Handlers
  btnSettingsModal.addEventListener('click', () => {
    geminiApiKeyInput.value = classifier.getApiKey();
    modalSettings.classList.add('open');
  });
  btnCloseSettings.addEventListener('click', () => modalSettings.classList.remove('open'));
  btnSaveSettings.addEventListener('click', () => {
    classifier.setApiKey(geminiApiKeyInput.value);
    modalSettings.classList.remove('open');
    showToast(geminiApiKeyInput.value ? 'Gemini API key saved!' : 'Key removed; using local multi-agent heuristics', 'success');
  });

  // Info Modal Handlers
  btnInfoModal.addEventListener('click', () => modalInfo.classList.add('open'));
  btnCloseInfo.addEventListener('click', () => modalInfo.classList.remove('open'));
  btnCloseInfoBottom.addEventListener('click', () => modalInfo.classList.remove('open'));

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modalSettings) modalSettings.classList.remove('open');
    if (e.target === modalInfo) modalInfo.classList.remove('open');
  });

  // --- CORE PIPELINE LOGIC ---

  async function processComplaint() {
    const rawText = complaintInput.value.trim();
    if (!rawText) {
      showToast('Please enter a citizen complaint query to triage.', 'warning');
      complaintInput.focus();
      return;
    }

    btnProcessComplaint.disabled = true;
    pipelineOverlay.style.display = 'block';

    // Reset steps
    const steps = [stepLang, stepDept, stepSev, stepSum, stepRep];
    steps.forEach(s => {
      s.className = 'pipeline-step';
    });

    let startTime = performance.now();
    const timerInterval = setInterval(() => {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
      pipelineTimer.textContent = `${elapsed}s elapsed`;
    }, 100);

    try {
      // Step 1: Language
      stepLang.classList.add('active');
      await sleep(140);
      stepLang.classList.remove('active');
      stepLang.classList.add('done');

      // Step 2: Department
      stepDept.classList.add('active');
      await sleep(140);
      stepDept.classList.remove('active');
      stepDept.classList.add('done');

      // Step 3: Severity
      stepSev.classList.add('active');
      await sleep(140);
      stepSev.classList.remove('active');
      stepSev.classList.add('done');

      // Step 4: Summary
      stepSum.classList.add('active');
      await sleep(140);
      stepSum.classList.remove('active');
      stepSum.classList.add('done');

      // Step 5: Reply
      stepRep.classList.add('active');
      const result = await classifier.processComplaint(rawText);
      await sleep(140);
      stepRep.classList.remove('active');
      stepRep.classList.add('done');

      clearInterval(timerInterval);
      currentResult = result;

      // Render the 4 cards
      renderTriageCards(result);

      // Auto-save to Registry
      addRecordToHistory(result);

      showToast(`Complaint triaged to ${result.department} (Severity ${result.severity.score})`, 'success');

      // Scroll smoothly to results
      document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      clearInterval(timerInterval);
      console.error('Triage Error:', err);
      showToast(`Triage Error: ${err.message}`, 'error');
    } finally {
      setTimeout(() => {
        pipelineOverlay.style.display = 'none';
        btnProcessComplaint.disabled = false;
      }, 500);
    }
  }

  /**
   * Renders the 4 Result Cards with high-fidelity visual styling
   */
  function renderTriageCards(res) {
    const deptInfo = DEPT_CATALOG[res.department] || DEPT_CATALOG.Other;

    // Header Metadata
    resultsEngineTag.textContent = res.engine.includes('Gemini') ? 'Gemini 1.5 Flash' : 'Solve-exp Multi-Agent';
    metaLangFlag.textContent = res.language.flag;
    metaLangName.textContent = `Dialect: ${res.language.name} (${res.language.nativeName || res.language.code})`;
    metaTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // ==========================================
    // CARD 1: DEPARTMENT (BIG BADGE)
    // ==========================================
    cardDepartment.className = `triage-card card-dept dept-${res.department}`;
    deptIconBox.textContent = deptInfo.icon;
    deptNameBig.textContent = res.department;
    deptRouteCode.textContent = deptInfo.code;
    deptDivisionName.textContent = deptInfo.division;
    deptHotline.textContent = deptInfo.hotline;
    deptConfidence.textContent = `Score: ${(res.language.confidence * 100).toFixed(0)}% Confidence`;

    // ==========================================
    // CARD 2: SEVERITY (1-2 GREEN, 3-4 YELLOW, 5 RED)
    // ==========================================
    cardSeverity.className = `triage-card card-sev ${res.severity.colorClass}`;
    sevScoreNumber.textContent = res.severity.score;
    sevStatusPill.textContent = res.severity.level;
    sevThreatDesc.textContent = res.severity.score === 5 ? '⚠️ LIFE-THREATENING CRISIS' : res.severity.sla;
    sevSlaBadge.textContent = res.severity.sla;
    sevImpactBox.textContent = res.severity.description;

    // Fill the 5 meter steps
    meterSteps.forEach((step, idx) => {
      if (idx < res.severity.score) {
        step.className = 'sev-meter-step filled';
      } else {
        step.className = 'sev-meter-step';
      }
    });

    if (res.severity.score === 5) {
      sevColorNote.textContent = 'Color Code: Red (Level 5 Emergency)';
      sevLifeThreatBadge.textContent = '🚨 LIFE-THREATENING';
      sevLifeThreatBadge.style.color = '#f87171';
    } else if (res.severity.score >= 3) {
      sevColorNote.textContent = 'Color Code: Yellow (Level 3-4 Urgent)';
      sevLifeThreatBadge.textContent = '⚡ Elevated Risk';
      sevLifeThreatBadge.style.color = '#fbbf24';
    } else {
      sevColorNote.textContent = 'Color Code: Green (Level 1-2 Routine)';
      sevLifeThreatBadge.textContent = '✓ Standard SLA';
      sevLifeThreatBadge.style.color = '#34d399';
    }

    // ==========================================
    // CARD 3: SUMMARY (15-WORD MAX)
    // ==========================================
    summaryText.textContent = res.summary.text;
    wordCountNumber.textContent = `${res.summary.wordCount} / 15`;

    if (res.summary.isValid) {
      wordCountBadge.className = 'word-count-badge';
      summaryWordStatus.textContent = `Compliant (${res.summary.wordCount} words ≤ 15)`;
      summaryWordStatus.style.color = '#34d399';
    } else {
      wordCountBadge.className = 'word-count-badge invalid';
      summaryWordStatus.textContent = `Non-compliant (${res.summary.wordCount} words > 15)`;
      summaryWordStatus.style.color = '#f87171';
    }

    summaryTag1.textContent = deptInfo.tags[0] || '#incident';
    summaryTag2.textContent = deptInfo.tags[1] || '#triage';
    summaryTag3.textContent = `#sev-${res.severity.score}`;

    // ==========================================
    // CARD 4: CITIZEN REPLY (EMPATHETIC IN COMPLAINT'S LANGUAGE)
    // ==========================================
    replyDialectTag.textContent = `Original Dialect: ${res.language.name}`;
    replyFlag.textContent = res.language.flag;
    replyLangTitle.textContent = `Written in ${res.language.name} (${res.language.nativeName})`;
    citizenReplyText.textContent = `"${res.citizenReply.text}"`;

    if (res.citizenReply.englishTranslation) {
      translationText.textContent = res.citizenReply.englishTranslation;
      btnToggleTranslation.style.display = 'inline-flex';
    } else {
      translationText.textContent = res.citizenReply.text;
      btnToggleTranslation.style.display = 'none';
    }
    translationDrawer.classList.remove('open');
  }

  /**
   * Reads text aloud in native dialect
   */
  function speakReply(text, langCode) {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser.', 'warning');
      return;
    }

    window.speechSynthesis.cancel();
    btnSpeakReply.classList.add('speaking');
    btnSpeakReply.innerHTML = '<span>🔊 Speaking...</span>';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode || 'en';
    utterance.rate = 0.95;

    utterance.onend = () => {
      btnSpeakReply.classList.remove('speaking');
      btnSpeakReply.innerHTML = '<span>🔊 Listen</span>';
    };

    utterance.onerror = () => {
      btnSpeakReply.classList.remove('speaking');
      btnSpeakReply.innerHTML = '<span>🔊 Listen</span>';
    };

    window.speechSynthesis.speak(utterance);
    showToast(`Speaking reply in ${langCode.toUpperCase()}...`, 'info');
  }

  // --- REGISTRY / HISTORY MANAGEMENT ---

  function initHistory() {
    const stored = localStorage.getItem('solve_exp_history');
    if (stored) {
      try {
        historyRecords = JSON.parse(stored);
      } catch (e) {
        historyRecords = [];
      }
    }

    // If empty on first visit, pre-populate 3 realistic triage cases in South Indian languages & Hindi
    if (!historyRecords || historyRecords.length === 0) {
      historyRecords = [
        {
          id: 'TRG-8921',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          department: 'Electricity',
          severity: { score: 5, level: 'Critical (Life-Threatening)', colorClass: 'severity-red' },
          language: { name: 'Tamil', flag: '🇮🇳', code: 'ta' },
          summary: { text: 'Fallen high-voltage power line sparking in flooded pedestrian area posing electrocution hazard.', wordCount: 12 },
          citizenReply: { text: 'இந்த ஆபத்தான சூழலை உணர்ந்து வருந்துகிறோம்; அவசர மீட்புக் குழுவினர் உங்கள் பகுதிக்கு விரைந்துள்ளனர்.' }
        },
        {
          id: 'TRG-8920',
          timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
          department: 'Water',
          severity: { score: 3, level: 'Moderate (Disruption)', colorClass: 'severity-yellow' },
          language: { name: 'Hindi', flag: '🇮🇳', code: 'hi' },
          summary: { text: 'Major municipal water supply pipeline ruptured, cutting off drinking water to local residents.', wordCount: 13 },
          citizenReply: { text: 'आपकी असुविधा के लिए हमें गहरा खेद है; हमारी नगर निगम टीम को निर्देशित कर दिया गया है।' }
        },
        {
          id: 'TRG-8919',
          timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
          department: 'Sanitation',
          severity: { score: 2, level: 'Low (Operational)', colorClass: 'severity-green' },
          language: { name: 'Telugu', flag: '🇮🇳', code: 'te' },
          summary: { text: 'Uncollected municipal garbage bins overflowing on residential street creating sanitary nuisance.', wordCount: 11 },
          citizenReply: { text: 'మీకు కలిగిన అసౌకర్యానికి మేము చింతిస్తున్నాము; మా మున్సిపల్ సిబ్బంది పరిష్కరించడానికి చర్యలు తీసుకుంటున్నారు.' }
        }
      ];
      saveHistory();
    }

    renderHistoryTable();
  }

  function addRecordToHistory(result) {
    const record = {
      id: `TRG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: result.timestamp,
      department: result.department,
      severity: result.severity,
      language: result.language,
      summary: result.summary,
      citizenReply: result.citizenReply
    };

    historyRecords.unshift(record);
    if (historyRecords.length > 50) historyRecords.pop();
    saveHistory();
    renderHistoryTable();
  }

  function saveHistory() {
    localStorage.setItem('solve_exp_history', JSON.stringify(historyRecords));
  }

  function renderHistoryTable() {
    countAll.textContent = historyRecords.length;

    const filtered = currentFilter === 'All' 
      ? historyRecords 
      : historyRecords.filter(r => r.department.toLowerCase() === currentFilter.toLowerCase());

    if (filtered.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-dim);">
            No grievances triaged under "${currentFilter}" department yet.
          </td>
        </tr>
      `;
      return;
    }

    historyTableBody.innerHTML = filtered.map(item => {
      const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sevClass = item.severity.score >= 5 ? 'badge-sev-5' : item.severity.score >= 3 ? 'badge-sev-3' : 'badge-sev-1';

      return `
        <tr>
          <td>
            <div style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${item.id}</div>
            <div style="font-size: 0.72rem; color: var(--text-dim);">${timeStr}</div>
          </td>
          <td>
            <span style="font-size: 1.1rem; vertical-align: middle;">${item.language.flag}</span>
            <span style="font-size: 0.8rem;">${item.language.name}</span>
          </td>
          <td>
            <strong style="color: #cbd5e1;">${item.department}</strong>
          </td>
          <td>
            <span class="badge-sm ${sevClass}">
              Level ${item.severity.score}
            </span>
          </td>
          <td style="max-width: 260px;">
            <div style="font-size: 0.82rem; color: #e2e8f0; line-height: 1.4;">${item.summary.text}</div>
            <div style="font-family: var(--font-mono); font-size: 0.68rem; color: #34d399; margin-top: 0.2rem;">✓ ${item.summary.wordCount} words</div>
          </td>
          <td style="max-width: 260px;">
            <div style="font-size: 0.82rem; font-style: italic; color: #cbd5e1; line-height: 1.4;">"${item.citizenReply.text}"</div>
          </td>
          <td>
            <button class="btn-pill btn-table-speak" data-text="${encodeURIComponent(item.citizenReply.text)}" data-lang="${item.language.code}" title="Listen in native dialect" style="padding: 0.25rem 0.55rem; font-size: 0.72rem;">
              🔊 Speak
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach speak button listeners in table
    document.querySelectorAll('.btn-table-speak').forEach(b => {
      b.addEventListener('click', () => {
        const text = decodeURIComponent(b.getAttribute('data-text'));
        const lang = b.getAttribute('data-lang');
        speakReply(text, lang);
      });
    });
  }

  function initSettings() {
    const key = classifier.getApiKey();
    if (key) geminiApiKeyInput.value = key;
  }

  /**
   * Load initial scenario on page startup so the 4 cards are populated right away
   */
  function loadInitialScenario() {
    const initialSample = SAMPLE_COMPLAINTS[0]; // Spanish Gas Explosion (Severity 5)
    complaintInput.value = initialSample.text;
    complaintInput.dispatchEvent(new Event('input'));

    classifier.processComplaint(initialSample.text).then(result => {
      currentResult = result;
      renderTriageCards(result);
    });
  }

  // Helper Utilities
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }
});
