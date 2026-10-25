% =========================================================================
% SCRIPT UNIFICADO: Análisis de Sistemas Lineales en MATLAB
% UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA
% ESCUELA PROFESIONAL DE INGENIERÍA DE TELECOMUNICACIONES
% LABORATORIO 02: SISTEMAS EN TIEMPO CONTINUO
% CURSO: SEÑALES Y SISTEMAS - DR. ASENCIO HUAITA BEDREGAL (2026)
% =========================================================================
% Este script reúne 10 ejemplos de análisis de sistemas LTI:
%   1. Función de transferencia y mapa de polos y ceros
%   2. Respuesta al escalón - Sistema de 2do orden
%   3. Respuesta al impulso - Sistema de 2do orden
%   4. Sistema de 2do orden sobreamortiguado
%   5. Sistema con polo real negativo (1er orden)
%   6. Respuesta en frecuencia - Diagrama de Bode
%   7. Respuesta al impulso: analítica vs convolución numérica
%   8. Respuesta al impulso de un sistema LTI
%   9. Sistema de 2do orden críticamente amortiguado
%  10. Respuesta al escalón - Sistema de 1er orden
% =========================================================================

clear; clc; close all;

%% ========================================================================
% 1) FUNCIÓN DE TRANSFERENCIA Y MAPA DE POLOS Y CEROS
% ========================================================================
disp('=== 1) Función de transferencia y mapa de polos y ceros ===');

num = [2, 5];
den = [1, 4, 3];

sys = tf(num, den);
disp('Función de transferencia:');
disp(sys);

polos = pole(sys);
ceros = zero(sys);

figure('Name', '1) Mapa de Polos y Ceros');
hold on;
if ~isempty(ceros)
    scatter(real(ceros), imag(ceros), 60, 'blue', 'o', ...
        'LineWidth', 1.5, 'DisplayName', 'Ceros');
end
if ~isempty(polos)
    scatter(real(polos), imag(polos), 60, 'red', 'x', ...
        'LineWidth', 1.5, 'DisplayName', 'Polos');
end
xline(0, 'k', 'LineWidth', 0.5, 'HandleVisibility', 'off');
yline(0, 'k', 'LineWidth', 0.5, 'HandleVisibility', 'off');
title('Mapa de Polos y Ceros');
xlabel('Parte Real');
ylabel('Parte Imaginaria');
grid on;
legend('show', 'Location', 'best');
hold off;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 2) RESPUESTA AL ESCALÓN UNITARIO - SISTEMA DE 2DO ORDEN
% ========================================================================
disp('=== 2) Respuesta al escalón unitario - 2do orden ===');

num = [9];
den = [1, 2, 9];
sys = tf(num, den);

[y, t] = step(sys);

figure('Name', '2) Escalón Unitario - 2do Orden');
plot(t, y, 'r', 'LineWidth', 2);
title('Respuesta al Escalón Unitario - 2do Orden (MATLAB)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 3) RESPUESTA AL IMPULSO - SISTEMA DE 2DO ORDEN
% ========================================================================
disp('=== 3) Respuesta al impulso - 2do orden ===');

num = [4];
den = [1, 2, 8];
sys = tf(num, den);

[h, t] = impulse(sys);

figure('Name', '3) Respuesta al Impulso - 2do Orden', ...
    'Position', [100, 100, 700, 450]);
plot(t, h, 'm', 'LineWidth', 2);
title('Sistema con Respuesta al Impulso $h(t)$', 'Interpreter', 'latex');
xlabel('Tiempo (s)');
ylabel('Respuesta h(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 4) SISTEMA DE SEGUNDO ORDEN SOBREAMORTIGUADO
% ========================================================================
disp('=== 4) Sistema de 2do orden sobreamortiguado ===');

wn = 4;
zeta = 2.0;

num = [wn^2];
den = [1, 2 * zeta * wn, wn^2];
sys = tf(num, den);

[y, t] = step(sys);

figure('Name', '4) Sistema Sobreamortiguado', ...
    'Position', [100, 100, 700, 450]);
plot(t, y, 'g', 'LineWidth', 2);
title('Sistema de Segundo Orden Sobreamortiguado ($\zeta = 2.0$)', ...
    'Interpreter', 'latex');
xlabel('Tiempo (s)');
ylabel('Amplitud');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 5) SISTEMA DE PRIMER ORDEN CON POLO REAL NEGATIVO
% ========================================================================
disp('=== 5) Polo real negativo (s = -3) ===');

a = 3;
K = 6;
num = [K];
den = [1, a];
sys = tf(num, den);

[y_step, t_step] = step(sys);
[y_imp, t_imp]   = impulse(sys);

figure('Name', '5) Polo Real Negativo', 'Position', [100, 100, 800, 600]);

subplot(2, 1, 1);
plot(t_step, y_step, 'r', 'LineWidth', 2);
title(sprintf('Respuesta al Escalón (Polo Real Negativo en s = -%g)', a));
ylabel('Amplitud');
grid on;

subplot(2, 1, 2);
plot(t_imp, y_imp, 'b', 'LineWidth', 2);
title('Respuesta al Impulso (Decaimiento Exponencial)');
xlabel('Tiempo (s)');
ylabel('Amplitud');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 6) RESPUESTA EN FRECUENCIA - DIAGRAMA DE BODE
% ========================================================================
disp('=== 6) Respuesta en frecuencia - Bode ===');

