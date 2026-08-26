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
            reader.onload = () => {
                // Resize image to save LocalStorage space
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // compress
                };
            };
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
    },

    updateSidebarLogo(logoBase64) {
        const sidebarHeader = document.querySelector('.sidebar-header');
        if (sidebarHeader && logoBase64) {
            // Keep the text but add logo above or next to it
            let img = sidebarHeader.querySelector('.sidebar-logo');
            if (!img) {
                img = document.createElement('img');
                img.className = 'sidebar-logo';
                img.style.maxHeight = '40px';
                img.style.marginBottom = '10px';
                img.style.display = 'block';
                sidebarHeader.insertBefore(img, sidebarHeader.firstChild);
            }
            img.src = logoBase64;
        }
    }
};

export default Utils;
