"""
=============================================================================
SCRIPT UNIFICADO: Análisis de Sistemas Lineales en Python (SciPy)
UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA
ESCUELA PROFESIONAL DE INGENIERÍA DE TELECOMUNICACIONES
LABORATORIO 02: SISTEMAS EN TIEMPO CONTINUO
CURSO: SEÑALES Y SISTEMAS - DR. ASENCIO HUAITA BEDREGAL (2026)
=============================================================================
Este script reúne 10 ejemplos de análisis de sistemas LTI:
   1. Función de transferencia y mapa de polos y ceros
   2. Respuesta al escalón - Sistema de 2do orden
   3. Respuesta al impulso - Sistema de 2do orden
   4. Sistema de 2do orden sobreamortiguado
   5. Sistema con polo real negativo (1er orden)
   6. Respuesta en frecuencia - Diagrama de Bode
   7. Respuesta al impulso: analítica vs convolución numérica
   8. Respuesta al impulso de un sistema LTI
   9. Sistema de 2do orden críticamente amortiguado
  10. Respuesta al escalón - Sistema de 1er orden
=============================================================================
"""

import matplotlib.pyplot as plt
import numpy as np
from scipy import signal


def pausar():
    """Muestra las figuras y espera a que se cierren antes de continuar."""
    plt.show(block=True)


# =============================================================================
# 1) FUNCIÓN DE TRANSFERENCIA Y MAPA DE POLOS Y CEROS
# =============================================================================
print("=== 1) Función de transferencia y mapa de polos y ceros ===")

num = [2, 5]
den = [1, 4, 3]

sys = signal.TransferFunction(num, den)
print("Función de transferencia:", sys)

polos = sys.poles
zeros = sys.zeros

plt.figure("1) Mapa de Polos y Ceros")
plt.scatter(np.real(zeros), np.imag(zeros), marker="o", color="blue", label="Ceros")
plt.scatter(np.real(polos), np.imag(polos), marker="x", color="red", label="Polos")
plt.axhline(0, color="black", linewidth=0.5)
plt.axvline(0, color="black", linewidth=0.5)
plt.title("Mapa de Polos y Ceros")
plt.xlabel("Parte Real")
plt.ylabel("Parte Imaginaria")
plt.grid(True)
plt.legend()
pausar()


# =============================================================================
# 2) RESPUESTA AL ESCALÓN UNITARIO - SISTEMA DE 2DO ORDEN
# =============================================================================
print("=== 2) Respuesta al escalón unitario - 2do orden ===")

num = [9]
den = [1, 2, 9]
sys = signal.TransferFunction(num, den)

t, y = signal.step(sys)

plt.figure("2) Escalón Unitario - 2do Orden")
plt.plot(t, y, color="r", linewidth=2)
plt.title("Respuesta al Escalón Unitario - 2do Orden (Python)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
pausar()


# =============================================================================
# 3) RESPUESTA AL IMPULSO - SISTEMA DE 2DO ORDEN
# =============================================================================
print("=== 3) Respuesta al impulso - 2do orden ===")

num = [4]
den = [1, 2, 8]
sys = signal.TransferFunction(num, den)

t, h = signal.impulse(sys)

plt.figure("3) Respuesta al Impulso - 2do Orden", figsize=(7, 4.5))
plt.plot(t, h, color="magenta", linewidth=2)
plt.title(r"Sistema con Respuesta al Impulso $h(t)$")
plt.xlabel("Tiempo (s)")
plt.ylabel("Respuesta h(t)")
plt.grid(True)
pausar()


# =============================================================================
# 4) SISTEMA DE SEGUNDO ORDEN SOBREAMORTIGUADO
# =============================================================================
print("=== 4) Sistema de 2do orden sobreamortiguado ===")

wn = 4
zeta = 2.0

num = [wn ** 2]
den = [1, 2 * zeta * wn, wn ** 2]
sys = signal.TransferFunction(num, den)

t, y = signal.step(sys)

plt.figure("4) Sistema Sobreamortiguado", figsize=(7, 4.5))
plt.plot(t, y, color="green", linewidth=2)
plt.title(r"Sistema de Segundo Orden Sobreamortiguado ($\zeta = 2.0$)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Amplitud")
plt.grid(True)
pausar()


# =============================================================================
# 5) SISTEMA DE PRIMER ORDEN CON POLO REAL NEGATIVO
# =============================================================================
print("=== 5) Polo real negativo (s = -3) ===")

a = 3
K = 6
num = [K]
den = [1, a]
sys = signal.TransferFunction(num, den)

t_step, y_step = signal.step(sys)
t_imp, y_imp = signal.impulse(sys)

plt.figure("5) Polo Real Negativo", figsize=(8, 6))

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
pausar()


# =============================================================================
# 6) RESPUESTA EN FRECUENCIA - DIAGRAMA DE BODE
# =============================================================================
print("=== 6) Respuesta en frecuencia - Bode ===")

num = [10]
den = [1, 2, 10]
sys = signal.TransferFunction(num, den)

w, magnitude, phase = sys.bode()

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6), num="6) Diagrama de Bode")

