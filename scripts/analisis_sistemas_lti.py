"""
=============================================================================
SCRIPT UNIFICADO: Análisis de Sistemas Lineales en Python (SciPy)
UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA (UNSA)
ESCUELA PROFESIONAL DE INGENIERÍA DE TELECOMUNICACIONES (EPIT)
LABORATORIO 02: SISTEMAS EN TIEMPO CONTINUO
CURSO: SEÑALES Y SISTEMAS - DR. ASENCIO ALEJANDRO HUAITA BEDREGAL (2026)
# =============================================================================
# TAREA 1 (Página 5 de la Guía Oficial de Laboratorio):
#    Tema 01: Respuesta al impulso de un sistema LTI (Franco Gutierrez)
#    Tema 02: Función de transferencia de un sistema LTI (Franco Gutierrez)
#    Tema 03: Respuesta al impulso de un sistema (Jeremy Villalta)
#    Tema 04: Respuesta en frecuencia (Jeremy Villalta)
#    Tema 05: Sistema de primer orden (Henry Gutierrez)
#
# TAREA 2 (Página 9 de la Guía Oficial de Laboratorio):
#    Tema 06: Sistema de segundo orden subamortiguado (Alex Quispe)
#    Tema 07: Respuesta al escalón unitario de un sistema de segundo orden (Alex Quispe)
#    Tema 08: Sistema de segundo orden sobreamortigua (Zaul Uturunco)
#    Tema 09: Sistema con respuesta impulso (Benjamín Quispe)
#    Tema 10: Sistema de primer orden con polo real negativo (Henry Gutierrez)
# =============================================================================
"""

import matplotlib.pyplot as plt
import numpy as np
from scipy import signal


def pausar():
    """Muestra la figura y espera que el usuario la cierre antes de continuar."""
    plt.show(block=True)


# =============================================================================
# TEMA 01: RESPUESTA AL IMPULSO DE UN SISTEMA LTI (Franco Gutierrez)
# =============================================================================
print("=== TEMA 01: Respuesta al impulso de un sistema LTI ===")
# H(s) = 1 / (s^2 + 3s + 2) -> h(t) = (e^(-t) - e^(-2t)) * u(t)

num1 = [1]
den1 = [1, 3, 2]
sys1 = signal.TransferFunction(num1, den1)

t1, y1 = signal.impulse(sys1)

plt.figure("Tema 01 - Impulso LTI", figsize=(7.5, 4.8))
plt.plot(t1, y1, color="#1f77b4", linewidth=2)
plt.title(r"Tema 01: Respuesta al Impulso del Sistema LTI $h(t)$ (Python)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Amplitud")
plt.grid(True)
pausar()


# =============================================================================
# TEMA 02: FUNCIÓN DE TRANSFERENCIA Y MAPA DE POLOS Y CEROS (Franco Gutierrez)
# =============================================================================
print("=== TEMA 02: Función de transferencia y mapa de polos y ceros ===")
# H(s) = (2s + 5) / (s^2 + 4s + 3) -> Cero en s = -2.5, Polos en s = -1, -3

num2 = [2, 5]
den2 = [1, 4, 3]
sys2 = signal.TransferFunction(num2, den2)
print("Función de transferencia H(s):", sys2)

polos2 = sys2.poles
ceros2 = sys2.zeros

plt.figure("Tema 02 - Mapa de Polos y Ceros", figsize=(7.5, 4.8))
plt.scatter(np.real(ceros2), np.imag(ceros2), marker="o", color="blue", s=80, label="Ceros (o)")
plt.scatter(np.real(polos2), np.imag(polos2), marker="x", color="red", s=80, label="Polos (x)")
plt.axhline(0, color="black", linestyle="--", linewidth=0.8)
plt.axvline(0, color="black", linestyle="--", linewidth=0.8)
plt.title("Tema 02: Mapa de Polos y Ceros en el Plano s")
plt.xlabel(r"Parte Real ($\sigma$)")
plt.ylabel(r"Parte Imaginaria ($j\omega$)")
plt.grid(True)
plt.legend()
pausar()


# =============================================================================
# TEMA 03: RESPUESTA AL IMPULSO: ANALÍTICA VS CONVOLUCIÓN NUMÉRICA (Jeremy Villalta)
# =============================================================================
print("=== TEMA 03: Impulso analítica vs convolución numérica ===")
# H(s) = 1 / (s^2 + 2s + 2) -> h(t) = e^(-t) * sin(t) * u(t)

num3 = [1]
den3 = [1, 2, 2]
sys3 = signal.TransferFunction(num3, den3)

