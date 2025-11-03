// Estrutura do banco de dados Firestore para o aplicativo de Pilates

export const DATABASE_STRUCTURE = {
  // Coleção de Alunos
  alunos: {
    // Documento: alunoId (gerado automaticamente)
    fields: {
      nome: "string (obrigatório)",
      telefone: "string (obrigatório)",
      email: "string (obrigatório)",
      dataNascimento: "timestamp (obrigatório)",
      dataCadastro: "timestamp",
      ultimaAtualizacao: "timestamp",
      status: "string (ativo/inativo)",
      observacoes: "string",
      nivel: "string (iniciante/intermediario/avancado)",
      restricoesMedicas: "array",
      profissionalResponsavel: "string (ID do profissional)"
    }
  },

  // Coleção de Profissionais
  profissionais: {
    fields: {
      nome: "string",
      email: "string",
      telefone: "string",
      especialidades: "array",
      dataCadastro: "timestamp",
      status: "string (ativo/inativo)"
    }
  },

  // Coleção de Exercícios
  exercicios: {
    fields: {
      nome: "string",
      descricao: "string",
      beneficios: "array",
      nivel: "string (iniciante/intermediario/avancado)",
      categoria: "string (core/flexibilidade/equilibrio)",
      duracaoEstimada: "number (minutos)",
      instrucoes: "array",
      contraindicacoes: "array",
      equipamentos: "array",
      imagemUrl: "string"
    }
  },

  // Coleção de Aulas/Sessões
  aulas: {
    fields: {
      alunoId: "string (referência)",
      profissionalId: "string (referência)",
      dataAula: "timestamp",
      duracao: "number (minutos)",
      exerciciosRealizados: "array",
      observacoes: "string",
      nivelIntensidade: "string (baixa/media/alta)",
      status: "string (agendada/realizada/cancelada)"
    }
  },

  // Coleção de Pagamentos
  pagamentos: {
    fields: {
      alunoId: "string (referência)",
      valor: "number",
      dataVencimento: "timestamp",
      dataPagamento: "timestamp",
      status: "string (pendente/pago/vencido)",
      metodoPagamento: "string",
      observacoes: "string",
      plano: "string (mensal/trimestral/semestral/anual)"
    }
  },

  // Coleção de Progresso dos Alunos
  progresso: {
    fields: {
      alunoId: "string (referência)",
      dataRegistro: "timestamp",
      exerciciosRealizados: "array",
      tempoTotalPratica: "number (minutos)",
      nivelAtual: "string",
      objetivos: "array",
      conquistas: "array",
      peso: "number",
      altura: "number",
      medidas: "object"
    }
  },

  // Coleção de Notificações
  notificacoes: {
    fields: {
      alunoId: "string (referência)",
      tipo: "string (aniversario/pagamento/exercicio)",
      titulo: "string",
      mensagem: "string",
      dataEnvio: "timestamp",
      status: "string (enviada/pendente/falhou)",
      dataLeitura: "timestamp"
    }
  }
};

// Exercícios de Pilates pré-cadastrados
export const EXERCICIOS_PILATES = [
  {
    nome: "The Hundred",
    descricao: "Exercício fundamental que trabalha o core e melhora a respiração",
    beneficios: ["Fortalece o core", "Melhora circulação", "Aumenta resistência", "Trabalha respiração"],
    nivel: "iniciante",
    categoria: "core",
    duracaoEstimada: 5,
    instrucoes: [
      "Deite-se de costas com joelhos flexionados",
      "Levante a cabeça e ombros do chão",
      "Estenda os braços ao longo do corpo",
      "Bombeie os braços para cima e para baixo 100 vezes",
      "Mantenha a respiração controlada"
    ],
    contraindicacoes: ["Problemas no pescoço", "Gravidez avançada"],
    equipamentos: ["Mat"]
  },
  {
    nome: "Roll-Up",
    descricao: "Exercício que aumenta a flexibilidade da coluna vertebral",
    beneficios: ["Flexibilidade da coluna", "Fortalece abdominais", "Melhora postura"],
    nivel: "intermediario",
    categoria: "flexibilidade",
    duracaoEstimada: 8,
    instrucoes: [
      "Deite-se de costas com pernas estendidas",
      "Braços estendidos atrás da cabeça",
      "Inspire e comece a enrolar a coluna vertebra por vertebra",
      "Chegue até sentado com braços paralelos ao chão",
      "Volte enrolando a coluna de volta ao chão"
    ],
    contraindicacoes: ["Problemas na coluna lombar", "Osteoporose"],
    equipamentos: ["Mat"]
  },
  {
    nome: "Single-Leg Stretch",
    descricao: "Fortalece o core e melhora a coordenação",
    beneficios: ["Fortalece core", "Melhora coordenação", "Estabiliza pelve"],
    nivel: "iniciante",
    categoria: "core",
    duracaoEstimada: 6,
    instrucoes: [
      "Deite-se de costas com joelhos no peito",
      "Levante a cabeça e ombros",
      "Mãos nas canelas",
      "Estenda uma perna enquanto puxa a outra",
      "Alternar as pernas mantendo o core ativo"
    ],
    contraindicacoes: ["Problemas no pescoço"],
    equipamentos: ["Mat"]
  },
  {
    nome: "Swan Dive",
    descricao: "Fortalece os músculos das costas e melhora a extensão da coluna",
    beneficios: ["Fortalece músculos das costas", "Melhora flexibilidade da coluna", "Corrige postura"],
    nivel: "intermediario",
    categoria: "flexibilidade",
    duracaoEstimada: 10,
    instrucoes: [
      "Deite-se de bruços com braços estendidos à frente",
      "Levante o peito e braços do chão",
      "Mantenha o olhar para baixo",
      "Faça movimentos suaves de 'voo' com os braços",
      "Mantenha as pernas ativas no chão"
    ],
    contraindicacoes: ["Problemas na coluna lombar", "Gravidez"],
    equipamentos: ["Mat"]
  },
  {
    nome: "Teaser",
    descricao: "Exercício avançado que fortalece o core e melhora o controle corporal",
    beneficios: ["Fortalece core", "Melhora controle corporal", "Aumenta equilíbrio"],
    nivel: "avancado",
    categoria: "core",
    duracaoEstimada: 12,
    instrucoes: [
      "Sente-se com joelhos flexionados",
      "Equilibre-se no osso sentado",
      "Estenda as pernas formando um V",
      "Estenda os braços paralelos às pernas",
      "Mantenha o equilíbrio e respire"
    ],
    contraindicacoes: ["Problemas na coluna", "Iniciantes"],
    equipamentos: ["Mat"]
  }
];