ax1.semilogx(w, magnitude)
ax1.set_title("Respuesta en Frecuencia - Bode (Python)")
ax1.set_ylabel("Magnitud (dB)")
ax1.grid(True, which="both")

ax2.semilogx(w, phase)
ax2.set_xlabel("Frecuencia (rad/s)")
ax2.set_ylabel("Fase (grados)")
ax2.grid(True, which="both")

plt.tight_layout()
pausar()


# =============================================================================
# 7) RESPUESTA AL IMPULSO: ANALÍTICA VS CONVOLUCIÓN NUMÉRICA
# =============================================================================
print("=== 7) Impulso: analítica vs convolución numérica ===")

num = [1]
den = [1, 2, 2]
sys = signal.TransferFunction(num, den)

# --- Método A: usando signal.impulse ---
t, h = signal.impulse(sys)

plt.figure("7) Impulso - Analítica vs Convolución", figsize=(8, 6))

plt.subplot(2, 1, 1)
plt.plot(t, h, color="b", linewidth=2)
plt.title("Respuesta al Impulso del Sistema - h(t) (Python)")
plt.ylabel("Amplitud")
plt.grid(True)

# --- Método B: convolución numérica ---
t_num = np.linspace(0, 10, 500)
dt = t_num[1] - t_num[0]

entrada_impulso = np.zeros_like(t_num)
entrada_impulso[0] = 1.0 / dt   # aproximación discreta de la delta de Dirac

t_out, y_conv, _ = signal.lsim(sys, entrada_impulso, t_num)

plt.subplot(2, 1, 2)
plt.plot(t_out, y_conv, color="g", linewidth=2)
plt.title("Respuesta al Impulso mediante Convolución Numérica")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)

plt.tight_layout()
pausar()


# =============================================================================
# 8) RESPUESTA AL IMPULSO DEL SISTEMA LTI
# =============================================================================
print("=== 8) Respuesta al impulso LTI ===")

num = [1]
den = [1, 3, 2]
sys = signal.TransferFunction(num, den)

t, y = signal.impulse(sys)

plt.figure("8) Impulso LTI")
plt.plot(t, y)
plt.title("Respuesta al Impulso del Sistema LTI (Python)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Amplitud")
plt.grid(True)
pausar()


# =============================================================================
# 9) SISTEMA DE 2DO ORDEN CRÍTICAMENTE AMORTIGUADO
# =============================================================================
print("=== 9) Sistema de 2do orden críticamente amortiguado ===")

wn = 3
num = [wn ** 2]
den = [1, 2 * wn, wn ** 2]   # zeta = 1
sys = signal.TransferFunction(num, den)

t, y = signal.step(sys)

plt.figure("9) Críticamente Amortiguado")
plt.plot(t, y, color="tab:blue", linewidth=2)
plt.title("Respuesta al Escalón Unitario - Sistema de 2do Orden (Críticamente Amortiguado)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
pausar()


# =============================================================================
# 10) RESPUESTA AL ESCALÓN - SISTEMA DE PRIMER ORDEN
# =============================================================================
print("=== 10) Respuesta al escalón - 1er orden ===")

tau = 2
num = [1]
den = [tau, 1]
sys = signal.TransferFunction(num, den)

t, y = signal.step(sys)

plt.figure("10) Escalón - 1er Orden")
plt.plot(t, y, color="purple", linewidth=2)
plt.title("Respuesta al Escalón - Sistema de Primer Orden (Python)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
pausar()

print("=== Análisis completado con éxito ===")
