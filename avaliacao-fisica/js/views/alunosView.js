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

                    <div class="form-group">
                        <label class="form-label">Foto de Identificação (Upload)</label>
                        <input type="file" id="fotoPerfil" class="form-control" accept="image/*">
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
                        <div class="form-group form-col">
                            <label class="form-label">Hidratação (Litros/dia)</label>
                            <input type="number" step="0.1" id="hidratacao" class="form-control">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Nutrição: Proteína (g/dia)</label>
                            <input type="number" id="nutri_proteina" class="form-control">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Nutrição: Carboidrato (g/dia)</label>
                            <input type="number" id="nutri_carbo" class="form-control">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Nutrição: Gordura (g/dia)</label>
                            <input type="number" id="nutri_gordura" class="form-control">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">PAR-Q+ (Restrição declarada?)</label>
                            <select id="parq_restricao" class="form-control">
                                <option value="false">Não</option>
                                <option value="true">Sim (Exige liberação médica)</option>
                            </select>
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Lesões Prévias</label>
                            <input type="text" id="lesoes_resumo" class="form-control" placeholder="Ex: Ombro direito, lombar">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Cirurgias</label>
                            <input type="text" id="cirurgias" class="form-control" placeholder="Ex: LCA Joelho Direito (2019)">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Medicamentos de Uso Contínuo</label>
                            <input type="text" id="medicamentos_resumo" class="form-control" placeholder="Ex: Losartana, Ritalina">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Restrições para Exercício</label>
                            <input type="text" id="restricoes_ex" class="form-control" placeholder="Ex: Evitar alto impacto">
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
        document.getElementById('aluno-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            let fotoBase64 = '';
            const fotoInput = document.getElementById('fotoPerfil');
            if (fotoInput.files && fotoInput.files[0]) {
                fotoBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsDataURL(fotoInput.files[0]);
                });
            }

            const novoAluno = {
                fotoPerfil: fotoBase64,
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
                // Anamnese fields
                sono: { horas: parseInt(document.getElementById('sono_horas').value) || 8 },
                estresse: parseInt(document.getElementById('estresse_nivel').value) || 5,
                hidratacao: parseFloat(document.getElementById('hidratacao').value) || 2,
                nutricao: {
                    proteina: parseInt(document.getElementById('nutri_proteina').value) || 0,
                    carbo: parseInt(document.getElementById('nutri_carbo').value) || 0,
                    gordura: parseInt(document.getElementById('nutri_gordura').value) || 0
                },
                parq: { possuiRestricao: document.getElementById('parq_restricao').value === 'true' },
                lesoes: document.getElementById('lesoes_resumo').value ? [{ local: document.getElementById('lesoes_resumo').value }] : [],
                cirurgias: document.getElementById('cirurgias').value || '',
                restricoes: document.getElementById('restricoes_ex').value || '',
                medicamentos: document.getElementById('medicamentos_resumo').value ? [{ nome: document.getElementById('medicamentos_resumo').value }] : []
            };

            const salvo = DB.save('alunos', novoAluno);
            Utils.toast('Aluno salvo com sucesso!', 'sucesso');
            window.location.hash = `#/alunos/${salvo.id}`;
        });
    }
};