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
        doc.text("Resumo e Alertas da IA", 20, 80);
        doc.setFontSize(12);

        let yPos = 90;

        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, yPos);
            yPos += (splitResumo.length * 7) + 5;

            if (analise.alertas && analise.alertas.length > 0) {
                doc.setFont(undefined, 'bold');
                doc.text("Alertas de Segurança Médica / Medicações:", 20, yPos);
                doc.setFont(undefined, 'normal');
                yPos += 10;

                analise.alertas.forEach(a => {
                    const splitAlerta = doc.splitTextToSize(`• [${a.nivel.toUpperCase()}] ${a.mensagem}`, 170);
                    doc.text(splitAlerta, 20, yPos);
                    yPos += (splitAlerta.length * 7);
                });
                yPos += 5;
            }
        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, yPos);
            yPos += 15;
        }

        if (aluno.nutricao) {
             doc.setFontSize(16);
             doc.text("Nutrição e Suplementação", 20, yPos);
             doc.setFontSize(12);
             yPos += 10;
             doc.text(`Hidratação: ${aluno.nutricao.hidratacao}L | Proteína: ${aluno.nutricao.proteina}g/kg | Carbo: ${aluno.nutricao.carbo}g/kg | Gordura: ${aluno.nutricao.gordura}g/kg`, 20, yPos);
             yPos += 10;
             if (aluno.nutricao.feedback) {
                 const splitFeedback = doc.splitTextToSize(`Parecer IA: ${aluno.nutricao.feedback}`, 170);
                 doc.text(splitFeedback, 20, yPos);
                 yPos += (splitFeedback.length * 7) + 5;
             }
        }

        doc.setFontSize(16);
        doc.text("Prescrição de Treinamento", 20, yPos);
        doc.setFontSize(12);
        yPos += 10;

        if (treino && treino.estrutura) {
            let y = yPos;
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
                    if(ex.video) {
                        doc.setFontSize(9);
                        doc.setTextColor(100, 100, 100);
                        doc.text(`  Vídeo: ${ex.video}`, 25, y);
                        doc.setFontSize(12);
                        doc.setTextColor(0, 0, 0);
                        y += 7;
                    }
                });
                y += 5;
            });
        } else {
             doc.text("Nenhum treino prescrito.", 20, yPos);
        }

        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 290);

        doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
    }
};
