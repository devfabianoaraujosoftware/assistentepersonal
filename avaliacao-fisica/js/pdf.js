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

        let y = 80;

        doc.setFontSize(16);
        doc.text("Resumo IA & Cuidados", 20, y);
        y += 10;
        doc.setFontSize(12);
        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, y);
            y += splitResumo.length * 7 + 5;

            if (analise.cuidados) {
                const splitCuidados = doc.splitTextToSize(`Cuidados: ${analise.cuidados}`, 170);
                doc.text(splitCuidados, 20, y);
                y += splitCuidados.length * 7 + 5;
            }
        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, y);
            y += 10;
        }

        y += 10;
        doc.setFontSize(16);
        doc.text("Prescrição de Treinamento", 20, y);
        y += 10;
        doc.setFontSize(12);

        if (treino && treino.estrutura) {
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
                    if (y > 260) { // Check space for multi-line
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(`• ${ex.nome} | ${ex.series}x${ex.repeticoes} | ${ex.carga} | Descanso: ${ex.descanso}`, 25, y);
                    y += 7;
                    if (ex.linkVideo) {
                        doc.setTextColor(0, 0, 255);
                        doc.textWithLink(`  Vídeo Instrucional: ${ex.linkVideo}`, 25, y, { url: ex.linkVideo });
                        doc.setTextColor(0, 0, 0);
                        y += 7;
                    }
                    if (ex.observacao) {
                        const splitObs = doc.splitTextToSize(`  Obs: ${ex.observacao}`, 160);
                        doc.text(splitObs, 25, y);
                        y += splitObs.length * 5;
                    }
                    y += 3;
                });
                y += 5;
            });
        } else {
             doc.text("Nenhum treino prescrito.", 20, y);
        }

        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 290);

        doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
    }
};
