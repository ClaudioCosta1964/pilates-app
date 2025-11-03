@echo off
chcp 65001 >nul
title Configuração Firebase - Aplicativo Pilates

echo.
echo ================================================================
echo              🔥 CONFIGURAÇÃO FIREBASE - PILATES 🔥
echo ================================================================
echo.

echo 📋 GUIA PASSO A PASSO PARA CONFIGURAR O FIREBASE:
echo.

echo [1] ACESSAR FIREBASE:
echo     🌐 https://console.firebase.google.com/
echo.

echo [2] CRIAR PROJETO:
echo     ✅ Clique em "Criar um projeto"
echo     ✅ Digite o nome: pilates-app (ou outro nome)
echo     ✅ Desative Google Analytics (opcional)
echo     ✅ Clique em "Criar projeto"
echo.

echo [3] ATIVAR FIRESTORE DATABASE:
echo     ✅ No painel, clique em "Firestore Database"
echo     ✅ Clique em "Criar banco de dados"
echo     ✅ Escolha "Iniciar no modo de teste"
echo     ✅ Selecione localização: us-central1
echo     ✅ Clique em "Próximo"
echo.

echo [4] ATIVAR AUTHENTICATION:
echo     ✅ Clique em "Authentication"
echo     ✅ Clique em "Começar"
echo     ✅ Vá em "Sign-in method"
echo     ✅ Ative "E-mail/senha"
echo.

echo [5] OBTER CREDENCIAIS:
echo     ✅ Clique na engrenagem (Configurações do projeto)
echo     ✅ Vá em "Contas de serviço"
echo     ✅ Clique em "Gerar nova chave privada"
echo     ✅ Baixe o arquivo JSON
echo.

echo [6] CONFIGURAR ARQUIVO .env:
echo     ✅ Abra o arquivo .env neste projeto
echo     ✅ Substitua os valores pelas suas credenciais
echo.

echo ================================================================
echo.

echo Deseja abrir o Firebase Console agora? (S/N)
set /p choice=
if /i "%choice%"=="S" (
    echo.
    echo 🌐 Abrindo Firebase Console...
    start https://console.firebase.google.com/
)

echo.
echo Deseja abrir o arquivo .env para edição? (S/N)
set /p choice2=
if /i "%choice2%"=="S" (
    echo.
    echo 📝 Abrindo arquivo .env...
    notepad .env
)

echo.
echo ================================================================
echo                    📋 INFORMAÇÕES IMPORTANTES
echo ================================================================
echo.
echo 🔑 DADOS NECESSÁRIOS PARA O .env:
echo.
echo FIREBASE_PROJECT_ID=seu-projeto-id
echo FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
echo FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
echo.
echo 📧 EMAIL PARA NOTIFICAÇÕES (opcional):
echo EMAIL_USER=seu-email@gmail.com
echo EMAIL_PASS=sua-senha-de-app
echo.
echo ================================================================
echo.

pause


