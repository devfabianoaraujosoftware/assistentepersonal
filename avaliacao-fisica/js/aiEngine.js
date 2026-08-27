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
    const avaliacao = DB.getAll('avaliacoes').find(a => a.alunoId === alunoId) || {};

    const context = {
        aluno: {
            lesoes: aluno.lesoes || [],
            parq: aluno.parq || {},
            experiencia: aluno.experiencia || 'Iniciante',
            frequenciaSemanal: parseInt(aluno.frequenciaSemanal) || 3,
            sono: aluno.sono || { horas: 8 },
            estresse: parseInt(aluno.estresse) || 5,
            objetivos: aluno.objetivos || [],
            hidratacao: aluno.hidratacao || 0,
            dieta: aluno.dieta || {},
            medicamentos: aluno.medicamentos || [],
            peso: avaliacao.peso || 70, // Fallback used in some rules
            fotoExame: avaliacao.fotoExame || null
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

    if (context.aluno.fotoExame) {
        sugestoes.push({ categoria: "imagem_analisada", mensagem: "Imagem de Bioimpedância/Exame detectada. A IA (Mock) nota uma distribuição muscular assimétrica que requer atenção unilateral no treino."});
    }

    const relatorioEvolucao = `Com adesão à frequência de ${context.aluno.frequenciaSemanal}x na semana e hidratação adequada, estima-se adaptação neurológica inicial em 3-4 semanas e mudanças estruturais visíveis em 8-12 semanas.`;

    return {
        confianca: 'MODERADA',
        resumo: `Aluno ${context.aluno.experiencia} focando em ${context.aluno.objetivos.join(', ') || 'Saúde Geral'}.`,
        alertas,
        sugestoes,
        relatorioEvolucao,
        geradoEm: new Date().toISOString()
    };
  }

  async generateTraining(alunoId, avaliacaoId) {
     await this._delay(2000); // Simulate generation

     const aluno = DB.getById('alunos', alunoId);
     const exerciciosBD = DB.getAll('exercicios');

     const dias = parseInt(aluno.frequenciaSemanal) || 3;
     let estrutura = [];

     // Very simple logic to mock workout splitting
     if (dias <= 2) {
         // Full body
         estrutura.push(this._createDay('A', 'Corpo Inteiro', exerciciosBD, ['Peitoral', 'Costas', 'Quadríceps', 'Posterior']));
     } else if (dias === 3) {
         // Push/Pull/Legs mock
         estrutura.push(this._createDay('A', 'Empurrar', exerciciosBD, ['Peitoral', 'Ombros', 'Tríceps']));
         estrutura.push(this._createDay('B', 'Puxar', exerciciosBD, ['Costas', 'Bíceps']));
         estrutura.push(this._createDay('C', 'Pernas', exerciciosBD, ['Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha']));
     } else {
         // Bro split mock
         estrutura.push(this._createDay('A', 'Peito e Tríceps', exerciciosBD, ['Peitoral', 'Tríceps']));
         estrutura.push(this._createDay('B', 'Costas e Bíceps', exerciciosBD, ['Costas', 'Bíceps']));
         estrutura.push(this._createDay('C', 'Pernas', exerciciosBD, ['Quadríceps', 'Posterior', 'Panturrilha']));
         estrutura.push(this._createDay('D', 'Ombros e Core', exerciciosBD, ['Ombros', 'Core', 'Abdômen']));
     }

     return {
         alunoId,
         dataInicio: new Date().toISOString(),
         status: 'Rascunho', // Must be approved by Personal
         frequencia: dias,
         estrutura,
         justificativa: "Estrutura sugerida com base na frequência semanal e nível de experiência. Cargas e ajustes finos requerem revisão presencial."
     };
  }

  _createDay(identificador, nome, db, gruposFoco) {
      const dia = { identificador, nome, exercicios: [] };

      gruposFoco.forEach(grupo => {
          // Find 1-2 exercises for the muscle group
          const possiveis = db.filter(ex => ex.grupoMuscular.includes(grupo));
          if(possiveis.length > 0) {
              const exSelecionado = possiveis[Math.floor(Math.random() * possiveis.length)];
              dia.exercicios.push({
                  exercicioId: exSelecionado.id,
                  nome: exSelecionado.nome,
                  series: 3,
                  repeticoes: "8-12",
                  carga: "A definir (RIR 2)",
                  descanso: "90s",
                  observacao: (exSelecionado.observacoes ? exSelecionado.observacoes + " " : "") + "Controlar excêntrica."
              });
          }
      });
      return dia;
  }
}

const AIEngine = new MockAIService();
export default AIEngine;
