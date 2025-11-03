# 🧘‍♀️ Aplicativo Pilates - Gerenciamento de Studio

Sistema completo para gerenciamento de estúdios de Pilates, desenvolvido para profissionais e alunos.

## 🎯 Funcionalidades

### ✅ Campos Obrigatórios para Alunos
- **Nome completo**
- **Telefone**
- **Email**
- **Data de nascimento**

### 💰 Sistema de Pagamentos
- Registro de pagamentos dos alunos
- Controle de vencimentos
- Relatórios de pagamentos em atraso
- Diferentes métodos de pagamento (Dinheiro, Cartão, PIX, Transferência)
- Planos flexíveis (Mensal, Trimestral, Semestral, Anual)

### 🏃‍♀️ Acompanhamento de Exercícios
- Base de dados com exercícios de Pilates
- Benefícios específicos de cada exercício
- Níveis de dificuldade (Iniciante, Intermediário, Avançado)
- Categorias (Core, Flexibilidade, Equilíbrio)
- Tempo estimado para cada exercício

### 🎂 Sistema de Aniversários
- Verificação automática de aniversariantes
- Envio automático de parabéns por email
- Notificações no sistema
- Controle de idade dos alunos

### 📊 Relatórios e Dashboard
- Estatísticas em tempo real
- Gráficos de alunos por nível
- Relatórios de pagamentos
- Atividade recente
- Próximos aniversários

## 🏗️ Tecnologias Utilizadas

### Backend
- **Node.js** com Express
- **Firebase Firestore** (Banco de dados)
- **Firebase Authentication** (Autenticação)
- **Nodemailer** (Envio de emails)
- **Moment.js** (Manipulação de datas)

### Frontend
- **HTML5** e **CSS3**
- **Bootstrap 5** (Interface responsiva)
- **JavaScript Vanilla**
- **Chart.js** (Gráficos)
- **Font Awesome** (Ícones)

## 🚀 Como Configurar

### 1. Pré-requisitos
- Node.js (versão 14 ou superior)
- Conta no Firebase
- Email para notificações (Gmail recomendado)

### 2. Configuração do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative os serviços:
   - **Firestore Database**
   - **Authentication**
   - **Storage** (opcional)
4. Baixe o arquivo de credenciais do Service Account
5. Configure as regras de segurança do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Para desenvolvimento - ajuste para produção
    }
  }
}
```

### 3. Instalação

```bash
# Clone o repositório
git clone [seu-repositorio]
cd pilates-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env
```

### 4. Configuração das Variáveis de Ambiente

Edite o arquivo `.env` com suas credenciais:

```env
# Firebase
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY_ID=sua-private-key-id
FIREBASE_PRIVATE_KEY="sua-private-key"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=sua-client-id

# Email (para notificações de aniversário)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# Servidor
PORT=3000
NODE_ENV=development
```

### 5. Configuração do Email

Para enviar notificações de aniversário:

1. Use uma conta Gmail
2. Ative a verificação em 2 etapas
3. Gere uma senha de aplicativo
4. Use a senha de aplicativo no campo `EMAIL_PASS`

### 6. Executar o Aplicativo

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

Acesse: `http://localhost:3000`

## 📱 Como Usar

### 1. Dashboard
- Visualize estatísticas gerais
- Veja atividade recente
- Acompanhe próximos aniversários

### 2. Gerenciar Alunos
- Cadastre novos alunos com dados obrigatórios
- Filtre por nome, nível ou status
- Visualize histórico completo

### 3. Pagamentos
- Registre pagamentos recebidos
- Configure diferentes planos
- Acompanhe vencimentos

### 4. Exercícios
- Consulte base de exercícios de Pilates
- Veja benefícios específicos
- Oriente alunos por nível

### 5. Aniversários
- Verifique aniversariantes do dia
- Envie parabéns automaticamente
- Acompanhe notificações enviadas

## 🏃‍♀️ Exercícios de Pilates Incluídos

### Nível Iniciante
- **The Hundred** - Fortalece core e melhora respiração
- **Single-Leg Stretch** - Coordenação e estabilização

### Nível Intermediário
- **Roll-Up** - Flexibilidade da coluna
- **Swan Dive** - Fortalece músculos das costas

### Nível Avançado
- **Teaser** - Controle corporal e equilíbrio

## 🔧 API Endpoints

### Alunos
- `GET /api/alunos` - Listar todos os alunos
- `POST /api/alunos` - Cadastrar novo aluno
- `GET /api/alunos/:id` - Buscar aluno específico
- `PUT /api/alunos/:id` - Atualizar dados do aluno

### Pagamentos
- `POST /api/pagamentos` - Registrar pagamento
- `GET /api/alunos/:id/pagamentos` - Pagamentos de um aluno

### Exercícios
- `GET /api/exercicios` - Listar exercícios
- `POST /api/exercicios/registrar` - Registrar exercício realizado

### Aniversários
- `POST /api/verificar-aniversarios` - Verificar aniversariantes

### Relatórios
- `GET /api/relatorios/alunos-por-nivel` - Estatísticas por nível
- `GET /api/relatorios/pagamentos-atrasados` - Pagamentos em atraso

## 🎨 Interface

A interface foi desenvolvida com foco na usabilidade:

- **Design responsivo** para desktop e mobile
- **Cores suaves** inspiradas no bem-estar do Pilates
- **Navegação intuitiva** com sidebar lateral
- **Notificações visuais** para feedback do usuário
- **Gráficos interativos** para relatórios

## 🔒 Segurança

- Autenticação via Firebase
- Validação de dados no backend
- Sanitização de inputs
- Regras de segurança do Firestore

## 🚀 Deploy

### Opções de Hospedagem Recomendadas

1. **Firebase Hosting** (Recomendado)
2. **Heroku**
3. **Vercel**
4. **Netlify**

### Deploy no Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init hosting

# Build do frontend
npm run build

# Deploy
firebase deploy
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou sugestões:
- Abra uma issue no GitHub
- Entre em contato via email

---

**Desenvolvido com ❤️ para profissionais de Pilates e seus alunos**


