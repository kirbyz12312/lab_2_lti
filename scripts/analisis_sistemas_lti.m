% =========================================================================
% SCRIPT UNIFICADO: Análisis de Sistemas Lineales en MATLAB
% UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA (UNSA)
% ESCUELA PROFESIONAL DE INGENIERÍA DE TELECOMUNICACIONES (EPIT)
% LABORATORIO 02: SISTEMAS EN TIEMPO CONTINUO
% CURSO: SEÑALES Y SISTEMAS - DR. ASENCIO ALEJANDRO HUAITA BEDREGAL (2026)
% =========================================================================
% =========================================================================
% TAREA 1 (Página 5 de la Guía Oficial de Laboratorio):
%   Tema 01: Respuesta al impulso de un sistema LTI (Franco Gutierrez)
%   Tema 02: Función de transferencia de un sistema LTI (Franco Gutierrez)
%   Tema 03: Respuesta al impulso de un sistema (Jeremy Villalta)
%   Tema 04: Respuesta en frecuencia (Jeremy Villalta)
%   Tema 05: Sistema de primer orden (Henry Gutierrez)
%
% TAREA 2 (Página 9 de la Guía Oficial de Laboratorio):
%   Tema 06: Sistema de segundo orden subamortiguado (Alex Quispe)
%   Tema 07: Respuesta al escalón unitario de un sistema de segundo orden (Alex Quispe)
%   Tema 08: Sistema de segundo orden sobreamortigua (Zaul Uturunco)
%   Tema 09: Sistema con respuesta impulso (Benjamín Quispe)
%   Tema 10: Sistema de primer orden con polo real negativo (Henry Gutierrez)
% =========================================================================

clear; clc; close all;

%% ========================================================================
% TEMA 01: RESPUESTA AL IMPULSO DE UN SISTEMA LTI (Franco Gutierrez)
% ========================================================================
disp('=== TEMA 01: Respuesta al impulso de un sistema LTI ===');
% H(s) = 1 / (s^2 + 3s + 2) = 1 / [(s+1)(s+2)]
% h(t) = (e^(-t) - e^(-2t)) * u(t)

num1 = [1];
den1 = [1, 3, 2];
sys1 = tf(num1, den1);

[y1, t1] = impulse(sys1);

