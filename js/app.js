/**
 * app.js
 * Controlador Principal de la Aplicación Web Interactiva
 * Laboratorio 02: Sistemas en Tiempo Continuo
 * Universidad Nacional de San Agustín de Arequipa (UNSA) - EPIT
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  currentSlide: 0, // 0 a 14 (15 diapositivas)
  totalSlides: 15,
  isPresentationMode: false,
  topicStates: {},
  slideIds: [
    "slide-cover",       // 0: Portada Oficial
    "slide-intro",       // 1: Introducción
    "topic-slide-1",     // 2: Tema 1 (Franco)
    "topic-slide-2",     // 3: Tema 2 (Franco)
    "topic-slide-3",     // 4: Tema 3 (Jeremy)
    "topic-slide-4",     // 5: Tema 4 (Jeremy)
    "topic-slide-5",     // 6: Tema 5 (Henry)
    "topic-slide-6",     // 7: Tema 6 (Alex)
    "topic-slide-7",     // 8: Tema 7 (Alex)
    "topic-slide-8",     // 9: Tema 8 (Zaul)
    "topic-slide-9",     // 10: Tema 9 (Benjamin)
    "topic-slide-10",    // 11: Tema 10 (Henry)
    "slide-sandbox",     // 12: Sandbox LTI
    "slide-conclusions", // 13: Conclusiones
    "slide-biblio"       // 14: Bibliografía
  ],

  init() {
    try {
      this.initTheme();
      this.renderCoverTeam();
      this.renderTheory();
      this.renderTopics();
      this.renderConclusions();
      this.renderBiblio();
      this.renderSandbox();
      this.bindEvents();
      this.initKaTeX();
      this.initFirstSimulations();

      // Verificar si la URL contiene hash de slide
      const hash = window.location.hash;
      if (hash && hash.startsWith("#slide-")) {
        const foundIdx = this.slideIds.indexOf(hash.replace("#", ""));
        if (foundIdx !== -1) {
          this.currentSlide = foundIdx;
        }
      }
    } catch (e) {
      console.error("Error durante la inicialización de App:", e);
    }
  },

  // ------------------------------------------------------------------------
  // GESTIÓN DE TEMA (DARK MODE / LIGHT MODE)
  // ------------------------------------------------------------------------
  initTheme() {
    let savedTheme = "dark";
    try {
      savedTheme = localStorage.getItem("epit-lab2-theme") || "dark";
    } catch (e) {}
    this.setTheme(savedTheme, false);
  },

  toggleTheme() {
    const current = document.body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    this.setTheme(next, true);
  },

  setTheme(theme, showFeedback = true) {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("epit-lab2-theme", theme);
    } catch (e) {}

    // Actualizar icono en la barra superior
    const icon = document.getElementById("theme-toggle-icon");
    if (icon) {
      icon.className = theme === "light" ? "fa fa-moon" : "fa fa-sun";
    }

    // Actualizar icono en el dock de presentación
    const dockIcon = document.getElementById("dock-theme-icon");
    if (dockIcon) {
      dockIcon.className = theme === "light" ? "fa fa-moon" : "fa fa-sun";
    }

    // Re-renderizar simulaciones con los nuevos colores de ejes y cuadrícula
    if (window.LAB_DATA) {
      LAB_DATA.topics.forEach(t => this.updateSimulation(t.id));
      this.runSandboxSimulation();
    }

    if (showFeedback) {
      this.showToast(`Modo ${theme === "light" ? "Claro" : "Oscuro"} activado`);
    }
  },

  // ------------------------------------------------------------------------
  // RENDERIZADO DE LA PORTADA: INTEGRANTES
  // ------------------------------------------------------------------------
  renderCoverTeam() {
    const grid = document.getElementById("cover-team-grid");
    if (!grid || !window.LAB_DATA) return;

    grid.innerHTML = LAB_DATA.teamMembers.map(m => `
      <div class="student-card" onclick="App.jumpToStudentTopics('${m.id}')" title="Clic para ir a los temas de ${m.name}">
        <div class="student-avatar" style="border-color: ${m.color}; color: ${m.color};">
          ${m.avatar}
        </div>
        <div class="student-info">
          <div class="student-name">${m.name}</div>
          <div class="student-topics-badge">
            <span style="color: var(--color-signal-violet); font-weight: 600;">${m.taskLabel}</span>: ${m.topics.map(t => 'Tema ' + (t < 10 ? '0' + t : t)).join(', ')}
          </div>
        </div>
      </div>
    `).join("");
  },

  // ------------------------------------------------------------------------
  // RENDERIZADO DE LA INTRODUCCIÓN TEÓRICA
  // ------------------------------------------------------------------------
  renderTheory() {
    const grid = document.getElementById("intro-pillars-grid");
    if (!grid || !window.LAB_DATA) return;

    grid.innerHTML = LAB_DATA.theoreticalFramework.concepts.map(c => `
      <div class="pillar-item">
        <div class="pillar-icon-box">
          <i class="fa ${c.icon}"></i>
        </div>
        <h4 class="pillar-title">${c.title}</h4>
        <p class="pillar-desc">${c.description}</p>
      </div>
    `).join("");
  },

  // ------------------------------------------------------------------------
  // RENDERIZADO DE LOS 10 EJERCICIOS DEL LABORATORIO
  // ------------------------------------------------------------------------
  renderTopics() {
    const container = document.getElementById("topics-container");
    if (!container || !window.LAB_DATA) return;

    container.innerHTML = LAB_DATA.topics.map(topic => {
      const presenter = LAB_DATA.teamMembers.find(m => m.id === topic.presenterId);
      this.topicStates[topic.id] = {
        activeTab: "python",
        params: {}
      };

      if (topic.parameters) {
        topic.parameters.forEach(p => {
          this.topicStates[topic.id].params[p.id] = p.default;
        });
      }

      // Resaltado de sintaxis inicial (Python por defecto)
      let highlightedCode = "";
      if (window.SyntaxHighlighter) {
        highlightedCode = SyntaxHighlighter.highlightPython(topic.pythonCode);
      } else {
        highlightedCode = this.escapeHtml(topic.pythonCode);
      }

      const slideIdx = topic.id + 1; // Slide 2 a 11

      return `
        <article class="topic-card deck-slide" id="topic-slide-${topic.id}" data-slide-index="${slideIdx}">
          
          <!-- Encabezado del Ejercicio -->
          <div class="topic-header">
            <div class="topic-meta-left">
              <div class="topic-badge-row">
                <span class="topic-number-pill">EJERCICIO ${topic.number} / 10</span>
                <span class="topic-task-pill">${topic.taskGroup}</span>
                <span class="topic-system-tag">${topic.systemType}</span>
              </div>
              <h2 class="topic-title">${topic.title}</h2>
            </div>

            <div class="topic-presenter-badge" title="Expositor Asignado">
              <div class="topic-presenter-avatar" style="border: 1px solid ${presenter?.color || '#7064f2'}; color: ${presenter?.color || '#ffffff'};">
                ${presenter?.avatar || 'UN'}
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 10px; color: var(--color-quiet-slate); text-transform: uppercase;">Expositor:</span>
                <span class="topic-presenter-name">${presenter?.name || 'UNSA Telecom'}</span>
              </div>
            </div>
          </div>

          <!-- Introducción del Ejercicio -->
          <div class="topic-intro-box">
            <p class="topic-intro-text">${topic.description}</p>
            
            <!-- Fórmula Matemática en LaTeX -->
            <div class="latex-formula-container">
              $$ ${topic.mathSummary} $$
            </div>
            ${topic.mathDetail ? `
              <div style="font-size: 13px; text-align: center; color: var(--color-misted-slate); margin-top: -8px; margin-bottom: var(--spacing-16);">
                $$ ${topic.mathDetail} $$
              </div>
            ` : ''}

            <!-- Utilidad en Telecomunicaciones -->
            <div class="telecom-utility-box">
              <i class="fa fa-broadcast-tower telecom-icon"></i>
              <div class="telecom-utility-content">
                <span class="telecom-utility-title">Utilidad en Telecomunicaciones:</span>
                ${topic.telecomApplication}
              </div>
            </div>
          </div>

          <!-- Grid Dual: Código a la Izquierda vs Gráfica a la Derecha -->
          <div class="topic-dual-grid">
            
            <!-- Columna Izquierda: Código Dual MATLAB / Python -->
            <div class="code-window-frame">
              <div class="code-window-header">
                <div class="code-traffic-lights">
                  <span class="traffic-light red"></span>
                  <span class="traffic-light yellow"></span>
                  <span class="traffic-light green"></span>
                </div>

                <div class="code-tabs-switcher">
                  <button class="code-tab-btn active" id="tab-py-${topic.id}" onclick="App.switchTab(${topic.id}, 'python')">
                    <i class="fab fa-python" style="color: #38bdf8;"></i> Python
                  </button>
                  <button class="code-tab-btn" id="tab-mat-${topic.id}" onclick="App.switchTab(${topic.id}, 'matlab')">
                    <i class="fa fa-code" style="color: #fbbf24;"></i> MATLAB
                  </button>
                </div>

                <div class="code-actions-box">
                  <button class="code-copy-btn" onclick="App.copyCode(${topic.id})" title="Copiar código al portapapeles">
                    <i class="fa fa-copy"></i> Copiar
                  </button>
                </div>
              </div>

              <pre class="code-body-pre" id="code-display-${topic.id}"><code class="language-python">${highlightedCode}</code></pre>
            </div>

            <!-- Columna Derecha: Gráfica de Ejecución Pyplot -->
            <div class="graph-window-frame">
              <div class="graph-window-header">
                <span class="graph-window-title">
                  <span class="pyplot-tag"><i class="fa fa-chart-line"></i> Pyplot</span>
                  Ejecución del Código
                </span>
                <span class="graph-status-badge">Tiempo Continuo LTI</span>
              </div>

              <div class="graph-canvas-container">
                <canvas id="canvas-topic-${topic.id}"></canvas>
              </div>
            </div>

          </div>

          <!-- Comentario y Análisis Técnico al pie de la gráfica -->
          <div class="topic-analysis-box">
            <span class="topic-analysis-title">Análisis y Comentario Técnico de la Respuesta</span>
            <ul class="topic-analysis-list">
              ${topic.analysis.map(item => `
                <li class="topic-analysis-item">${item}</li>
              `).join("")}
            </ul>
          </div>

        </article>
      `;
    }).join("");
  },

  // ------------------------------------------------------------------------
  // RENDERIZADO DE CONCLUSIONES POR ESTUDIANTE (PÁGINA 9)
  // ------------------------------------------------------------------------
  renderConclusions() {
    const grid = document.getElementById("conclusions-students-grid");
    if (!grid || !window.LAB_DATA) return;

    grid.innerHTML = LAB_DATA.studentConclusions.map(s => {
      const member = LAB_DATA.teamMembers.find(m => m.id === s.studentId);
      return `
        <div class="conclusion-card">
          <div class="conclusion-header">
            <div class="conclusion-avatar" style="border-color: ${member?.color || '#7064f2'}; color: ${member?.color || '#ffffff'};">
              ${member?.avatar || 'UN'}
            </div>
            <div>
              <div class="conclusion-student-name">${s.name}</div>
              <div class="conclusion-student-topics">${s.topicsCovered}</div>
            </div>
          </div>

          <ol class="conclusion-list">
            ${s.conclusions.map(c => `
              <li class="conclusion-item">${c}</li>
            `).join("")}
          </ol>
        </div>
      `;
    }).join("");

    // Observaciones Generales
    const obsList = document.getElementById("general-observations-list");
    if (obsList && LAB_DATA.generalObservations) {
      obsList.innerHTML = LAB_DATA.generalObservations.map((obs, idx) => `
        <li style="font-size: 13px; line-height: 1.6; color: var(--color-frost-text); padding-left: 20px; position: relative;">
          <span style="position: absolute; left: 0; color: var(--color-signal-violet); font-family: var(--font-mono); font-weight: 700;">${idx + 1}.</span>
          ${obs}
        </li>
      `).join("");
    }
  },

  // ------------------------------------------------------------------------
  // RENDERIZADO DE LA TABLA DE BIBLIOGRAFÍA
  // ------------------------------------------------------------------------
  renderBiblio() {
    const tbody = document.getElementById("biblio-tbody");
    if (!tbody || !window.LAB_DATA) return;

    tbody.innerHTML = LAB_DATA.bibliography.map(b => `
      <tr>
        <td style="font-weight: 600; color: var(--color-cloud-white);">${b.author}</td>
        <td><em>${b.title}</em></td>
        <td>${b.edition}</td>
        <td>${b.publisher}</td>
        <td style="font-family: var(--font-mono); color: var(--color-signal-violet); font-weight: 600;">${b.year}</td>
      </tr>
    `).join("");
  },

  // ------------------------------------------------------------------------
  // SANDBOX LTI EN VIVO
  // ------------------------------------------------------------------------
  renderSandbox() {
    const runBtn = document.getElementById("sandbox-run-btn");
    if (runBtn) {
      runBtn.addEventListener("click", () => this.runSandboxSimulation());
    }
  },

  runSandboxSimulation() {
    const numStr = document.getElementById("sandbox-num")?.value || "10";
    const denStr = document.getElementById("sandbox-den")?.value || "1, 2, 10";
    const simType = document.getElementById("sandbox-sim-type")?.value || "step";

    const num = numStr.split(",").map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const den = denStr.split(",").map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (num.length === 0 || den.length === 0) {
      this.showToast("Ingresa coeficientes numéricos válidos");
      return;
    }

    try {
      const res = LTIEngine.simulateCustomLTI(num, den, 8.0, 300);
      const title = simType === "step" ? "Respuesta al Escalón y(t)" : "Respuesta al Impulso h(t)";
      const plotData = {
        t: res.t,
        data: simType === "step" ? res.stepOut : res.impulseOut
      };

      ChartManager.renderGenericLTI("canvas-sandbox", plotData, title);
    } catch (e) {
      console.error(e);
      this.showToast("Error en el cálculo polinómico");
    }
  },

  // ------------------------------------------------------------------------
  // INICIALIZACIÓN DE TODAS LAS GRÁFICAS DE LOS 10 TEMAS
  // ------------------------------------------------------------------------
  initFirstSimulations() {
    const renderAll = () => {
      LAB_DATA.topics.forEach(t => {
        this.updateSimulation(t.id);
      });
      this.runSandboxSimulation();
    };

    setTimeout(renderAll, 80);
    setTimeout(renderAll, 400);
  },

  updateSimulation(topicId) {
    const canvasId = `canvas-topic-${topicId}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    try {
      switch (topicId) {
        case 1: {
          // Franco: 1. Respuesta al impulso de un sistema LTI
          const r1 = LTIEngine.simulateTopic1(1.0, 2.0, 8.0, 300);
          ChartManager.renderTopic1(canvasId, r1);
          break;
        }
        case 2: {
          // Franco: 2. Función de transferencia de un sistema LTI
          const r2 = LTIEngine.simulateTopic2(-2.5, -1.0, -3.0);
          ChartManager.renderTopic2(canvasId, r2);
          break;
        }
        case 3: {
          // Jeremy: 3. Respuesta al impulso de un sistema
          const r3 = LTIEngine.simulateTopic3(1.0, 1.0, 0.02, 10.0);
          ChartManager.renderTopic3(canvasId, r3);
          break;
        }
        case 4: {
          // Jeremy: 4. Respuesta en frecuencia
          const r4 = LTIEngine.simulateTopic4(3.162, 0.316, 10.0, -1, 2, 250);
          ChartManager.renderTopic4(canvasId, r4);
          break;
        }
        case 5: {
          // Henry: 5. Sistema de primer orden
          const r5 = LTIEngine.simulateTopic5(2.0, 1.0, 10.0, 300);
          ChartManager.renderTopic5(canvasId, r5);
          break;
        }
        case 6: {
          // Alex: 6. Sistema de segundo orden subamortiguado
          const r6 = LTIEngine.simulateTopic6(3.0, 0.5, 6.0, 300);
          ChartManager.renderTopic6(canvasId, r6);
          break;
        }
        case 7: {
          // Alex: 7. Respuesta al escalón unitario de un sistema de segundo orden
          const r7 = LTIEngine.simulateTopic7(3.0, 0.333, 8.0, 350);
          ChartManager.renderTopic7(canvasId, r7);
          break;
        }
        case 8: {
          // Zaul: 8. Sistema de segundo orden sobreamortiguado
          const r8 = LTIEngine.simulateTopic8(4.0, 2.0, 8.0, 300);
          ChartManager.renderTopic8(canvasId, r8);
          break;
        }
        case 9: {
          // Benjamin: 9. Sistema con respuesta impulso
          const r9 = LTIEngine.simulateTopic9(2.828, 0.354, 4.0, 6.0, 350);
          ChartManager.renderTopic9(canvasId, r9);
          break;
        }
        case 10: {
          // Henry: 10. Sistema de primer orden con polo real negativo
          const r10 = LTIEngine.simulateTopic10(3.0, 6.0, 4.0, 300);
          ChartManager.renderTopic10(canvasId, r10);
          break;
        }
      }
    } catch (e) {
      console.error(`Error al simular tema ${topicId}:`, e);
    }
  },

  // ------------------------------------------------------------------------
  // PESTAÑAS DE CÓDIGO (MATLAB vs PYTHON)
  // ------------------------------------------------------------------------
  switchTab(topicId, lang) {
    if (!this.topicStates[topicId]) return;
    this.topicStates[topicId].activeTab = lang;

    const topic = LAB_DATA.topics.find(t => t.id === topicId);
    if (!topic) return;

    const pyTab = document.getElementById(`tab-py-${topicId}`);
    const matTab = document.getElementById(`tab-mat-${topicId}`);
    const codeDisplay = document.getElementById(`code-display-${topicId}`);

    if (pyTab && matTab && codeDisplay) {
      if (lang === "python") {
        pyTab.classList.add("active");
        matTab.classList.remove("active");
        codeDisplay.innerHTML = `<code class="language-python">${window.SyntaxHighlighter ? SyntaxHighlighter.highlightPython(topic.pythonCode) : this.escapeHtml(topic.pythonCode)}</code>`;
      } else {
        matTab.classList.add("active");
        pyTab.classList.remove("active");
        codeDisplay.innerHTML = `<code class="language-matlab">${window.SyntaxHighlighter ? SyntaxHighlighter.highlightMatlab(topic.matlabCode) : this.escapeHtml(topic.matlabCode)}</code>`;
      }
    }
  },

  copyCode(topicId) {
    const topic = LAB_DATA.topics.find(t => t.id === topicId);
    if (!topic) return;
    const lang = this.topicStates[topicId].activeTab;
    const code = lang === "python" ? topic.pythonCode : topic.matlabCode;

    navigator.clipboard.writeText(code).then(() => {
      this.showToast(`Código ${lang.toUpperCase()} copiado al portapapeles`);
    }).catch(() => {
      this.showToast("Error al copiar al portapapeles");
    });
  },

  // ------------------------------------------------------------------------
  // MODO PRESENTACIÓN COMPLETO (15 SLIDES)
  // ------------------------------------------------------------------------
  togglePresentationMode() {
    this.isPresentationMode = !this.isPresentationMode;
    document.body.classList.toggle("presentation-mode", this.isPresentationMode);

    const dock = document.getElementById("presentation-dock");
    if (dock) dock.style.display = this.isPresentationMode ? "flex" : "none";

    const navBtn = document.getElementById("nav-presentation-btn");
    if (navBtn) {
      navBtn.innerHTML = this.isPresentationMode ? 
        `<i class="fa fa-times"></i> Salir de Exposición` : 
        `<i class="fa fa-play"></i> Modo Exposición`;
    }

    if (this.isPresentationMode) {
      this.updateSlideView();
    } else {
      // Restaurar visibilidad normal de todas las diapositivas
      document.querySelectorAll(".deck-slide").forEach(c => {
        c.style.display = "block";
        c.classList.remove("current-deck-slide");
      });
      // Scroll al slide actual
      const activeElem = document.getElementById(this.slideIds[this.currentSlide]);
      if (activeElem) {
        activeElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  },

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
      if (this.isPresentationMode) {
        this.updateSlideView();
      } else {
        const target = document.getElementById(this.slideIds[index]);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  },

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.updateSlideView();
    }
  },

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlideView();
    }
  },

  updateSlideView() {
    // Ocultar todas las slides
    document.querySelectorAll(".deck-slide").forEach(c => {
      c.classList.remove("current-deck-slide");
      c.style.display = "none";
    });

    const activeId = this.slideIds[this.currentSlide];
    const activeElem = document.getElementById(activeId);
    if (activeElem) {
      activeElem.classList.add("current-deck-slide");
      activeElem.style.display = "block";
      window.scrollTo(0, 0);
    }

    // Actualizar barra de progreso
    const progressBar = document.getElementById("presentation-progress-bar");
    if (progressBar) {
      const pct = (this.currentSlide / (this.totalSlides - 1)) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // Actualizar datos del Dock
    const slideNumElem = document.getElementById("dock-slide-num");
    const slideTitleElem = document.getElementById("dock-slide-title");
    const prevBtn = document.getElementById("dock-prev-btn");
    const nextBtn = document.getElementById("dock-next-btn");

    if (prevBtn) prevBtn.disabled = (this.currentSlide === 0);
    if (nextBtn) nextBtn.disabled = (this.currentSlide === this.totalSlides - 1);

    const slideNumStr = (this.currentSlide + 1) < 10 ? `0${this.currentSlide + 1}` : `${this.currentSlide + 1}`;
    if (slideNumElem) slideNumElem.textContent = `SLIDE ${slideNumStr} / ${this.totalSlides}`;

    let titleText = "Presentación";
    if (this.currentSlide === 0) titleText = "Portada Oficial UNSA";
    else if (this.currentSlide === 1) titleText = "Fundamentos de Sistemas LTI";
    else if (this.currentSlide >= 2 && this.currentSlide <= 11) {
      const topicId = this.currentSlide - 1;
      const topic = LAB_DATA.topics.find(t => t.id === topicId);
      const presenter = LAB_DATA.teamMembers.find(m => m.id === topic?.presenterId);
      titleText = `TEMA ${topic?.number}: ${presenter?.shortName || ''}`;
      // Re-renderizar simulación inmediatamente para ajustar dimensiones del canvas visible
      setTimeout(() => this.updateSimulation(topicId), 40);
    } else if (this.currentSlide === 12) {
      titleText = "Playground / Sandbox LTI";
      setTimeout(() => this.runSandboxSimulation(), 40);
    } else if (this.currentSlide === 13) {
      titleText = "Conclusiones Individuales";
    } else if (this.currentSlide === 14) {
      titleText = "Referencias Bibliográficas";
    }

    if (slideTitleElem) slideTitleElem.textContent = titleText;

    // Actualizar URL hash sin recargar
    window.history.replaceState(null, null, `#${activeId}`);
  },

  jumpToStudentTopics(studentId) {
    const member = LAB_DATA.teamMembers.find(m => m.id === studentId);
    if (!member || member.topics.length === 0) return;
    const firstTopicId = member.topics[0];
    const targetSlide = firstTopicId + 1; // Slide 2 a 11
    this.goToSlide(targetSlide);
    if (!this.isPresentationMode) {
      this.togglePresentationMode();
    }
    this.showToast(`Presentando temas de ${member.name}`);
  },

  filterByPresenter(presenterId) {
    this.jumpToStudentTopics(presenterId);
  },

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Fullscreen no disponible: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  },

  // ------------------------------------------------------------------------
  // EVENT LISTENERS & SHORTCUTS
  // ------------------------------------------------------------------------
  bindEvents() {
    window.addEventListener("keydown", (e) => {
      // Atajo global para alternar presentación (P)
      if ((e.key === "p" || e.key === "P") && e.target.tagName !== "INPUT") {
        e.preventDefault();
        this.togglePresentationMode();
        return;
      }

      // Atajo global para alternar tema claro / oscuro (T)
      if ((e.key === "t" || e.key === "T") && e.target.tagName !== "INPUT") {
        e.preventDefault();
        this.toggleTheme();
        return;
      }

      if (!this.isPresentationMode) return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === "Escape") {
        this.togglePresentationMode();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        this.toggleFullScreen();
      } else if (e.key === "Home") {
        e.preventDefault();
        this.goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
      }
    });

    // Resize listener para redibujar gráficas responsive
    window.addEventListener("resize", () => {
      if (this.isPresentationMode && this.currentSlide >= 2 && this.currentSlide <= 11) {
        this.updateSimulation(this.currentSlide - 1);
      }
    });

    // Botones de Tema
    document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
      this.toggleTheme();
    });

    document.getElementById("dock-theme-btn")?.addEventListener("click", () => {
      this.toggleTheme();
    });

    document.getElementById("nav-presentation-btn")?.addEventListener("click", () => {
      this.togglePresentationMode();
    });

    document.getElementById("dock-next-btn")?.addEventListener("click", () => {
      this.nextSlide();
    });

    document.getElementById("dock-prev-btn")?.addEventListener("click", () => {
      this.prevSlide();
    });

    document.getElementById("dock-exit-btn")?.addEventListener("click", () => {
      this.togglePresentationMode();
    });

    document.getElementById("dock-fs-btn")?.addEventListener("click", () => {
      this.toggleFullScreen();
    });
  },

  initKaTeX() {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn("KaTeX renderMathInElement:", e);
      }
    }
  },

  showToast(message) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-notification";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  },

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

window.App = App;
