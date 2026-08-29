// js/pdf.js
export const PDFService = {
    generateAlunoReport(aluno, analise, treino) {
        if (!window.jspdf) {
            alert('A biblioteca jsPDF não está carregada corretamente.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // Primary color
        doc.text("MESTRE - Relatório de Avaliação", 20, 20);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Aluno: ${aluno.nome}`, 20, 40);
        doc.text(`Objetivo: ${aluno.objetivoPrincipal}`, 20, 50);
        doc.text(`Frequência Semanal: ${aluno.frequenciaSemanal} dias`, 20, 60);

        doc.setFontSize(16);
        doc.text("Resumo IA", 20, 80);
        doc.setFontSize(12);
        let currentY = 90;
        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, currentY);
            currentY += (splitResumo.length * 7);

            if (analise.alertas && analise.alertas.length > 0) {
                 doc.setFont(undefined, 'bold');
                 doc.setTextColor(239, 68, 68); // Red
                 doc.text("Alertas Médicos/Segurança:", 20, currentY);
                 doc.setFont(undefined, 'normal');
                 doc.setTextColor(0, 0, 0);
                 currentY += 7;
                 analise.alertas.forEach(a => {
                     const splitAlerta = doc.splitTextToSize("- " + a.mensagem, 170);
                     doc.text(splitAlerta, 20, currentY);
                     currentY += (splitAlerta.length * 7);
                 });
            }

            currentY += 5;
            doc.setFont(undefined, 'bold');
            doc.text("Previsão de Evolução:", 20, currentY);
            doc.setFont(undefined, 'normal');
            currentY += 7;
            const splitEvolucao = doc.splitTextToSize(analise.previsaoEvolucao || "", 170);
            doc.text(splitEvolucao, 20, currentY);
            currentY += (splitEvolucao.length * 7);

            if (analise.dietaRecomendada) {
                 currentY += 10;
                 if (currentY > 260) { doc.addPage(); currentY = 20; }

                 doc.setFontSize(14);
                 doc.setFont(undefined, 'bold');
                 doc.text("Orientação Alimentar Básica", 20, currentY);
                 doc.setFontSize(12);
                 doc.setFont(undefined, 'normal');
                 currentY += 7;

                 const d = analise.dietaRecomendada;
                 doc.text(`Objetivo: ${d.objetivo}`, 20, currentY); currentY += 7;
                 doc.text(doc.splitTextToSize(`Recomendação: ${d.recomendacao}`, 170), 20, currentY); currentY += 14;
                 doc.text(doc.splitTextToSize(`Suplementação: ${d.suplementacao_sugerida}`, 170), 20, currentY); currentY += 14;
                 doc.text(`Hidratação: ${d.hidratacao}`, 20, currentY); currentY += 10;
            }

        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, currentY);
            currentY += 10;
        }

        currentY += 10;
        if (currentY > 260) { doc.addPage(); currentY = 20; }

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text("Prescrição de Treinamento", 20, currentY);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
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
                    y += 7;
                    if (ex.video) {
                        doc.setTextColor(37, 99, 235);
                        doc.text(`  Vídeo: ${ex.video}`, 25, y);
                        doc.setTextColor(0, 0, 0);
                        y += 7;
                    }
                });
                y += 5;
            });
        } else {
             doc.text("Nenhum treino prescrito.", 20, currentY);
        }

        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 290);

        doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
    }
};
