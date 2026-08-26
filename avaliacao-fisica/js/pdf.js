// js/pdf.js
import DB from './database.js';

export const PDFService = {
    async generateAlunoReport(aluno, analise, treino) {
        if (!window.jspdf) {
            alert('A biblioteca jsPDF não está carregada corretamente.');
            return;
        }

        const config = DB.getConfig();
        const personalInfo = config ? config.personal : {};
        const primaryColor = personalInfo.corPrimaria || '#2563eb';

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Convert HEX to RGB
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 37, g: 99, b: 235 };
        };
        const colorRGB = hexToRgb(primaryColor);

        // Header Background
        doc.setFillColor(colorRGB.r, colorRGB.g, colorRGB.b);
        doc.rect(0, 0, 210, 30, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);

        let xOffset = 20;
        if (personalInfo.logoBase64) {
            try {
                // Approximate scaling for a standard logo aspect ratio
                doc.addImage(personalInfo.logoBase64, 'PNG', 10, 5, 20, 20);
                xOffset = 40;
            } catch (e) {
                console.warn('Erro ao inserir logo no PDF', e);
            }
        }

        doc.text(personalInfo.nomeProfissional || "MESTRE - Relatório", xOffset, 20);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Aluno: ${aluno.nome}`, 20, 45);
        doc.text(`Objetivo: ${aluno.objetivoPrincipal}`, 20, 52);
        doc.text(`Frequência Semanal: ${aluno.frequenciaSemanal} dias`, 20, 59);

        let currentY = 75;

        doc.setFontSize(16);
        doc.setTextColor(colorRGB.r, colorRGB.g, colorRGB.b);
        doc.text("Análise Inteligente e Saúde", 20, currentY);
        currentY += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, currentY);
            currentY += (splitResumo.length * 7) + 5;

            if (treino && treino.evolucaoPrevista) {
                 doc.setFont(undefined, 'bold');
                 doc.text("Evolução Prevista:", 20, currentY);
                 doc.setFont(undefined, 'normal');
                 currentY += 7;
                 const splitEvo = doc.splitTextToSize(treino.evolucaoPrevista, 170);
                 doc.text(splitEvo, 20, currentY);
                 currentY += (splitEvo.length * 7) + 5;
            }
        } else {
            doc.text("Nenhuma análise gerada.", 20, currentY);
            currentY += 10;
        }

        doc.setFontSize(16);
        doc.setTextColor(colorRGB.r, colorRGB.g, colorRGB.b);
        doc.text("Prescrição de Treinamento", 20, currentY);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        currentY += 10;

        if (treino && treino.estrutura) {
            treino.estrutura.forEach(dia => {
                if (currentY > 260) {
                    doc.addPage();
                    currentY = 20;
                }
                doc.setFont(undefined, 'bold');
                doc.text(`Treino ${dia.identificador} - ${dia.nome}`, 20, currentY);
                doc.setFont(undefined, 'normal');
                currentY += 8;

                dia.exercicios.forEach(ex => {
                    if (currentY > 270) {
                        doc.addPage();
                        currentY = 20;
                    }

                    // Link de Video (fetch full info from DB if needed, but we have URL in DB, not directly in suggestion.
                    // Let's assume URL is attached to exercise. We'll fetch it from DB for safety.)
                    const exerciciosDB = DB.getAll('exercicios');
                    const fullEx = exerciciosDB.find(e => e.id === ex.exercicioId);
                    const videoText = fullEx && fullEx.videoUrl ? ` | Vídeo` : '';

                    doc.text(`• ${ex.nome} | ${ex.series}x${ex.repeticoes} | Carga: ${ex.carga || '-'} | Obs: ${ex.observacao}`, 25, currentY);

                    if (fullEx && fullEx.videoUrl) {
                        doc.setTextColor(0, 0, 255);
                        doc.textWithLink(' [Assistir]', 170, currentY, { url: fullEx.videoUrl });
                        doc.setTextColor(0, 0, 0);
                    }

                    currentY += 8;
                });
                currentY += 5;
            });
        } else {
             doc.text("Nenhum treino prescrito.", 20, currentY);
        }

        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        if (personalInfo.frase) {
            doc.text(personalInfo.frase, 105, 285, { align: 'center' });
        }
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} pelo Sistema MESTRE`, 105, 290, { align: 'center' });

        doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
    }
};
