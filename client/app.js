// Configurações da API
const API_BASE_URL = 'http://localhost:3000/api';

// Variáveis globais
let alunos = [];
let pagamentos = [];
let exercicios = [];

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    carregarAlunosParaPagamento();
});

// ===== NAVEGAÇÃO =====
function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    
    // Remover classe active de todos os links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Mostrar seção selecionada
    document.getElementById(`${sectionName}-section`).style.display = 'block';
    
    // Adicionar classe active ao link clicado
    event.target.classList.add('active');
    
    // Carregar dados específicos da seção
    switch(sectionName) {
        case 'alunos':
            carregarAlunos();
            break;
        case 'pagamentos':
            carregarPagamentos();
            break;
        case 'exercicios':
            carregarExercicios();
            break;
        case 'relatorios':
            carregarRelatorios();
            break;
    }
}

// ===== DASHBOARD =====
async function carregarDados() {
    try {
        // Carregar estatísticas
        const response = await fetch(`${API_BASE_URL}/alunos`);
        const alunosData = await response.json();
        
        const alunosAtivos = alunosData.filter(aluno => aluno.status === 'ativo');
        
        // Atualizar estatísticas
        document.getElementById('total-alunos').textContent = alunosData.length;
        document.getElementById('alunos-ativos').textContent = alunosAtivos.length;
        
        // Carregar atividades recentes
        carregarAtividadeRecente(alunosData);
        
        // Verificar aniversariantes hoje
        verificarAniversariantesHoje(alunosData);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarNotificacao('Erro ao carregar dados do dashboard', 'error');
    }
}

function carregarAtividadeRecente(alunos) {
    const atividadeDiv = document.getElementById('atividade-recente');
    const atividades = [];
    
    // Simular atividades recentes (em uma implementação real, viria do banco)
    alunos.slice(0, 5).forEach(aluno => {
        const dataCadastro = new Date(aluno.dataCadastro.seconds * 1000);
        atividades.push({
            tipo: 'cadastro',
            aluno: aluno.nome,
            data: dataCadastro.toLocaleDateString('pt-BR'),
            descricao: 'Novo aluno cadastrado'
        });
    });
    
    if (atividades.length === 0) {
        atividadeDiv.innerHTML = '<p class="text-muted">Nenhuma atividade recente</p>';
        return;
    }
    
    const html = atividades.map(atividade => `
        <div class="d-flex align-items-center mb-2">
            <div class="flex-shrink-0">
                <i class="fas fa-user-plus text-primary"></i>
            </div>
            <div class="flex-grow-1 ms-3">
                <div class="fw-bold">${atividade.aluno}</div>
                <small class="text-muted">${atividade.descricao} - ${atividade.data}</small>
            </div>
        </div>
    `).join('');
    
    atividadeDiv.innerHTML = html;
}

function verificarAniversariantesHoje(alunos) {
    const hoje = new Date();
    const mesHoje = hoje.getMonth() + 1;
    const diaHoje = hoje.getDate();
    
    const aniversariantes = alunos.filter(aluno => {
        const dataNasc = new Date(aluno.dataNascimento.seconds * 1000);
        return dataNasc.getMonth() + 1 === mesHoje && dataNasc.getDate() === diaHoje;
    });
    
    document.getElementById('aniversariantes-hoje').textContent = aniversariantes.length;
    
    // Mostrar próximos aniversários
    const proximosDiv = document.getElementById('proximos-aniversarios');
    if (aniversariantes.length > 0) {
        const html = aniversariantes.map(aluno => `
            <div class="d-flex align-items-center mb-2">
                <i class="fas fa-birthday-cake text-warning me-2"></i>
                <span class="fw-bold">${aluno.nome}</span>
            </div>
        `).join('');
        proximosDiv.innerHTML = html;
    } else {
        proximosDiv.innerHTML = '<p class="text-muted">Nenhum aniversariante hoje</p>';
    }
}

