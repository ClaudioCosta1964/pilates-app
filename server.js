const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const moment = require('moment');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client')); // Servir arquivos estáticos da pasta client

// Inicializar Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Configuração do Nodemailer para envio de emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ===== ROTAS PARA ALUNOS =====

// Cadastrar novo aluno
app.post('/api/alunos', async (req, res) => {
  try {
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
    if (aluno.email) {
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
  res.sendFile(__dirname + '/client/index.html');
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor do Aplicativo Pilates funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Aplicativo Pilates - API disponível em http://localhost:${PORT}`);
});

module.exports = app;


