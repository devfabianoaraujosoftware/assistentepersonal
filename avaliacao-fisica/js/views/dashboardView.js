// js/views/dashboardView.js
import DB from '../database.js';

export const DashboardView = {
    render: () => {
        const alunos = DB.getAll('alunos');
        const treinos = DB.getAll('treinos');

        const ativos = alunos.filter(a => a.status === 'Ativo').length || alunos.length;
        const treinosRascunho = treinos.filter(t => t.status === 'Rascunho').length;

        return `
            <h1 style="margin-bottom: var(--space-6)">Visão Geral</h1>

            <div class="dashboard-stats">
                <div class="stat-card">
                    <span class="stat-title">Total de Alunos</span>
                    <span class="stat-value">${alunos.length}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-title">Alunos Ativos</span>
                    <span class="stat-value">${ativos}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-title">Treinos em Rascunho (Revisar)</span>
                    <span class="stat-value" style="color: var(--status-orange)">${treinosRascunho}</span>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">Últimos Alunos Cadastrados</div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Objetivo</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${alunos.slice(-5).reverse().map(a => `
                                    <tr>
                                        <td>${a.nome}</td>
                                        <td>${a.objetivoPrincipal || 'Não definido'}</td>
                                        <td><a href="#/alunos/${a.id}" class="btn btn-secondary btn-sm">Ver Perfil</a></td>
                                    </tr>
                                `).join('') || '<tr><td colspan="3">Nenhum aluno cadastrado.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card alerts-panel">
                    <div class="card-header">Painel de Alertas de Saúde IA</div>
                    <!-- Simulando alertas do painel -->
                    <div class="alert-item alert-orange">
                        <strong>Laranja:</strong> João Silva (PAR-Q+ pendente de revisão)
                    </div>
                    <div class="alert-item alert-yellow">
                        <strong>Amarelo:</strong> Maria Souza (Frequência baixa informada)
                    </div>
                </div>
            </div>
        `;
    }
};
