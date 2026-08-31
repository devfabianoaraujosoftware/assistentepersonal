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
            parq: aluno.parq || {},
            experiencia: aluno.experiencia || 'Iniciante',
            frequenciaSemanal: parseInt(aluno.frequenciaSemanal) || 3,
            sono: aluno.sono || { horas: 8 },
            estresse: parseInt(aluno.estresse) || 5,
            objetivos: aluno.objetivos || [],
            medicacoes: aluno.medicacoes || [],
            temFotosRecentes: true // Mock that we have uploaded photos in the previous step
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

    return {
        confianca: 'MODERADA',
        resumo: `Aluno ${context.aluno.experiencia} focando em ${context.aluno.objetivos.join(', ') || 'Saúde Geral'}.`,
        alertas,
        sugestoes,
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

     const relatorioEvolucao = `Com dedicação a este plano de ${dias}x por semana e adesão à orientação nutricional, a expectativa é de adaptação neuromuscular nas primeiras 4 semanas e resultados morfológicos visíveis em 8 a 12 semanas.`;

     return {
         alunoId,
         dataInicio: new Date().toISOString(),
         status: 'Rascunho', // Must be approved by Personal
         frequencia: dias,
         estrutura,
         justificativa: "Estrutura sugerida com base na frequência semanal, nível de experiência e avaliações físicas/posturais. Atenção aos cuidados reportados na análise de medicações.",
         relatorioPrevisto: relatorioEvolucao
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
                  carga: "Moderada (RIR 2)",
                  descanso: "90s",
                  observacao: exSelecionado.observacoes || "Controlar excêntrica.",
                  video: exSelecionado.video || ""
              });
          }
      });
      return dia;
  }

  async analyzeNutrition({ hidratacao, objetivo, proteina, carbo, gordura }) {
      await this._delay(1000); // Simulate processing

      let feedback = "";
      if (objetivo === 'Hipertrofia') {
          if (proteina < 1.6) {
              feedback += "Proteína abaixo do recomendado para hipertrofia (sugestão: 1.6 a 2.2 g/kg). ";
          }
          if (carbo < 3.0) {
              feedback += "Carboidratos baixos podem comprometer a performance no treino de força e a recuperação. ";
          }
      } else if (objetivo === 'Emagrecimento') {
          if (proteina < 2.0) {
              feedback += "Em déficit calórico, manter a proteína alta (2.0 a 2.5 g/kg) ajuda na manutenção da massa magra. ";
          }
      }

      if (hidratacao < 2.5) {
          feedback += "Atenção: A hidratação está baixa. Aumentar a ingestão de água é fundamental para todas as vias metabólicas. ";
      }

      if (feedback === "") {
          feedback = "Os macros e a hidratação estão adequados para o objetivo selecionado. Ótima distribuição!";
      }

      return feedback;
  }
}

const AIEngine = new MockAIService();
export default AIEngine;
