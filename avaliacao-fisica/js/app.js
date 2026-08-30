// js/app.js
import Router from './router.js';
import { DashboardView } from './views/dashboardView.js';
import { AlunosListView, AlunoFormView } from './views/alunosView.js';
import { AlunoDetailView } from './views/alunoDetailView.js';

// Simple views for remaining routes
const ConfiguracoesView = {
    render: async () => {
        const DB = (await import('./database.js')).default;
        const config = DB.getConfig() || { personal: {} };
        const p = config.personal;
        return `
            <h1>Configurações do Personal Trainer</h1>
            <div class="card">
                <form id="config-form">
                    <div class="card-header">Dados Profissionais (Usados nos Relatórios PDF)</div>
                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Nome Profissional</label>
                            <input type="text" id="cfg_nome" class="form-control" value="${p.nomeProfissional || ''}" required>
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">E-mail</label>
                            <input type="email" id="cfg_email" class="form-control" value="${p.email || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Telefone / WhatsApp</label>
                            <input type="text" id="cfg_telefone" class="form-control" value="${p.telefone || ''}">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Especialidade / Título</label>
                            <input type="text" id="cfg_especialidade" class="form-control" value="${p.especialidade || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Frase Profissional (Rodapé)</label>
                        <input type="text" id="cfg_frase" class="form-control" value="${p.frase || ''}">
                    </div>

                    <div class="card-header" style="margin-top: 20px;">Personalização do Sistema (White-label)</div>
                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Cor Principal do Sistema</label>
                            <input type="color" id="cfg_corPrincipal" class="form-control" value="${p.corPrincipal || '#2563eb'}" style="height: 40px; padding: 2px;">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Logomarca (Upload de Imagem)</label>
                            <input type="file" id="cfg_logomarca" accept="image/*" class="form-control">
                            ${p.logomarca ? `<div style="margin-top: 10px;"><img src="${p.logomarca}" alt="Logomarca" style="max-height: 50px;"></div>` : ''}
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Foto do Personal (Upload de Imagem)</label>
                            <input type="file" id="cfg_foto_personal" accept="image/*" class="form-control">
                            ${p.fotoPersonal ? `<div style="margin-top: 10px;"><img src="${p.fotoPersonal}" alt="Foto Personal" style="max-height: 50px; border-radius: 50%;"></div>` : ''}
                        </div>
                    </div>

                    <div style="text-align: right; margin-top: var(--space-4);">
                        <button type="submit" class="btn btn-primary">Salvar Configurações</button>
                    </div>
                </form>
            </div>
        `;
    },
    afterRender: async () => {
        const Utils = (await import('./utils.js')).default;
        const DB = (await import('./database.js')).default;

        document.getElementById('config-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const config = DB.getConfig() || { personal: {} };

            let logomarcaBase64 = config.personal.logomarca;
            const logomarcaFile = document.getElementById('cfg_logomarca').files[0];
            if (logomarcaFile) {
                logomarcaBase64 = await Utils.fileToBase64(logomarcaFile);
            }

            let fotoPersonalBase64 = config.personal.fotoPersonal;
            const fotoPersonalFile = document.getElementById('cfg_foto_personal').files[0];
            if (fotoPersonalFile) {
                fotoPersonalBase64 = await Utils.fileToBase64(fotoPersonalFile);
            }

            config.personal = {
                ...config.personal,
                nomeProfissional: document.getElementById('cfg_nome').value,
                email: document.getElementById('cfg_email').value,
                telefone: document.getElementById('cfg_telefone').value,
                especialidade: document.getElementById('cfg_especialidade').value,
                frase: document.getElementById('cfg_frase').value,
                corPrincipal: document.getElementById('cfg_corPrincipal').value,
                logomarca: logomarcaBase64,
                fotoPersonal: fotoPersonalBase64
            };
            DB.saveConfig(config);

            // Update global UI
            document.getElementById('header-user-name').textContent = config.personal.nomeProfissional;
            if (config.personal.corPrincipal) {
                document.documentElement.style.setProperty('--primary-color', config.personal.corPrincipal);
            }
            if (config.personal.logomarca) {
                const sidebarHeader = document.querySelector('.sidebar-header');
                if (sidebarHeader) {
                    sidebarHeader.innerHTML = `<img src="${config.personal.logomarca}" alt="Logo" style="max-height: 40px; margin-right: 10px; display: inline-block; vertical-align: middle;"> ${config.personal.nomeProfissional}<div style="font-size: 0.75rem; font-weight: normal; color: var(--text-light)">Personal Trainer OS</div>`;
                }
            }

            Utils.toast('Configurações salvas com sucesso!', 'sucesso');
            // Refresh to apply image updates in UI form
            window.location.reload();
        });
    }
};

