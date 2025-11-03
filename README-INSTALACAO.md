# 🚀 Guia de Instalação e Deploy - Aplicativo Pilates

## 📋 Scripts Automatizados Criados

Criei **3 scripts automatizados** para facilitar a configuração:

### 1. 🛠️ **setup.bat** - Configuração Completa
- Verifica se Node.js está instalado
- Instala todas as dependências automaticamente
- Cria arquivo de configuração (.env)
- Testa se tudo está funcionando

### 2. 🚀 **start-server.bat** - Iniciar Servidor
- Inicia o servidor do aplicativo
- Mostra a URL para acessar (http://localhost:3000)

### 3. 🔥 **configure-firebase.bat** - Guia Firebase
- Abre o Firebase Console
- Mostra passo a passo como configurar
- Abre o arquivo .env para edição

---

## 🎯 **Como Usar (Super Fácil!)**

### **PASSO 1: Instalar Node.js** (se ainda não tiver)
1. Acesse: https://nodejs.org/
2. Baixe e instale a versão LTS
3. Reinicie o computador

### **PASSO 2: Executar Configuração Automática**
```
Duplo clique em: setup.bat
```

### **PASSO 3: Configurar Firebase**
```
Duplo clique em: configure-firebase.bat
```

### **PASSO 4: Iniciar o Aplicativo**
```
Duplo clique em: start-server.bat
```

### **PASSO 5: Acessar**
Abra o navegador em: **http://localhost:3000**

---

## 🔧 **Configuração Manual (se necessário)**

### **1. Instalar Dependências:**
```bash
npm install
```

### **2. Configurar Firebase:**
1. Acesse: https://console.firebase.google.com/
2. Crie um projeto
3. Ative Firestore Database
4. Ative Authentication
5. Baixe as credenciais

### **3. Editar arquivo .env:**
```env
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="sua-chave-privada"
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
```

### **4. Executar:**
```bash
npm run dev
```

---

## 📱 **Funcionalidades do Aplicativo**

✅ **Cadastro de Alunos** (nome, telefone, email, data nascimento)
✅ **Sistema de Pagamentos** (controle de vencimentos)
✅ **Exercícios de Pilates** (base completa com benefícios)
✅ **Aniversários Automáticos** (parabéns por email)
✅ **Relatórios e Dashboard** (estatísticas completas)

---

## 🆘 **Problemas Comuns**

### **Node.js não encontrado:**
- Instale do site oficial: https://nodejs.org/
- Reinicie o computador após instalação

### **Erro de dependências:**
- Execute: `npm install` novamente
- Verifique conexão com internet

### **Erro de Firebase:**
- Verifique se as credenciais no .env estão corretas
- Confirme se Firestore está ativo no Firebase

### **Porta ocupada:**
- Altere a porta no .env para 3001 ou 8080
- Reinicie o servidor

---

## 🎉 **Sucesso!**

Quando tudo estiver funcionando, você verá:
- Interface moderna e responsiva
- Dashboard com estatísticas
- Formulários para cadastrar alunos
- Lista de exercícios de Pilates
- Sistema completo de gestão

**Agora é só usar! 🧘‍♀️**

---

## 🌐 **Colocar na Internet**

### **Opção Rápida (10 minutos pelo navegador)**

📄 **Veja o guia completo:** `COMO-COLOCAR-NA-INTERNET.md` ou `DEPLOY-MANUAL-FACIL.txt`

### **Resumo:**

1. Crie conta no GitHub: https://github.com/signup
2. Crie conta no Vercel: https://vercel.com/signup
3. Envie seu código para GitHub
4. Importe no Vercel
5. Configure as variáveis de ambiente (usando `variaveis-vercel.txt`)
6. **Pronto!** Sua aplicação estará online! 🎉


