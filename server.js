// Wrapper de segurança para evitar crashes
try {
  const express = require('express');
  const cors = require('cors');
  const admin = require('firebase-admin');
  const moment = require('moment');
  const nodemailer = require('nodemailer');
  require('dotenv').config();

  // Log inicial para debug
  console.log('🚀 Iniciando servidor...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL:', process.env.VERCEL);

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static('client')); // Servir arquivos estáticos da pasta client

  // Inicializar Firebase Admin
  let db;
  try {
    if (!admin.apps.length) {
      // Verificar se todas as variáveis estão presentes
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.error('❌ Variáveis do Firebase não configuradas!');
        console.error('FIREBASE_PROJECT_ID:', !!process.env.FIREBASE_PROJECT_ID);
        console.error('FIREBASE_PRIVATE_KEY:', !!process.env.FIREBASE_PRIVATE_KEY);
        console.error('FIREBASE_CLIENT_EMAIL:', !!process.env.FIREBASE_CLIENT_EMAIL);
      } else {
        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
          token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token"
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase inicializado com sucesso');
      }
    }
    if (admin.apps.length > 0) {
      db = admin.firestore();
      console.log('✅ Firestore inicializado');
    } else {
      console.error('❌ Firebase não foi inicializado');
      db = null;
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error.message);
    console.error('Stack:', error.stack);
    db = null;
  }

  // Configuração do Nodemailer para envio de emails (opcional)
  let transporter = null;
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('✅ Nodemailer configurado');
    } else {
      console.log('⚠️ Nodemailer não configurado (EMAIL_USER ou EMAIL_PASS faltando)');
    }
  } catch (error) {
    console.error('❌ Erro ao configurar Nodemailer:', error.message);
    transporter = null;
  }

  // ===== ROTAS PARA ALUNOS =====

  // Cadastrar novo aluno
  app.post('/api/alunos', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
      }
    
    const { nome, telefone, email, dataNascimento, nivel = 'iniciante' } = req.body;
    
    // Validar campos obrigatórios
    if (!nome || !telefone || !email || !dataNascimento) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, telefone, email, dataNascimento' });
    }

    const alunoData = {
      nome,
      telefone,
      email,
      dataNascimento: admin.firestore.Timestamp.fromDate(new Date(dataNascimento)),
      dataCadastro: admin.firestore.Timestamp.now(),
      ultimaAtualizacao: admin.firestore.Timestamp.now(),
      status: 'ativo',
      nivel,
      restricoesMedicas: [],
      profissionalResponsavel: req.body.profissionalResponsavel || null
    };

    const docRef = await db.collection('alunos').add(alunoData);
    
    res.status(201).json({ 
      id: docRef.id, 
      message: 'Aluno cadastrado com sucesso!',
      data: alunoData 
    });
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar todos os alunos
app.get('/api/alunos', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const snapshot = await db.collection('alunos').get();
    const alunos = [];
    
    snapshot.forEach(doc => {
      alunos.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar aluno por ID
app.get('/api/alunos/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const doc = await db.collection('alunos').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar dados do aluno
app.put('/api/alunos/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const alunoId = req.params.id;
    const updateData = {
      ...req.body,
      ultimaAtualizacao: admin.firestore.Timestamp.now()
    };

    // Converter dataNascimento se fornecida
    if (updateData.dataNascimento) {
      updateData.dataNascimento = admin.firestore.Timestamp.fromDate(new Date(updateData.dataNascimento));
    }

    await db.collection('alunos').doc(alunoId).update(updateData);
    
    res.json({ message: 'Aluno atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS PARA PAGAMENTOS =====

// Registrar pagamento
app.post('/api/pagamentos', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const { alunoId, valor, dataVencimento, plano = 'mensal', metodoPagamento = 'dinheiro' } = req.body;
    
    if (!alunoId || !valor || !dataVencimento) {
      return res.status(400).json({ error: 'Campos obrigatórios: alunoId, valor, dataVencimento' });
    }

    const pagamentoData = {
      alunoId,
      valor: parseFloat(valor),
      dataVencimento: admin.firestore.Timestamp.fromDate(new Date(dataVencimento)),
      dataPagamento: admin.firestore.Timestamp.now(),
      status: 'pago',
      metodoPagamento,
      plano,
      observacoes: req.body.observacoes || ''
    };

    const docRef = await db.collection('pagamentos').add(pagamentoData);
    
    res.status(201).json({ 
      id: docRef.id, 
      message: 'Pagamento registrado com sucesso!',
      data: pagamentoData 
    });
  } catch (error) {
    console.error('Erro ao registrar pagamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar pagamentos de um aluno
app.get('/api/alunos/:id/pagamentos', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const alunoId = req.params.id;
    const snapshot = await db.collection('pagamentos')
      .where('alunoId', '==', alunoId)
      .orderBy('dataPagamento', 'desc')
      .get();
    
    const pagamentos = [];
    snapshot.forEach(doc => {
      pagamentos.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(pagamentos);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS PARA EXERCÍCIOS =====

// Listar exercícios disponíveis
app.get('/api/exercicios', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const snapshot = await db.collection('exercicios').get();
    const exercicios = [];
    
    snapshot.forEach(doc => {
      exercicios.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(exercicios);
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar exercício realizado pelo aluno
app.post('/api/exercicios/registrar', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const { alunoId, exercicioId, duracao, observacoes } = req.body;
    
    if (!alunoId || !exercicioId) {
      return res.status(400).json({ error: 'Campos obrigatórios: alunoId, exercicioId' });
    }

    const registroData = {
      alunoId,
      exercicioId,
      duracao: parseInt(duracao) || 0,
      dataRegistro: admin.firestore.Timestamp.now(),
      observacoes: observacoes || ''
    };

    const docRef = await db.collection('progresso').add(registroData);
    
    res.status(201).json({ 
      id: docRef.id, 
      message: 'Exercício registrado com sucesso!',
      data: registroData 
    });
  } catch (error) {
    console.error('Erro ao registrar exercício:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== SISTEMA DE ANIVERSÁRIOS =====

// Função para verificar aniversariantes e enviar parabéns
app.post('/api/verificar-aniversarios', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const hoje = moment().format('MM-DD');
    const snapshot = await db.collection('alunos').get();
    const aniversariantes = [];
    
    snapshot.forEach(doc => {
      const aluno = doc.data();
      const dataNascimento = moment(aluno.dataNascimento.toDate()).format('MM-DD');
      
      if (dataNascimento === hoje) {
        aniversariantes.push({
          id: doc.id,
          ...aluno,
          idade: moment().diff(moment(aluno.dataNascimento.toDate()), 'years')
        });
      }
    });
    
    // Enviar notificações para os aniversariantes
    for (const aniversariante of aniversariantes) {
      await enviarParabensAniversario(aniversariante);
    }
    
    res.json({ 
      message: `Verificação concluída. ${aniversariantes.length} aniversariantes encontrados.`,
      aniversariantes 
    });
  } catch (error) {
    console.error('Erro ao verificar aniversários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para enviar parabéns de aniversário
async function enviarParabensAniversario(aluno) {
  try {
    // Registrar notificação no banco
    await db.collection('notificacoes').add({
      alunoId: aluno.id,
      tipo: 'aniversario',
      titulo: '🎉 Feliz Aniversário!',
      mensagem: `Parabéns ${aluno.nome}! Que este novo ano de vida seja repleto de saúde, bem-estar e muitas conquistas no Pilates!`,
      dataEnvio: admin.firestore.Timestamp.now(),
      status: 'enviada'
    });

    // Enviar email (opcional)
    if (aluno.email && transporter) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: aluno.email,
          subject: '🎉 Feliz Aniversário! - Studio Pilates',
          html: `
            <h2>Feliz Aniversário, ${aluno.nome}!</h2>
            <p>Que este novo ano de vida seja repleto de saúde, bem-estar e muitas conquistas no Pilates!</p>
            <p>Continue cuidando do seu corpo e mente através da prática do Pilates.</p>
            <p>Com carinho,<br>Equipe do Studio Pilates</p>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error(`Erro ao enviar email para ${aluno.nome}:`, emailError.message);
        // Não falha se o email não puder ser enviado
      }
    }
    
    console.log(`Parabéns enviado para ${aluno.nome}`);
  } catch (error) {
    console.error(`Erro ao enviar parabéns para ${aluno.nome}:`, error);
  }
}

// ===== ROTAS PARA RELATÓRIOS =====

// Relatório de alunos por nível
app.get('/api/relatorios/alunos-por-nivel', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const snapshot = await db.collection('alunos').get();
    const relatorio = {
      iniciante: 0,
      intermediario: 0,
      avancado: 0,
      total: 0
    };
    
    snapshot.forEach(doc => {
      const aluno = doc.data();
      if (aluno.status === 'ativo') {
        relatorio[aluno.nivel]++;
        relatorio.total++;
      }
    });
    
    res.json(relatorio);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Relatório de pagamentos em atraso
app.get('/api/relatorios/pagamentos-atrasados', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase não inicializado. Verifique as variáveis de ambiente.' });
    }
    
    const hoje = admin.firestore.Timestamp.now();
    const snapshot = await db.collection('pagamentos')
      .where('dataVencimento', '<', hoje)
      .where('status', '==', 'pendente')
      .get();
    
    const pagamentosAtrasados = [];
    snapshot.forEach(doc => {
      pagamentosAtrasados.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(pagamentosAtrasados);
  } catch (error) {
    console.error('Erro ao buscar pagamentos atrasados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota principal - servir a página inicial
app.get('/', (req, res) => {
  try {
    const path = require('path');
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  } catch (error) {
    console.error('Erro ao servir página inicial:', error);
    res.status(500).send('Erro ao carregar página');
  }
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor do Aplicativo Pilates funcionando!',
    timestamp: new Date().toISOString(),
    firebase: db ? 'Conectado' : 'Desconectado',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota de diagnóstico
app.get('/api/diagnostico', (req, res) => {
  const diagnostico = {
    servidor: 'OK',
    firebase: {
      inicializado: !!db,
      projectId: process.env.FIREBASE_PROJECT_ID ? 'Configurado' : 'Não configurado',
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'Configurado' : 'Não configurado',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'Configurado' : 'Não configurado'
    },
    variaveis: {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY_ID: !!process.env.FIREBASE_PRIVATE_KEY_ID,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_CLIENT_ID: !!process.env.FIREBASE_CLIENT_ID,
      FIREBASE_AUTH_URI: !!process.env.FIREBASE_AUTH_URI,
      FIREBASE_TOKEN_URI: !!process.env.FIREBASE_TOKEN_URI,
      NODE_ENV: !!process.env.NODE_ENV
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(diagnostico);
});

// Handler de erro global para evitar crashes
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor apenas se não estiver no Vercel
// No Vercel, o servidor é executado como serverless function
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  app.listen(PORT || 3000, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT || 3000}`);
    console.log(`📱 Aplicativo Pilates - API disponível em http://localhost:${PORT || 3000}`);
  });
} else {
  console.log('✅ Servidor configurado para Vercel (serverless)');
  console.log('✅ Firebase status:', db ? 'Conectado' : 'Desconectado');
}

  // Exportar para Vercel (serverless function)
  module.exports = app;
  
} catch (error) {
  // Se houver erro na inicialização, criar um servidor mínimo que sempre funciona
  console.error('❌ ERRO CRÍTICO na inicialização:', error.message);
  console.error('Stack:', error.stack);
  
  const express = require('express');
  const app = express();
  
  app.use((req, res) => {
    res.status(500).json({
      error: 'Erro na inicialização do servidor',
      message: 'Verifique os logs do Vercel para mais detalhes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  });
  
  module.exports = app;
}