figure('Name', 'Tema 01 - Impulso LTI', 'Position', [100, 100, 750, 480]);
plot(t1, y1, 'Color', [0.12, 0.47, 0.71], 'LineWidth', 2);
title('Tema 01: Respuesta al Impulso del Sistema LTI (MATLAB)');
xlabel('Tiempo (s)');
ylabel('Amplitud h(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 02: FUNCIÓN DE TRANSFERENCIA Y MAPA DE POLOS Y CEROS (Franco Gutierrez)
% ========================================================================
disp('=== TEMA 02: Función de transferencia y mapa de polos y ceros ===');
% H(s) = (2s + 5) / (s^2 + 4s + 3) -> Cero en s = -2.5, Polos en s = -1, -3

num2 = [2, 5];
den2 = [1, 4, 3];
sys2 = tf(num2, den2);

disp('Función de transferencia H(s):');
disp(sys2);

polos2 = pole(sys2);
ceros2 = zero(sys2);

figure('Name', 'Tema 02 - Mapa de Polos y Ceros', 'Position', [100, 100, 750, 480]);
hold on;
if ~isempty(ceros2)
    scatter(real(ceros2), imag(ceros2), 80, 'blue', 'o', 'LineWidth', 2, 'DisplayName', 'Ceros (o)');
end
if ~isempty(polos2)
    scatter(real(polos2), imag(polos2), 80, 'red', 'x', 'LineWidth', 2, 'DisplayName', 'Polos (x)');
end
xline(0, 'k--', 'LineWidth', 0.8, 'HandleVisibility', 'off');
yline(0, 'k--', 'LineWidth', 0.8, 'HandleVisibility', 'off');
title('Tema 02: Mapa de Polos y Ceros en el Plano s');
xlabel('Parte Real (\sigma)');
ylabel('Parte Imaginaria (j\omega)');
grid on;
legend('show', 'Location', 'best');
hold off;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 03: RESPUESTA AL IMPULSO: ANALÍTICA VS CONVOLUCIÓN NUMÉRICA (Jeremy Villalta)
% ========================================================================
disp('=== TEMA 03: Impulso analítica vs convolución numérica ===');
% H(s) = 1 / (s^2 + 2s + 2) -> h(t) = e^(-t) * sin(t) * u(t)

num3 = [1];
den3 = [1, 2, 2];
sys3 = tf(num3, den3);

% Respuesta analitica continua
[h3, t3] = impulse(sys3);

% Convolucion numerica con aproximacion de Dirac delta = 1/dt
t_num = linspace(0, 10, 500);
dt    = t_num(2) - t_num(1);
delta_aprox    = zeros(size(t_num));
delta_aprox(1) = 1.0 / dt;

[y_conv, t_out] = lsim(sys3, delta_aprox, t_num);

figure('Name', 'Tema 03 - Impulso vs Convolucion', 'Position', [100, 100, 800, 600]);

subplot(2, 1, 1);
plot(t3, h3, 'b', 'LineWidth', 2);
title('Tema 03: Respuesta al Impulso Analítica - h(t)');
ylabel('Amplitud');
grid on;

subplot(2, 1, 2);
plot(t_out, y_conv, 'g', 'LineWidth', 2);
title('Respuesta mediante Convolución Numérica (Área \delta = 1)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 04: RESPUESTA EN FRECUENCIA - DIAGRAMA DE BODE (Jeremy Villalta)
% ========================================================================
disp('=== TEMA 04: Respuesta en frecuencia - Diagrama de Bode ===');
% H(s) = 10 / (s^2 + 2s + 10)

num4 = [10];
den4 = [1, 2, 10];
sys4 = tf(num4, den4);

[mag, phase, w] = bode(sys4);
mag_dB    = 20 * log10(squeeze(mag));
phase_deg = squeeze(phase);
w         = squeeze(w);

figure('Name', 'Tema 04 - Diagrama de Bode', 'Position', [100, 100, 800, 600]);

subplot(2, 1, 1);
semilogx(w, mag_dB, 'Color', [0.44, 0.39, 0.95], 'LineWidth', 2);
title('Tema 04: Diagrama de Bode - Magnitud (dB)');
ylabel('Magnitud (dB)');
grid on;

subplot(2, 1, 2);
semilogx(w, phase_deg, 'Color', [0.06, 0.72, 0.51], 'LineWidth', 2);
title('Diagrama de Bode - Fase (grados)');
xlabel('Frecuencia (rad/s)');
ylabel('Fase (°)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 05: SISTEMA DE PRIMER ORDEN AL ESCALÓN (Henry Gutierrez)
% ========================================================================
disp('=== TEMA 05: Sistema de primer orden al escalón ===');
% H(s) = 1 / (2s + 1) -> tau = 2 s

tau5 = 2;
num5 = [1];
den5 = [tau5, 1];
sys5 = tf(num5, den5);

[y5, t5] = step(sys5);

figure('Name', 'Tema 05 - 1er Orden al Escalon', 'Position', [100, 100, 750, 480]);
plot(t5, y5, 'Color', [0.5, 0, 0.5], 'LineWidth', 2);
hold on;
yline(0.632, 'k--', '63.2% en t = \tau (2s)', 'LineWidth', 1);
xline(2.0, 'k--', 'LineWidth', 1);
hold off;
title('Tema 05: Respuesta al Escalón - Sistema de Primer Orden (\tau = 2s)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 06: SISTEMA DE SEGUNDO ORDEN SUBAMORTIGUADO (Alex Quispe)
% ========================================================================
disp('=== TEMA 06: Sistema de segundo orden subamortiguado ===');
% H(s) = 9 / (s^2 + 3s + 9) -> wn = 3, zeta = 0.5 (polos complejos conjugados)

wn6   = 3.0;
zeta6 = 0.5;
num6  = [wn6^2];
den6  = [1, 2 * zeta6 * wn6, wn6^2];
sys6  = tf(num6, den6);

[y6, t6] = step(sys6);

figure('Name', 'Tema 06 - 2do Orden Subamortiguado', 'Position', [100, 100, 750, 480]);
plot(t6, y6, 'Color', [0.12, 0.47, 0.71], 'LineWidth', 2);
title('Tema 06: Sistema de Segundo Orden Subamortiguado (\zeta = 0.5, \omega_n = 3)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 07: RESPUESTA AL ESCALÓN CON SOBREIMPULSO (Alex Quispe)
% ========================================================================
disp('=== TEMA 07: Respuesta al escalón unitario con sobreimpulso ===');
% H(s) = 9 / (s^2 + 2s + 9) -> wn = 3, zeta = 0.333, Mp = 32.9%

num7 = [9];
den7 = [1, 2, 9];
sys7 = tf(num7, den7);

[y7, t7] = step(sys7);

figure('Name', 'Tema 07 - Escalón con Sobreimpulso', 'Position', [100, 100, 750, 480]);
plot(t7, y7, 'r', 'LineWidth', 2);
hold on;
yline(1.329, 'r--', 'Pico Mp = 32.9% (1.33 V)', 'LineWidth', 1);
xline(1.11, 'r--', 'tp = 1.11 s', 'LineWidth', 1);
hold off;
title('Tema 07: Respuesta al Escalón Unitario - 2do Orden (M_p = 32.9%)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 08: SISTEMA DE SEGUNDO ORDEN SOBREAMORTIGUADO (Zaul Uturunco)
% ========================================================================
disp('=== TEMA 08: Sistema de segundo orden sobreamortiguado ===');
% H(s) = 16 / (s^2 + 16s + 16) -> wn = 4, zeta = 2.0 (polos reales: -1.07 y -14.93)

wn8   = 4;
zeta8 = 2.0;
num8  = [wn8^2];
den8  = [1, 2 * zeta8 * wn8, wn8^2];
sys8  = tf(num8, den8);

[y8, t8] = step(sys8);

figure('Name', 'Tema 08 - Sobreamortiguado', 'Position', [100, 100, 750, 480]);
plot(t8, y8, 'Color', [0.18, 0.8, 0.44], 'LineWidth', 2);
title('Tema 08: Sistema de Segundo Orden Sobreamortiguado (\zeta = 2.0, \omega_n = 4)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 09: SISTEMA CON RESPUESTA AL IMPULSO OSCILATORIA (Benjamín Quispe)
% ========================================================================
disp('=== TEMA 09: Sistema con respuesta al impulso oscilatoria ===');
% H(s) = 4 / (s^2 + 2s + 8) -> h(t) = (4/sqrt(7)) * e^(-t) * sin(sqrt(7)*t) * u(t)

num9 = [4];
den9 = [1, 2, 8];
sys9 = tf(num9, den9);

[h9, t9] = impulse(sys9);

figure('Name', 'Tema 09 - Impulso Oscilatorio', 'Position', [100, 100, 750, 480]);
plot(t9, h9, 'Color', [0.85, 0.2, 0.85], 'LineWidth', 2);
title('Tema 09: Sistema con Respuesta al Impulso Oscilatoria h(t)');
xlabel('Tiempo (s)');
ylabel('Respuesta h(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% TEMA 10: SISTEMA DE PRIMER ORDEN CON POLO REAL NEGATIVO (Henry Gutierrez)
% ========================================================================
disp('=== TEMA 10: Sistema con polo real negativo ===');
% H(s) = 6 / (s + 3) -> Polo en s = -3, Ganancia DC = 2

a10  = 3;
K10  = 6;
num10 = [K10];
den10 = [1, a10];
sys10 = tf(num10, den10);

[y_step10, t_step10] = step(sys10);
[y_imp10, t_imp10]   = impulse(sys10);

figure('Name', 'Tema 10 - Polo Real Negativo', 'Position', [100, 100, 800, 600]);

subplot(2, 1, 1);
plot(t_step10, y_step10, 'r', 'LineWidth', 2);
title(sprintf('Tema 10: Respuesta al Escalón (Polo en s = -%g, Ganancia DC = 2)', a10));
ylabel('Amplitud');
grid on;

subplot(2, 1, 2);
plot(t_imp10, y_imp10, 'b', 'LineWidth', 2);
title('Respuesta al Impulso (Decaimiento Exponencial 6e^{-3t})');
xlabel('Tiempo (s)');
ylabel('Amplitud');
grid on;

disp('=== Todos los 10 temas fueron ejecutados exitosamente ===');
