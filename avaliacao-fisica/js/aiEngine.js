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
            objetivos: aluno.objetivos || []
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

    // Hardcoded logic for meds and nutrition (Mock AI)
    if (aluno.medicamentos && aluno.medicamentos.length > 0) {
        const medsStr = aluno.medicamentos.map(m => m.nome.toLowerCase()).join(' ');
        if (medsStr.includes('losartana') || medsStr.includes('atenolol') || medsStr.includes('propranolol') || medsStr.includes('beta')) {
             alertas.push({ nivel: 'laranja', mensagem: 'Uso de anti-hipertensivos/betabloqueadores. Atenção: Frequência cardíaca pode não ser um bom parâmetro de intensidade. Monitore a percepção subjetiva de esforço (PSE). Evite manobra de Valsalva.', id: 'MED_PRESSAO' });
        }
        if (medsStr.includes('metformina') || medsStr.includes('insulina') || medsStr.includes('glifage')) {
             alertas.push({ nivel: 'laranja', mensagem: 'Uso de hipoglicemiantes. Risco de hipoglicemia durante/após o treino. Recomende refeição pré-treino adequada e monitore sintomas.', id: 'MED_DIABETE' });
        }
        if (!alertas.find(a => a.id.startsWith('MED_'))) {
            alertas.push({ nivel: 'amarelo', mensagem: `Uso de medicamentos reportados (${aluno.medicamentos.map(m => m.nome).join(', ')}). Caso desconheça as interações, peça liberação médica.`, id: 'MED_GENERICO' });
        }
    }

    if (aluno.hidratacao && aluno.hidratacao < 2.0) {
        sugestoes.push({ categoria: 'Hidratação', mensagem: `Hidratação reportada baixa (${aluno.hidratacao}L). Recomende aumento na ingestão hídrica, especialmente peritroino.`});
    }

    if (aluno.nutricao) {
        if (aluno.objetivoPrincipal === 'Hipertrofia' && aluno.nutricao.proteina < 1.6) {
             sugestoes.push({ categoria: 'Nutrição', mensagem: `Ingestão proteica reportada (${aluno.nutricao.proteina}g/kg) está abaixo do recomendado (1.6-2.2g/kg) para hipertrofia. Considere encaminhar ao nutricionista.` });
        }
        if (aluno.objetivoPrincipal === 'Emagrecimento' && aluno.nutricao.proteina < 1.2) {
             sugestoes.push({ categoria: 'Nutrição', mensagem: `Ingestão proteica baixa (${aluno.nutricao.proteina}g/kg). Aumentar a proteína ajuda na saciedade e manutenção da massa magra durante emagrecimento.` });
        }
    }

    if (aluno.cirurgias && aluno.cirurgias.length > 0) {
        alertas.push({ nivel: 'vermelho', mensagem: `Atenção especial à prescrição devido a cirurgias reportadas: ${aluno.cirurgias.map(c => c.local).join(', ')}.`, id: 'CIRURGIA_AVISO' });
    }

    // Default static insights if rules don't trigger much
    if (alertas.length === 0) {
        alertas.push({ nivel: 'verde', mensagem: 'Sem alertas relevantes identificados pelos dados disponíveis.', id: 'DEFAULT_OK' });
    }

    return {
        confianca: 'ALTA (Dados Detalhados)',
        resumo: `Aluno ${context.aluno.experiencia} focando em ${aluno.objetivoPrincipal || 'Saúde Geral'}.`,
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
         // Full body + Prep
         estrutura.push(this._createDay('A', 'Corpo Inteiro', exerciciosBD, ['Mobilidade', 'Peitoral', 'Costas', 'Quadríceps', 'Posterior', 'Alongamento']));
     } else if (dias === 3) {
         // Push/Pull/Legs mock
         estrutura.push(this._createDay('A', 'Empurrar', exerciciosBD, ['Mobilidade', 'Peitoral', 'Ombros', 'Tríceps', 'Alongamento']));
         estrutura.push(this._createDay('B', 'Puxar', exerciciosBD, ['Mobilidade', 'Costas', 'Bíceps', 'Lombar', 'Alongamento']));
         estrutura.push(this._createDay('C', 'Pernas', exerciciosBD, ['Mobilidade', 'Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha', 'Alongamento']));
     } else {
         // Bro split mock
         estrutura.push(this._createDay('A', 'Peito e Tríceps', exerciciosBD, ['Mobilidade', 'Peitoral', 'Tríceps']));
         estrutura.push(this._createDay('B', 'Costas e Bíceps', exerciciosBD, ['Mobilidade', 'Costas', 'Bíceps']));
         estrutura.push(this._createDay('C', 'Pernas', exerciciosBD, ['Mobilidade', 'Quadríceps', 'Posterior', 'Panturrilha']));
         estrutura.push(this._createDay('D', 'Ombros e Condicionamento', exerciciosBD, ['Mobilidade', 'Ombros', 'Crossfit', 'Core']));
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

              let series = 3;
              let repeticoes = "8-12";
              let descanso = "90s";
              let carga = "A definir (RIR 2)";

              if (exSelecionado.tipo === 'alongamento' || exSelecionado.tipo === 'mobilidade') {
                  series = 2;
                  repeticoes = "20-30s";
                  descanso = "30s";
                  carga = "Peso corporal";
              } else if (exSelecionado.tipo === 'isometria') {
                  series = 3;
                  repeticoes = "30-45s";
                  descanso = "60s";
                  carga = "Peso corporal";
              } else if (exSelecionado.tipo === 'potencia' || exSelecionado.tipo === 'metabolico') {
                  series = 4;
                  repeticoes = "10-15";
                  descanso = "60s";
                  carga = "Moderada";
              }

              dia.exercicios.push({
                  exercicioId: exSelecionado.id,
                  nome: exSelecionado.nome,
                  series: series,
                  repeticoes: repeticoes,
                  carga: carga,
                  descanso: descanso,
                  observacao: exSelecionado.observacoes || "Foco na execução.",
                  videoUrl: exSelecionado.videoUrl || ""
              });
          }
      });
      return dia;
  }
}

const AIEngine = new MockAIService();
export default AIEngine;
