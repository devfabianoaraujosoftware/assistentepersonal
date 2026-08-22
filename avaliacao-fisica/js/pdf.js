// js/pdf.js
import DB from './database.js';

export const PDFService = {
    generateAlunoReport(aluno, analise, treino) {
        if (!window.jspdf) {
            alert('A biblioteca jsPDF não está carregada corretamente.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get config for theme color and logo
        const config = DB.getConfig();
        const personalName = config?.personal?.nomeProfissional || 'MESTRE';
        const hexColor = config?.personal?.corPrimaria || '#2563eb';

        // Convert hex to rgb for jsPDF
        const r = parseInt(hexColor.slice(1, 3), 16) || 37;
        const g = parseInt(hexColor.slice(3, 5), 16) || 99;
        const b = parseInt(hexColor.slice(5, 7), 16) || 235;

        doc.setFontSize(22);
        doc.setTextColor(r, g, b); // Dynamic Primary color
        doc.text(`${personalName} - Relatório de Avaliação`, 20, 20);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Aluno: ${aluno.nome} (Matrícula: ${aluno.matricula || '-'})`, 20, 40);
        doc.text(`Objetivo: ${aluno.objetivoPrincipal}`, 20, 50);
        doc.text(`Frequência Semanal: ${aluno.frequenciaSemanal} dias`, 20, 60);

        let currentY = 80;

        doc.setFontSize(16);
        doc.text("Resumo e IA (Diretrizes e Nutrição)", 20, currentY);
        doc.setFontSize(12);
        currentY += 10;

        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, currentY);
            currentY += (splitResumo.length * 5) + 5;

            if (analise.sugestoes && analise.sugestoes.length > 0) {
                analise.sugestoes.forEach(s => {
                    const text = `[${s.categoria.toUpperCase()}] ${s.mensagem}`;
                    const splitText = doc.splitTextToSize(text, 170);
                    doc.text(splitText, 20, currentY);
                    currentY += (splitText.length * 5) + 5;
                    if (currentY > 270) { doc.addPage(); currentY = 20; }
                });
            }
        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, currentY);
            currentY += 10;
        }

        currentY += 10;
        if (currentY > 270) { doc.addPage(); currentY = 20; }

        doc.setFontSize(16);
        doc.text("Prescrição de Treinamento", 20, currentY);
        doc.setFontSize(12);
        currentY += 10;

        if (treino && treino.estrutura) {
            let y = currentY;
            treino.estrutura.forEach(dia => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.setFont(undefined, 'bold');
                doc.text(`Treino ${dia.identificador} - ${dia.nome}`, 20, y);
                doc.setFont(undefined, 'normal');
                y += 10;

                dia.exercicios.forEach(ex => {
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(`• ${ex.nome} | ${ex.series}x${ex.repeticoes} | Descanso: ${ex.descanso}`, 25, y);
                    y += 10;
                });
                y += 5;
            });
        } else {
             doc.text("Nenhum treino prescrito.", 20, 130);
        }

        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Gerado por: ${personalName} | Em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 290);

        if(config?.personal?.frase) {
            doc.text(config.personal.frase, 20, 295);
        }

        doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
    }
};
