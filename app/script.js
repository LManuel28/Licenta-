const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').setAttribute('min', today);

    let currentStep = 1;
    let totalSteps = 2;
    let eventKind = '';

    const staticPanels = [null,
      document.getElementById('panel-1'),
      document.getElementById('panel-2'),
    ];

    const specialPanels = {
      wedding: document.getElementById('panel-4-wedding'),
      majorat: document.getElementById('panel-4-majorat'),
      botez: document.getElementById('panel-4-botez'),
      bal: document.getElementById('panel-4-bal'),
      banchet: document.getElementById('panel-4-banchet'),
      aniversare: document.getElementById('panel-4-aniversare'),
      petrecere: document.getElementById('panel-4-petrecere'),
      corporate: document.getElementById('panel-4-corporate'),
      cununie: document.getElementById('panel-4-cununie'),
      alt: document.getElementById('panel-4-alt'),
    };

    function getActivePanel4() { return specialPanels[eventKind] || null; }

    // Genre cards
    document.querySelectorAll('.genre-card').forEach(card => {
      const cb = card.querySelector('.genre-cb');
      card.addEventListener('click', e => {
        if (e.target === cb) return;
        e.preventDefault();
        if (cb.type === 'radio') {
          document.querySelectorAll('input[name="' + cb.name + '"]').forEach(radio => {
            radio.checked = false;
            radio.closest('.genre-card')?.classList.remove('selected');
          });
          cb.checked = true;
          card.classList.add('selected');
        } else {
          cb.checked = !cb.checked;
          card.classList.toggle('selected', cb.checked);
        }
      });
    });

    // GDPR
    function setupGdpr(labelId, checkId) {
      const label = document.getElementById(labelId);
      const check = document.getElementById(checkId);
      if (!label || !check) return;
      label.addEventListener('click', e => {
        if (e.target === check) return;
        e.preventDefault();
        check.checked = !check.checked;
        label.classList.toggle('checked', check.checked);
      });
    }
    ['gdprLabel|gdprCheck', 'gdprLabel4w|gdprCheck4w', 'gdprLabel4m|gdprCheck4m', 'gdprLabel4b|gdprCheck4b', 'gdprLabel4bal|gdprCheck4bal', 'gdprLabel4banchet|gdprCheck4banchet', 'gdprLabel4aniversare|gdprCheck4aniversare', 'gdprLabel4petrecere|gdprCheck4petrecere', 'gdprLabel4corporate|gdprCheck4corporate', 'gdprLabel4cununie|gdprCheck4cununie', 'gdprLabel4alt|gdprCheck4alt']
      .forEach(pair => { const [l, c] = pair.split('|'); setupGdpr(l, c); });

    // Dance toggle
    window.toggleDance = function (type, choice) {
      const yBtn = document.getElementById(type + '-yes');
      const nBtn = document.getElementById(type + '-no');
      const reveal = document.getElementById(type + '-reveal');
      const val = document.getElementById(type + '-dance-val');
      const song = document.getElementById(type + '-dance-song');
      yBtn.classList.remove('active-yes', 'active-no');
      nBtn.classList.remove('active-yes', 'active-no');
      if (choice === 'yes') {
        yBtn.classList.add('active-yes');
        reveal.classList.add('open');
        val.value = 'Da';
      } else {
        nBtn.classList.add('active-no');
        reveal.classList.remove('open');
        val.value = 'Nu';
        song.value = '';
      }
      setTimeout(applyProgressiveFlow, 80);
      setTimeout(syncProgressiveButtons, 120);
    };


    function updateGeneralMusicVibeFields() {
      const box = document.getElementById('generalMusicVibeFields');
      if (!box) return;

      const isWeddingSelected = document.getElementById('eventType')?.value === 'Nuntă' || eventKind === 'wedding';

      box.classList.toggle('hidden-for-wedding', isWeddingSelected);
      box.style.display = isWeddingSelected ? 'none' : '';

      box.querySelectorAll('input, textarea, select').forEach(el => {
        if (!el.dataset.originalRequiredMusic) {
          el.dataset.originalRequiredMusic = el.required ? 'true' : 'false';
        }

        el.disabled = isWeddingSelected;
        el.required = !isWeddingSelected && el.dataset.originalRequiredMusic === 'true';

        if (isWeddingSelected) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
            el.closest('.genre-card')?.classList.remove('selected');
          } else {
            el.value = '';
          }
        }
      });
    }

    function updateWeddingStep2Fields() {
      const box = document.getElementById('weddingStep2Fields');
      if (!box) return;

      const isWedding = eventKind === 'wedding';
      box.style.display = isWedding ? '' : 'none';

      box.querySelectorAll('input, textarea, select').forEach(el => {
        if (!el.dataset.originalRequired) {
          el.dataset.originalRequired = el.required ? 'true' : 'false';
        }

        el.disabled = !isWedding;
        el.required = isWedding && el.dataset.originalRequired === 'true';
      });
    }

    // Event type change
    document.getElementById('eventType').addEventListener('change', function () {
      const v = this.value;
      eventKind =
        v === 'Nuntă' ? 'wedding' :
        v === 'Majorat' ? 'majorat' :
        v === 'Botez' ? 'botez' :
        v === 'Bal' ? 'bal' :
        v === 'Banchet' ? 'banchet' :
        v === 'Aniversare' ? 'aniversare' :
        v === 'Petrecere privată' ? 'petrecere' :
        v === 'Corporate' ? 'corporate' :
        v === 'Cununie' ? 'cununie' :
        v === 'Alt tip de eveniment' ? 'alt' :
        '';
      totalSteps = eventKind ? 3 : 2;

      const si3 = document.getElementById('step-item-3');
      si3.style.display = eventKind ? '' : 'none';

      const lbl3 = document.getElementById('step-label-3');
      if (lbl3) lbl3.textContent =
        v === 'Nuntă' ? 'Nuntă' :
        v === 'Majorat' ? 'Majorat' :
        v === 'Botez' ? 'Botez' :
        v === 'Bal' ? 'Bal' :
        v === 'Banchet' ? 'Banchet' :
        v === 'Aniversare' ? 'Aniversare' :
        v === 'Petrecere privată' ? 'Petrecere' :
        v === 'Corporate' ? 'Corporate' :
        v === 'Cununie' ? 'Cununie' :
        'Special';

      document.getElementById('gdpr-step3').style.display = eventKind ? 'none' : '';
      document.getElementById('gdprCheck').required = !eventKind;

      ['gdprCheck4w', 'gdprCheck4m', 'gdprCheck4b', 'gdprCheck4bal', 'gdprCheck4banchet', 'gdprCheck4aniversare', 'gdprCheck4petrecere', 'gdprCheck4corporate', 'gdprCheck4cununie', 'gdprCheck4alt'].forEach(id => {
        const gd = document.getElementById(id);
        if (gd) gd.required = false;
      });

      const wfd = document.getElementById('weddingFirstDance');
      if (wfd) wfd.required = eventKind === 'wedding';

      const gdprBal = document.getElementById('gdprCheck4bal');
      if (gdprBal) gdprBal.required = eventKind === 'bal';

      const gdprBanchet = document.getElementById('gdprCheck4banchet');
      if (gdprBanchet) gdprBanchet.required = eventKind === 'banchet';

      ['aniversare', 'petrecere', 'corporate', 'cununie', 'alt'].forEach(kind => {
        const gd = document.getElementById('gdprCheck4' + kind);
        if (gd) gd.required = eventKind === kind;
      });

      updateGeneralMusicVibeFields();
      updateWeddingStep2Fields();
      updateGeneralMusicVibeFields();

      if (currentStep > totalSteps) { currentStep = totalSteps; renderStep(); }
      updateTrack();
      updateGeneralMusicVibeFields();
      setTimeout(applyProgressiveFlow, 80);
      setTimeout(syncProgressiveButtons, 120);
    });

    // Toast
    let toastTimer;
    function showToast(msg) {
      clearTimeout(toastTimer);
      const el = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      el.classList.add('show');
      toastTimer = setTimeout(() => el.classList.remove('show'), 5000);
    }

    // Validate
    function validate() {
      const panel = getCurrentPanel();
      if (!panel) return true;
      for (let el of panel.querySelectorAll('[required]')) {
        if (!el.checkValidity()) { el.reportValidity(); return false; }
      }
      if (currentStep === 2) {
        const generalMusic = document.getElementById('generalMusicVibeFields');
        const shouldValidateGeneralMusic = !generalMusic || generalMusic.style.display !== 'none';

        if (shouldValidateGeneralMusic && !document.querySelectorAll('#generalMusicVibeFields input[name="Genuri[]"]:checked').length) {
          showToast('Te rugăm să selectezi cel puțin un gen muzical.'); return false;
        }
        if (!eventKind && !document.getElementById('gdprCheck').checked) {
          showToast('Trebuie să fii de acord cu termenii pentru a continua.'); return false;
        }
      }
      if (currentStep === 3 && eventKind) {
        if ((eventKind === 'majorat' || eventKind === 'botez') && !document.getElementById(eventKind + '-dance-val').value) {
          showToast('Te rugăm să selectezi dacă dorești un dans de deschidere.'); return false;
        }

        if (eventKind === 'banchet') {
          const scenesVal = document.getElementById('banchet-scenes-val');
          if (scenesVal && !scenesVal.value) {
            showToast('Te rugăm să selectezi dacă vor exista momente artistice la banchet.'); return false;
          }
        }

        const gdprMap = {
          wedding: 'gdprCheck4w',
          majorat: 'gdprCheck4m',
          botez: 'gdprCheck4b',
          bal: 'gdprCheck4bal',
          banchet: 'gdprCheck4banchet',
          aniversare: 'gdprCheck4aniversare',
          petrecere: 'gdprCheck4petrecere',
          corporate: 'gdprCheck4corporate',
          cununie: 'gdprCheck4cununie',
          alt: 'gdprCheck4alt'
        };
        const gdpr = document.getElementById(gdprMap[eventKind]);
        if (gdpr && !gdpr.checked) { showToast('Trebuie să fii de acord cu termenii pentru a trimite.'); return false; }
      }
      return true;
    }

    // Render
    function renderStep() {
      [...staticPanels.slice(1), ...Object.values(specialPanels)].forEach(p => {
        if (!p) return;
        p.classList.remove('active');
        p.style.display = 'none';
        p.style.opacity = '0';
        p.style.transform = 'translateX(16px)';
      });

      const active = currentStep <= 2 ? staticPanels[currentStep] : getActivePanel4();
      if (active) {
        active.style.display = 'block';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          active.classList.add('active');
          active.style.opacity = '1';
          active.style.transform = 'translateX(0)';
        }));
      }

      for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('dot-' + i);
        const item = document.querySelector('.step-item[data-step="' + i + '"]');
        if (!dot || !item) continue;
        dot.classList.remove('active', 'done');
        item.classList.remove('active', 'done');
        if (i < currentStep) { dot.classList.add('done'); item.classList.add('done'); }
        else if (i === currentStep) { dot.classList.add('active'); item.classList.add('active'); }
      }

      updateTrack();

      document.getElementById('btnBack').classList.toggle('btn-hidden', currentStep === 1);
      document.getElementById('btnNext').classList.toggle('btn-hidden', currentStep === totalSteps);
      document.getElementById('btnSubmit').classList.toggle('btn-hidden', currentStep !== totalSteps);

      setTimeout(applyProgressiveFlow, 0);
      setTimeout(applyProgressiveFlow, 80);
      setTimeout(syncProgressiveButtons, 100);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateTrack() {
      const pct = totalSteps <= 1 ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100;
      document.getElementById('trackFill').style.width = pct + '%';
    }

    document.getElementById('btnNext').addEventListener('click', () => {
      if (validate() && currentStep < totalSteps) { currentStep++; renderStep(); updateGeneralMusicVibeFields(); }
    });
    document.getElementById('btnBack').addEventListener('click', () => {
      if (currentStep > 1) { currentStep--; renderStep(); updateGeneralMusicVibeFields(); }
    });

    document.getElementById('mainForm').addEventListener('submit', function (e) {
      if (!validate()) { e.preventDefault(); return; }
      const generalMusic = document.getElementById('generalMusicVibeFields');
      const shouldValidateGeneralMusic = !generalMusic || generalMusic.style.display !== 'none';

      if (shouldValidateGeneralMusic && !document.querySelectorAll('#generalMusicVibeFields input[name="Genuri[]"]:checked').length) {
        e.preventDefault(); currentStep = 2; renderStep(); showToast('Selectează cel puțin un gen muzical.'); return;
      }
      const sub = document.getElementById('btnSubmit');
      
      // Delay disabling the button slightly to allow form submission to process
      setTimeout(() => {
          sub.disabled = true;
          sub.innerHTML = '<div class="loading-spinner"></div> Se trimite...';
      }, 10);
    });

    window.toggleScenes = function (type, choice) {
      const yBtn = document.getElementById(type + '-scenes-yes');
      const nBtn = document.getElementById(type + '-scenes-no');
      const reveal = document.getElementById(type + '-scenes-reveal');
      const val = document.getElementById(type + '-scenes-val');
      const countInput = document.getElementById(type + 'SceneCount');
      const container = document.getElementById(type + 'SceneContainer');

      yBtn.classList.remove('active-yes', 'active-no');
      nBtn.classList.remove('active-yes', 'active-no');

      if (choice === 'yes') {
        yBtn.classList.add('active-yes');
        reveal.classList.add('open');
        val.value = 'Da';
        countInput.required = true;

        const micReveal = document.getElementById(type + '-mics-reveal');
        const micInput = document.getElementById(type + '-mics-input');

        if (micReveal) micReveal.classList.add('open');
        if (micInput) micInput.required = true;
      } else {
        nBtn.classList.add('active-no');
        reveal.classList.remove('open');
        val.value = 'Nu';
        countInput.required = false;
        countInput.value = '';
        container.innerHTML = '';

        const micReveal = document.getElementById(type + '-mics-reveal');
        const micInput = document.getElementById(type + '-mics-input');

        if (micReveal) micReveal.classList.remove('open');
        if (micInput) {
          micInput.required = false;
          micInput.value = '';
        }
      }
      setTimeout(applyProgressiveFlow, 80);
      setTimeout(syncProgressiveButtons, 120);
    };

    const banchetSceneCount = document.getElementById('banchetSceneCount');

    if (banchetSceneCount) {
      banchetSceneCount.addEventListener('input', function () {
        const container = document.getElementById('banchetSceneContainer');
        container.innerHTML = '';

        const count = parseInt(this.value) || 0;

        for (let i = 1; i <= count; i++) {
          container.innerHTML += `
            <div class="field-group">
              <label class="field-label">Descriere moment artistic banchet ${i} <span class="req">*</span></label>
              <textarea
                class="field-textarea"
                name="Sceneta banchet ${i}"
                required
                placeholder="Descriere scurtă pentru sceneta ${i}..."
              ></textarea>
            </div>
          `;
        }
      });
    }

    const sceneCount = document.getElementById('sceneCount');

    if (sceneCount) {
      sceneCount.addEventListener('input', function () {
        const container = document.getElementById('sceneContainer');
        container.innerHTML = '';

        const count = parseInt(this.value) || 0;

        for (let i = 1; i <= count; i++) {
          container.innerHTML += `
            <div class="field-group">
              <label class="field-label">Descriere moment artistic ${i} <span class="req">*</span></label>
              <textarea
                class="field-textarea"
                name="Sceneta ${i}"
                required
                placeholder="Descriere scurtă pentru sceneta ${i}..."
              ></textarea>
            </div>
          `;

        }
      });
    }

    updateWeddingStep2Fields();

    // Progressive flow stabil: afișează câmpurile pe rând și nu blochează pe GDPR ascuns / câmpuri din alte categorii.
    function getCurrentPanel() {
      if (currentStep <= 2) return staticPanels[currentStep];
      return getActivePanel4();
    }

    function isStructurallyActive(el, panel) {
      if (!el || !panel || !panel.contains(el)) return false;

      let node = el;
      while (node && node !== panel) {
        if (node.style && node.style.display === 'none') return false;
        if (node.classList && node.classList.contains('hidden-for-wedding')) return false;

        if (node.classList && node.classList.contains('reveal-box') && !node.classList.contains('open')) {
          return false;
        }

        node = node.parentElement;
      }

      return true;
    }

    function getQuestionBlocks(panel) {
      const blocks = [];
      const seen = new Set();

      panel.querySelectorAll('.field-group, .gdpr-wrap').forEach(block => {
        if (seen.has(block)) return;
        if (!isStructurallyActive(block, panel)) return;

        if (currentStep === 2 && eventKind && block.closest('#gdpr-step3')) return;
        if (eventKind && block.closest('#generalMusicVibeFields')) return;
        if (eventKind !== 'wedding' && block.closest('#weddingStep2Fields')) return;

        const inputs = Array.from(block.querySelectorAll('input, textarea, select'));
        if (!block.matches('.gdpr-wrap') && inputs.length === 0) return;

        const usableInputs = inputs.filter(input => {
          if (input.disabled) return false;
          if (!isStructurallyActive(input, panel)) return false;
          if (eventKind && input.closest('#generalMusicVibeFields')) return false;
          if (eventKind !== 'wedding' && input.closest('#weddingStep2Fields')) return false;
          return true;
        });

        if (!block.matches('.gdpr-wrap') && inputs.length > 0 && usableInputs.length === 0) return;

        seen.add(block);
        blocks.push(block);
      });

      return blocks;
    }

    function blockHasAnswer(block, panel) {
      if (block.matches('.gdpr-wrap')) {
        const check = block.querySelector('input[type="checkbox"]');
        return check ? check.checked : true;
      }

      const inputs = Array.from(block.querySelectorAll('input, textarea, select')).filter(input => {
        if (input.disabled) return false;
        if (!isStructurallyActive(input, panel)) return false;
        if (eventKind && input.closest('#generalMusicVibeFields')) return false;
        if (eventKind !== 'wedding' && input.closest('#weddingStep2Fields')) return false;
        return true;
      });

      if (!inputs.length) return true;

      const genreInputs = inputs.filter(input => input.name === 'Genuri[]');
      if (genreInputs.length) {
        return genreInputs.some(input => input.checked);
      }

      const choiceInputs = inputs.filter(input => input.type === 'checkbox' || input.type === 'radio');
      if (choiceInputs.length) {
        const names = [...new Set(choiceInputs.map(input => input.name).filter(Boolean))];

        if (!names.length) {
          return choiceInputs.some(input => input.checked);
        }

        return names.every(name => {
          return inputs
            .filter(input => input.name === name)
            .some(input => input.checked);
        });
      }

      const mustAnswerInputs = inputs.filter(input => {
        if (input.required) return true;
        if (input.type === 'hidden' && input.name && input.name.toLowerCase().includes('dans deschidere')) return true;
        if (input.type === 'hidden' && input.name && input.name.toLowerCase().includes('momente artistice')) return true;
        return false;
      });

      if (!mustAnswerInputs.length) {
        return true;
      }

      return mustAnswerInputs.every(input => {
        if (input.tagName === 'SELECT') return input.value && input.value.trim() !== '';
        return input.value && input.value.trim() !== '';
      });
    }

    function hideEverythingProgressive(panel) {
      panel.querySelectorAll('.field-group, .gdpr-wrap, .info-box').forEach(el => {
        el.classList.add('progressive-hidden');
        el.classList.remove('progressive-visible');
      });

      panel.querySelectorAll('.section-divider').forEach(el => {
        el.classList.add('progressive-hidden');
        el.classList.remove('progressive-visible');
      });
    }

    function showProgressiveElement(el) {
      if (!el) return;
      el.classList.remove('progressive-hidden');
      el.classList.add('progressive-visible');
    }

    function showRelatedContainers(block) {
      showProgressiveElement(block);

      let parent = block.parentElement;
      while (parent && !parent.classList.contains('step-panel')) {
        if (
          parent.classList.contains('grid-2') ||
          parent.classList.contains('grid-3') ||
          parent.classList.contains('wedding-grid') ||
          parent.classList.contains('reveal-box') ||
          parent.classList.contains('dance-field')
        ) {
          parent.classList.remove('progressive-hidden');
          parent.classList.add('progressive-visible');
        }

        parent = parent.parentElement;
      }
    }

    function showSectionTitleFor(block) {
      let node = block.previousElementSibling;

      while (node) {
        if (node.classList && node.classList.contains('section-divider')) {
          showProgressiveElement(node);
          return;
        }

        if (
          node.classList &&
          (
            node.classList.contains('field-group') ||
            node.classList.contains('grid-2') ||
            node.classList.contains('grid-3') ||
            node.classList.contains('wedding-grid') ||
            node.classList.contains('gdpr-wrap') ||
            node.classList.contains('info-box')
          )
        ) {
          break;
        }

        node = node.previousElementSibling;
      }

      const parent = block.parentElement;
      if (parent && !parent.classList.contains('step-panel')) {
        let parentPrev = parent.previousElementSibling;

        while (parentPrev) {
          if (parentPrev.classList && parentPrev.classList.contains('section-divider')) {
            showProgressiveElement(parentPrev);
            return;
          }

          if (
            parentPrev.classList &&
            (
              parentPrev.classList.contains('field-group') ||
              parentPrev.classList.contains('grid-2') ||
              parentPrev.classList.contains('grid-3') ||
              parentPrev.classList.contains('wedding-grid') ||
              parentPrev.classList.contains('gdpr-wrap') ||
              parentPrev.classList.contains('info-box')
            )
          ) {
            break;
          }

          parentPrev = parentPrev.previousElementSibling;
        }
      }
    }

    function applyProgressiveFlow() {
      const panel = getCurrentPanel();
      if (!panel) return;

      hideEverythingProgressive(panel);

      const infoBox = panel.querySelector('.info-box');
      if (infoBox) showProgressiveElement(infoBox);

      const blocks = getQuestionBlocks(panel);

      if (!blocks.length) {
        updateProgressiveButtons(false);
        return;
      }

      let firstUnansweredIndex = blocks.findIndex(block => !blockHasAnswer(block, panel));
      if (firstUnansweredIndex === -1) firstUnansweredIndex = blocks.length;

      blocks.forEach((block, index) => {
        if (index <= firstUnansweredIndex) {
          showRelatedContainers(block);
          showSectionTitleFor(block);
        }
      });

      const canContinue = firstUnansweredIndex === blocks.length;
      updateProgressiveButtons(canContinue);
    }

    function updateProgressiveButtons(canContinue) {
      const nextBtn = document.getElementById('btnNext');
      const submitBtn = document.getElementById('btnSubmit');

      if (nextBtn && currentStep !== totalSteps) {
        nextBtn.classList.toggle('btn-hidden', !canContinue);
      }

      if (submitBtn && currentStep === totalSteps) {
        submitBtn.classList.toggle('btn-hidden', !canContinue);
      }
    }

    function syncProgressiveButtons() {
      applyProgressiveFlow();
    }

    document.addEventListener('input', () => setTimeout(applyProgressiveFlow, 0));
    document.addEventListener('change', () => setTimeout(applyProgressiveFlow, 0));
    document.addEventListener('click', () => setTimeout(applyProgressiveFlow, 0));

    document.addEventListener('input', () => setTimeout(syncProgressiveButtons, 30));
    document.addEventListener('change', () => setTimeout(syncProgressiveButtons, 30));
    document.addEventListener('click', () => setTimeout(syncProgressiveButtons, 30));

    updateGeneralMusicVibeFields();
    renderStep();
    setTimeout(syncProgressiveButtons, 80);
    setTimeout(applyProgressiveFlow, 0);