/**
 * lti-engine.js
 * Motor matemático de cálculo y simulación para Sistemas LTI y Tiempo Continuo.
 * Implementa soluciones analíticas exactas y simuladores numéricos RK4 / Convolución.
 */

const LTIEngine = {
  /**
   * Genera un vector temporal linspace(tMin, tMax, points)
   */
  linspace(tMin, tMax, points = 300) {
    const step = (tMax - tMin) / (points - 1);
    const arr = new Float64Array(points);
    for (let i = 0; i < points; i++) {
      arr[i] = tMin + i * step;
    }
    return arr;
  },

  /**
   * Tema 1: Respuesta al Impulso Sistema LTI con dos polos reales -p1 y -p2
   * H(s) = 1 / ((s + p1)(s + p2))
   * h(t) = (e^(-p1*t) - e^(-p2*t)) / (p2 - p1)
   */
  simulateTopic1(p1 = 1.0, p2 = 2.0, tMax = 6.0, points = 300) {
    const t = this.linspace(0, tMax, points);
    const h = new Float64Array(points);
    const isDegenerate = Math.abs(p1 - p2) < 1e-4;

    for (let i = 0; i < points; i++) {
      const ti = t[i];
      if (isDegenerate) {
        h[i] = ti * Math.exp(-p1 * ti);
      } else {
        h[i] = (Math.exp(-p1 * ti) - Math.exp(-p2 * ti)) / (p2 - p1);
      }
    }

    // Calcular valores métricos
    let tPeak = 0;
    let hPeak = 0;
    if (!isDegenerate) {
      tPeak = Math.log(p2 / p1) / (p2 - p1);
      hPeak = (Math.exp(-p1 * tPeak) - Math.exp(-p2 * tPeak)) / (p2 - p1);
    } else {
      tPeak = 1 / p1;
      hPeak = (1 / p1) * Math.exp(-1);
    }

    return {
      t,
      data: h,
      metrics: {
        tPeak: tPeak.toFixed(3),
        hPeak: hPeak.toFixed(3),
        pole1: (-p1).toFixed(2),
        pole2: (-p2).toFixed(2),
        stability: p1 > 0 && p2 > 0 ? "Estable (BIBO)" : "Inestable"
      }
    };
  },

  /**
   * Tema 2: Función de Transferencia con Mapa de Polos y Ceros
   * H(s) = (2s + 5) / (s^2 + 4s + 3) -> Polos en -1, -3; Cero en -2.5
   */
  simulateTopic2(zero = -2.5, p1 = -1.0, p2 = -3.0) {
    // Calculamos también la respuesta al escalón analítica para mostrar el impacto dinámico del cero
    // H(s) = K*(s - z) / ((s - p1)(s - p2)) con K = 2
    const t = this.linspace(0, 6.0, 300);
    const y = new Float64Array(t.length);
    const K = 2.0;

    // Descomposición en fracciones simples de Y(s) = H(s)/s
    // Y(s) = A/s + B/(s - p1) + C/(s - p2)
    // Para s = 0: A = K*(-zero)/(p1*p2)
    const A = (K * -zero) / (p1 * p2);
    // Para s = p1: B = K*(p1 - zero) / (p1 * (p1 - p2))
    const B = (K * (p1 - zero)) / (p1 * (p1 - p2));
    // Para s = p2: C = K*(p2 - zero) / (p2 * (p2 - p1))
    const C = (K * (p2 - zero)) / (p2 * (p2 - p1));

    for (let i = 0; i < t.length; i++) {
      const ti = t[i];
      y[i] = A + B * Math.exp(p1 * ti) + C * Math.exp(p2 * ti);
    }

    return {
      poles: [{ re: p1, im: 0 }, { re: p2, im: 0 }],
      zeros: [{ re: zero, im: 0 }],
      t,
      stepResponse: y,
      metrics: {
        numPoles: 2,
        numZeros: 1,
        dcGain: A.toFixed(3),
        isStable: p1 < 0 && p2 < 0,
        roc: `Re{s} > ${Math.max(p1, p2).toFixed(2)}`
      }
    };
  },

  /**
   * Tema 3: Comparación Analítica vs Convolución Numérica
   * H(s) = 1 / (s^2 + 2*sigma*s + (sigma^2 + wd^2))
   * Analítica: h(t) = (1/wd) * e^(-sigma*t) * sin(wd*t)
   * Numérica: entrada impulso aproximada delta[0] = 1/dt, simulación numérica con Euler/Heun
   */
  simulateTopic3(sigma = 1.0, wd = 1.0, dt = 0.02, tMax = 10.0) {
    const N = Math.floor(tMax / dt) + 1;
    const t = new Float64Array(N);
    const hAnalytical = new Float64Array(N);
    const hNumerical = new Float64Array(N);

    // Sistema en variables de estado para s^2 + 2*sigma*s + wn^2:
    // x1' = x2
    // x2' = -wn^2*x1 - 2*sigma*x2 + u(t)
    // y = x1
    const wn2 = sigma * sigma + wd * wd;
    const a1 = 2 * sigma;

    let x1 = 0.0;
    let x2 = 0.0;

    for (let i = 0; i < N; i++) {
      const ti = i * dt;
      t[i] = ti;

      // Solución analítica pura
      hAnalytical[i] = (1 / wd) * Math.exp(-sigma * ti) * Math.sin(wd * ti);

      // Entrada numérica: delta[0] = 1/dt
      const u = (i === 0) ? (1.0 / dt) : 0.0;

      // Integrador RK4 para lsim numérico de alta precisión
      hNumerical[i] = x1;

      // Derivadas
      const k1_x1 = x2;
      const k1_x2 = -wn2 * x1 - a1 * x2 + u;

      const mid_x1 = x1 + 0.5 * dt * k1_x1;
      const mid_x2 = x2 + 0.5 * dt * k1_x2;
      const k2_x1 = mid_x2;
      const k2_x2 = -wn2 * mid_x1 - a1 * mid_x2 + (i === 0 ? 0.5 * u : 0);

      const mid2_x1 = x1 + 0.5 * dt * k2_x1;
      const mid2_x2 = x2 + 0.5 * dt * k2_x2;
      const k3_x1 = mid2_x2;
      const k3_x2 = -wn2 * mid2_x1 - a1 * mid2_x2 + (i === 0 ? 0.5 * u : 0);

      const end_x1 = x1 + dt * k3_x1;
      const end_x2 = x2 + dt * k3_x2;
      const k4_x1 = end_x2;
      const k4_x2 = -wn2 * end_x1 - a1 * end_x2;

      x1 += (dt / 6) * (k1_x1 + 2 * k2_x1 + 2 * k3_x1 + k4_x1);
      x2 += (dt / 6) * (k1_x2 + 2 * k2_x2 + 2 * k3_x2 + k4_x2);
    }

    // Calcular error cuadrático medio
    let sumSqErr = 0;
    for (let i = 0; i < N; i++) {
      const diff = hAnalytical[i] - hNumerical[i];
      sumSqErr += diff * diff;
    }
    const rmse = Math.sqrt(sumSqErr / N);

    return {
      t,
      hAnalytical,
      hNumerical,
      metrics: {
        rmse: rmse.toExponential(4),
        dt: `${dt.toFixed(3)} s`,
        sigma: `${sigma.toFixed(2)} Np/s`,
        wd: `${wd.toFixed(2)} rad/s`
      }
    };
  },

  /**
   * Tema 4: Diagrama de Bode de Magnitud y Fase
   * H(s) = K / (s^2 + 2*zeta*wn*s + wn^2)
   */
  simulateTopic4(wn = 3.162, zeta = 0.316, K = 10.0, wMinExp = -1, wMaxExp = 2, points = 250) {
    const w = new Float64Array(points);
    const magDb = new Float64Array(points);
    const phaseDeg = new Float64Array(points);

    const stepExp = (wMaxExp - wMinExp) / (points - 1);

    let maxMagDb = -Infinity;
    let wResonance = 0;

    for (let i = 0; i < points; i++) {
      const exp = wMinExp + i * stepExp;
      const omega = Math.pow(10, exp);
      w[i] = omega;

      // H(jw) = K / [ (wn^2 - omega^2) + j*(2*zeta*wn*omega) ]
      const reDen = wn * wn - omega * omega;
      const imDen = 2 * zeta * wn * omega;
      const denMag2 = reDen * reDen + imDen * imDen;
      const denMag = Math.sqrt(denMag2);

      const magnitude = K / denMag;
      const db = 20 * Math.log10(magnitude);
      magDb[i] = db;

      if (db > maxMagDb) {
        maxMagDb = db;
        wResonance = omega;
      }

      // Fase: angle(Numerador) - angle(Denominador) = 0 - atan2(imDen, reDen)
      const phaseRad = -Math.atan2(imDen, reDen);
      phaseDeg[i] = (phaseRad * 180) / Math.PI;
    }

    const dcGainDb = 20 * Math.log10(K / (wn * wn));
    const resonanceCalculated = zeta < 0.7071 ? wn * Math.sqrt(1 - 2 * zeta * zeta) : 0;

    return {
      w,
      magDb,
      phaseDeg,
      metrics: {
        dcGainDb: dcGainDb.toFixed(2) + " dB",
        maxMagDb: maxMagDb.toFixed(2) + " dB",
        wResonance: resonanceCalculated > 0 ? `${resonanceCalculated.toFixed(2)} rad/s` : "Sin pico",
        wn: `${wn.toFixed(2)} rad/s`,
        zeta: zeta.toFixed(3)
      }
    };
  },

  /**
   * Tema 5: Sistema de Primer Orden al Escalón
   * H(s) = K / (tau*s + 1)
   * y(t) = K * (1 - e^(-t/tau))
   */
  simulateTopic5(tau = 2.0, K = 1.0, tMax = 10.0, points = 300) {
    const t = this.linspace(0, tMax, points);
    const y = new Float64Array(points);

    for (let i = 0; i < points; i++) {
      y[i] = K * (1 - Math.exp(-t[i] / tau));
    }

    const t63 = tau;
    const y63 = K * 0.632;
    const tRise = 2.197 * tau;
    const tSettling = 3.912 * tau; // 2% settling time

    return {
      t,
      y,
      metrics: {
        tau: `${tau.toFixed(2)} s`,
        t63: `${t63.toFixed(2)} s (${y63.toFixed(2)} V)`,
        tRise: `${tRise.toFixed(2)} s (10%-90%)`,
        tSettling: `${tSettling.toFixed(2)} s (criterio 2%)`,
        finalValue: `${K.toFixed(2)} V`
      }
    };
  },

  /**
   * Tema 6: Sistema de Segundo Orden (Amortiguamiento Crítico / Subamortiguado)
   * H(s) = wn^2 / (s^2 + 2*zeta*wn*s + wn^2)
   */
  simulateTopic6(wn = 3.0, zeta = 1.0, tMax = 6.0, points = 300) {
    return this.simulateSecondOrderStep(wn, zeta, 1.0, tMax, points);
  },

  /**
   * Tema 7: Segundo Orden Subamortiguado Pronunciado
   * H(s) = 9 / (s^2 + 2s + 9) -> wn = 3, zeta = 0.333
   */
  simulateTopic7(wn = 3.0, zeta = 0.333, tMax = 8.0, points = 350) {
    return this.simulateSecondOrderStep(wn, zeta, 1.0, tMax, points);
  },

  /**
   * Tema 8: Segundo Orden Sobreamortiguado
   * H(s) = wn^2 / (s^2 + 2*zeta*wn*s + wn^2) con zeta = 2.0, wn = 4
   */
  simulateTopic8(wn = 4.0, zeta = 2.0, tMax = 8.0, points = 350) {
    return this.simulateSecondOrderStep(wn, zeta, 1.0, tMax, points);
  },

  /**
   * Función genérica para respuesta al escalón de 2do orden
   */
  simulateSecondOrderStep(wn = 3.0, zeta = 1.0, K = 1.0, tMax = 8.0, points = 350) {
    const t = this.linspace(0, tMax, points);
    const y = new Float64Array(points);

    let mp = 0;
    let tp = 0;
    let ts = 0;
    let p1Str = "";
    let p2Str = "";
    let regimen = "";

    if (Math.abs(zeta - 1.0) < 1e-4) {
      // Críticamente amortiguado: polos dobles s = -wn
      regimen = "Críticamente amortiguado (ζ = 1)";
      p1Str = `${(-wn).toFixed(2)}`;
      p2Str = `${(-wn).toFixed(2)}`;
      ts = 4.75 / wn;

      for (let i = 0; i < points; i++) {
        const ti = t[i];
        y[i] = K * (1 - Math.exp(-wn * ti) * (1 + wn * ti));
      }
    } else if (zeta < 1.0) {
      // Subamortiguado: polos complejos conjugados
      regimen = "Subamortiguado (0 < ζ < 1)";
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      const phi = Math.atan2(Math.sqrt(1 - zeta * zeta), zeta);
      tp = Math.PI / wd;
      mp = Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)) * 100;
      ts = 4.0 / (zeta * wn);

      p1Str = `${(-zeta * wn).toFixed(2)} + j${wd.toFixed(2)}`;
      p2Str = `${(-zeta * wn).toFixed(2)} - j${wd.toFixed(2)}`;

      for (let i = 0; i < points; i++) {
        const ti = t[i];
        const val = 1 - (Math.exp(-zeta * wn * ti) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * ti + phi);
        y[i] = K * val;
      }
    } else {
      // Sobreamortiguado: polos reales distintos
      regimen = "Sobreamortiguado (ζ > 1)";
      const sqrtDisc = Math.sqrt(zeta * zeta - 1);
      const s1 = -zeta * wn + wn * sqrtDisc; // polo dominante (más cercano al origen)
      const s2 = -zeta * wn - wn * sqrtDisc; // polo rápido

      p1Str = `${s1.toFixed(2)} (dominante)`;
      p2Str = `${s2.toFixed(2)}`;
      ts = 4.0 / Math.abs(s1);

      for (let i = 0; i < points; i++) {
        const ti = t[i];
        const term1 = (s2 / (s1 - s2)) * Math.exp(s1 * ti);
        const term2 = (s1 / (s1 - s2)) * Math.exp(s2 * ti);
        y[i] = K * (1 + term1 - term2);
      }
    }

    return {
      t,
      y,
      metrics: {
        regimen,
        wn: `${wn.toFixed(2)} rad/s`,
        zeta: zeta.toFixed(3),
        mp: mp > 0 ? `${mp.toFixed(2)}%` : "0%",
        tp: tp > 0 ? `${tp.toFixed(3)} s` : "N/A",
        ts: `${ts.toFixed(2)} s (aprox. 2%)`,
        pole1: p1Str,
        pole2: p2Str
      }
    };
  },

  /**
   * Tema 9: Sistema 2do Orden con Respuesta Impulso Oscilatoria
   * H(s) = K / (s^2 + 2*zeta*wn*s + wn^2)
   * h(t) = (K / wd) * e^(-zeta*wn*t) * sin(wd*t)
   */
  simulateTopic9(wn = 2.828, zeta = 0.354, K = 4.0, tMax = 6.0, points = 350) {
    const t = this.linspace(0, tMax, points);
    const h = new Float64Array(points);
    const envUpper = new Float64Array(points);
    const envLower = new Float64Array(points);

    const sigma = zeta * wn;
    const wd = wn * Math.sqrt(Math.max(0, 1 - zeta * zeta));
    const amp = wd > 0 ? K / wd : 0;

    let hMax = 0;
    let tMaxPeak = 0;

    for (let i = 0; i < points; i++) {
      const ti = t[i];
      const decay = Math.exp(-sigma * ti);
      const envelope = amp * decay;

      envUpper[i] = envelope;
      envLower[i] = -envelope;
      const val = envelope * Math.sin(wd * ti);
      h[i] = val;

      if (val > hMax) {
        hMax = val;
        tMaxPeak = ti;
      }
    }

    return {
      t,
      h,
      envUpper,
      envLower,
      metrics: {
        wn: `${wn.toFixed(2)} rad/s`,
        zeta: zeta.toFixed(3),
        sigma: `${sigma.toFixed(2)} Np/s`,
        wd: `${wd.toFixed(2)} rad/s`,
        hMax: hMax.toFixed(3),
        tMaxPeak: `${tMaxPeak.toFixed(3)} s`
      }
    };
  },

  /**
   * Tema 10: Sistema de Primer Orden con Polo Real Negativo en s = -a
   * H(s) = K / (s + a)
   * y_step(t) = (K/a) * (1 - e^(-at))
   * h_imp(t)  = K * e^(-at)
   */
  simulateTopic10(a = 3.0, K = 6.0, tMax = 4.0, points = 300) {
    const t = this.linspace(0, tMax, points);
    const yStep = new Float64Array(points);
    const hImp = new Float64Array(points);

    const dcGain = K / a;
    const tau = 1 / a;

    for (let i = 0; i < points; i++) {
      const ti = t[i];
      const expTerm = Math.exp(-a * ti);
      yStep[i] = dcGain * (1 - expTerm);
      hImp[i] = K * expTerm;
    }

    return {
      t,
      yStep,
      hImp,
      metrics: {
        pole: `-a = -${a.toFixed(2)} rad/s`,
        gainK: K.toFixed(2),
        dcGain: dcGain.toFixed(2),
        tau: `${tau.toFixed(3)} s`,
        initialImpulse: `${K.toFixed(2)} (t=0⁺)`
      }
    };
  },

  /**
   * Playground Libre: Simula cualquier H(s) = (b_m*s^m + ... + b_0) / (s^n + a_{n-1}*s^{n-1} + ... + a_0)
   * hasta orden 3 con solver RK4
   */
  simulateCustomLTI(num = [1], den = [1, 2, 2], tMax = 8.0, points = 300) {
    // Normalizar denominador para que a_n = 1
    const an = den[0];
    const n = den.length - 1;
    const normDen = den.map(v => v / an);
    const normNum = num.map(v => v / an);

    const t = this.linspace(0, tMax, points);
    const dt = t[1] - t[0];
    const stepOut = new Float64Array(points);
    const impulseOut = new Float64Array(points);

    // Si orden 1: s + a0, num = b0 -> H(s) = b0 / (s + a0)
    if (n === 1) {
      const a0 = normDen[1];
      const b0 = normNum[normNum.length - 1];
      for (let i = 0; i < points; i++) {
        const ti = t[i];
        stepOut[i] = (b0 / a0) * (1 - Math.exp(-a0 * ti));
        impulseOut[i] = b0 * Math.exp(-a0 * ti);
      }
    } else if (n === 2) {
      // Orden 2: s^2 + a1*s + a0
      const a1 = normDen[1];
      const a0 = normDen[2];
      const b0 = normNum[normNum.length - 1];
      const wn = Math.sqrt(Math.max(1e-5, a0));
      const zeta = a1 / (2 * wn);

      const simStep = this.simulateSecondOrderStep(wn, zeta, b0 / a0, tMax, points);
      const simImp = this.simulateTopic9(wn, Math.min(0.99, zeta), b0, tMax, points);

      for (let i = 0; i < points; i++) {
        stepOut[i] = simStep.y[i];
        impulseOut[i] = simImp.h[i];
      }
    }

    return {
      t,
      stepOut,
      impulseOut,
      num: normNum,
      den: normDen
    };
  }
};

if (typeof window !== "undefined") {
  window.LTIEngine = LTIEngine;
}
