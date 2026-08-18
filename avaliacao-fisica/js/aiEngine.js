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
            hidratacao: aluno.hidratacao || 0,
            alimentacao: aluno.alimentacao || 'balanceado',
            parq: aluno.parq || {},
            experiencia: aluno.experiencia || 'Iniciante',
            frequenciaSemanal: parseInt(aluno.frequenciaSemanal) || 3,
            sono: aluno.sono || { horas: 8 },
            estresse: parseInt(aluno.estresse) || 5,
            objetivoPrincipal: aluno.objetivoPrincipal || '',
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

    // Análise de Medicamentos (Mock inteligente de IA para cruzar medicações e exercícios)
    context.aluno.medicamentos.forEach(med => {
        const nomeLower = med.nome.toLowerCase();
        if (nomeLower.includes('losartana') || nomeLower.includes('captopril') || nomeLower.includes('hipertensao')) {
            alertas.push({ nivel: 'laranja', mensagem: `Medicamento detectado (${med.nome}): Atenção com exercícios isométricos prolongados (Ex: Prancha) e manobra de Valsalva, risco de picos de pressão arterial.`, id: `MED_${med.nome}` });
        } else if (nomeLower.includes('insulina') || nomeLower.includes('metformina')) {
            alertas.push({ nivel: 'amarelo', mensagem: `Medicamento detectado (${med.nome}): Risco de hipoglicemia durante/pós-treino. Sugerir carboidrato de rápida absorção antes do treino.`, id: `MED_${med.nome}` });
        } else if (nomeLower.includes('sibutramina')) {
            alertas.push({ nivel: 'laranja', mensagem: `Medicamento detectado (${med.nome}): Pode aumentar frequência cardíaca de repouso e pressão arterial. Monitorar cardio e evitar HIT extremos.`, id: `MED_${med.nome}` });
        } else {
             sugestoes.push({ categoria: 'Medicação', mensagem: `Medicamento (${med.nome}) relatado. Verifique a bula ou solicite atestado para impactos não listados.` });
        }
    });

    // Feedback Alimentar e Hidratação baseado nos objetivos
    if (context.aluno.hidratacao < 2) {
        alertas.push({ nivel: 'amarelo', mensagem: `Hidratação muito baixa (${context.aluno.hidratacao}L). Risco de queda de performance e cãibras. Meta ideal: ${(75 * 0.035).toFixed(1)}L a ${(75 * 0.05).toFixed(1)}L/dia.`, id: 'HIDRO_BAIXA' });
    }

    if (context.aluno.objetivoPrincipal.toLowerCase() === 'hipertrofia') {
        if (context.aluno.alimentacao === 'hipocalorica' || context.aluno.alimentacao === 'irregular') {
            alertas.push({ nivel: 'laranja', mensagem: `Padrão alimentar (${context.aluno.alimentacao}) conflitante com o objetivo de hipertrofia. Sugerido ajuste para superávit calórico e alta proteína.`, id: 'DIETA_CONFLITO' });
        }
        sugestoes.push({ categoria: 'Nutrição', mensagem: `Para hipertrofia, sugere-se 1.6 a 2.2g de Proteína/kg. Focar em refeições com carboidratos antes e após o treino.` });
    } else if (context.aluno.objetivoPrincipal.toLowerCase() === 'emagrecimento') {
        if (context.aluno.alimentacao === 'hipercalorica') {
            alertas.push({ nivel: 'laranja', mensagem: `Padrão alimentar (bulking) conflitante com objetivo de emagrecimento. Necessário déficit calórico.`, id: 'DIETA_CONFLITO' });
        }
        sugestoes.push({ categoria: 'Nutrição', mensagem: `Para emagrecimento, manter alta ingestão de proteínas para preservar massa magra e déficit calórico de 300-500 kcal.` });
    }

    // Default static insights if rules don't trigger much
    if (alertas.length === 0) {
        alertas.push({ nivel: 'verde', mensagem: 'Sem alertas relevantes identificados pelos dados disponíveis.', id: 'DEFAULT_OK' });
    }

    // Mock Inteligente para Análise de Imagem/Bioimpedância (se exames estivessem anexados, IA interpretaria as imagens/PDFs)
    sugestoes.push({ categoria: 'Biofotogrametria/Composição (IA)', mensagem: 'As imagens anexadas indicam possível leve assimetria no ombro direito. Foco em exercícios unilaterais para equilibrar.' });

    return {
        confianca: 'ALTA (IA Analítica)',
        resumo: `Aluno ${context.aluno.experiencia} focando em ${context.aluno.objetivoPrincipal || 'Saúde Geral'}, com base em ${context.aluno.frequenciaSemanal} treinos semanais.`,
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

     // Very simple logic to mock workout splitting with advanced variations
     const objetivo = aluno.objetivoPrincipal ? aluno.objetivoPrincipal.toLowerCase() : 'saúde';
     const isHipertrofia = objetivo === 'hipertrofia';
     const isEmagrecimento = objetivo === 'emagrecimento';

     if (dias <= 2) {
         // Full body
         estrutura.push(this._createDay('A', 'Corpo Inteiro', exerciciosBD, ['Peitoral', 'Costas', 'Quadríceps', 'Posterior', 'Core'], isHipertrofia));
         estrutura.push(this._createDay('B', 'Corpo Inteiro (Variação)', exerciciosBD, ['Costas', 'Peitoral', 'Posterior', 'Quadríceps', 'Ombros'], isHipertrofia));
     } else if (dias === 3) {
         // Push/Pull/Legs mock
         estrutura.push(this._createDay('A', 'Empurrar (Peito, Ombro, Tríceps)', exerciciosBD, ['Peitoral', 'Ombros', 'Tríceps', 'Core'], isHipertrofia));
         estrutura.push(this._createDay('B', 'Puxar (Costas, Bíceps)', exerciciosBD, ['Costas', 'Bíceps', 'Mobilidade'], isHipertrofia));
         estrutura.push(this._createDay('C', 'Pernas Completas', exerciciosBD, ['Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha'], isHipertrofia));
     } else {
         // Bro split mock ou Upper/Lower
         estrutura.push(this._createDay('A', 'Membros Superiores Foco Peito', exerciciosBD, ['Peitoral', 'Tríceps', 'Ombros'], isHipertrofia));
         estrutura.push(this._createDay('B', 'Membros Inferiores Foco Quad', exerciciosBD, ['Quadríceps', 'Panturrilha', 'Core'], isHipertrofia));
         estrutura.push(this._createDay('C', 'Membros Superiores Foco Costas', exerciciosBD, ['Costas', 'Bíceps', 'Mobilidade'], isHipertrofia));
         estrutura.push(this._createDay('D', 'Membros Inferiores Foco Post/Glúteo', exerciciosBD, ['Posterior', 'Glúteos', 'Core'], isHipertrofia));
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

  _createDay(identificador, nome, db, gruposFoco, isHipertrofia) {
      const dia = { identificador, nome, exercicios: [] };

      // Configurações baseadas no objetivo
      const repBase = isHipertrofia ? "8-12" : "12-15";
      const descBase = isHipertrofia ? "90s a 120s" : "45s a 60s";
      const cargaBase = isHipertrofia ? "Pesada (RIR 1-2)" : "Moderada (RIR 3-4)";

      // Inserir aquecimento/mobilidade
      const mobilidadeDisponivel = db.filter(ex => ex.modalidade === 'mobilidade' || ex.tipo === 'flexibilidade');
      if (mobilidadeDisponivel.length > 0) {
          const mob = mobilidadeDisponivel[Math.floor(Math.random() * mobilidadeDisponivel.length)];
          dia.exercicios.push({
              exercicioId: mob.id,
              nome: mob.nome + ' (Aquecimento)',
              series: 2,
              repeticoes: "15 rep / 30s",
              carga: "N/A",
              descanso: "Sem descanso",
              observacao: mob.observacoes || "Focar na amplitude do movimento.",
              linkYoutube: mob.link_youtube || ""
          });
      }

      gruposFoco.forEach(grupo => {
          // Find exercises for the muscle group, ignoring aquecimento if already added
          const possiveis = db.filter(ex => ex.grupoMuscular.includes(grupo) && ex.tipo !== 'flexibilidade');
          if(possiveis.length > 0) {
              // Tentativa de pegar até 2 exercícios se o grupo for principal (ex: Costas)
              const exSelecionado = possiveis[Math.floor(Math.random() * possiveis.length)];
              dia.exercicios.push({
                  exercicioId: exSelecionado.id,
                  nome: exSelecionado.nome,
                  series: 3,
                  repeticoes: repBase,
                  carga: cargaBase,
                  descanso: descBase,
                  observacao: exSelecionado.observacoes || "Controlar excêntrica e explodir na concêntrica.",
                  linkYoutube: exSelecionado.link_youtube || ""
              });
          }
      });
      return dia;
  }
}

const AIEngine = new MockAIService();
export default AIEngine;
