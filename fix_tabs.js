const fs = require('fs');
let content = fs.readFileSync('avaliacao-fisica/js/views/alunoDetailView.js', 'utf8');

// The class .tabs doesn't exist, we must add an ID to the div containing the tabs
content = content.replace(
    /<div style="margin-bottom: var\(--space-4\); border-bottom: 1px solid var\(--border-color\); display: flex; gap: 20px;">/,
    '<div class="tabs" style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--border-color); display: flex; gap: 20px;">'
);

fs.writeFileSync('avaliacao-fisica/js/views/alunoDetailView.js', content, 'utf8');
