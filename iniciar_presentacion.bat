@echo off
title Presentacion Web - Laboratorio 02: Sistemas en Tiempo Continuo (UNSA)
cd /d "%~dp0"
echo =========================================================================
echo    UNIVERSIDAD NACIONAL DE SAN AGUSTIN DE AREQUIPA
echo    ESCUELA PROFESIONAL DE INGENIERIA DE TELECOMUNICACIONES
echo    LABORATORIO 02: SISTEMAS EN TIEMPO CONTINUO
echo =========================================================================
echo Iniciando servidor local en http://localhost:8089/ ...
start "" http://localhost:8089/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