# Metodo analitico continuo
t3, h3 = signal.impulse(sys3)

# Metodo numerico mediante aproximacion de Dirac delta
t_num = np.linspace(0, 10, 500)
dt = t_num[1] - t_num[0]
entrada_impulso = np.zeros_like(t_num)
entrada_impulso[0] = 1.0 / dt  # Area unitaria = 1

t_out, y_conv, _ = signal.lsim(sys3, entrada_impulso, t_num)

fig3, (ax3a, ax3b) = plt.subplots(2, 1, figsize=(8, 6), num="Tema 03 - Impulso vs Convolucion")
ax3a.plot(t3, h3, color="b", linewidth=2)
ax3a.set_title("Tema 03: Respuesta al Impulso Analítica - h(t)")
ax3a.set_ylabel("Amplitud")
ax3a.grid(True)

ax3b.plot(t_out, y_conv, color="g", linewidth=2)
ax3b.set_title(r"Respuesta mediante Convolución Numérica (Área $\delta = 1$)")
ax3b.set_xlabel("Tiempo (s)")
ax3b.set_ylabel("Salida y(t)")
ax3b.grid(True)

plt.tight_layout()
pausar()


# =============================================================================
# TEMA 04: RESPUESTA EN FRECUENCIA - DIAGRAMA DE BODE (Jeremy Villalta)
# =============================================================================
print("=== TEMA 04: Respuesta en frecuencia - Diagrama de Bode ===")
# H(s) = 10 / (s^2 + 2s + 10)

num4 = [10]
den4 = [1, 2, 10]
sys4 = signal.TransferFunction(num4, den4)

w4, mag4, phase4 = sys4.bode()

fig4, (ax4a, ax4b) = plt.subplots(2, 1, figsize=(8, 6), num="Tema 04 - Diagrama de Bode")
ax4a.semilogx(w4, mag4, color="#7064f2", linewidth=2)
ax4a.set_title("Tema 04: Diagrama de Bode - Magnitud (dB)")
ax4a.set_ylabel("Magnitud (dB)")
ax4a.grid(True, which="both")

ax4b.semilogx(w4, phase4, color="#10b981", linewidth=2)
ax4b.set_title("Diagrama de Bode - Fase (grados)")
ax4b.set_xlabel("Frecuencia (rad/s)")
ax4b.set_ylabel("Fase (°)")
ax4b.grid(True, which="both")

plt.tight_layout()
pausar()


# =============================================================================
# TEMA 05: SISTEMA DE PRIMER ORDEN AL ESCALÓN (Henry Gutierrez)
# =============================================================================
print("=== TEMA 05: Sistema de primer orden al escalón ===")
# H(s) = 1 / (2s + 1) -> tau = 2 s

tau5 = 2.0
num5 = [1]
den5 = [tau5, 1]
sys5 = signal.TransferFunction(num5, den5)

t5, y5 = signal.step(sys5)

