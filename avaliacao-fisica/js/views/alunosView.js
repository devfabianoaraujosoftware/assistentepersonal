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

                    <div class="form-row" style="margin-top: 10px;">
                        <div class="form-group form-col">
                            <label class="form-label">Foto de Perfil do Aluno</label>
                            <input type="file" id="foto_perfil" class="form-control" accept="image/*">
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
                            <label class="form-label">PAR-Q+ (Possui restrição médica declarada?)</label>
                            <select id="parq_restricao" class="form-control">
                                <option value="false">Não</option>
                                <option value="true">Sim (Exige liberação médica)</option>
                            </select>
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Lesões Prévias (Resumo)</label>
                            <input type="text" id="lesoes_resumo" class="form-control" placeholder="Ex: Ombro direito, lombar">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Cirurgias Anteriores</label>
                            <input type="text" id="cirurgias_resumo" class="form-control" placeholder="Ex: Apendicite, LCA">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-col">
                            <label class="form-label">Medicamentos de Uso Contínuo</label>
                            <input type="text" id="medicamentos_resumo" class="form-control" placeholder="Ex: Losartana">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Hidratação Diária (Litros)</label>
                            <input type="number" step="0.1" id="hidratacao_litros" min="0" max="10" class="form-control">
                        </div>
                        <div class="form-group form-col">
                            <label class="form-label">Padrão Alimentar</label>
                            <select id="padrao_alimentar" class="form-control">
                                <option value="balanceado">Balanceado</option>
                                <option value="vegetariano">Vegetariano / Vegano</option>
                                <option value="hipercalorica">Hipercalórica (Bulking)</option>
                                <option value="hipocalorica">Hipocalórica (Cutting)</option>
                                <option value="irregular">Irregular / Pula Refeições</option>
                            </select>
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

            let fotoPerfilBase64 = null;
            const fotoPerfilFile = document.getElementById('foto_perfil').files[0];
            if (fotoPerfilFile) {
                fotoPerfilBase64 = await Utils.fileToBase64(fotoPerfilFile);
            }

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
                fotoPerfil: fotoPerfilBase64,
                // Anamnese fields
                sono: { horas: parseInt(document.getElementById('sono_horas').value) || 8 },
                estresse: parseInt(document.getElementById('estresse_nivel').value) || 5,
                parq: { possuiRestricao: document.getElementById('parq_restricao').value === 'true' },
                lesoes: document.getElementById('lesoes_resumo').value ? [{ local: document.getElementById('lesoes_resumo').value }] : [],
                cirurgias: document.getElementById('cirurgias_resumo').value ? [{ tipo: document.getElementById('cirurgias_resumo').value }] : [],
                medicamentos: document.getElementById('medicamentos_resumo').value ? [{ nome: document.getElementById('medicamentos_resumo').value }] : [],
                hidratacao: parseFloat(document.getElementById('hidratacao_litros').value) || 0,
                alimentacao: document.getElementById('padrao_alimentar').value
            };

            const salvo = DB.save('alunos', novoAluno);
            Utils.toast('Aluno salvo com sucesso!', 'sucesso');
            window.location.hash = `#/alunos/${salvo.id}`;
        });
    }
};