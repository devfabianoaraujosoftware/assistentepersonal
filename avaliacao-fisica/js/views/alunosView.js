// js/views/alunosView.js
import DB from '../database.js';
import Utils from '../utils.js';

export const AlunosListView = {
    render: () => {
        const alunos = DB.getAll('alunos');

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6)">
                <h1>Alunos</h1>
                <a href="#/alunos/novo" class="btn btn-primary">+ Novo Aluno</a>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${alunos.map(a => `
                                <tr>
                                    <td>${a.id}</td>
                                    <td>${a.nome}</td>
                                    <td>${a.email || '-'}</td>
                                    <td><span class="badge badge-green">${a.status || 'Ativo'}</span></td>
                                    <td>
                                        <a href="#/alunos/${a.id}" class="btn btn-secondary btn-sm">Abrir</a>
                                    </td>
                                </tr>
                            `).join('') || '<tr><td colspan="5">Nenhum aluno encontrado.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};

export const AlunoFormView = {
    render: () => {
        return `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: var(--space-6)">
                <a href="#/alunos" class="btn btn-secondary">← Voltar</a>
                <h1>Cadastro de Novo Aluno</h1>
            </div>

            <div class="card">
                <form id="aluno-form">
                    <div class="card-header">Dados Pessoais</div>
                    <div class="form-row">
                        <div class="form-group form-col" style="flex: 0 0 120px;">
                            <label class="form-label">Foto de Perfil</label>
                            <div id="foto_preview" style="width: 100px; height: 100px; border: 1px dashed var(--border-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 10px;">
                                <span style="font-size: 0.8rem; color: var(--text-light); text-align: center;">Upload</span>
                            </div>
                            <input type="file" id="foto_aluno" accept="image/*" style="width: 100px; font-size: 0.75rem;">
                        </div>
                        <div class="form-col" style="flex: 1;">
                            <div class="form-row">
                                <div class="form-group form-col">
                                    <label class="form-label">Nome Completo *</label>
                                    <input type="text" id="nome" class="form-control" required>
                                </div>
                                <div class="form-group form-col">
                                    <label class="form-label">Data de Nascimento *</label>
                                    <input type="date" id="dataNascimento" class="form-control" required>
                                </div>
                            </div>
                            <div class="form-row">
                                 <div class="form-group form-col">
                                    <label class="form-label">Email</label>
                                    <input type="email" id="email" class="form-control">
                                </div>
                                <div class="form-group form-col">
                                    <label class="form-label">Telefone (WhatsApp)</label>
                                    <input type="text" id="telefone" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-header" style="margin-top: 20px;">Perfil de Treinamento e Anamnese Básica</div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Objetivo Principal *</label>
                            <select id="objetivoPrincipal" class="form-control" required>
                                <option value="">Selecione...</option>
                                <option value="Hipertrofia">Hipertrofia</option>
                                <option value="Emagrecimento">Emagrecimento</option>
                                <option value="Força">Ganho de força</option>
                                <option value="Saúde">Saúde Geral</option>
                            </select>
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Experiência *</label>
                            <select id="experiencia" class="form-control" required>
                                <option value="Iniciante">Iniciante (0-6 meses)</option>
                                <option value="Intermediario">Intermediário (6m - 2 anos)</option>
                                <option value="Avancado">Avançado (+2 anos)</option>
                            </select>
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Frequência Semanal (Dias) *</label>
                            <input type="number" id="frequenciaSemanal" min="1" max="7" class="form-control" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Horas de Sono por Noite</label>
                            <input type="number" id="sono_horas" min="0" max="24" class="form-control">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Nível de Estresse (0-10)</label>
                            <input type="number" id="estresse_nivel" min="0" max="10" class="form-control">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Hidratação Diária (Litros)</label>
                            <input type="number" step="0.1" id="hidratacao" class="form-control" placeholder="Ex: 2.5">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Orientação Alimentar (Macronutrientes)</label>
                            <input type="text" id="alimentacao" class="form-control" placeholder="Ex: Alta proteína, baixo carbo">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">PAR-Q+ (Restrição Médica?)</label>
                            <select id="parq_restricao" class="form-control">
                                <option value="false">Não</option>
                                <option value="true">Sim (Exige liberação médica)</option>
                            </select>
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Cirurgias / Lesões</label>
                            <input type="text" id="lesoes_resumo" class="form-control" placeholder="Ex: LCA Joelho (2020)">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Medicamentos de Uso Contínuo (Detalhar)</label>
                            <input type="text" id="medicamentos_resumo" class="form-control" placeholder="Ex: Losartana, Ritalina (Descreva impactos se souber)">
                        </div>
                    </div>

                    <div class="form-group">
                         <label class="form-label" style="display:flex; align-items:center; gap: 8px;">
                            <input type="checkbox" id="consentimento" required>
                            O aluno assinou o termo de consentimento LGPD para tratamento de dados sensíveis e imagens.
                         </label>
                    </div>

                    <div style="margin-top: var(--space-6); text-align: right;">
                        <button type="submit" class="btn btn-primary">Salvar Aluno Completo</button>
                    </div>
                </form>
            </div>
        `;
    },
    afterRender: () => {
        let fotoBase64 = '';
        document.getElementById('foto_aluno').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    fotoBase64 = event.target.result;
                    document.getElementById('foto_preview').innerHTML = `<img src="${fotoBase64}" style="width:100%; height:100%; object-fit:cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('aluno-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const novoAluno = {
                nome: document.getElementById('nome').value,
                dataNascimento: document.getElementById('dataNascimento').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                objetivoPrincipal: document.getElementById('objetivoPrincipal').value,
                experiencia: document.getElementById('experiencia').value,
                frequenciaSemanal: parseInt(document.getElementById('frequenciaSemanal').value),
                status: 'Ativo',
                consentimentoLGPD: document.getElementById('consentimento').checked,
                dataCadastro: new Date().toISOString(),
                foto: fotoBase64,
                // Anamnese fields
                sono: { horas: parseInt(document.getElementById('sono_horas').value) || 8 },
                estresse: parseInt(document.getElementById('estresse_nivel').value) || 5,
                hidratacao: parseFloat(document.getElementById('hidratacao').value) || 0,
                alimentacao: document.getElementById('alimentacao').value,
                parq: { possuiRestricao: document.getElementById('parq_restricao').value === 'true' },
                lesoes: document.getElementById('lesoes_resumo').value ? [{ local: document.getElementById('lesoes_resumo').value }] : [],
                medicamentos: document.getElementById('medicamentos_resumo').value ? [{ nome: document.getElementById('medicamentos_resumo').value }] : []
            };

            const salvo = DB.save('alunos', novoAluno);
            Utils.toast('Aluno salvo com sucesso!', 'sucesso');
            window.location.hash = `#/alunos/${salvo.id}`;
        });
    }
};