num = [10];
den = [1, 2, 10];
sys = tf(num, den);

[mag, phase, w] = bode(sys);
mag_dB    = 20 * log10(squeeze(mag));
phase_deg = squeeze(phase);
w         = squeeze(w);

figure('Name', '6) Diagrama de Bode', 'Position', [100, 100, 800, 600]);

subplot(2, 1, 1);
semilogx(w, mag_dB, 'b', 'LineWidth', 1.5);
title('Respuesta en Frecuencia - Bode (MATLAB)');
ylabel('Magnitud (dB)');
grid on;

subplot(2, 1, 2);
semilogx(w, phase_deg, 'b', 'LineWidth', 1.5);
xlabel('Frecuencia (rad/s)');
ylabel('Fase (grados)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 7) RESPUESTA AL IMPULSO: ANALÍTICA VS CONVOLUCIÓN NUMÉRICA
% ========================================================================
disp('=== 7) Impulso: analítica vs convolución numérica ===');

num = [1];
den = [1, 2, 2];
sys = tf(num, den);

[h, t] = impulse(sys);

figure('Name', '7) Impulso - Analítica vs Convolución', ...
    'Position', [100, 100, 800, 600]);

subplot(2, 1, 1);
plot(t, h, 'b', 'LineWidth', 2);
title('Respuesta al Impulso del Sistema - h(t) (MATLAB)');
ylabel('Amplitud');
grid on;

t_num = linspace(0, 10, 500);
dt    = t_num(2) - t_num(1);

entrada_impulso    = zeros(size(t_num));
entrada_impulso(1) = 1.0 / dt;

[y_conv, t_out] = lsim(sys, entrada_impulso, t_num);

subplot(2, 1, 2);
plot(t_out, y_conv, 'g', 'LineWidth', 2);
title('Respuesta al Impulso mediante Convolución Numérica');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 8) RESPUESTA AL IMPULSO DEL SISTEMA LTI
% ========================================================================
disp('=== 8) Respuesta al impulso LTI ===');

num = [1];
den = [1, 3, 2];
sys = tf(num, den);

[y, t] = impulse(sys);

figure('Name', '8) Impulso LTI');
plot(t, y, 'b', 'LineWidth', 1.5);
title('Respuesta al Impulso del Sistema LTI (MATLAB)');
xlabel('Tiempo (s)');
ylabel('Amplitud');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 9) SISTEMA DE 2DO ORDEN CRÍTICAMENTE AMORTIGUADO
% ========================================================================
disp('=== 9) Sistema de 2do orden críticamente amortiguado ===');

wn  = 3;
num = [wn^2];
den = [1, 2 * wn, wn^2];   % zeta = 1
sys = tf(num, den);

[y, t] = step(sys);

figure('Name', '9) Críticamente Amortiguado');
plot(t, y, 'Color', [0.12, 0.47, 0.71], 'LineWidth', 2);
title('Respuesta al Escalón Unitario - Sistema de 2do Orden (Críticamente Amortiguado)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;
disp('Presione una tecla para continuar...'); pause;

%% ========================================================================
% 10) RESPUESTA AL ESCALÓN - SISTEMA DE PRIMER ORDEN
% ========================================================================
disp('=== 10) Respuesta al escalón - 1er orden ===');

tau = 2;
num = [1];
den = [tau, 1];
sys = tf(num, den);

[y, t] = step(sys);

figure('Name', '10) Escalón - 1er Orden');
plot(t, y, 'Color', [0.5, 0, 0.5], 'LineWidth', 2);
title('Respuesta al Escalón - Sistema de Primer Orden (MATLAB)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;

disp('=== Análisis completado con éxito ===');
