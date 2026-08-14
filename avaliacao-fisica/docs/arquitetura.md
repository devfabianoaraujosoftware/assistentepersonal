# Arquitetura do Sistema

O projeto adota uma arquitetura **Single Page Application (SPA)** desenvolvida em Vanilla JavaScript (ES6+), HTML5 e CSS3, sem frameworks pesados, para manter a simplicidade e a performance.

## Camadas

1. **View (UI)**
   - O `index.html` serve como um *shell*. As views (Dashboard, Cadastro, Avaliações) são injetadas dinamicamente via um Router simples (`js/router.js`).
   - CSS modular (`css/layout.css`, `css/components.css`) organiza o estilo.

2. **Controller (App Logic)**
   - Scripts como `js/app.js`, `js/assessment.js`, `js/training.js` respondem aos eventos da interface, orquestram o fluxo de dados e conectam as Actions da View aos Services.

3. **Service (Business & AI)**
   - `js/aiEngine.js` e `js/alerts.js`: Representam a camada de inteligência, processando os dados e aplicando `ai-rules.json` (Mock) para devolver *insights*.
   - `js/pdf.js`, `js/calculations.js`: Serviços utilitários isolados.

4. **Data Access (Persistência)**
   - `js/storage.js` / `js/database.js`: Abstrai a persistência utilizando LocalStorage (ou IndexedDB). Futuramente, esta camada pode ser facilmente substituída por chamadas `fetch()` para uma API REST.

## Preparação para o Futuro
- O `aiEngine.js` está construído com Promises para simular latência de rede. Ao plugar a OpenAI ou Gemini no futuro, a UI não precisará ser alterada.