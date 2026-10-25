/**
 * charts.js
 * Capa de renderizado visual de gráficas científicas tipo Pyplot / MATLAB.
 * Estilo Featurebase Dark Stage (#050608 / #080a0f / #1f1e2a / #7064f2).
 * Compatible con Chart.js y con fallback 2D Canvas nativo ultrarrobusto.
 */

const ChartManager = {
  activeCharts: {},

  getThemeColors() {
    return {
      bg: "#080a0f",
      grid: "#1f1e2a",
      textPrimary: "#ffffff",
      textSecondary: "#b2b8cd",
      linePrimary: "#7064f2",
      lineSecondary: "#02e5ef",
      accent: "#7064f2",
      red: "#f43f5e",
      blue: "#38bdf8",
      green: "#10b981",
      amber: "#fbbf24",
      purple: "#a855f7",
      tooltipBg: "rgba(15, 18, 25, 0.96)",
      tooltipBorder: "#1f1e2a"
    };
  },

  getBaseOptions(titleText = "", xLabel = "Tiempo (s)", yLabel = "Amplitud") {
    const c = this.getThemeColors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 250,
        easing: "easeOutQuad"
      },
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: c.textPrimary,
            font: { family: "'Inter', sans-serif", size: 12, weight: 600 },
            usePointStyle: true,
            boxWidth: 8
          }
        },
        tooltip: {
          backgroundColor: c.tooltipBg,
          titleColor: c.textPrimary,
          bodyColor: c.textSecondary,
          borderColor: c.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", weight: 600 },
          bodyFont: { family: "'Inter', sans-serif" }
        }
      },
      scales: {
        x: {
          grid: { color: c.grid, drawBorder: false },
          ticks: { color: c.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
          title: { display: true, text: xLabel, color: c.textPrimary, font: { size: 12, weight: 600 } }
        },
        y: {
          grid: { color: c.grid, drawBorder: false },
          ticks: { color: c.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
          title: { display: true, text: yLabel, color: c.textPrimary, font: { size: 12, weight: 600 } }
        }
      }
    };
  },

  destroyChart(canvasId) {
    if (this.activeCharts[canvasId]) {
      try {
        this.activeCharts[canvasId].destroy();
      } catch (e) {}
      delete this.activeCharts[canvasId];
    }
  },

  // ------------------------------------------------------------------------
  // TEMA 1: Respuesta al Impulso Sistema LTI (Franco)
  // ------------------------------------------------------------------------
  renderTopic1(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const c = this.getThemeColors();
    const dataPoints = result.data || result.h || [];
    const labels = Array.from(result.t).map(v => v.toFixed(2));

    const ctx = canvas.getContext("2d");
    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "h(t) — Respuesta al Impulso",
          data: Array.from(dataPoints),
          borderColor: c.linePrimary,
          backgroundColor: "rgba(112, 100, 242, 0.15)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.2,
          pointRadius: 0
        }]
      },
      options: this.getBaseOptions("Respuesta al Impulso h(t)", "Tiempo t (s)", "Amplitud h(t)")
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 2: Función de Transferencia y Mapa de Polos y Ceros (Franco)
  // ------------------------------------------------------------------------
  renderTopic2(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const width = canvas.width = canvas.parentElement.clientWidth || 500;
    const height = canvas.height = canvas.parentElement.clientHeight || 320;

    const xMin = -7, xMax = 2;
    const yMin = -4, yMax = 4;

    const toScreenX = (x) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;

    // Fondo
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, width, height);

    // Semiplano izquierdo (Región de convergencia BIBO)
    ctx.fillStyle = "rgba(112, 100, 242, 0.08)";
    ctx.fillRect(0, 0, toScreenX(0), height);

    // Cuadrícula tipo Pyplot
    ctx.strokeStyle = c.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const sx = toScreenX(x);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const sy = toScreenY(y);
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
    }
    ctx.stroke();

    // Ejes principales
    ctx.strokeStyle = c.textPrimary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(width, toScreenY(0));
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), height);
    ctx.stroke();

    // Etiquetas de ejes
    ctx.fillStyle = c.textSecondary;
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText("Parte Real (σ)", width - 85, toScreenY(0) - 8);
    ctx.fillText("Parte Imaginaria (jω)", toScreenX(0) + 10, 18);
    ctx.fillText("Semiplano Estable (Re < 0)", 15, 25);

    // Normalizar ceros
    const zeros = (result.zeros || []).map(z => typeof z === "number" ? { re: z, im: 0 } : z);
    zeros.forEach(z => {
      const sx = toScreenX(z.re);
      const sy = toScreenY(z.im);
      ctx.strokeStyle = c.blue;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = c.textPrimary;
      ctx.font = "bold 11px 'Inter', sans-serif";
      ctx.fillText(`Cero: ${z.re.toFixed(2)}`, sx - 30, sy - 14);
    });

    // Normalizar polos
    const poles = (result.poles || []).map(p => typeof p === "number" ? { re: p, im: 0 } : p);
    poles.forEach((p, idx) => {
      const sx = toScreenX(p.re);
      const sy = toScreenY(p.im);
      const size = 9;

      ctx.strokeStyle = c.red;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(sx - size, sy - size);
      ctx.lineTo(sx + size, sy + size);
      ctx.moveTo(sx + size, sy - size);
      ctx.lineTo(sx - size, sy + size);
      ctx.stroke();

      ctx.fillStyle = c.textPrimary;
      ctx.font = "bold 11px 'Inter', sans-serif";
      ctx.fillText(`Polo ${idx + 1}: ${p.re.toFixed(2)}`, sx - 35, sy + 22);
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 3: Respuesta al Impulso de un Sistema (Jeremy)
  // Analítica vs Convolución Numérica
  // ------------------------------------------------------------------------
  renderTopic3(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const stride = Math.max(1, Math.floor(result.t.length / 200));
    const labels = [];
    const dataAnalytical = [];
    const dataNumerical = [];

    for (let i = 0; i < result.t.length; i += stride) {
      labels.push(result.t[i].toFixed(2));
      dataAnalytical.push(result.hAnalytical[i]);
      dataNumerical.push(result.hNumerical[i]);
    }

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Solución Analítica (SciPy / MATLAB)",
            data: dataAnalytical,
            borderColor: c.linePrimary,
            borderWidth: 2.5,
            pointRadius: 0
          },
          {
            label: "Convolución Numérica Discreta (lsim)",
            data: dataNumerical,
            borderColor: c.green,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: this.getBaseOptions("Analítica vs Convolución Numérica", "Tiempo t (s)", "Amplitud y(t)")
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 4: Respuesta en Frecuencia (Jeremy) - Diagrama de Bode Dual Axis
  // ------------------------------------------------------------------------
  renderTopic4(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.w).map(w => w < 10 ? w.toFixed(2) : w.toFixed(1));
    const magData = Array.from(result.magDb);
    const phaseData = Array.from(result.phaseDeg);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Magnitud |H(jω)| (dB)",
            data: magData,
            borderColor: c.linePrimary,
            backgroundColor: "rgba(112, 100, 242, 0.12)",
            borderWidth: 2.5,
            fill: true,
            yAxisID: "y",
            pointRadius: 0
          },
          {
            label: "Fase ∠H(jω) (grados)",
            data: phaseData,
            borderColor: c.blue,
            borderWidth: 2,
            borderDash: [4, 4],
            yAxisID: "y1",
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: { color: c.textPrimary, usePointStyle: true }
          }
        },
        scales: {
          x: {
            grid: { color: c.grid },
            ticks: { color: c.textSecondary, maxTicksLimit: 10 },
            title: { display: true, text: "Frecuencia Angular ω (rad/s)", color: c.textPrimary }
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            grid: { color: c.grid },
            ticks: { color: c.linePrimary },
            title: { display: true, text: "Magnitud (dB)", color: c.linePrimary }
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: { drawOnChartArea: false },
            ticks: { color: c.blue },
            title: { display: true, text: "Fase (°)", color: c.blue }
          }
        }
      }
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 5: Sistema de Primer Orden (Henry)
  // ------------------------------------------------------------------------
  renderTopic5(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.t).map(v => v.toFixed(2));
    const data = Array.from(result.y);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "y(t) — Respuesta al Escalón (τ = 2s)",
          data: data,
          borderColor: c.purple,
          backgroundColor: "rgba(168, 85, 247, 0.15)",
          borderWidth: 2.5,
          fill: true,
          pointRadius: 0
        }]
      },
      options: this.getBaseOptions("Respuesta al Escalón - 1er Orden (τ = 2s)", "Tiempo t (s)", "Salida y(t)")
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 6: Sistema de Segundo Orden Subamortiguado (Alex)
  // ------------------------------------------------------------------------
  renderTopic6(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.t).map(v => v.toFixed(2));
    const data = Array.from(result.y);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: `Salida y(t) — Subamortiguado (ζ = 0.5)`,
          data: data,
          borderColor: c.blue,
          backgroundColor: "rgba(56, 189, 248, 0.15)",
          borderWidth: 2.5,
          fill: true,
          pointRadius: 0
        }]
      },
      options: this.getBaseOptions("Sistema de Segundo Orden Subamortiguado", "Tiempo t (s)", "Salida y(t)")
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 7: Respuesta al Escalón Unitario de un Sistema de 2do Orden (Alex)
  // ------------------------------------------------------------------------
  renderTopic7(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.t).map(v => v.toFixed(2));
    const data = Array.from(result.y);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Salida y(t) con Sobreimpulso (ζ = 0.333)",
            data: data,
            borderColor: c.red,
            backgroundColor: "rgba(244, 63, 94, 0.15)",
            borderWidth: 2.5,
            fill: true,
            pointRadius: 0
          },
          {
            label: "Referencia Escalón (1.0)",
            data: labels.map(() => 1.0),
            borderColor: c.textSecondary,
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0
          }
        ]
      },
      options: this.getBaseOptions("Respuesta al Escalón - 2do Orden (Sobreimpulso)", "Tiempo t (s)", "Salida y(t)")
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 8: Sistema de Segundo Orden Sobreamortiguado (Zaul)
  // ------------------------------------------------------------------------
  renderTopic8(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.t).map(v => v.toFixed(2));
    const data = Array.from(result.y);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Salida y(t) Sobreamortiguada (ζ = 2.0, Polo Dominante)",
          data: data,
          borderColor: c.green,
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          borderWidth: 2.5,
          fill: true,
          pointRadius: 0
        }]
      },
      options: this.getBaseOptions("Sistema Sobreamortiguado (ζ = 2.0)", "Tiempo t (s)", "Amplitud")
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 9: Sistema con Respuesta Impulso (Benjamin)
  // ------------------------------------------------------------------------
  renderTopic9(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.t).map(v => v.toFixed(2));
    const dataH = Array.from(result.h);
    const dataUpper = Array.from(result.envUpper);
    const dataLower = Array.from(result.envLower);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "h(t) — Oscilación Amortiguada",
            data: dataH,
            borderColor: "#d946ef",
            borderWidth: 2.5,
            pointRadius: 0
          },
          {
            label: "+ Envolvente e^(-σt)",
            data: dataUpper,
            borderColor: c.textSecondary,
            borderWidth: 1.2,
            borderDash: [4, 4],
            pointRadius: 0
          },
          {
            label: "- Envolvente e^(-σt)",
            data: dataLower,
            borderColor: c.textSecondary,
            borderWidth: 1.2,
            borderDash: [4, 4],
            pointRadius: 0
          }
        ]
      },
      options: this.getBaseOptions("Sistema con Respuesta al Impulso h(t)", "Tiempo t (s)", "Respuesta h(t)")
    });
  },

  // ------------------------------------------------------------------------
  // TEMA 10: Sistema de Primer Orden con Polo Real Negativo (Henry)
  // ------------------------------------------------------------------------
  renderTopic10(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.t).map(v => v.toFixed(2));
    const stepData = Array.from(result.yStep);
    const impData = Array.from(result.hImp);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "y(t) — Respuesta al Escalón (Asintótica a 2.0)",
            data: stepData,
            borderColor: c.red,
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            borderWidth: 2.5,
            fill: true,
            pointRadius: 0
          },
          {
            label: "h(t) — Respuesta al Impulso (Decaimiento e^(-3t))",
            data: impData,
            borderColor: c.blue,
            borderWidth: 2.5,
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: this.getBaseOptions("Respuesta al Escalón vs Impulso (Polo en s = -3)", "Tiempo t (s)", "Amplitud")
    });
  },

  // ------------------------------------------------------------------------
  // SIMULADOR LIBRE (SANDBOX LTI)
  // ------------------------------------------------------------------------
  renderGenericLTI(canvasId, result, titleText = "Respuesta Temporal LTI") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !result) return;
    this.destroyChart(canvasId);

    const ctx = canvas.getContext("2d");
    const c = this.getThemeColors();
    const labels = Array.from(result.t).map(v => v.toFixed(2));
    const data = Array.from(result.data || result.stepOut || result.impulseOut || []);

    this.activeCharts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: titleText,
          data: data,
          borderColor: c.linePrimary,
          backgroundColor: "rgba(112, 100, 242, 0.18)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.15,
          pointRadius: 0
        }]
      },
      options: this.getBaseOptions(titleText, "Tiempo t (s)", "Amplitud")
    });
  }
};

if (typeof window !== "undefined") {
  window.ChartManager = ChartManager;
}
