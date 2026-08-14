# Estrutura do Banco de Dados (JSON / LocalStorage)

O modelo relacional lógico é simulado usando objetos JSON para fácil persistência e migração futura para NoSQL ou SQL.

## Coleções Principais

### 1. Alunos (`alunos`)
Armazena perfil, anamnese, exames anexados e links para os IDs de suas avaliações.

### 2. Avaliações (`avaliacoes`)
Armazena histórico pontual.
Campos: `id`, `alunoId`, `data`, `antropometria`, `bioimpedancia`, `fotos`, `anamnese_atualizada`.

### 3. Treinos (`treinos`)
Programas de treinamento gerados.
Campos: `id`, `alunoId`, `dataInicio`, `status` (Rascunho, Aprovado, Concluído), `estrutura` (Dias, Exercícios, Séries, etc).

### 4. Exercícios (`exercicios`)
Catálogo estático.
Campos: `id`, `nome`, `grupoMuscular`, `equipamento`, `restricoes_associadas`.

### 5. Configurações (`configuracoes`)
Perfil do Personal Trainer e preferências visuais (Logos).