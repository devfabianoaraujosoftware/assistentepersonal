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
            objetivos: aluno.objetivos || [aluno.objetivoPrincipal] || [],
            medicamentos: aluno.medicamentos || [],
            alimentacao: aluno.alimentacao || 'Regular',
            hidratacao: aluno.hidratacao || 2
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

    // Simulate image analysis (mock) if the student has photos
    if (aluno.fotoUrl || aluno.foto_frente || aluno.foto_exames) {
        sugestoes.push({ categoria: 'imagem', mensagem: 'Análise de Imagem (Mock): Assimetria leve detectada no ombro direito. Bioimpedância sugere 15% de BF.' });
    }

    // Nutritional guidelines based on objective
    const objPrincipal = aluno.objetivoPrincipal || '';
    if (objPrincipal === 'Hipertrofia') {
        sugestoes.push({ categoria: 'nutricao', mensagem: 'Sugestão Nutricional (Validada): Focar em superávit calórico leve (200-300 kcal), alta ingestão de proteína (1.6 a 2.2g/kg). Suplementação sugerida: Creatina, Whey Protein.' });
        sugestoes.push({ categoria: 'evolucao', mensagem: 'Evolução Prevista: Ganho de 0.5 a 1kg de massa magra por mês se houver adesão ao treino e dieta.' });
    } else if (objPrincipal === 'Emagrecimento') {
        sugestoes.push({ categoria: 'nutricao', mensagem: 'Sugestão Nutricional (Validada): Focar em déficit calórico moderado (300-500 kcal), manter alta proteína para preservar massa magra. Suplementação sugerida: Cafeína (pré-treino).' });
        sugestoes.push({ categoria: 'evolucao', mensagem: 'Evolução Prevista: Perda de 0.5 a 1kg de gordura por semana com boa adesão.' });
    } else if (objPrincipal === 'Força') {
        sugestoes.push({ categoria: 'nutricao', mensagem: 'Sugestão Nutricional (Validada): Focar em dieta isocalórica ou leve superávit. Alta ingestão de carboidratos antes do treino. Suplementação sugerida: Creatina.' });
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

     return {
         alunoId,
         dataInicio: new Date().toISOString(),
         status: 'Rascunho', // Must be approved by Personal
         frequencia: dias,
         estrutura,
         justificativa: "Estrutura sugerida com base na frequência semanal e nível de experiência. Cargas e ajustes finos requerem revisão presencial. Cuidados para o treinador: Monitore a execução dos exercícios multiarticulares e ajuste a carga conforme o feedback do aluno (RIR)."
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
                  observacao: exSelecionado.observacoes || "Controlar excêntrica."
              });
          }
      });
      return dia;
  }
}

const AIEngine = new MockAIService();
export default AIEngine;