// ===== ALUNOS =====
async function carregarAlunos() {
    try {
        const response = await fetch(`${API_BASE_URL}/alunos`);
        alunos = await response.json();
        exibirAlunos(alunos);
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        mostrarNotificacao('Erro ao carregar alunos', 'error');
    }
}

function exibirAlunos(alunosFiltrados) {
    const tbody = document.getElementById('tabela-alunos');
    
    if (alunosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum aluno encontrado</td></tr>';
        return;
    }
    
    const html = alunosFiltrados.map(aluno => {
        const dataCadastro = new Date(aluno.dataCadastro.seconds * 1000);
        const statusClass = aluno.status === 'ativo' ? 'success' : 'secondary';
        const nivelClass = {
            'iniciante': 'info',
            'intermediario': 'warning',
            'avancado': 'danger'
        }[aluno.nivel] || 'secondary';
        
        return `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.telefone}</td>
                <td><span class="badge bg-${nivelClass}">${aluno.nivel}</span></td>
                <td><span class="badge bg-${statusClass}">${aluno.status}</span></td>
                <td>${dataCadastro.toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarAluno('${aluno.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="verDetalhesAluno('${aluno.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = html;
}

function filtrarAlunos() {
    const nomeFiltro = document.getElementById('filtroNome').value.toLowerCase();
    const nivelFiltro = document.getElementById('filtroNivel').value;
    const statusFiltro = document.getElementById('filtroStatus').value;
    
    let alunosFiltrados = alunos;
    
    if (nomeFiltro) {
        alunosFiltrados = alunosFiltrados.filter(aluno => 
            aluno.nome.toLowerCase().includes(nomeFiltro)
        );
    }
    
    if (nivelFiltro) {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.nivel === nivelFiltro);
    }
    
    if (statusFiltro) {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.status === statusFiltro);
    }
    
    exibirAlunos(alunosFiltrados);
}

async function carregarAlunosParaPagamento() {
    try {
        const response = await fetch(`${API_BASE_URL}/alunos`);
        const alunosData = await response.json();
        
        const select = document.getElementById('alunoPagamento');
        select.innerHTML = '<option value="">Selecione um aluno</option>';
        
        alunosData.forEach(aluno => {
            const option = document.createElement('option');
            option.value = aluno.id;
            option.textContent = `${aluno.nome} (${aluno.email})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar alunos para pagamento:', error);
    }
}

async function cadastrarAluno() {
    try {
        const alunoData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            nivel: document.getElementById('nivel').value,
            status: document.getElementById('status').value,
            observacoes: document.getElementById('observacoes').value
        };
        
        const response = await fetch(`${API_BASE_URL}/alunos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(alunoData)
        });
        
        if (response.ok) {
            mostrarNotificacao('Aluno cadastrado com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalNovoAluno')).hide();
            document.getElementById('formNovoAluno').reset();
            carregarAlunos();
            carregarDados(); // Atualizar dashboard
        } else {
            throw new Error('Erro ao cadastrar aluno');
        }
    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);
        mostrarNotificacao('Erro ao cadastrar aluno', 'error');
    }
}

// ===== PAGAMENTOS =====
async function carregarPagamentos() {
    try {
        // Em uma implementação real, você teria uma rota específica para pagamentos
        // Por enquanto, vamos simular alguns dados
        const pagamentosSimulados = [
            {
                id: '1',
                alunoId: '1',
                valor: 150.00,
                dataVencimento: { seconds: Date.now() / 1000 + 86400 },
                status: 'pendente',
                metodoPagamento: 'pix'
            }
        ];
        
        exibirPagamentos(pagamentosSimulados);
    } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        mostrarNotificacao('Erro ao carregar pagamentos', 'error');
    }
}

function exibirPagamentos(pagamentosData) {
    const tbody = document.getElementById('tabela-pagamentos');
    
    if (pagamentosData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum pagamento encontrado</td></tr>';
        return;
    }
    
    const html = pagamentosData.map(pagamento => {
        const dataVencimento = new Date(pagamento.dataVencimento.seconds * 1000);
        const statusClass = {
            'pago': 'success',
            'pendente': 'warning',
            'vencido': 'danger'
        }[pagamento.status] || 'secondary';
        
        return `
            <tr>
                <td>Aluno ${pagamento.alunoId}</td>
                <td>R$ ${pagamento.valor.toFixed(2)}</td>
                <td>${dataVencimento.toLocaleDateString('pt-BR')}</td>
                <td><span class="badge bg-${statusClass}">${pagamento.status}</span></td>
                <td>${pagamento.metodoPagamento}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = html;
}

async function registrarPagamento() {
    try {
        const pagamentoData = {
            alunoId: document.getElementById('alunoPagamento').value,
            valor: document.getElementById('valor').value,
            dataVencimento: document.getElementById('dataVencimento').value,
            plano: document.getElementById('plano').value,
            metodoPagamento: document.getElementById('metodoPagamento').value,
            observacoes: document.getElementById('observacoesPagamento').value
        };
        
        const response = await fetch(`${API_BASE_URL}/pagamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pagamentoData)
        });
        
        if (response.ok) {
            mostrarNotificacao('Pagamento registrado com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalNovoPagamento')).hide();
            document.getElementById('formNovoPagamento').reset();
            carregarPagamentos();
        } else {
            throw new Error('Erro ao registrar pagamento');
        }
    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        mostrarNotificacao('Erro ao registrar pagamento', 'error');
    }
}

// ===== EXERCÍCIOS =====
async function carregarExercicios() {
    // Dados dos exercícios de Pilates
    const exerciciosPilates = [
        {
            id: 1,
            nome: "The Hundred",
            descricao: "Exercício fundamental que trabalha o core e melhora a respiração",
            beneficios: ["Fortalece o core", "Melhora circulação", "Aumenta resistência", "Trabalha respiração"],
            nivel: "iniciante",
            categoria: "core",
            duracaoEstimada: 5
        },
        {
            id: 2,
            nome: "Roll-Up",
            descricao: "Exercício que aumenta a flexibilidade da coluna vertebral",
            beneficios: ["Flexibilidade da coluna", "Fortalece abdominais", "Melhora postura"],
            nivel: "intermediario",
            categoria: "flexibilidade",
            duracaoEstimada: 8
        },
        {
            id: 3,
            nome: "Single-Leg Stretch",
            descricao: "Fortalece o core e melhora a coordenação",
            beneficios: ["Fortalece core", "Melhora coordenação", "Estabiliza pelve"],
            nivel: "iniciante",
            categoria: "core",
            duracaoEstimada: 6
        },
        {
            id: 4,
            nome: "Swan Dive",
            descricao: "Fortalece os músculos das costas e melhora a extensão da coluna",
            beneficios: ["Fortalece músculos das costas", "Melhora flexibilidade da coluna", "Corrige postura"],
            nivel: "intermediario",
            categoria: "flexibilidade",
            duracaoEstimada: 10
        },
        {
            id: 5,
            nome: "Teaser",
            descricao: "Exercício avançado que fortalece o core e melhora o controle corporal",
            beneficios: ["Fortalece core", "Melhora controle corporal", "Aumenta equilíbrio"],
            nivel: "avancado",
            categoria: "core",
            duracaoEstimada: 12
        }
    ];
    
    exibirExercicios(exerciciosPilates);
}

function exibirExercicios(exerciciosData) {
    const grid = document.getElementById('exercicios-grid');
    
    const html = exerciciosData.map(exercicio => {
        const nivelClass = {
            'iniciante': 'success',
            'intermediario': 'warning',
            'avancado': 'danger'
        }[exercicio.nivel] || 'secondary';
        
        const beneficiosHtml = exercicio.beneficios.map(beneficio => 
            `<li class="list-group-item">${beneficio}</li>`
        ).join('');
        
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${exercicio.nome}</h6>
                        <span class="badge bg-${nivelClass}">${exercicio.nivel}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${exercicio.descricao}</p>
                        <p class="text-muted"><i class="fas fa-clock me-1"></i>${exercicio.duracaoEstimada} min</p>
                        <p class="text-muted"><i class="fas fa-tag me-1"></i>${exercicio.categoria}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary btn-sm w-100" data-bs-toggle="collapse" data-bs-target="#beneficios-${exercicio.id}">
                            Ver Benefícios
                        </button>
                        <div class="collapse mt-2" id="beneficios-${exercicio.id}">
                            <ul class="list-group list-group-flush">
                                ${beneficiosHtml}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    grid.innerHTML = html;
}

// ===== RELATÓRIOS =====
async function carregarRelatorios() {
    try {
        // Carregar relatório de alunos por nível
        const response = await fetch(`${API_BASE_URL}/relatorios/alunos-por-nivel`);
        const relatorio = await response.json();
        
        // Criar gráfico
        const ctx = document.getElementById('chartAlunosNivel').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Iniciante', 'Intermediário', 'Avançado'],
                datasets: [{
                    data: [relatorio.iniciante, relatorio.intermediario, relatorio.avancado],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Carregar pagamentos em atraso
        const responseAtrasados = await fetch(`${API_BASE_URL}/relatorios/pagamentos-atrasados`);
        const atrasados = await responseAtrasados.json();
        
        const atrasadosDiv = document.getElementById('pagamentos-atrasados-list');
        if (atrasados.length === 0) {
            atrasadosDiv.innerHTML = '<p class="text-success">Nenhum pagamento em atraso!</p>';
        } else {
            const html = atrasados.map(pagamento => `
                <div class="alert alert-danger">
                    <strong>Aluno ${pagamento.alunoId}</strong><br>
                    Valor: R$ ${pagamento.valor.toFixed(2)}<br>
                    Vencimento: ${new Date(pagamento.dataVencimento.seconds * 1000).toLocaleDateString('pt-BR')}
                </div>
            `).join('');
            atrasadosDiv.innerHTML = html;
        }
        
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        mostrarNotificacao('Erro ao carregar relatórios', 'error');
    }
}

// ===== ANIVERSÁRIOS =====
async function verificarAniversarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/verificar-aniversarios`, {
            method: 'POST'
        });
        
        const resultado = await response.json();
        const aniversariantesDiv = document.getElementById('aniversariantes-list');
        
        if (resultado.aniversariantes.length === 0) {
            aniversariantesDiv.innerHTML = '<p class="text-muted">Nenhum aniversariante hoje.</p>';
        } else {
            const html = resultado.aniversariantes.map(aluno => `
                <div class="alert alert-success">
                    <h6><i class="fas fa-birthday-cake me-2"></i>${aluno.nome}</h6>
                    <p class="mb-0">Parabéns enviados! Idade: ${aluno.idade} anos</p>
                </div>
            `).join('');
            aniversariantesDiv.innerHTML = html;
        }
        
        mostrarNotificacao(resultado.message, 'success');
    } catch (error) {
        console.error('Erro ao verificar aniversários:', error);
        mostrarNotificacao('Erro ao verificar aniversários', 'error');
    }
}

// ===== FUNÇÕES AUXILIARES =====
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar notificação toast
    const toastContainer = document.getElementById('toast-container') || criarToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div class="toast" id="${toastId}" role="alert">
            <div class="toast-header">
                <i class="fas fa-${tipo === 'success' ? 'check-circle text-success' : tipo === 'error' ? 'exclamation-circle text-danger' : 'info-circle text-info'} me-2"></i>
                <strong class="me-auto">Notificação</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${mensagem}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remover toast após ser escondido
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function criarToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Funções para editar e ver detalhes (implementação básica)
function editarAluno(alunoId) {
    mostrarNotificacao('Funcionalidade de edição será implementada em breve', 'info');
}

function verDetalhesAluno(alunoId) {
    mostrarNotificacao('Funcionalidade de detalhes será implementada em breve', 'info');
}


