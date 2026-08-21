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
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-6)">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <a href="#/alunos" class="btn btn-secondary">← Voltar</a>
                    ${aluno.foto ? `<img src="${aluno.foto}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">` : ''}
                    <h1>${aluno.nome} <span class="badge badge-green">${idade} anos</span></h1>
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--border-color); display: flex; gap: 20px;">
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
                    <div class="card-header">Nova Avaliação Antropométrica</div>
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
                                <label class="form-label">Gordura Corporal (%)</label>
                                <input type="number" step="0.1" id="gordura" class="form-control">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group form-col">
                                <label class="form-label">Massa Muscular (kg) - Opcional</label>
                                <input type="number" step="0.1" id="massa_muscular" class="form-control">
                            </div>
                            <div class="form-group form-col">
                                <label class="form-label">Upload Exame Bioimpedância / Imagem</label>
                                <input type="file" id="exame_bio_upload" accept="image/*" class="form-control">
                            </div>
                        </div>

                        <div class="card-header" style="margin-top: 20px;">Biofotogrametria (Fotos Posturais)</div>
                        <div class="form-row">
                            <div class="form-group form-col">
                                 <label class="form-label">Frente</label>
                                 <input type="file" id="foto_frente" accept="image/*" class="form-control">
                            </div>
                            <div class="form-group form-col">
                                 <label class="form-label">Costas</label>
                                 <input type="file" id="foto_costas" accept="image/*" class="form-control">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group form-col">
                                 <label class="form-label">Perfil Direito</label>
                                 <input type="file" id="foto_dir" accept="image/*" class="form-control">
                            </div>
                            <div class="form-group form-col">
                                 <label class="form-label">Perfil Esquerdo</label>
                                 <input type="file" id="foto_esq" accept="image/*" class="form-control">
                            </div>
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
        `;
    },

    afterRender: ({ id }) => {
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

                    resultsContainer.innerHTML = htmlAnalise;

                    // 2. Generate Training
                    const treinoContainer = document.getElementById('treino-container');
                    treinoContainer.innerHTML = '<div style="text-align: center; padding: 40px;">Gerando estrutura de treinamento ideal...</div>';

                    const sugestaoTreino = await AIEngine.generateTraining(id);

                    let htmlTreino = `
                        <div class="card-header" style="display:flex; justify-content:space-between;">
                            <span>Sugestão de Treino - Rascunho IA</span>
                            <span class="badge badge-orange" id="status-treino-badge">Pendente de Revisão</span>
                        </div>
                        <div style="background: #f8fafc; padding: 10px; border-radius: 4px; font-size: 0.9em; margin-bottom: 15px;">
                            <strong>Justificativa da IA:</strong> ${sugestaoTreino.justificativa}<br><br>
                            <strong>Cuidados Recomendados:</strong> ${sugestaoTreino.cuidados || 'Sem cuidados específicos adicionais.'}<br><br>
                            <strong>Evolução Prevista:</strong> ${sugestaoTreino.evolucao || 'Evolução padronizada esperada.'}
                        </div>
                    `;

                    sugestaoTreino.estrutura.forEach((dia, dIndex) => {
                        htmlTreino += `
                            <h3 style="margin-top: 20px; color: var(--primary-color);">Treino ${dia.identificador} - ${dia.nome}</h3>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead><tr><th>Exercício</th><th>Vídeo</th><th>Séries</th><th>Reps</th><th>Carga/RIR</th><th>Obs</th></tr></thead>
                                    <tbody>
                                        ${dia.exercicios.map((ex, eIndex) => `
                                            <tr>
                                                <td>${ex.nome}</td>
                                                <td>${ex.video ? `<a href="${ex.video}" target="_blank" style="color:red; text-decoration:none;">▶ YouTube</a>` : '-'}</td>
                                                <td><input type="number" id="t_${dIndex}_${eIndex}_series" value="${ex.series}" style="width: 50px;"></td>
                                                <td><input type="text" id="t_${dIndex}_${eIndex}_reps" value="${ex.repeticoes}" style="width: 80px;"></td>
                                                <td>${ex.carga}</td>
                                                <td><input type="text" id="t_${dIndex}_${eIndex}_obs" value="${ex.observacao}" style="width: 100%;"></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `;
                    });

                    htmlTreino += `
                        <div style="margin-top: 20px; text-align: right; display:flex; justify-content: flex-end; gap: 10px;">
                            <button class="btn btn-primary" id="btn-aprovar-treino">Aprovar e Salvar Prescrição</button>
                            <button class="btn btn-secondary" id="btn-gerar-pdf" style="display: none;">Gerar PDF</button>
                            <button class="btn btn-secondary" id="btn-enviar-whatsapp" style="display: none; background-color: #25D366; color: white; border: none;">Enviar por WhatsApp</button>
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
                        document.getElementById('btn-enviar-whatsapp').style.display = 'inline-block';

                        Utils.toast('Treino aprovado e salvo com sucesso!', 'sucesso');
                    });

                    document.getElementById('btn-gerar-pdf').addEventListener('click', async () => {
                        const { PDFService } = await import('../pdf.js');
                        PDFService.generateAlunoReport(aluno, analise, sugestaoTreino);
                        Utils.toast('PDF gerado com sucesso.', 'sucesso');
                    });

                    document.getElementById('btn-enviar-whatsapp').addEventListener('click', () => {
                        if (!aluno.telefone) {
                            alert("Aluno não possui telefone cadastrado!");
                            return;
                        }

                        let mensagem = `Olá, ${aluno.nome}! Seu novo treino foi gerado.\n\n`;
                        sugestaoTreino.estrutura.forEach(dia => {
                            mensagem += `*Treino ${dia.identificador}: ${dia.nome}*\n`;
                            dia.exercicios.forEach(ex => {
                                mensagem += `- ${ex.nome}: ${ex.series}x${ex.repeticoes} (${ex.video || ''})\n`;
                            });
                            mensagem += `\n`;
                        });

                        mensagem += `Bons treinos!`;

                        const numeroLimpo = aluno.telefone.replace(/\D/g, '');
                        const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
                        window.open(url, '_blank');
                    });

                    Utils.toast('Análise concluída com sucesso.', 'sucesso');

                } catch (e) {
                    resultsContainer.innerHTML = `<span style="color:red">Erro: ${e.message}</span>`;
                } finally {
                    btnIA.disabled = false;
                }
            });
        }

        // Handle Photo Conversions for Assessment
        const fileToBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        // Mock Save Avaliação
        document.getElementById('btn-salvar-avaliacao')?.addEventListener('click', async () => {
             const getBase64Safe = async (inputId) => {
                 const input = document.getElementById(inputId);
                 if (input && input.files.length > 0) {
                     return await fileToBase64(input.files[0]);
                 }
                 return null;
             };

             const avaliacaoData = {
                 peso: parseFloat(document.getElementById('peso')?.value) || 0,
                 altura: parseFloat(document.getElementById('altura')?.value) || 0,
                 cintura: parseFloat(document.getElementById('cintura')?.value) || 0,
                 gordura: parseFloat(document.getElementById('gordura')?.value) || 0,
                 massa_muscular: parseFloat(document.getElementById('massa_muscular')?.value) || 0,
                 fotos: {
                     frente: await getBase64Safe('foto_frente'),
                     costas: await getBase64Safe('foto_costas'),
                     direita: await getBase64Safe('foto_dir'),
                     esquerda: await getBase64Safe('foto_esq'),
                     exame_bio: await getBase64Safe('exame_bio_upload')
                 },
                 data: new Date().toISOString()
             };

             // In a complete implementation, this would save to a separate 'avaliacoes' collection or nest inside aluno
             aluno.ultimaAvaliacao = avaliacaoData;
             DB.save('alunos', aluno);

             Utils.toast('Avaliação salva com sucesso, incluindo fotos e exames!', 'sucesso');
             // In a real app, this would extract values, call Calc.imc(), save to DB.avaliacoes
        });
    }
};