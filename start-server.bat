@echo off
chcp 65001 >nul
title Aplicativo Pilates - Servidor

echo.
echo ================================================================
echo              🧘‍♀️ APLICATIVO PILATES - SERVIDOR 🧘‍♀️
echo ================================================================
echo.

echo 🚀 Iniciando servidor...
echo.
echo 📍 URL: http://localhost:3000
echo 📍 Pasta: %cd%
echo.
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo.
echo ================================================================
echo.

npm run dev


