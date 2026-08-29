const fs = require('fs');
let content = fs.readFileSync('avaliacao-fisica/js/views/alunoDetailView.js', 'utf8');

content = content.replace(
    /dietaTabBtn\.className = 'tab-btn';/,
    `dietaTabBtn.className = 'tab-btn';
            dietaTabBtn.style.background = 'none';
            dietaTabBtn.style.border = 'none';
            dietaTabBtn.style.paddingBottom = '10px';
            dietaTabBtn.style.fontWeight = 'bold';
            dietaTabBtn.style.cursor = 'pointer';
            dietaTabBtn.style.color = 'var(--text-light)';`
);

fs.writeFileSync('avaliacao-fisica/js/views/alunoDetailView.js', content, 'utf8');
