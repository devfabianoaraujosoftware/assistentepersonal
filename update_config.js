const fs = require('fs');
const filePath = 'avaliacao-fisica/data/configuracoes.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (!data.personal.primaryColor) {
    data.personal.primaryColor = '#2563eb';
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Done');
