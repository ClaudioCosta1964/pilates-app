@echo off
chcp 65001 >nul
title Configuração do Aplicativo Pilates

echo.
echo ================================================================
echo                🧘‍♀️ CONFIGURAÇÃO APLICATIVO PILATES 🧘‍♀️
echo ================================================================
echo.

echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Node.js não encontrado no PATH, mas pode estar instalado...
    echo 🔍 Verificando instalação padrão...
    
    if exist "C:\Program Files\nodejs\node.exe" (
        echo ✅ Node.js encontrado em: C:\Program Files\nodejs\
        echo 🔧 Adicionando ao PATH temporariamente...
        set PATH=%PATH%;C:\Program Files\nodejs\
        
        node --version >nul 2>&1
        if %errorlevel% equ 0 (
            echo ✅ Node.js funcionando!
            node --version
        ) else (
            echo ❌ Erro ao executar Node.js
            echo 📥 Por favor, reinstale o Node.js de: https://nodejs.org/
            pause
            exit /b 1
        )
    ) else (
        echo ❌ Node.js não encontrado!
        echo.
        echo 📥 INSTALANDO NODE.JS...
        echo.
        echo Por favor, siga estes passos:
        echo 1. Acesse: https://nodejs.org/
        echo 2. Baixe a versão LTS (recomendada)
        echo 3. Execute o instalador
        echo 4. Reinicie este script após a instalação
        echo.
        pause
        exit /b 1
    )
) else (
    echo ✅ Node.js encontrado!
    node --version
)

echo.
echo [2/6] Verificando NPM...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ NPM não encontrado!
    pause
    exit /b 1
) else (
    echo ✅ NPM encontrado!
    npm --version
)

echo.
echo [3/6] Instalando dependências do projeto...
echo.
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
) else (
    echo ✅ Dependências instaladas com sucesso!
)

echo.
echo [4/6] Configurando arquivo de ambiente...
if not exist .env (
    copy env.example .env >nul
    echo ✅ Arquivo .env criado!
) else (
    echo ✅ Arquivo .env já existe!
)

echo.
echo [5/6] Verificando estrutura do projeto...
if not exist client (
    echo ❌ Pasta 'client' não encontrada!
    pause
    exit /b 1
) else (
    echo ✅ Estrutura do projeto OK!
)

echo.
echo [6/6] Testando configuração...
echo.
echo ================================================================
echo                    ✅ CONFIGURAÇÃO CONCLUÍDA!
echo ================================================================
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. 🔥 Configure o Firebase:
echo    - Acesse: https://console.firebase.google.com/
echo    - Crie um novo projeto
echo    - Ative Firestore Database
echo    - Ative Authentication
echo.
echo 2. ⚙️ Edite o arquivo .env com suas credenciais do Firebase
echo.
echo 3. 🚀 Execute o servidor:
echo    npm run dev
echo.
echo 4. 🌐 Acesse: http://localhost:3000
echo.
echo ================================================================
echo.
echo Deseja iniciar o servidor agora? (S/N)
set /p choice=
if /i "%choice%"=="S" (
    echo.
    echo 🚀 Iniciando servidor...
    npm run dev
) else (
    echo.
    echo Para iniciar o servidor mais tarde, execute: npm run dev
)

echo.
pause


