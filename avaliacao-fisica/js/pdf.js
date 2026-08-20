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
        doc.text(`Registro/Matrícula: ${aluno.id}`, 20, 50);
        doc.text(`Objetivo: ${aluno.objetivoPrincipal}`, 20, 60);
        doc.text(`Frequência Semanal: ${aluno.frequenciaSemanal} dias`, 20, 70);

        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235);
        doc.text("Resumo IA & Alertas", 20, 90);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        let y = 100;
        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, y);
            y += (splitResumo.length * 5) + 5;

            if (analise.alertas && analise.alertas.length > 0) {
                doc.setFont(undefined, 'bold');
                doc.text("Atenção:", 20, y);
                doc.setFont(undefined, 'normal');
                y += 7;
                analise.alertas.forEach(a => {
                    const splitAlerta = doc.splitTextToSize(`- ${a.mensagem}`, 170);
                    doc.text(splitAlerta, 20, y);
                    y += (splitAlerta.length * 5) + 2;
                });
            }
        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, y);
            y += 10;
        }

        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235);
        doc.text("Prescrição de Treinamento", 20, y);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        y += 10;

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
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(`• ${ex.nome} | ${ex.series}x${ex.repeticoes} | Carga: ${ex.carga} | Descanso: ${ex.descanso}`, 25, y);
                    y += 10;
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
