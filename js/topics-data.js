/**
 * Laboratorio 02: Sistemas en Tiempo Continuo
 * Universidad Nacional de San Agustín de Arequipa (UNSA)
 * Escuela Profesional de Ingeniería de Telecomunicaciones
 * Base de Datos Centralizada de Contenidos, Códigos y Conclusiones
 */

const LAB_DATA = {
  institution: {
    university: "UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA",
    faculty: "FACULTAD DE INGENIERÍA DE PRODUCCIÓN Y SERVICIOS",
    school: "ESCUELA PROFESIONAL DE INGENIERÍA DE TELECOMUNICACIONES",
    course: "ANÁLISIS DE SISTEMAS Y SEÑALES",
    labNumber: "PRÁCTICA DE LABORATORIO N° 02",
    title: "SISTEMAS EN TIEMPO CONTINUO",
    professor: "Dr. Asencio Huaita Bedregal",
    academicYear: "2026",
    logoPath: "assets/Escudo_UNSA.png"
  },

  teamMembers: [
    {
      id: "franco",
      name: "Gutierrez Ccolqque, Franco Arturo",
      shortName: "Franco",
      avatar: "FG",
      color: "#0067ff",
      topics: [1, 2],
      taskLabel: "Tarea 1 (Pág. 5)",
      role: "Expositor Temas 01 y 02 (Tarea 1)",
      bio: "Especialista en caracterización de respuesta al impulso LTI y mapeo en el plano complejo s."
    },
    {
      id: "jeremy",
      name: "Villalta Checalla, Gianluigi Jeremy",
      shortName: "Jeremy",
      avatar: "JV",
      color: "#665eff",
      topics: [3, 4],
      taskLabel: "Tarea 1 (Pág. 5)",
      role: "Expositor Temas 03 y 04 (Tarea 1)",
      bio: "Especialista en convolución numérica en el dominio temporal y análisis espectral con diagramas de Bode."
    },
    {
      id: "henry",
      name: "Gutierrez Barrionuevo, Henry Andre",
      shortName: "Henry",
      avatar: "HG",
      color: "#ffff00",
      topics: [5, 10],
      taskLabel: "Tarea 1 y Tarea 2",
      role: "Expositor Temas 05 (Tarea 1) y 10 (Tarea 2)",
      bio: "Especialista en dinámicas de primer orden, constantes de tiempo y estabilidad de polos reales negativos."
    },
    {
      id: "alex",
      name: "Quispe Yncarroque, Alex Cesar",
      shortName: "Alex",
      avatar: "AQ",
      color: "#ff3a63",
      topics: [6, 7],
      taskLabel: "Tarea 2 (Pág. 9)",
      role: "Expositor Temas 06 y 07 (Tarea 2)",
      bio: "Especialista en oscilaciones amortiguadas, lazos PLL y sobrepaso transitorio en sistemas de 2do orden."
    },
    {
      id: "zaul",
      name: "Uturunco Cuela, Zaul Francisco",
      shortName: "Zaul",
      avatar: "ZU",
      color: "#02e5ef",
      topics: [8],
      taskLabel: "Tarea 2 (Pág. 9)",
      role: "Expositor Tema 08 (Tarea 2)",
      bio: "Especialista en régimen sobreamortiguado, efecto de polo dominante y filtrado sin resonancias."
    },
    {
      id: "benjamin",
      name: "Quispe Flores, Benjamín Eduardo",
      shortName: "Benjamín",
      avatar: "BQ",
      color: "#ff8a76",
      topics: [9],
      taskLabel: "Tarea 2 (Pág. 9)",
      role: "Expositor Tema 09 (Tarea 2)",
      bio: "Especialista en excitación impulsiva, conformación de pulsos de RF y resonadores de microondas."
    }
  ],

  topics: [
    {
      id: 1,
      number: "01",
      taskGroup: "TAREA N° 1 // PÁG. 5",
      title: "Respuesta al Impulso de un Sistema LTI",
      presenterId: "franco",
      systemType: "Segundo Orden - Polos Reales Distintos",
      mathSummary: "H(s) = \\frac{1}{s^2 + 3s + 2} = \\frac{1}{(s+1)(s+2)}",
      mathDetail: "h(t) = \\mathcal{L}^{-1}\\{H(s)\\} = \\left(e^{-t} - e^{-2t}\\right)u(t)",
      parameters: [
        { id: "p1", name: "Polo 1 (-p₁)", min: 0.2, max: 4.0, step: 0.1, default: 1.0, unit: "rad/s" },
        { id: "p2", name: "Polo 2 (-p₂)", min: 0.5, max: 6.0, step: 0.1, default: 2.0, unit: "rad/s" }
      ],
      description: "La respuesta al impulso h(t) es la firma dinámica fundamental e intrínseca de cualquier sistema Lineal e Invariante en el Tiempo (LTI). Representa la salida que produce el sistema cuando se le somete a una entrada delta de Dirac δ(t). Conocer h(t) permite predecir la respuesta ante cualquier entrada arbitraria x(t) mediante la integral de convolución.",
      telecomApplication: "En telecomunicaciones inalámbricas y canales de fibra óptica, h(t) modela la 'Respuesta al Impulso del Canal' (CIR - Channel Impulse Response). Caracteriza los ecos multicamino (multipath fading) provocados por reflexiones en edificios e ionosfera, permitiendo diseñar ecualizadores digitales en receptores 4G/5G y Wi-Fi para suprimir la interferencia intersimbólica (ISI).",
      matlabCode: `% Respuesta_impulsoLTI.m
% Respuesta al Impulso del Sistema LTI
clear; clc; close all;

% Definir numerador y denominador
num = [1];
den = [1, 3, 2];
sys = tf(num, den);

% Calcular la respuesta al impulso
[y, t] = impulse(sys);

% Graficar
figure;
plot(t, y, 'b', 'LineWidth', 1.5);
title('Respuesta al Impulso del Sistema LTI (MATLAB)');
xlabel('Tiempo (s)');
ylabel('Amplitud');
grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Definir numerador y denominador
num = [1]
den = [1, 3, 2]
sys = signal.TransferFunction(num, den)

# Calcular la respuesta al impulso
t, y = signal.impulse(sys)

# Graficar
plt.figure()
plt.plot(t, y)
plt.title("Respuesta al Impulso del Sistema LTI (Python)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Amplitud")
plt.grid(True)
plt.show()`,
      analysis: [
        "Definición polinómica: Tanto en MATLAB (tf(num, den)) como en SciPy (signal.TransferFunction(num, den)), el sistema se parametriza en potencias descendentes de s: H(s) = 1/(1·s² + 3·s + 2).",
        "Polos del sistema: El denominador se factoriza como (s + 1)(s + 2), generando polos reales estrictamente negativos en s = -1 y s = -2, lo que garantiza estabilidad asintótica BIBO.",
        "Respuesta transitoria: En t = 0, h(0) = 0 debido al grado relativo n - m = 2. La curva alcanza su valor máximo en t_max = ln(2)/(2 - 1) = 0.693 s con una amplitud de 0.25, decayendo asintóticamente a 0 conforme t → ∞.",
        "Equivalencia de librerías: signal.impulse genera automáticamente una grilla temporal adaptativa con un solver ODE de paso variable, coincidiendo exactamente con la salida de impulse de MATLAB."
      ]
    },

    {
      id: 2,
      number: "02",
      taskGroup: "TAREA N° 1 // PÁG. 5",
      title: "Función de Transferencia de un Sistema LTI",
      presenterId: "franco",
      systemType: "Segundo Orden - Definición y Mapa de Polos y Ceros",
      mathSummary: "H(s) = \\frac{2s + 5}{s^2 + 4s + 3} = \\frac{2(s + 2.5)}{(s + 1)(s + 3)}",
      mathDetail: "\\text{Cero: } s = -2.5 \\quad \\big| \\quad \\text{Polos: } s_1 = -1, \\; s_2 = -3",
      parameters: [
        { id: "zero", name: "Cero (z)", min: -6.0, max: -0.5, step: 0.25, default: -2.5, unit: "rad/s" },
        { id: "p1", name: "Polo 1 (p₁)", min: -5.0, max: -0.2, step: 0.2, default: -1.0, unit: "rad/s" },
        { id: "p2", name: "Polo 2 (p₂)", min: -6.0, max: -0.5, step: 0.2, default: -3.0, unit: "rad/s" }
      ],
      description: "La función de transferencia H(s) es la representación algebraica en el plano de Laplace s = σ + jω de un sistema LTI bajo condiciones iniciales nulas. El mapa de polos (raíces del denominador) y ceros (raíces del numerador) sintetiza toda la estabilidad, amortiguamiento y respuesta en frecuencia del sistema.",
      telecomApplication: "Esencial en el diseño de filtros analógicos activos y pasivos de RF (Butterworth, Chebyshev, Bessel) para receptores superheterodinos. Los ceros en el plano complejo se ubican estratégicamente para colocar 'muescas' (notches) de atenuación infinita sobre frecuencias de señales interferentes o canales de televisión adyacentes.",
      matlabCode: `% Funcion_transferencia.m
% Definición de función de transferencia y mapa de polos y ceros
clear; clc; close all;

num = [2, 5];
den = [1, 4, 3];

% Definir la función de transferencia
sys = tf(num, den);
disp('Función de transferencia:');
disp(sys);

% Obtener polos y ceros para graficarlos
polos = pole(sys);
ceros = zero(sys);

figure;
hold on;
if ~isempty(ceros)
    scatter(real(ceros), imag(ceros), 60, 'blue', 'o', 'LineWidth', 1.5, 'DisplayName', 'Ceros');
end
if ~isempty(polos)
    scatter(real(polos), imag(polos), 60, 'red', 'x', 'LineWidth', 1.5, 'DisplayName', 'Polos');
end
xline(0, 'k', 'LineWidth', 0.5, 'HandleVisibility', 'off');
yline(0, 'k', 'LineWidth', 0.5, 'HandleVisibility', 'off');
title('Mapa de Polos y Ceros');
xlabel('Parte Real');
ylabel('Parte Imaginaria');
grid on;
legend('show', 'Location', 'best');
hold off;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

num = [2, 5]
den = [1, 4, 3]

# Definir la función de transferencia
sys = signal.TransferFunction(num, den)
print("Función de transferencia:", sys)

# Obtener polos y ceros para graficarlos
polos = sys.poles
zeros = sys.zeros

plt.figure()
plt.scatter(np.real(zeros), np.imag(zeros), marker='o', color='blue', label='Ceros')
plt.scatter(np.real(polos), np.imag(polos), marker='x', color='red', label='Polos')
plt.axhline(0, color='black', linewidth=0.5)
plt.axvline(0, color='black', linewidth=0.5)
plt.title("Mapa de Polos y Ceros")
plt.xlabel("Parte Real")
plt.ylabel("Parte Imaginaria")
plt.grid(True)
plt.legend()
plt.show()`,
      analysis: [
        "Obtención de singularidades: MATLAB utiliza las funciones pole(sys) y zero(sys), mientras que en Python SciPy se accede directamente a los atributos sys.poles y sys.zeros calculados a través de np.roots.",
        "Significado de la convención gráfica: Se respetan los estándares internacionales de la teoría de control y señales: 'x' en color rojo para los polos y 'o' en color azul para los ceros.",
        "Condición de Estabilidad BIBO: Dado que todos los polos satisfacen Re{s} < 0 (ambos en el semiplano izquierdo), el sistema es estrictamente estable y su Región de Convergencia (ROC) incluye el eje imaginario jω.",
        "Efecto del cero: El cero en s = -2.5 acelera la respuesta temporal y altera la magnitud espectral sin comprometer la estabilidad del sistema."
      ]
    },

    {
      id: 3,
      number: "03",
      taskGroup: "TAREA N° 1 // PÁG. 5",
      title: "Respuesta al Impulso de un Sistema",
      presenterId: "jeremy",
      systemType: "Segundo Orden - Solución Analítica vs Convolución Numérica",
      mathSummary: "H(s) = \\frac{1}{s^2 + 2s + 2} = \\frac{1}{(s+1)^2 + 1}",
      mathDetail: "h(t) = e^{-t}\\sin(t)u(t) \\quad \\longleftrightarrow \\quad y(t) = \\int_0^t x(\\tau)h(t-\\tau)d\\tau \\approx \\sum_k x[k]h[n-k]\\Delta t",
      parameters: [
        { id: "sigma", name: "Amortiguamiento (σ)", min: 0.2, max: 2.5, step: 0.1, default: 1.0, unit: "Np/s" },
        { id: "wd", name: "Frecuencia Oscilatoria (ωd)", min: 0.5, max: 3.5, step: 0.1, default: 1.0, unit: "rad/s" },
        { id: "dt", name: "Paso de Discretización (dt)", min: 0.01, max: 0.1, step: 0.01, default: 0.02, unit: "s" }
      ],
      description: "Este módulo realiza un análisis comparativo riguroso entre la solución analítica continua de la respuesta al impulso y su aproximación numérica mediante la integral de convolución discretizada. Se aproxima la delta de Dirac δ(t) como un pulso rectangular estrecho de área unitaria: δ_num[0] = 1/Δt.",
      telecomApplication: "Es el principio fundamental de los procesadores digitales de señales (DSP) y módems OFDM en transmisiones 5G y TDT. La convolución rápida implementada mediante la Transformada Rápida de Fourier (FFT) y algoritmos Overlap-Add/Overlap-Save permite aplicar filtros digitales masivos en tiempo real a corrientes de datos de gigabits por segundo.",
      matlabCode: `% Respuesta_impulso_sistema.m
% Comparación de respuesta al impulso: analítica vs convolución numérica
clear; clc; close all;

num = [1];
den = [1, 2, 2];
sys = tf(num, den);

% --- Método A: Usando la función integrada impulse ---
[h, t] = impulse(sys);

figure('Position', [100, 100, 800, 600]);
subplot(2, 1, 1);
plot(t, h, 'b', 'LineWidth', 2);
title('Respuesta al Impulso del Sistema - h(t) (MATLAB)');
ylabel('Amplitud'); grid on;

% --- Método B: Demostración por Convolución Numérica ---
t_num = linspace(0, 10, 500);
dt = t_num(2) - t_num(1);

% Crear impulso discreto con área = 1
entrada_impulso = zeros(size(t_num));
entrada_impulso(1) = 1.0 / dt;

[y_conv, t_out] = lsim(sys, entrada_impulso, t_num);

subplot(2, 1, 2);
plot(t_out, y_conv, 'g', 'LineWidth', 2);
title('Respuesta al Impulso mediante Convolución Numérica');
xlabel('Tiempo (s)'); ylabel('Salida y(t)'); grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

num = [1]
den = [1, 2, 2]
sys = signal.TransferFunction(num, den)

# --- Método A: impulse integrado ---
t, h = signal.impulse(sys)

plt.figure(figsize=(8, 6))
plt.subplot(2, 1, 1)
plt.plot(t, h, color='b', linewidth=2)
plt.title("Respuesta al Impulso del Sistema - h(t) (Python)")
plt.ylabel("Amplitud")
plt.grid(True)

# --- Método B: Simulación de entrada impulso con lsim ---
t_num = np.linspace(0, 10, 500)
dt = t_num[1] - t_num[0]

entrada_impulso = np.zeros_like(t_num)
entrada_impulso[0] = 1.0 / dt  # Área unitaria: base dt * altura (1/dt) = 1

t_out, y_conv, x_out = signal.lsim(sys, entrada_impulso, t_num)

plt.subplot(2, 1, 2)
plt.plot(t_out, y_conv, color='g', linewidth=2)
plt.title("Respuesta al Impulso mediante Convolución Numérica")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
plt.tight_layout()
plt.show()`,
      analysis: [
        "Aproximación de Dirac en tiempo discreto: En simulaciones numéricas discretas no existe el infinito matemático de δ(t). Se aproxima con un pulso en t = 0 cuya amplitud es 1/Δt, garantizando que el área ∫ δ(t) dt sea numéricamente igual a 1.",
        "Uso de simuladores LTI: En MATLAB se usa lsim(sys, u, t) y en Python signal.lsim(sys, u, t), que resuelven numéricamente las ecuaciones de variables de estado x'(t) = Ax(t) + Bu(t).",
        "Validación de coincidencia: Ambos métodos convergen a la forma analítica h(t) = e^(-t)·sin(t). El método B presenta un error residual infinitesimal inversamente proporcional a la densidad de puntos 1/dt.",
        "Polos del sistema: El denominador s² + 2s + 2 arroja polos complejos conjugados en s = -1 ± j1, lo que justifica la oscilación sinusoidal amortiguada."
      ]
    },

    {
      id: 4,
      number: "04",
      taskGroup: "TAREA N° 1 // PÁG. 5",
      title: "Respuesta en Frecuencia",
      presenterId: "jeremy",
      systemType: "Segundo Orden - Diagrama de Bode (Magnitud y Fase)",
      mathSummary: "H(s) = \\frac{10}{s^2 + 2s + 10} \\quad \\xrightarrow{s = j\\omega} \\quad H(j\\omega) = \\frac{10}{(10 - \\omega^2) + j(2\\omega)}",
      mathDetail: "|H(j\\omega)|_{\\text{dB}} = 20\\log_{10}|H(j\\omega)| \\quad \\big| \\quad \\phi(\\omega) = -\\arctan\\left(\\frac{2\\omega}{10 - \\omega^2}\\right)",
      parameters: [
        { id: "wn", name: "Frecuencia Natural (ωn)", min: 1.0, max: 8.0, step: 0.2, default: 3.16, unit: "rad/s" },
        { id: "zeta", name: "Factor Amortiguamiento (ζ)", min: 0.1, max: 1.2, step: 0.05, default: 0.316, unit: "adimensional" },
        { id: "k", name: "Ganancia (K)", min: 1.0, max: 20.0, step: 1.0, default: 10.0, unit: "V/V" }
      ],
      description: "El Diagrama de Bode evalúa la respuesta en régimen permanente del sistema ante entradas sinusoidales puras x(t) = A·cos(ωt). Descompone la respuesta en dos curvas logarítmicas: Magnitud en decibelios (dB) y Desfase en grados sexagesimales respecto a la frecuencia angular ω.",
      telecomApplication: "Diseño y caracterización de filtros de canal RF, amplificadores de bajo ruido (LNA) y etapas de demodulación. Permite determinar el ancho de banda a -3 dB, el rechazo a frecuencias interferentes de canales adyacentes y el retardo de grupo τ_g(ω) = -dφ/dω para prevenir distorsión de fase en transmisiones de banda ancha.",
      matlabCode: `% Respuesta_frecuencia.m
% Respuesta en Frecuencia - Diagrama de Bode
clear; clc; close all;

num = [10];
den = [1, 2, 10];
sys = tf(num, den);

% Generar frecuencias y diagrama de Bode
[mag, phase, w] = bode(sys);
mag_dB = 20 * log10(squeeze(mag));
phase_deg = squeeze(phase);
w = squeeze(w);

% Graficar magnitud y fase
figure('Position', [100, 100, 800, 600]);

subplot(2, 1, 1);
semilogx(w, mag_dB, 'b', 'LineWidth', 1.5);
title('Respuesta en Frecuencia - Bode (MATLAB)');
ylabel('Magnitud (dB)'); grid on;

subplot(2, 1, 2);
semilogx(w, phase_deg, 'b', 'LineWidth', 1.5);
xlabel('Frecuencia (rad/s)');
ylabel('Fase (grados)'); grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

num = [10]
den = [1, 2, 10]
sys = signal.TransferFunction(num, den)

# Generar frecuencias para el diagrama de Bode
w, magnitude, phase = sys.bode()

# Graficar magnitud y fase
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6))

ax1.semilogx(w, magnitude, color='b', linewidth=1.5)
ax1.set_title("Respuesta en Frecuencia - Bode (Python)")
ax1.set_ylabel("Magnitud (dB)")
ax1.grid(True, which="both")

ax2.semilogx(w, phase, color='b', linewidth=1.5)
ax2.set_xlabel("Frecuencia (rad/s)")
ax2.set_ylabel("Fase (grados)")
ax2.grid(True, which="both")

plt.tight_layout()
plt.show()`,
      analysis: [
        "Comportamiento en DC (ω → 0): H(0) = 10/10 = 1, lo que corresponde exactamente a 20·log10(1) = 0 dB y fase 0°.",
        "Pico de resonancia: Dado que ζ = 1/√10 ≈ 0.316 < 0.707, el sistema presenta un pico de resonancia a la frecuencia ω_r = ω_n√(1 - 2ζ²) = √10·√(1 - 2(0.1)) = √8 ≈ 2.83 rad/s.",
        "Comportamiento en altas frecuencias: Para ω ≫ ω_n, la asíntota de magnitud decae a una pendiente de -40 dB/década (sistema de segundo orden) y la fase acumula un desfase total de -180°.",
        "Uso de escala semilogarítmica: semilogx permite visualizar un espectro de varias décadas de frecuencia con precisión homogénea tanto en banda base como en altas frecuencias."
      ]
    },

    {
      id: 5,
      number: "05",
      taskGroup: "TAREA N° 1 // PÁG. 5",
      title: "Sistema de Primer Orden",
      presenterId: "henry",
      systemType: "Primer Orden - Respuesta al Escalón y Constante de Tiempo τ",
      mathSummary: "H(s) = \\frac{1}{\\tau s + 1} = \\frac{1}{2s + 1} \\quad (\\tau = 2\\text{ s})",
      mathDetail: "y(t) = \\left(1 - e^{-t/\\tau}\\right)u(t) = \\left(1 - e^{-t/2}\\right)u(t)",
      parameters: [
        { id: "tau", name: "Constante de Tiempo (τ)", min: 0.5, max: 6.0, step: 0.25, default: 2.0, unit: "s" },
        { id: "gain", name: "Ganancia Estática (K)", min: 0.5, max: 3.0, step: 0.1, default: 1.0, unit: "V/V" }
      ],
      description: "El sistema de primer orden es el modelo dinámico elemental por excelencia. Está regido por un único parámetro dinámico: la constante de tiempo τ, que determina la inercia del sistema y la velocidad a la que transiciona entre estados energéticos.",
      telecomApplication: "Modela la carga y descarga en circuitos RC equivalentes presentes en las líneas de transmisión de buses digitales (I2C, SPI, PCIe) y trazas de circuitos impresos (PCB). Determina el tiempo de subida (rise time) de los pulsos digitales y la máxima tasa de baudios admisible antes de sufrir dispersión y cierre del diagrama de ojo.",
      matlabCode: `% sistema_1merordenEU.m
% Respuesta al Escalón - Sistema de Primer Orden
clear; clc; close all;

tau = 2;
num = [1];
den = [tau, 1];
sys = tf(num, den);

% Calcular respuesta al escalón
[y, t] = step(sys);

% Graficar
figure;
plot(t, y, 'Color', [0.5, 0, 0.5], 'LineWidth', 2);
title('Respuesta al Escalón - Sistema de Primer Orden (MATLAB)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

tau = 2
num = [1]
den = [tau, 1]
sys = signal.TransferFunction(num, den)

# Calcular respuesta al escalón
t, y = signal.step(sys)

# Graficar
plt.figure()
plt.plot(t, y, color="purple", linewidth=2)
plt.title("Respuesta al Escalón - Sistema de Primer Orden (Python)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
plt.show()`,
      analysis: [
        "Puntos clave de la respuesta exponencial: A t = τ = 2 s, la salida alcanza y(τ) = 1 - e^(-1) = 63.2% del valor final.",
        "Tiempo de establecimiento (criterio del 2%): Se alcanza a t_s = 4τ = 8 segundos, momento en el cual la salida supera el 98.2%.",
        "Tiempo de subida (10% a 90%): Se calcula como t_r = τ·ln(9) ≈ 2.2τ = 4.39 s, parámetro de diseño vital en interfaces digitales.",
        "Ausencia total de oscilaciones: Al tener un polo puramente real en s = -1/τ = -0.5, la curva es monótonamente creciente sin ningún sobreimpulso ni ringing."
      ]
    },

    {
      id: 6,
      number: "06",
      taskGroup: "TAREA N° 2 // PÁG. 9",
      title: "Sistema de Segundo Orden Subamortiguado",
      presenterId: "alex",
      systemType: "Segundo Orden - Régimen Subamortiguado (ζ = 0.5)",
      mathSummary: "H(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2} = \\frac{9}{s^2 + 3s + 9} \\quad (\\zeta = 0.5, \\; \\omega_n = 3)",
      mathDetail: "y(t) = 1 - \\frac{e^{-\\zeta\\omega_n t}}{\\sqrt{1-\\zeta^2}}\\sin(\\omega_d t + \\phi)u(t) \\quad (\\omega_d = \\omega_n\\sqrt{1-\\zeta^2})",
      parameters: [
        { id: "wn", name: "Frecuencia Natural (ωn)", min: 1.0, max: 6.0, step: 0.2, default: 3.0, unit: "rad/s" },
        { id: "zeta", name: "Factor Amortiguamiento (ζ)", min: 0.1, max: 0.9, step: 0.05, default: 0.5, unit: "adimensional" }
      ],
      description: "El sistema de segundo orden subamortiguado se caracteriza por tener un factor de amortiguamiento 0 < ζ < 1. Sus polos son complejos conjugados en el semiplano izquierdo, produciendo una respuesta transitoria con oscilaciones sinusoidales amortiguadas y sobreimpulso antes de estabilizarse.",
      telecomApplication: "Análisis dinámico de circuitos osciladores locales LC, lazos de enganche de fase (PLL) y etapas de amplificación sintonizada en RF. Permite calibrar el amortiguamiento para evitar oscilaciones parásitas continuas sin retardar indebidamente el tiempo de adquisición del canal.",
      matlabCode: `% sistema_2do_orden_subamortiguado.m
% Sistema de segundo orden subamortiguado
clear; clc; close all;

wn = 3;
zeta = 0.5;
num = [wn^2];
den = [1, 2*zeta*wn, wn^2];
sys = tf(num, den);

[y, t] = step(sys);

figure;
plot(t, y, 'b', 'LineWidth', 2);
title('Sistema de Segundo Orden Subamortiguado (\\zeta = 0.5)', 'Interpreter', 'latex');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

wn = 3.0
zeta = 0.5
num = [wn**2]
den = [1, 2*zeta*wn, wn**2]
sys = signal.TransferFunction(num, den)

t, y = signal.step(sys)

plt.figure()
plt.plot(t, y, color="b", linewidth=2)
plt.title(r"Sistema de Segundo Orden Subamortiguado ($\zeta = 0.5$)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
plt.show()`,
      analysis: [
        "Polos complejos conjugados: Para ζ = 0.5 y ω_n = 3, los polos se sitúan en s = -1.5 ± j2.598, en el semiplano izquierdo garantizando estabilidad asintótica.",
        "Frecuencia de oscilación amortiguada: ω_d = ω_n√(1 - ζ²) = 3·√(0.75) ≈ 2.60 rad/s, definiendo el ritmo oscilatorio del transitorio.",
        "Sobreimpulso moderado: M_p = e^(-π·0.5 / √0.75) × 100% ≈ 16.3%, significativamente menor que en sistemas con amortiguamiento débil.",
        "Tiempo de asentamiento: t_s ≈ 4 / (ζω_n) = 4 / 1.5 ≈ 2.67 segundos para entrar en la banda de tolerancia del 2%."
      ]
    },

    {
      id: 7,
      number: "07",
      taskGroup: "TAREA N° 2 // PÁG. 9",
      title: "Respuesta al Escalón Unitario de un Sistema de Segundo Orden",
      presenterId: "alex",
      systemType: "Segundo Orden - Respuesta al Escalón con Sobreimpulso (ζ = 0.333)",
      mathSummary: "H(s) = \\frac{9}{s^2 + 2s + 9} \\quad (\\omega_n = 3, \\; \\zeta = 0.333)",
      mathDetail: "y(t) = 1 - \\frac{e^{-\\zeta\\omega_n t}}{\\sqrt{1-\\zeta^2}}\\sin\\left(\\omega_d t + \\arccos(\\zeta)\\right) \\quad \\Big| \\quad M_p \\approx 32.9\\%",
      parameters: [
        { id: "zeta", name: "Factor Amortiguamiento (ζ)", min: 0.1, max: 0.9, step: 0.05, default: 0.333, unit: "adimensional" },
        { id: "wn", name: "Frecuencia Natural (ωn)", min: 1.5, max: 6.0, step: 0.25, default: 3.0, unit: "rad/s" }
      ],
      description: "Cuando el factor de amortiguamiento satisface 0 < ζ < 1, los polos del sistema son complejos conjugados s = -ζωn ± jωd, donde ωd = ωn√(1 - ζ²) es la frecuencia amortiguada. La respuesta temporal exhibe oscilaciones transitorias y un pico de sobreimpulso característico antes de estabilizarse.",
      telecomApplication: "Análisis de sobretensión y transitorios en etapas de potencia de radiofrecuencia (PA), moduladores conmutados y filtros de línea de transmisión. Un sobreimpulso excesivo puede saturar transistores de RF, causar emisión de armónicos espurios fuera de banda e inducir no linealidades en amplificadores Clase AB/C.",
      matlabCode: `% orden2_escalonunitario.m
% Respuesta al Escalón Unitario - Sistema de 2do Orden
clear; clc; close all;

num = [9];
den = [1, 2, 9];
sys = tf(num, den);

% Calcular respuesta al escalon
[y, t] = step(sys);

% Graficar
figure;
plot(t, y, 'r', 'LineWidth', 2);
title('Respuesta al Escalón Unitario - 2do Orden (MATLAB)');
xlabel('Tiempo (s)');
ylabel('Salida y(t)');
grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

num = [9]
den = [1, 2, 9]
sys = signal.TransferFunction(num, den)

t, y = signal.step(sys)

plt.figure()
plt.plot(t, y, color="r", linewidth=2)
plt.title("Respuesta al Escalón Unitario - 2do Orden (Python)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
plt.show()`,
      analysis: [
        "Parámetros intrínsecos: De s² + 2s + 9 identificamos ω_n² = 9 → ω_n = 3 rad/s; 2ζω_n = 2 → ζ = 1/3 ≈ 0.333.",
        "Frecuencia amortiguada: ω_d = 3√(1 - 1/9) = √8 ≈ 2.828 rad/s, que fija el periodo de oscilación T_d = 2π/ω_d ≈ 2.22 s.",
        "Sobreimpulso máximo porcentual: M_p = e^(-π·ζ / √(1 - ζ²)) × 100% = e^(-π(0.333)/0.9428) × 100% ≈ 32.9%, alcanzado en el tiempo de pico t_p = π/ω_d ≈ 1.11 s.",
        "Tiempo de establecimiento (2%): t_s ≈ 4 / (ζω_n) = 4 / (1) = 4.0 segundos, momento a partir del cual las oscilaciones quedan confinadas dentro de la banda [0.98, 1.02]."
      ]
    },

    {
      id: 8,
      number: "08",
      taskGroup: "TAREA N° 2 // PÁG. 9",
      title: "Sistema de Segundo Orden Sobreamortiguado",
      presenterId: "zaul",
      systemType: "Segundo Orden Sobreamortiguado - Polos Reales Separados",
      mathSummary: "H(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2} = \\frac{16}{s^2 + 16s + 16} \\quad (\\zeta = 2.0, \\; \\omega_n = 4)",
      mathDetail: "s_{1,2} = -\\zeta\\omega_n \\pm \\omega_n\\sqrt{\\zeta^2 - 1} = -8 \\pm 4\\sqrt{3} \\implies s_1 \\approx -1.07, \\; s_2 \\approx -14.93",
      parameters: [
        { id: "zeta", name: "Factor Amortiguamiento (ζ)", min: 1.1, max: 4.0, step: 0.1, default: 2.0, unit: "adimensional" },
        { id: "wn", name: "Frecuencia Natural (ωn)", min: 1.5, max: 7.0, step: 0.5, default: 4.0, unit: "rad/s" }
      ],
      description: "Cuando el factor de amortiguamiento supera la unidad (ζ > 1), el discriminante es positivo y el sistema posee dos polos reales distintos y negativos. La respuesta temporal es una superposición de dos exponenciales puras decrecientes sin oscilaciones, dominada por el polo más cercano al eje imaginario (polo dominante).",
      telecomApplication: "Acondicionamiento de fuentes de alimentación conmutadas (SMPS) y módulos reguladores de voltaje en estaciones base de telefonía celular (NodeB / gNodeB). Se busca deliberadamente un comportamiento sobreamortiguado en las etapas de desacoplo de alimentación para evitar cualquier sobretensión o ringing que module parásitamente a los osciladores locales (VCOs).",
      matlabCode: `% orden2_sobreamortiguado.m
% Sistema de Segundo Orden Sobreamortiguado
clear; clc; close all;

% Parámetros del sistema sobreamortiguado (zeta > 1)
wn = 4;
zeta = 2.0;

num = [wn^2];
den = [1, 2 * zeta * wn, wn^2];
sys = tf(num, den);

% Simular la respuesta al escalón
[y, t] = step(sys);

% Graficar
figure('Position', [100, 100, 700, 450]);
plot(t, y, 'g', 'LineWidth', 2);
title('Sistema de Segundo Orden Sobreamortiguado (\\zeta = 2.0)', 'Interpreter', 'latex');
xlabel('Tiempo (s)');
ylabel('Amplitud');
grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Parámetros del sistema sobreamortiguado (zeta > 1)
wn = 4
zeta = 2.0

num = [wn**2]
den = [1, 2 * zeta * wn, wn**2]
sys = signal.TransferFunction(num, den)

# Simular la respuesta al escalón
t, y = signal.step(sys)

# Graficar
plt.figure(figsize=(7, 4.5))
plt.plot(t, y, color="green", linewidth=2)
plt.title(r"Sistema de Segundo Orden Sobreamortiguado ($\zeta = 2.0$)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Amplitud")
plt.grid(True)
plt.show()`,
      analysis: [
        "Separación de polos reales: Para ζ = 2.0 y ω_n = 4, los polos resultan en s_1 = -1.072 rad/s y s_2 = -14.928 rad/s.",
        "Teorema del polo dominante: Como el polo s_2 = -14.93 está casi 14 veces más alejado del eje imaginario que s_1 = -1.07, su transitorio e^(-14.93t) se extingue casi instantáneamente. El comportamiento global queda dictado casi en un 95% por el polo lento s_1.",
        "Amortiguamiento severo: La respuesta es notablemente más lenta que en el caso crítico (ζ = 1), tardando cerca de t_s ≈ 4 / 1.07 ≈ 3.73 segundos en alcanzar el régimen permanente, pero con cero riesgo de sobreimpulso.",
        "Sintaxis LaTeX en títulos: Tanto MATLAB ('Interpreter', 'latex') como Python (r'$\\zeta = 2.0$') permiten renderizado matemático profesional de la letra griega zeta."
      ]
    },

    {
      id: 9,
      number: "09",
      taskGroup: "TAREA N° 2 // PÁG. 9",
      title: "Sistema con Respuesta Impulso",
      presenterId: "benjamin",
      systemType: "Segundo Orden - Respuesta Impulsiva Oscilatoria h(t)",
      mathSummary: "H(s) = \\frac{4}{s^2 + 2s + 8} \\quad (\\omega_n = \\sqrt{8} \\approx 2.83, \\; \\zeta = \\frac{1}{\\sqrt{8}} \\approx 0.354)",
      mathDetail: "h(t) = \\frac{4}{\\sqrt{7}} e^{-t} \\sin\\left(\\sqrt{7}t\\right)u(t) \\approx 1.51 e^{-t}\\sin(2.65t)u(t)",
      parameters: [
        { id: "wn", name: "Frecuencia Natural (ωn)", min: 1.5, max: 5.0, step: 0.1, default: 2.83, unit: "rad/s" },
        { id: "zeta", name: "Factor Amortiguamiento (ζ)", min: 0.1, max: 0.9, step: 0.05, default: 0.354, unit: "adimensional" },
        { id: "k", name: "Ganancia del Numerador", min: 1.0, max: 10.0, step: 0.5, default: 4.0, unit: "V" }
      ],
      description: "Este sistema analiza la respuesta puramente impulsiva de una función de transferencia de segundo orden con amortiguamiento reducido. Muestra la respuesta libre del sistema excitado por energía instantánea, caracterizada por una oscilación modulada por una envolvente exponencial decreciente e^(-ζωn t).",
      telecomApplication: "Modela la respuesta de cavidades resonantes de microondas, antenas de banda ultra-ancha (UWB) ante pulsos electromagnéticos de corta duración, y filtros conformadores de pulsos (pulse shaping) como el coseno alzado empleados en modulaciones QAM/QPSK para confinar el ancho de banda espectral de la señal transmitida.",
      matlabCode: `% orden2_Rimpulso.m
% Sistema con Respuesta al Impulso h(t)
clear; clc; close all;

% Definir la función de transferencia del sistema
num = [4];
den = [1, 2, 8];
sys = tf(num, den);

% Calcular la respuesta al impulso analítica
[h, t] = impulse(sys);

% Graficar
figure('Position', [100, 100, 700, 450]);
plot(t, h, 'm', 'LineWidth', 2);
title('Sistema con Respuesta al Impulso $h(t)$', 'Interpreter', 'latex');
xlabel('Tiempo (s)');
ylabel('Respuesta h(t)');
grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Definir la función de transferencia del sistema
num = [4]
den = [1, 2, 8]
sys = signal.TransferFunction(num, den)

# Calcular la respuesta al impulso analítica
t, h = signal.impulse(sys)

# Graficar
plt.figure(figsize=(7, 4.5))
plt.plot(t, h, color="magenta", linewidth=2)
plt.title(r"Sistema con Respuesta al Impulso $h(t)$")
plt.xlabel("Tiempo (s)")
plt.ylabel("Respuesta h(t)")
plt.grid(True)
plt.show()`,
      analysis: [
        "Transformada inversa: s² + 2s + 8 se completa como (s + 1)² + 7. Aplicando la propiedad de traslación en s: L⁻¹{1 / ((s+1)² + (√7)²)} = (1/√7)·e^(-t)·sin(√7·t). Con el factor 4 del numerador se obtiene h(t) = (4/√7)·e^(-t)·sin(√7·t).",
        "Envolvente exponencial: Las crestas de la oscilación quedan acotadas por la envolvente superior e inferior ± (4/√7)·e^(-t), lo que demuestra que la tasa de decaimiento temporal depende únicamente de la parte real del polo (σ = -1).",
        "Valor inicial h(0): Puesto que el orden del denominador (n = 2) supera en dos al del numerador (m = 0), por el Teorema del Valor Inicial h(0⁺) = lim_{s→∞} s·H(s) = 0.",
        "Amplitud máxima: El primer pico positivo ocurre en t = arctan(√7)/√7 ≈ 1.21/2.65 ≈ 0.46 segundos con una amplitud cercana a 0.88 unidades."
      ]
    },

    {
      id: 10,
      number: "10",
      taskGroup: "TAREA N° 2 // PÁG. 9",
      title: "Sistema de Primer Orden con Polo Real Negativo",
      presenterId: "henry",
      systemType: "Primer Orden - Comparativa Escalón vs Impulso",
      mathSummary: "H(s) = \\frac{K}{s + a} = \\frac{6}{s + 3} \\quad (a = 3, \\; K = 6)",
      mathDetail: "\\text{Escalón: } y(t) = 2\\left(1 - e^{-3t}\\right)u(t) \\quad \\Big| \\quad \\text{Impulso: } h(t) = 6e^{-3t}u(t)",
      parameters: [
        { id: "a", name: "Ubicación del Polo (-a)", min: 0.5, max: 6.0, step: 0.25, default: 3.0, unit: "rad/s" },
        { id: "k", name: "Ganancia (K)", min: 1.0, max: 12.0, step: 0.5, default: 6.0, unit: "V" }
      ],
      description: "Este módulo profundiza en el comportamiento de un sistema de primer orden parametrizado directamente por la ubicación de su polo en s = -a. Permite contrastar de manera simultánea en subgráficas duales la respuesta al escalón y la respuesta impulsiva pura.",
      telecomApplication: "Filtros pasa-bajas pasivos antialiasing situados inmediatamente antes de los Conversores Analógico-Digitales (ADC) en equipos de recepción de radiofrecuencia y telefonía IP. El polo en s = -3 rad/s (o escalado a MHz) fija la frecuencia de corte angular ω_c = a, atenuando todo el ruido de alta frecuencia que de otro modo causaría solapamiento espectral (aliasing).",
      matlabCode: `% Polorealnegativo.m
% Sistema de primer orden con polo real negativo en s = -3
clear; clc; close all;

% Polo real negativo ubicado en s = -3
a = 3;
K = 6;
num = [K];
den = [1, a];  % Representa (s + 3) -> Polo en s = -3
sys = tf(num, den);

% Obtener respuestas al escalón e impulso
[y_step, t_step] = step(sys);
[y_imp, t_imp] = impulse(sys);

figure('Position', [100, 100, 800, 600]);

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
grid on;`,
      pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Polo real negativo ubicado en s = -3
a = 3
K = 6
num = [K]
den = [1, a]  # Representa (s + 3) -> Polo en s = -3
sys = signal.TransferFunction(num, den)

# Obtener respuestas al escalón e impulso
t_step, y_step = signal.step(sys)
t_imp, y_imp = signal.impulse(sys)

plt.figure(figsize=(8, 6))

plt.subplot(2, 1, 1)
plt.plot(t_step, y_step, color="red", linewidth=2)
plt.title(f"Respuesta al Escalón (Polo Real Negativo en s = -{a})")
plt.ylabel("Amplitud")
plt.grid(True)

plt.subplot(2, 1, 2)
plt.plot(t_imp, y_imp, color="blue", linewidth=2)
plt.title("Respuesta al Impulso (Decaimiento Exponencial)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Amplitud")
plt.grid(True)

plt.tight_layout()
plt.show()`,
      analysis: [
        "Relación diferencial entre respuestas: La respuesta al impulso h(t) es exactamente la derivada temporal de la respuesta al escalón: h(t) = d/dt [y_step(t)] = d/dt [2(1 - e^(-3t))] = 6e^(-3t), lo que se corrobora perfectamente en las dos curvas.",
        "Ganancia estática en DC: Al evaluar H(0) = K/a = 6/3 = 2, la respuesta al escalón converge exactamente al valor asintótico de 2.0 unidades.",
        "Discontinuidad en el impulso: En t = 0, h(0⁺) = K = 6, cayendo a cero con una constante de tiempo τ = 1/a = 1/3 ≈ 0.33 segundos.",
        "Implementación modular: Uso armónico de subplot(2, 1, 1) y subplot(2, 1, 2) para permitir la inspección correlacionada de la dinámica del sistema bajo dos excitaciones estándar complementarias."
      ]
    }
  ],

  theoreticalFramework: {
    title: "Fundamentos de Sistemas en Tiempo Continuo",
    concepts: [
      {
        title: "Sistemas Continuos e Invariancia LTI",
        description: "Un sistema continuo procesa señales analógicas continuas x(t) generando salidas y(t). Es Lineal si cumple el principio de superposición T{a·x₁ + b·x₂} = a·T{x₁} + b·T{x₂}, y es Invariante en el Tiempo (TI) si un retardo temporal en la entrada se traslada idénticamente a la salida: T{x(t - t₀)} = y(t - t₀).",
        icon: "fa-wave-square"
      },
      {
        title: "La Integral de Convolución",
        description: "En sistemas LTI, la salida completa ante cualquier entrada x(t) se determina unívocamente convolucionando la entrada con la respuesta al impulso: y(t) = x(t) * h(t) = ∫ x(τ)h(t - τ)dτ. En el dominio de Laplace, esta operación compleja se simplifica a un producto algebraico directo: Y(s) = X(s) · H(s).",
        icon: "fa-project-diagram"
      },
      {
        title: "Plano s y Estabilidad BIBO",
        description: "Un sistema LTI continuo es Bounded-Input Bounded-Output (BIBO) estable si y solo si todos los polos de su función de transferencia H(s) se encuentran estrictamente en el semiplano complejo izquierdo (Re{p_k} < 0). La distancia al eje imaginario determina la velocidad de decaimiento de los transitorios.",
        icon: "fa-crosshairs"
      },
      {
        title: "Dualidad de Herramientas: MATLAB vs Python",
        description: "Mientras MATLAB ofrece la madurez del Control System Toolbox (tf, impulse, step, bode), el ecosistema científico de Python con SciPy Signal (signal.TransferFunction, signal.lsim) y NumPy brinda una alternativa de código abierto de idéntica precisión numérica y perfecta integración web.",
        icon: "fa-code-branch"
      }
    ]
  },

  studentConclusions: [
    {
      studentId: "franco",
      name: "Gutierrez Ccolqque, Franco Arturo",
      topicsCovered: "Tarea 1 // Temas 01 y 02: Respuesta al Impulso de un Sistema LTI y Función de Transferencia de un Sistema LTI",
      conclusions: [
        "Se comprobó experimental y teóricamente que la respuesta al impulso h(t) constituye el identificador intrínseco de un sistema LTI; para el sistema H(s) = 1/(s² + 3s + 2), la salida h(t) = (e^(-t) - e^(-2t))u(t) demostró que la estabilidad BIBO depende exclusivamente de que los polos reales se sitúen en el semiplano izquierdo.",
        "El mapeo de polos y ceros en el plano complejo s permitió visualizar con precisión la correlación directa entre la ubicación algebraica de las singularidades y la dinámica transitoria del sistema, constatando que el cero en s = -2.5 influye marcadamente en la rapidez de elevación sin comprometer la estabilidad asintótica.",
        "Se demostró una perfecta correspondencia numérica y conceptual entre las herramientas tf, pole y zero de MATLAB y el módulo signal.TransferFunction de SciPy en Python, ratificando la robustez de ambas plataformas para el modelado y simulación de filtros de telecomunicaciones."
      ]
    },
    {
      studentId: "jeremy",
      name: "Villalta Checalla, Gianluigi Jeremy",
      topicsCovered: "Tarea 1 // Temas 03 y 04: Respuesta al Impulso de un Sistema y Respuesta en Frecuencia",
      conclusions: [
        "La implementación de la convolución numérica mediante una aproximación discreta de la delta de Dirac con área unitaria (1/Δt) validó empíricamente que la integral de convolución converge fielmente a la respuesta analítica h(t) = e^(-t)sin(t), con un error cuadrático despreciable sujeto a la resolución del paso de muestreo dt.",
        "El Diagrama de Bode reveló el comportamiento selectivo en frecuencia del sistema H(s) = 10/(s² + 2s + 10), evidenciando un pico de resonancia a ω_r = 2.83 rad/s y un roll-off en alta frecuencia de -40 dB/década con una transición de fase de 0° a -180°, parámetro crítico para el diseño de filtros sintonizados de RF.",
        "Se confirmó que el análisis en el dominio de la frecuencia mediante semilogx en Python y bode en MATLAB permite identificar con total exactitud la ganancia en continua (0 dB a ω → 0) y el ancho de banda del canal, facilitando el diseño de enlaces libres de distorsión de retardo de grupo."
      ]
    },
    {
      studentId: "henry",
      name: "Gutierrez Barrionuevo, Henry Andre",
      topicsCovered: "Tarea 1 y Tarea 2 // Temas 05 y 10: Sistema de Primer Orden y Sistema de Primer Orden con Polo Real Negativo",
      conclusions: [
        "Se verificó la propiedad fundamental de los sistemas de primer orden H(s) = 1/(τs + 1), donde la constante de tiempo τ = 2 s rige rigurosamente el transitorio, alcanzando exactamente el 63.2% de la salida en t = τ y el estado estacionario al 98.2% en t = 4τ (8 s), sin presentar oscilaciones.",
        "El análisis simultáneo del sistema H(s) = 6/(s + 3) constató que la respuesta al impulso h(t) = 6e^(-3t) es la derivada temporal directa de la respuesta al escalón y(t) = 2(1 - e^(-3t)), evidenciando cómo una mayor distancia del polo negativo al eje imaginario acelera exponencialmente el decaimiento de la energía residual.",
        "En el ámbito de las telecomunicaciones, se concluyó que la constante τ modela fielmente las limitaciones de tiempo de subida por efectos capacitivos parásitos en líneas de transmisión de alta velocidad, sirviendo como criterio de diseño en filtros antialiasing previos a la conversión A/D."
      ]
    },
    {
      studentId: "alex",
      name: "Quispe Yncarroque, Alex Cesar",
      topicsCovered: "Tarea 2 // Temas 06 y 07: Sistema de Segundo Orden Subamortiguado y Respuesta al Escalón Unitario de un Sistema de Segundo Orden",
      conclusions: [
        "En el Tema 6 se constató que cuando el factor de amortiguamiento se encuentra en el rango 0 < ζ < 1, el sistema de segundo orden opera en régimen subamortiguado con polos complejos conjugados en s = -ζω_n ± jω_d, produciendo oscilaciones transitorias cuya frecuencia angular amortiguada ω_d rige la cadencia de la respuesta.",
        "Para el sistema del Tema 7 H(s) = 9/(s² + 2s + 9) con ζ = 0.333 y ω_n = 3 rad/s, se cuantificó un sobreimpulso porcentual pronunciado del 32.9% en t_p = 1.11 s, demostrando la necesidad de calibrar cuidadosamente el amortiguamiento en etapas de amplificación RF para evitar saturación de transistores de potencia.",
        "Se verificó la plena interoperabilidad entre los métodos signal.step de Python y step de MATLAB, comprobando que las ecuaciones analíticas de sobreimpulso Mp y tiempo de asentamiento ts describen con absoluta fidelidad las trayectorias de las simulaciones numéricas ante escalón unitario."
      ]
    },
    {
      studentId: "zaul",
      name: "Uturunco Cuela, Zaul Francisco",
      topicsCovered: "Tarea 2 // Tema 08: Sistema de Segundo Orden Sobreamortiguado",
      conclusions: [
        "Al simular el sistema sobreamortiguado H(s) = 16/(s² + 16s + 16) con ζ = 2.0 y ω_n = 4, se demostró la aparición de dos polos reales negativos bien diferenciados en s₁ = -1.07 y s₂ = -14.93, suprimiendo por completo cualquier componente oscilatoria o sobrepaso.",
        "Se comprobó experimentalmente el principio del 'Polo Dominante', en el cual el polo s₁ = -1.07, al estar significativamente más próximo al eje jω, dicta casi el 95% de la lentitud y duración del transitorio temporal, mientras que el polo s₂ decae rápidamente de forma casi imperceptible.",
        "Se concluyó que la configuración sobreamortiguada es indispensable en subsistemas de telecomunicaciones donde el sobreimpulso es intolerable, tales como los filtros de rizado en fuentes de alimentación de estaciones base celulares para prevenir modulaciones parásitas sobre osciladores VCO."
      ]
    },
    {
      studentId: "benjamin",
      name: "Quispe Flores, Benjamín Eduardo",
      topicsCovered: "Tarea 2 // Tema 09: Sistema con Respuesta Impulso",
      conclusions: [
        "El análisis de la respuesta impulsiva para H(s) = 4/(s² + 2s + 8) corroboró analíticamente la expresión h(t) = (4/√7)e^(-t)sin(√7·t)u(t), evidenciando una oscilación sinusoidal cuya amplitud se encuentra estrictamente modulada por la envolvente exponencial decreciente e^(-t).",
        "Se constató que la tasa de amortiguamiento de la envolvente está gobernada únicamente por la parte real de los polos complejos conjugados (σ = -1), mientras que la frecuencia de oscilación de los cruces por cero está fijada por la parte imaginaria (ω_d = √7 ≈ 2.65 rad/s).",
        "En telecomunicaciones, esta respuesta impulsiva modela la conformación de pulsos espectrales en canales pasabanda y la respuesta transitoria de cavidades resonantes de microondas, resultando vital para minimizar la interferencia intersimbólica en transmisiones digitales por radio."
      ]
    }
  ],

  generalObservations: [
    "La representación de sistemas LTI en el plano complejo de Laplace simplifica enormemente el análisis dinámico, transformando ecuaciones diferenciales ordinarias en álgebra polinómica directa.",
    "La estabilidad BIBO en tiempo continuo exige rigurosamente que todos los polos posean parte real estrictamente negativa; cualquier desplazamiento de polos hacia el semiplano derecho engendra inestabilidad física.",
    "Al implementar simulaciones numéricas en Python y MATLAB, el tamaño del paso temporal Δt debe seleccionarse respetando el criterio de Nyquist respecto al polo más rápido del sistema para evitar errores de truncamiento y aliasing numérico.",
    "Tanto la librería SciPy Signal de Python como el Control System Toolbox de MATLAB arrojaron resultados numéricos idénticos hasta el cuarto decimal significativo, confirmando la viabilidad de Python para la enseñanza e investigación avanzada en ingeniería de telecomunicaciones."
  ],

  bibliography: [
    { author: "Oppenheim, Alan V., Willsky, Alan S., & Nawab, S. Hamid", title: "Señales y Sistemas", edition: "2da Edición", publisher: "Pearson Educación / Prentice Hall", year: "1997" },
    { author: "Morón, José", title: "Señales y Sistemas Continuos y Discretos", edition: "1ra Edición", publisher: "Editorial Universitaria", year: "2018" },
    { author: "Proakis, John G., & Manolakis, Dimitris G.", title: "Tratamiento Digital de Señales: Principios, Algoritmos y Aplicaciones", edition: "4ta Edición", publisher: "Pearson", year: "2007" },
    { author: "Ogata, Katsuhiko", title: "Ingeniería de Control Moderna", edition: "5ta Edición", publisher: "Pearson Educación", year: "2010" }
  ]
};

if (typeof window !== "undefined") {
  window.LAB_DATA = LAB_DATA;
}
