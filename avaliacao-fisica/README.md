# Sistema Web de Avaliação Física e Prescrição de Treinamento

**AVALIE. ANALISE. PLANEJE. TREINE. EVOLUA.**
*Tecnologia inteligente para transformar avaliação física em planejamento de treinamento.*

Este é um sistema SPA (Single Page Application) rodando nativamente no navegador utilizando HTML5, CSS3, JavaScript e LocalStorage.

## Objetivo
O objetivo principal é atuar como o "Assistente Inteligente do Personal Trainer", reduzindo o tempo administrativo e auxiliando na organização de dados e geração de alertas para a prescrição de treinamentos baseados em evidências científicas. **A decisão final é sempre do profissional.**

## Estrutura
- `/assets`: Imagens, logos e ícones.
- `/css`: Estilos modulares da aplicação (responsivos).
- `/js`: Regras de negócio, manipulação do DOM, simulação de IA, persistência (IndexedDB/LocalStorage).
- `/data`: Arquivos JSON base contendo dados simulados (mock de exercícios, alunos).
- `/docs`: Documentações técnicas.

## Instalação e Execução
Como é uma aplicação totalmente baseada no lado do cliente (Client-Side), não é necessário um servidor backend para rodar inicialmente.
1. Clone ou baixe o repositório.
2. Abra um servidor local para visualizar. (Ex: `npx http-server ./avaliacao-fisica` ou use a extensão Live Server do VSCode).
3. Acesse `http://localhost:8080/` (ou a porta correspondente).

## Funcionalidades Atuais
- [x] Dashboard informativo
- [x] Cadastro de Alunos
- [x] Avaliação Física e Anamnese (Mock de funcionalidades de salvamento em LocalStorage)
- [x] Simulação de Análise de IA baseada em Regras
- [x] Geração de Treino sugerida e passível de edição/aprovação
- [ ] Integração com IA Real (preparada no MockAIService)

## Banco e Backup
Os dados são armazenados localmente via `LocalStorage`. Futuramente poderá ser migrado para um banco de dados real. É possível exportar os dados para um arquivo `.json` a partir das configurações.

## PDF e Relatórios
Os relatórios utilizam a biblioteca `jsPDF` (incluída via CDN) para geração de exportações baseadas nos dados avaliados.
