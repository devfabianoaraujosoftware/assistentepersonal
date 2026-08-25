// js/aiEngine.js
import DB from './database.js';

class MockAIService {
  constructor() {
    this.rules = [];
  }

  async loadRules() {
    try {
      const response = await fetch('./docs/ai-rules.json');
      if (response.ok) {
        const data = await response.json();
        this.rules = data.regras;
      }
    } catch (e) {
      console.warn("Could not load AI rules.");
    }
  }

  // Simulates latency of an external API
  async _delay(ms = 1500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async analyze(alunoId, avaliacaoId) {
    await this.loadRules();
    await this._delay(); // Simulate processing

    const aluno = DB.getById('alunos', alunoId);
    if (!aluno) throw new Error("Aluno não encontrado para análise.");

    // Safely structure data for rules evaluation to mock AI behavior
    const context = {
        aluno: {
            lesoes: aluno.lesoes || [],
            cirurgias: aluno.cirurgias || [],
            medicamentos: aluno.medicamentos || [],
            parq: aluno.parq || {},
            experiencia: aluno.experiencia || 'Iniciante',
            frequenciaSemanal: parseInt(aluno.frequenciaSemanal) || 3,
            sono: aluno.sono || { horas: 8 },
            estresse: parseInt(aluno.estresse) || 5,
            alimentacao: aluno.alimentacao || 'boa',
            hidratacao: parseFloat(aluno.hidratacao) || 2.0,
            objetivos: aluno.objetivoPrincipal ? [aluno.objetivoPrincipal] : []
        }
    };

    const alertas = [];
    const sugestoes = [];

    // Simple rule engine evaluation (Mock)
    this.rules.forEach(rule => {
        try {
            // WARNING: Using eval for the sake of mocking dynamic rules in this local SPA.
            // In production with a real backend, rules are processed safely or via LLM.
            // Create a local function scope to safely evaluate the condition string
            const checkCondition = new Function('aluno', `return ${rule.condicao};`);
            if (checkCondition(context.aluno)) {
                if (['vermelho', 'laranja', 'amarelo'].includes(rule.nivel)) {
                    alertas.push({ nivel: rule.nivel, mensagem: rule.acao, id: rule.id });
                } else {
                    sugestoes.push({ categoria: rule.categoria, mensagem: rule.acao });
                }
            }
        } catch (e) {
           console.warn(`Erro avaliando regra ${rule.id}`);
        }
    });

    // Default static insights if rules don't trigger much
    if (alertas.length === 0) {
        alertas.push({ nivel: 'verde', mensagem: 'Sem alertas relevantes identificados pelos dados disponíveis.', id: 'DEFAULT_OK' });
    }

    // Simulate image analysis context if images exist (mock logic)
    const hasImages = aluno.fotoIdentificacao || false;
    let mockImageAnalysis = "Nenhuma imagem de avaliação física para analisar.";
    if (hasImages) {
        mockImageAnalysis = "Imagens processadas: Identificada leve assimetria postural e biotipo predominante mesomorfo. Bioimpedância sugere aumento de massa magra de 1.5kg em 3 meses com protocolo adequado.";
    }

    return {
        confianca: 'ALTA',
        resumo: `Aluno ${context.aluno.experiencia} focando em ${context.aluno.objetivos.join(', ') || 'Saúde Geral'}. \nFeedback IA (Fotos/Exames): ${mockImageAnalysis}`,
        alertas,
        sugestoes,
        geradoEm: new Date().toISOString(),
        relatorioEvolucao: `Evolução Prevista: Com consistência de ${context.aluno.frequenciaSemanal}x/semana, a meta de ${context.aluno.objetivos.join(', ')} começará a ser visível estruturalmente entre 8 e 12 semanas. Atenção especial à dieta é requerida.`,
        cuidadosPersonal: alertas.map(a => a.mensagem).join(' | ')
    };
  }

  async generateTraining(alunoId, avaliacaoId) {
     await this._delay(2000); // Simulate generation

     const aluno = DB.getById('alunos', alunoId);
     const exerciciosBD = DB.getAll('exercicios');

     const dias = parseInt(aluno.frequenciaSemanal) || 3;
     let estrutura = [];

     // Enhanced logic to generate workouts dynamically based on specified days (frequenciaSemanal)
     const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
     if (dias <= 2) {
         estrutura.push(this._createDay('A', 'Corpo Inteiro', exerciciosBD, ['Peitoral', 'Costas', 'Quadríceps', 'Posterior', 'Core', 'Panturrilha']));
         if (dias === 2) {
             estrutura.push(this._createDay('B', 'Corpo Inteiro Foco 2', exerciciosBD, ['Costas', 'Peitoral', 'Posterior', 'Quadríceps', 'Ombros', 'Abdômen']));
         }
     } else if (dias === 3) {
         estrutura.push(this._createDay('A', 'Empurrar (Peito, Ombro, Tríceps)', exerciciosBD, ['Peitoral', 'Ombros', 'Tríceps']));
         estrutura.push(this._createDay('B', 'Puxar (Costas, Bíceps)', exerciciosBD, ['Costas', 'Bíceps']));
         estrutura.push(this._createDay('C', 'Pernas Completas e Core', exerciciosBD, ['Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha', 'Core']));
     } else if (dias === 4) {
         estrutura.push(this._createDay('A', 'Superior - Força', exerciciosBD, ['Peitoral', 'Costas', 'Ombros', 'Bíceps', 'Tríceps']));
         estrutura.push(this._createDay('B', 'Inferior - Força', exerciciosBD, ['Quadríceps', 'Posterior', 'Panturrilha', 'Abdômen']));
         estrutura.push(this._createDay('C', 'Superior - Hipertrofia', exerciciosBD, ['Peitoral', 'Costas', 'Ombros', 'Bíceps', 'Tríceps']));
         estrutura.push(this._createDay('D', 'Inferior - Hipertrofia', exerciciosBD, ['Quadríceps', 'Posterior', 'Panturrilha', 'Core']));
     } else {
         estrutura.push(this._createDay('A', 'Peito e Panturrilha', exerciciosBD, ['Peitoral', 'Panturrilha']));
         estrutura.push(this._createDay('B', 'Costas e Antebraço', exerciciosBD, ['Costas']));
         estrutura.push(this._createDay('C', 'Pernas (Foco Quadríceps)', exerciciosBD, ['Quadríceps', 'Glúteos']));
         estrutura.push(this._createDay('D', 'Ombros e Abdômen', exerciciosBD, ['Ombros', 'Abdômen']));
         estrutura.push(this._createDay('E', 'Bíceps e Tríceps', exerciciosBD, ['Bíceps', 'Tríceps']));
         for (let i = 5; i < dias; i++) {
             estrutura.push(this._createDay(letras[i], 'Treino Extra (Mobilidade / Funcional)', exerciciosBD, ['Corpo Inteiro', 'Core']));
         }
     }

     return {
         alunoId,
         dataInicio: new Date().toISOString(),
         status: 'Rascunho', // Must be approved by Personal
         frequencia: dias,
         estrutura,
         justificativa: "Estrutura sugerida pela IA considerando " + dias + " dias de treino semanais, baseada nos objetivos e histórico do aluno. Ajuste séries e repetições conforme achar adequado."
     };
  }

  _createDay(identificador, nome, db, gruposFoco) {
      const dia = { identificador, nome, exercicios: [] };

      gruposFoco.forEach(grupo => {
          // Find 1-3 exercises for the muscle group to provide volume
          const possiveis = db.filter(ex => ex.grupoMuscular.includes(grupo) || ex.grupoMuscular.includes("Corpo Inteiro"));
          if(possiveis.length > 0) {
              const limit = Math.min(2, possiveis.length);
              // Shuffle and slice for simple mock variety
              const selecionados = possiveis.sort(() => 0.5 - Math.random()).slice(0, limit);
              selecionados.forEach(exSelecionado => {
                  dia.exercicios.push({
                      exercicioId: exSelecionado.id,
                      nome: exSelecionado.nome,
                      series: exSelecionado.tipo === 'Alongamento' || exSelecionado.tipo === 'Mobilidade' ? 2 : 4,
                      repeticoes: exSelecionado.tipo === 'Isometria' ? '30s - 1min' : '10-15',
                      carga: "Sugerido: RIR 1-2 (Intenso)",
                      descanso: "60-90s",
                      observacao: exSelecionado.observacoes || "Execução controlada.",
                      videoUrl: exSelecionado.videoUrl || ""
                  });
              });
          }
      });
      return dia;
  }
}

const AIEngine = new MockAIService();
export default AIEngine;