const TreinosView = {
    render: async () => {
        const DB = (await import('./database.js')).default;
        const treinos = DB.getAll('treinos') || [];
        const alunos = DB.getAll('alunos') || [];

        return `
            <h1>Treinos Ativos e Rascunhos</h1>
            <div class="card">
                <div class="card-header">Painel Global de Prescrições</div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID Treino</th>
                                <th>Aluno</th>
                                <th>Frequência</th>
                                <th>Status</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${treinos.length === 0 ? '<tr><td colspan="5">Nenhum treino gerado ainda. Realize avaliações para gerar treinos.</td></tr>' :
                                treinos.map(t => {
                                    const aluno = alunos.find(a => a.id === t.alunoId) || { nome: 'Desconhecido' };
                                    const badgeClass = t.status === 'Aprovado' ? 'badge-green' : 'badge-orange';
                                    return `
                                        <tr>
                                            <td>${t.id.substring(0, 8)}...</td>
                                            <td>${aluno.nome}</td>
                                            <td>${t.frequencia}x/semana</td>
                                            <td><span class="badge ${badgeClass}">${t.status}</span></td>
                                            <td><a href="#/alunos/${t.alunoId}" class="btn btn-secondary btn-sm">Ver Aluno</a></td>
                                        </tr>
                                    `;
                                }).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};

const BackupView = {
    render: () => {
        return `
            <h1>Backup e Segurança de Dados</h1>
            <div class="card">
                <div class="card-header">Exportar Dados (LGPD & Segurança)</div>
                <p style="margin-bottom: 15px;">Faça o download de todos os dados locais em formato JSON. Mantenha em local seguro.</p>
                <button id="btn-export" class="btn btn-primary">Exportar Banco (JSON)</button>
            </div>

            <div class="card">
                <div class="card-header">Restaurar Dados</div>
                <input type="file" id="file-import" accept=".json" class="form-control" style="margin-bottom: 15px;">
                <button id="btn-import" class="btn btn-danger">Importar e Substituir Banco</button>
            </div>
        `;
    },
    afterRender: () => {
        document.getElementById('btn-export').addEventListener('click', async () => {
            const DB = (await import('./database.js')).default;
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(DB.exportDB());
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", `mestre_backup_${new Date().toISOString().slice(0,10)}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }
};

// Define routes map
const routes = [
    { path: '/dashboard', action: DashboardView.render },
    { path: '/alunos', action: AlunosListView.render },
    { path: '/alunos/novo', action: AlunoFormView.render, afterRender: AlunoFormView.afterRender },
    { path: '/alunos/:id', action: AlunoDetailView.render, afterRender: AlunoDetailView.afterRender },
    { path: '/treinos', action: TreinosView.render },
    { path: '/configuracoes', action: ConfiguracoesView.render },
    { path: '/backup', action: BackupView.render, afterRender: BackupView.afterRender }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Start router
    const router = new Router(routes, 'router-view');

    // Set global configurations (White-label)
    import('./database.js').then(module => {
        const DB = module.default;
        const config = DB.getConfig();
        if (config && config.personal) {
            if (config.personal.nomeProfissional) {
                document.getElementById('header-user-name').textContent = config.personal.nomeProfissional;
            }
            if (config.personal.corPrincipal) {
                document.documentElement.style.setProperty('--primary-color', config.personal.corPrincipal);
            }
            if (config.personal.logomarca) {
                const sidebarHeader = document.querySelector('.sidebar-header');
                if (sidebarHeader) {
                    sidebarHeader.innerHTML = `<img src="${config.personal.logomarca}" alt="Logo" style="max-height: 40px; margin-right: 10px; display: inline-block; vertical-align: middle;"> ${config.personal.nomeProfissional || 'MESTRE'}<div style="font-size: 0.75rem; font-weight: normal; color: var(--text-light)">Personal Trainer OS</div>`;
                }
            }
        }
    });
});
