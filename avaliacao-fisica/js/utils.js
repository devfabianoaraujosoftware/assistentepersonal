// js/utils.js
const Utils = {
    formatarData(dataISO) {
        if (!dataISO) return '';
        const d = new Date(dataISO);
        return d.toLocaleDateString('pt-BR');
    },

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    toast(msg, tipo = 'info') {
        // Simple custom toast
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.position = 'fixed';
        div.style.bottom = '20px';
        div.style.right = '20px';
        div.style.padding = '1rem';
        div.style.borderRadius = '8px';
        div.style.color = 'white';
        div.style.zIndex = '9999';

        if(tipo === 'sucesso') div.style.backgroundColor = 'var(--status-green)';
        else if(tipo === 'erro') div.style.backgroundColor = 'var(--status-red)';
        else div.style.backgroundColor = 'var(--primary-color)';

        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    },

    escapeHTML(str) {
        if(typeof str !== 'string') return str;
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
};

export default Utils;
