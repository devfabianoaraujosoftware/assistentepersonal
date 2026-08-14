# Regras da IA e Motor de Inferência

A IA deste sistema não diagnostica doenças, ela **identifica padrões e sinaliza pontos de atenção** baseada em um motor de regras.

## Princípios de Operação
- **Confiança:** Toda inferência reportará um nível de confiança (Alta, Moderada, Baixa) baseada na completude dos dados.
- **Explicação:** Toda sugestão deve ser acompanhada de uma justificativa legível para que o profissional possa validar.

## Categorias de Regras (`ai-rules.json`)
1. **Segurança/Saúde (Alertas Vermelhos/Laranjas):**
   - *Exemplo:* Se Histórico tem 'Cardiopatia' ou PA alta -> Exigir Liberação Médica (Vermelho).
   - *Exemplo:* Se PAR-Q+ tem alguma resposta 'Sim' -> Avaliação Profissional recomendada (Laranja).

2. **Treinamento e Volume (Alertas Amarelos/Sugestões):**
   - *Exemplo:* Se Aluno é Iniciante -> Sugerir Volume baixo/moderado (10-12 séries semanais por grupo muscular).
   - *Exemplo:* Se Frequência for 2x na semana -> Sugerir divisão Full Body (Corpo Inteiro).

3. **Nutrição e Estilo de Vida:**
   - *Exemplo:* Sono < 6h e Estresse Alto -> Alertar para fadiga crônica, sugerir controle de intensidade do treino.

A IA atuará primariamente dentro do script `js/aiEngine.js` e consumirá estes padrões.