// js/views/alunoDetailView.js
import DB from '../database.js';
import Calc from '../calculations.js';
import AIEngine from '../aiEngine.js';
import Utils from '../utils.js';

export const AlunoDetailView = {
    render: ({ id }) => {
        const aluno = DB.getById('alunos', id);
        if (!aluno) return '<h2>Aluno não encontrado</h2>';

        const idade = Calc.idade(aluno.dataNascimento);

        return `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: var(--space-6)">
                <a href="#/alunos" class="btn btn-secondary">← Voltar</a>
                <h1>${aluno.nome} <span class="badge badge-green">${idade} anos</span></h1>
            </div>

            <!-- Tabs Navigation -->
            <div class="tabs" style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--border-color); display: flex; gap: 20px;">
                <button class="tab-btn active" data-tab="resumo" style="background:none; border:none; padding-bottom:10px; font-weight:bold; cursor:pointer; border-bottom: 2px solid var(--primary-color);">Resumo & IA</button>
                <button class="tab-btn" data-tab="anamnese" style="background:none; border:none; padding-bottom:10px; font-weight:bold; cursor:pointer; color: var(--text-light)">Anamnese & Histórico</button>
                <button class="tab-btn" data-tab="avaliacao" style="background:none; border:none; padding-bottom:10px; font-weight:bold; cursor:pointer; color: var(--text-light)">Avaliação Física</button>
                <button class="tab-btn" data-tab="treino" style="background:none; border:none; padding-bottom:10px; font-weight:bold; cursor:pointer; color: var(--text-light)">Prescrição</button>
            </div>

            <!-- TAB: Resumo & IA -->
            <div id="tab-resumo" class="tab-content">
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">Perfil de Treinamento</div>
                        <p><strong>Objetivo:</strong> ${aluno.objetivoPrincipal}</p>
                        <p><strong>Experiência:</strong> ${aluno.experiencia}</p>
                        <p><strong>Frequência:</strong> ${aluno.frequenciaSemanal}x na semana</p>
                        <hr style="margin: 10px 0; border: 0; border-top: 1px solid var(--border-color);">
                        <p><strong>Email:</strong> ${aluno.email || 'N/A'}</p>
                        <p><strong>Telefone:</strong> ${aluno.telefone || 'N/A'}</p>
                    </div>

                    <div class="card">
                        <div class="card-header">Motor de IA</div>
                        <div id="ia-results" style="min-height: 100px;">
                            <p style="color: var(--text-light); text-align: center;">Clique para processar os dados deste aluno e gerar insights e rascunho de treino.</p>
                        </div>
                        <div style="text-align: center; margin-top: 15px;">
                            <button id="btn-analisar-ia" class="btn btn-primary">Processar com IA Mestre</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB: Anamnese & Histórico -->
            <div id="tab-anamnese" class="tab-content" style="display: none;">
                <div class="card">
                    <div class="card-header">Anamnese</div>
                    <div class="form-row">
                        <div class="form-col">
                            <p><strong>Horas de Sono:</strong> ${aluno.sono?.horas || 'Não informado'}h</p>
                            <p><strong>Nível de Estresse:</strong> ${aluno.estresse || 'Não informado'} / 10</p>
                        </div>
                        <div class="form-col">
                            <p><strong>PAR-Q+ Restrição:</strong> ${aluno.parq?.possuiRestricao ? '<span style="color:red">Sim</span>' : 'Não'}</p>
                            <p><strong>Consentimento LGPD:</strong> ${aluno.consentimentoLGPD ? 'Assinado' : 'Pendente'}</p>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">Histórico Médico</div>
                    <p><strong>Lesões:</strong> ${aluno.lesoes && aluno.lesoes.length > 0 ? aluno.lesoes.map(l => l.local).join(', ') : 'Nenhuma relatada'}</p>
                    <p><strong>Medicamentos:</strong> ${aluno.medicamentos && aluno.medicamentos.length > 0 ? aluno.medicamentos.map(m => m.nome).join(', ') : 'Nenhum relatado'}</p>
                </div>
            </div>

            <!-- TAB: Avaliação Física (Mock) -->
            <div id="tab-avaliacao" class="tab-content" style="display: none;">
                <div class="card">
                    <div class="card-header">Nova Avaliação Antropométrica e Clínica</div>
                    <form id="form-avaliacao">
                        <div class="form-row">
                            <div class="form-group form-col">
                                <label class="form-label">Peso (kg)</label>
                                <input type="number" step="0.1" id="peso" class="form-control">
                            </div>
                            <div class="form-group form-col">
                                <label class="form-label">Altura (cm)</label>
                                <input type="number" id="altura" class="form-control">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group form-col">
                                <label class="form-label">Circunferência Cintura (cm)</label>
                                <input type="number" step="0.1" id="cintura" class="form-control">
                            </div>
                            <div class="form-group form-col">
                                <label class="form-label">Gordura Corporal (%) - Bioimpedância</label>
                                <input type="number" step="0.1" id="gordura" class="form-control">
                            </div>
                        </div>

                        <div class="card-header" style="margin-top: 20px;">Hábitos e Histórico</div>
                        <div class="form-row">
                             <div class="form-group form-col">
                                 <label class="form-label">Hidratação (ml/dia)</label>
                                 <input type="number" id="hidratacao" class="form-control" placeholder="Ex: 2500">
                             </div>
                             <div class="form-group form-col">
                                 <label class="form-label">Alimentação (Proteína)</label>
                                 <select id="alimentacao_proteina" class="form-control">
                                     <option value="adequada">Adequada</option>
                                     <option value="baixa">Baixa</option>
                                     <option value="alta">Alta</option>
                                 </select>
                             </div>
                        </div>
                        <div class="form-row">
                             <div class="form-group form-col">
                                 <label class="form-label">Cirurgias Prévias (Opcional)</label>
                                 <input type="text" id="cirurgias" class="form-control" placeholder="Ex: LCA Joelho Direito">
                             </div>
                        </div>

                        <div class="card-header" style="margin-top: 20px;">Medicamentos de Uso Contínuo</div>
                        <div class="form-group">
                             <label class="form-label">Selecione medicamentos (Segure Ctrl/Cmd para múltiplos)</label>
                             <select id="medicamentos_select" class="form-control" multiple style="height: 100px;">
                                 <!-- Options injected via JS -->
                             </select>
                        </div>

                        <div class="card-header" style="margin-top: 20px;">Fotos e Exames (Biofotogrametria e Bioimpedância)</div>
                        <div class="form-row">
                             <div class="form-group form-col">
                                 <label class="form-label">Foto Frente</label>
                                 <input type="file" id="foto_frente" accept="image/*" class="form-control">
                             </div>
                             <div class="form-group form-col">
                                 <label class="form-label">Foto Lateral Direita</label>
                                 <input type="file" id="foto_lat_dir" accept="image/*" class="form-control">
                             </div>
                        </div>
                        <div class="form-row">
                             <div class="form-group form-col">
                                 <label class="form-label">Foto Costas</label>
                                 <input type="file" id="foto_costas" accept="image/*" class="form-control">
                             </div>
                             <div class="form-group form-col">
                                 <label class="form-label">Foto Lateral Esquerda</label>
                                 <input type="file" id="foto_lat_esq" accept="image/*" class="form-control">
                             </div>
                        </div>
                        <div class="form-group">
                             <label class="form-label">Exames Adicionais / Bioimpedância (Opcional)</label>
                             <input type="file" id="foto_exame" accept="image/*" class="form-control">
                        </div>

                        <div style="text-align: right; margin-top: 15px;">
                            <button type="button" id="btn-salvar-avaliacao" class="btn btn-primary">Salvar Avaliação</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- TAB: Prescrição (Mock view) -->
            <div id="tab-treino" class="tab-content" style="display: none;">
                <div class="card" id="treino-container">
                    <div style="text-align: center; padding: 40px; color: var(--text-light);">
                        Nenhum treino prescrito. Use a aba "Resumo & IA" para gerar uma sugestão baseada na avaliação.
                    </div>
                </div>
            </div>

            <!-- TAB: Dieta e Suplementação -->
            <div id="tab-dieta" class="tab-content" style="display: none;">
                <div class="card" id="dieta-container">
                    <div style="text-align: center; padding: 40px; color: var(--text-light);">
                        Gere a análise da IA para obter sugestões de orientação alimentar e suplementação validada.
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: ({ id }) => {
        // Popular medicamentos select
        const medicamentos = DB.getAll('medicamentos');
        const medSelect = document.getElementById('medicamentos_select');
        if (medSelect && medicamentos) {
            medicamentos.forEach(med => {
                const opt = document.createElement('option');
                opt.value = med.nome;
                opt.textContent = med.nome + " - " + med.indicacao;
                medSelect.appendChild(opt);
            });
        }

        // Adicionar botão de aba para dieta se não existir no html renderizado
        // Precisamos injetar o botão da aba "Dieta" dinamicamente, já que esquecemos de colocar no html renderizado principal
        const tabHeader = document.querySelector('.tabs');
        if (tabHeader) {
            const dietaTabBtn = document.createElement('button');
            dietaTabBtn.className = 'tab-btn';
            dietaTabBtn.style.background = 'none';
            dietaTabBtn.style.border = 'none';
            dietaTabBtn.style.paddingBottom = '10px';
            dietaTabBtn.style.fontWeight = 'bold';
            dietaTabBtn.style.cursor = 'pointer';
            dietaTabBtn.style.color = 'var(--text-light)';
            dietaTabBtn.dataset.tab = 'dieta';
            dietaTabBtn.textContent = 'Dieta & Suplementação';
            tabHeader.appendChild(dietaTabBtn);
        }

        // Tab Switching Logic
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remove active classes
                tabs.forEach(t => {
                    t.style.borderBottom = 'none';
                    t.style.color = 'var(--text-light)';
                });
                document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

                // Add active to clicked
                e.target.style.borderBottom = '2px solid var(--primary-color)';
                e.target.style.color = 'var(--text-color)';
                document.getElementById(`tab-${e.target.dataset.tab}`).style.display = 'block';
            });
        });

        // AI Engine Action
        const btnIA = document.getElementById('btn-analisar-ia');
        if (btnIA) {
            btnIA.addEventListener('click', async () => {
                const resultsContainer = document.getElementById('ia-results');
                resultsContainer.innerHTML = '<em>Processando dados antropométricos, histórico e regras de segurança...</em>';
                btnIA.disabled = true;

                try {
                    // 1. Analyze
                    const analise = await AIEngine.analyze(id);

                    let htmlAnalise = `
                        <div style="margin-bottom: 15px;">
                            <strong>Status da Análise:</strong> Concluída (Confiança: ${analise.confianca})<br>
                            <small>${analise.resumo}</small>
                        </div>
                    `;

                    if (analise.alertas.length > 0) {
                        htmlAnalise += `<strong>Alertas de Segurança:</strong><br>`;
                        analise.alertas.forEach(a => {
                            htmlAnalise += `<div class="alert-item alert-${a.nivel}">${a.mensagem}</div>`;
                        });
                    }

                    htmlAnalise += `<div style="margin-top: 15px;">
                        <strong>Previsão de Evolução:</strong><br>
                        <p style="background: #f8fafc; padding: 10px; border-radius: 4px; font-size: 0.9em;">${analise.previsaoEvolucao}</p>
                    </div>`;

                    resultsContainer.innerHTML = htmlAnalise;

                    // Update Dieta Tab
                    const dietaContainer = document.getElementById('dieta-container');
                    if (dietaContainer && analise.dietaRecomendada) {
                         dietaContainer.innerHTML = `
                             <div class="card-header">Orientação Alimentar & Suplementação (${analise.dietaRecomendada.objetivo})</div>
                             <p><strong>Recomendação Geral:</strong> ${analise.dietaRecomendada.recomendacao}</p>
                             <ul style="margin-top: 10px; margin-bottom: 15px; padding-left: 20px;">
                                <li><strong>Proteína:</strong> ${analise.dietaRecomendada.macronutrientes.proteina}</li>
                                <li><strong>Carboidrato:</strong> ${analise.dietaRecomendada.macronutrientes.carboidrato}</li>
                                <li><strong>Gordura:</strong> ${analise.dietaRecomendada.macronutrientes.gordura}</li>
                             </ul>
                             <p><strong>Suplementação Sugerida (Validada):</strong> ${analise.dietaRecomendada.suplementacao_sugerida}</p>
                             <p style="margin-top: 10px;"><strong>Hidratação:</strong> ${analise.dietaRecomendada.hidratacao}</p>
                         `;
                    }

                    // 2. Generate Training
                    const treinoContainer = document.getElementById('treino-container');
                    treinoContainer.innerHTML = '<div style="text-align: center; padding: 40px;">Gerando estrutura de treinamento ideal...</div>';

                    const sugestaoTreino = await AIEngine.generateTraining(id);

                    let htmlTreino = `
                        <div class="card-header" style="display:flex; justify-content:space-between;">
                            <span>Sugestão de Treino - Rascunho IA</span>
                            <span class="badge badge-orange" id="status-treino-badge">Pendente de Revisão</span>
                        </div>
                        <p style="background: #f8fafc; padding: 10px; border-radius: 4px; font-size: 0.9em;">
                            <strong>Justificativa da IA:</strong> ${sugestaoTreino.justificativa}
                        </p>
                    `;

                    sugestaoTreino.estrutura.forEach((dia, dIndex) => {
                        htmlTreino += `
                            <h3 style="margin-top: 20px; color: var(--primary-color);">Treino ${dia.identificador} - ${dia.nome}</h3>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead><tr><th>Exercício</th><th>Séries</th><th>Reps</th><th>Carga/RIR</th><th>Obs</th><th>Vídeo</th></tr></thead>
                                    <tbody>
                                        ${dia.exercicios.map((ex, eIndex) => `
                                            <tr>
                                                <td>${ex.nome}</td>
                                                <td><input type="number" id="t_${dIndex}_${eIndex}_series" value="${ex.series}" style="width: 50px;"></td>
                                                <td><input type="text" id="t_${dIndex}_${eIndex}_reps" value="${ex.repeticoes}" style="width: 80px;"></td>
                                                <td>${ex.carga}</td>
                                                <td><input type="text" id="t_${dIndex}_${eIndex}_obs" value="${ex.observacao}" style="width: 100%;"></td>
                                                <td>${ex.video ? `<a href="${ex.video}" target="_blank" class="btn btn-sm btn-secondary">Ver</a>` : '-'}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `;
                    });

                    htmlTreino += `
                        <div style="margin-top: 20px; text-align: right;">
                            <button class="btn btn-primary" id="btn-aprovar-treino">Aprovar e Salvar Prescrição</button>
                            <button class="btn btn-secondary" id="btn-gerar-pdf" style="margin-left: 10px; display: none;">Gerar PDF</button>
                        </div>
                    `;

                    treinoContainer.innerHTML = htmlTreino;

                    document.getElementById('btn-aprovar-treino').addEventListener('click', () => {
                        // Extract edited values back to the object
                        sugestaoTreino.estrutura.forEach((dia, dIndex) => {
                            dia.exercicios.forEach((ex, eIndex) => {
                                ex.series = document.getElementById(`t_${dIndex}_${eIndex}_series`).value;
                                ex.repeticoes = document.getElementById(`t_${dIndex}_${eIndex}_reps`).value;
                                ex.observacao = document.getElementById(`t_${dIndex}_${eIndex}_obs`).value;
                            });
                        });

                        sugestaoTreino.status = 'Aprovado';
                        DB.save('treinos', sugestaoTreino);

                        document.getElementById('status-treino-badge').textContent = 'Aprovado';
                        document.getElementById('status-treino-badge').className = 'badge badge-green';
                        document.getElementById('btn-gerar-pdf').style.display = 'inline-block';

                        Utils.toast('Treino aprovado e salvo com sucesso!', 'sucesso');
                    });

                    document.getElementById('btn-gerar-pdf').addEventListener('click', async () => {
                        const { PDFService } = await import('../pdf.js');
                        PDFService.generateAlunoReport(aluno, analise, sugestaoTreino);
                        Utils.toast('PDF gerado com sucesso.', 'sucesso');
                    });

                    Utils.toast('Análise concluída com sucesso.', 'sucesso');

                } catch (e) {
                    resultsContainer.innerHTML = `<span style="color:red">Erro: ${e.message}</span>`;
                } finally {
                    btnIA.disabled = false;
                }
            });
        }

        // Image compression helper (Max 800x800, JPEG)
        const compressImage = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress as JPEG, 70% quality
                    };
                    img.onerror = error => reject(error);
                };
                reader.onerror = error => reject(error);
            });
        };

        // Mock Save Avaliação
        document.getElementById('btn-salvar-avaliacao')?.addEventListener('click', async () => {
             const btn = document.getElementById('btn-salvar-avaliacao');
             btn.disabled = true;
             btn.textContent = 'Processando imagens...';

             let fotos = {};
             try {
                 const inputs = ['foto_frente', 'foto_lat_dir', 'foto_costas', 'foto_lat_esq', 'foto_exame'];
                 for (let inputId of inputs) {
                     const file = document.getElementById(inputId).files[0];
                     if (file) {
                         fotos[inputId] = await compressImage(file);
                     }
                 }
             } catch(e) {
                 Utils.toast('Erro ao processar imagens', 'erro');
             }

             // Update Aluno model directly for this mock
             const alunoAtual = DB.getById('alunos', id);
             if (alunoAtual) {
                 const selectedMeds = Array.from(document.getElementById('medicamentos_select').selectedOptions).map(opt => ({nome: opt.value}));
                 alunoAtual.medicamentos = selectedMeds;
                 alunoAtual.hidratacao = parseInt(document.getElementById('hidratacao').value) || 0;
                 alunoAtual.alimentacao = { proteina: document.getElementById('alimentacao_proteina').value };

                 const cirurgiasVal = document.getElementById('cirurgias').value;
                 alunoAtual.cirurgias = cirurgiasVal ? [cirurgiasVal] : [];

                 // Save fotos in a separate sub-object or in the avaliacao (mocking directly in aluno for simplicity here)
                 alunoAtual.fotos = fotos;

                 DB.save('alunos', alunoAtual);
             }

             btn.disabled = false;
             btn.textContent = 'Salvar Avaliação';
             Utils.toast('Avaliação salva localmente. Imagens processadas e comprimidas.', 'sucesso');
        });
    }
};