plt.figure("Tema 05 - 1er Orden al Escalon", figsize=(7.5, 4.8))
plt.plot(t5, y5, color="purple", linewidth=2)
plt.axhline(0.632, color="gray", linestyle="--", label=r"63.2% en $t = \tau$ (2s)")
plt.axvline(2.0, color="gray", linestyle="--")
plt.title(r"Tema 05: Respuesta al Escalón - Sistema de Primer Orden ($\tau = 2$ s)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
plt.legend()
pausar()


# =============================================================================
# TEMA 06: SISTEMA DE SEGUNDO ORDEN SUBAMORTIGUADO (Alex Quispe)
# =============================================================================
print("=== TEMA 06: Sistema de segundo orden subamortiguado ===")
# H(s) = 9 / (s^2 + 3s + 9) -> wn = 3, zeta = 0.5 (polos complejos conjugados)

wn6 = 3.0
zeta6 = 0.5
num6 = [wn6 ** 2]
den6 = [1, 2 * zeta6 * wn6, wn6 ** 2]
sys6 = signal.TransferFunction(num6, den6)

t6, y6 = signal.step(sys6)

plt.figure("Tema 06 - 2do Orden Subamortiguado", figsize=(7.5, 4.8))
plt.plot(t6, y6, color="#1f77b4", linewidth=2)
plt.title(r"Tema 06: Sistema de Segundo Orden Subamortiguado ($\zeta = 0.5$, $\omega_n = 3$)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
pausar()


# =============================================================================
# TEMA 07: RESPUESTA AL ESCALÓN CON SOBREIMPULSO (Alex Quispe)
# =============================================================================
print("=== TEMA 07: Respuesta al escalón unitario con sobreimpulso ===")
# H(s) = 9 / (s^2 + 2s + 9) -> wn = 3, zeta = 0.333, Mp = 32.9%

num7 = [9]
den7 = [1, 2, 9]
sys7 = signal.TransferFunction(num7, den7)

t7, y7 = signal.step(sys7)

plt.figure("Tema 07 - Escalón con Sobreimpulso", figsize=(7.5, 4.8))
plt.plot(t7, y7, color="r", linewidth=2)
plt.axhline(1.329, color="darkred", linestyle="--", label=r"Pico $M_p = 32.9\%$ (1.33 V)")
plt.axvline(1.11, color="darkred", linestyle="--", label=r"$t_p = 1.11$ s")
plt.title(r"Tema 07: Respuesta al Escalón Unitario - 2do Orden ($M_p = 32.9\%$)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
plt.legend()
pausar()


# =============================================================================
# TEMA 08: SISTEMA DE SEGUNDO ORDEN SOBREAMORTIGUADO (Zaul Uturunco)
# =============================================================================
print("=== TEMA 08: Sistema de segundo orden sobreamortiguado ===")
# H(s) = 16 / (s^2 + 16s + 16) -> wn = 4, zeta = 2.0 (polos reales: -1.07 y -14.93)

wn8 = 4.0
zeta8 = 2.0
num8 = [wn8 ** 2]
den8 = [1, 2 * zeta8 * wn8, wn8 ** 2]
sys8 = signal.TransferFunction(num8, den8)

t8, y8 = signal.step(sys8)

plt.figure("Tema 08 - Sobreamortiguado", figsize=(7.5, 4.8))
plt.plot(t8, y8, color="green", linewidth=2)
plt.title(r"Tema 08: Sistema de Segundo Orden Sobreamortiguado ($\zeta = 2.0$, $\omega_n = 4$)")
plt.xlabel("Tiempo (s)")
plt.ylabel("Salida y(t)")
plt.grid(True)
pausar()


# =============================================================================
# TEMA 09: SISTEMA CON RESPUESTA AL IMPULSO OSCILATORIA (Benjamín Quispe)
# =============================================================================
print("=== TEMA 09: Sistema con respuesta al impulso oscilatoria ===")
# H(s) = 4 / (s^2 + 2s + 8) -> h(t) = (4/sqrt(7)) * e^(-t) * sin(sqrt(7)*t) * u(t)

num9 = [4]
den9 = [1, 2, 8]
sys9 = signal.TransferFunction(num9, den9)

t9, h9 = signal.impulse(sys9)

plt.figure("Tema 09 - Impulso Oscilatorio", figsize=(7.5, 4.8))
plt.plot(t9, h9, color="magenta", linewidth=2)
plt.title(r"Tema 09: Sistema con Respuesta al Impulso Oscilatoria $h(t)$")
plt.xlabel("Tiempo (s)")
plt.ylabel("Respuesta h(t)")
plt.grid(True)
pausar()


# =============================================================================
# TEMA 10: SISTEMA DE PRIMER ORDEN CON POLO REAL NEGATIVO (Henry Gutierrez)
# =============================================================================
print("=== TEMA 10: Sistema con polo real negativo ===")
# H(s) = 6 / (s + 3) -> Polo en s = -3, Ganancia DC = 2

a10 = 3.0
K10 = 6.0
num10 = [K10]
den10 = [1, a10]
sys10 = signal.TransferFunction(num10, den10)

t_step10, y_step10 = signal.step(sys10)
t_imp10, y_imp10 = signal.impulse(sys10)

fig10, (ax10a, ax10b) = plt.subplots(2, 1, figsize=(8, 6), num="Tema 10 - Polo Real Negativo")
ax10a.plot(t_step10, y_step10, color="red", linewidth=2)
ax10a.set_title(f"Tema 10: Respuesta al Escalón (Polo en s = -{a10}, Ganancia DC = 2)")
ax10a.set_ylabel("Amplitud")
ax10a.grid(True)

ax10b.plot(t_imp10, y_imp10, color="blue", linewidth=2)
ax10b.set_title(r"Respuesta al Impulso (Decaimiento Exponencial $6e^{-3t}$)")
ax10b.set_xlabel("Tiempo (s)")
ax10b.set_ylabel("Amplitud")
ax10b.grid(True)

plt.tight_layout()
pausar()

print("=== Todos los 10 temas fueron ejecutados exitosamente ===")
