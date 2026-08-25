// js/pdf.js
export const PDFService = {
    generateAlunoReport(aluno, analise, treino) {
        if (!window.jspdf) {
            alert('A biblioteca jsPDF não está carregada corretamente.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configuration to get logo
        const config = JSON.parse(localStorage.getItem('configuracoes')) || { personal: {} };
        const primaryColorHex = config.personal.primaryColor || '#2563eb';
        const hexToRgb = hex => hex.match(/[a-f0-9]{2}/gi).map(v => parseInt(v, 16));
        const color = hexToRgb(primaryColorHex);

        if (config.personal.logoBase64) {
             doc.addImage(config.personal.logoBase64, 'JPEG', 150, 10, 40, 20);
        }

        doc.setFontSize(22);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text("MESTRE - Relatório de Treinamento", 20, 20);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Aluno: ${aluno.nome}`, 20, 40);
        doc.text(`Objetivo: ${aluno.objetivoPrincipal || 'Não definido'}`, 20, 50);
        doc.text(`Frequência Semanal: ${aluno.frequenciaSemanal} dias`, 20, 60);

        let yBase = 80;

        doc.setFontSize(16);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text("Resumo IA & Evolução", 20, yBase);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        yBase += 10;
        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, yBase);
            yBase += splitResumo.length * 7 + 5;

            if (analise.relatorioEvolucao) {
                const splitEvolucao = doc.splitTextToSize(analise.relatorioEvolucao, 170);
                doc.setFont(undefined, 'bold');
                doc.text("Previsão de Evolução:", 20, yBase);
                doc.setFont(undefined, 'normal');
                yBase += 7;
                doc.text(splitEvolucao, 20, yBase);
                yBase += splitEvolucao.length * 7 + 5;
            }

            if (analise.cuidadosPersonal && analise.cuidadosPersonal.trim() !== '') {
                const splitCuidados = doc.splitTextToSize(analise.cuidadosPersonal, 170);
                doc.setFont(undefined, 'bold');
                doc.text("Cuidados e Alertas de Saúde:", 20, yBase);
                doc.setFont(undefined, 'normal');
                yBase += 7;
                doc.text(splitCuidados, 20, yBase);
                yBase += splitCuidados.length * 7 + 10;
            }
        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, yBase);
            yBase += 15;
        }

        if (yBase > 250) {
            doc.addPage();
            yBase = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text("Prescrição de Treinamento", 20, yBase);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        if (treino && treino.estrutura) {
            let y = yBase + 10;
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
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 290);

        doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
    }
};
