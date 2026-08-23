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
        if (analise) {
            const splitResumo = doc.splitTextToSize(analise.resumo, 170);
            doc.text(splitResumo, 20, 90);
        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, 90);
        }

        doc.setFontSize(16);
        doc.text("Prescrição de Treinamento", 20, 120);
        doc.setFontSize(12);

        let currentY = 130;
        if (treino && treino.estrutura) {
            treino.estrutura.forEach(dia => {
                if (currentY > 270) {
                    doc.addPage();
                    currentY = 20;
                }
                doc.setFont(undefined, 'bold');
                doc.text(`Treino ${dia.identificador} - ${dia.nome}`, 20, currentY);
                doc.setFont(undefined, 'normal');
                currentY += 10;

                dia.exercicios.forEach(ex => {
                    if (currentY > 270) {
                        doc.addPage();
                        currentY = 20;
                    }
                    doc.text(`• ${ex.nome} | ${ex.series}x${ex.repeticoes} | Descanso: ${ex.descanso}`, 25, currentY);
                    currentY += 10;
                });
                currentY += 5;
            });
        } else {
             doc.text("Nenhum treino prescrito.", 20, 130);
             currentY = 140;
        }

        if (analise) {
            if (currentY > 240) { doc.addPage(); currentY = 20; }
            doc.setFontSize(16);
            doc.text("Feedback da IA (Alertas e Dicas)", 20, currentY);
            currentY += 10;
            doc.setFontSize(12);

            let feedbackStr = '';
            if (analise.cuidadosPersonal) feedbackStr += `Cuidados do Personal: ${analise.cuidadosPersonal}\n`;
            if (analise.relatorioEvolucao) feedbackStr += `Previsão de Evolução: ${analise.relatorioEvolucao}\n`;

            if (analise.alertas && analise.alertas.length > 0) {
                feedbackStr += `\nAlertas:\n` + analise.alertas.map(a => `- ${a.mensagem}`).join('\n');
            }
            if (analise.sugestoes && analise.sugestoes.length > 0) {
                feedbackStr += `\n\nSugestões:\n` + analise.sugestoes.map(s => `- ${s.mensagem}`).join('\n');
            }

            const splitFeedback = doc.splitTextToSize(feedbackStr, 170);
            doc.text(splitFeedback, 20, currentY);
        }

        // Rodapé com infos do personal
        // Import DB to get configs
        import('./database.js').then(module => {
            const DB = module.default;
            const config = DB.getConfig() || {};
            const p = config.personal || {};

            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            const rodapeY = 285;

            if (p.nomeProfissional) {
                doc.text(`Profissional: ${p.nomeProfissional} ${p.especialidade ? '('+p.especialidade+')' : ''}`, 20, rodapeY);
            }
            if (p.frase) {
                doc.text(p.frase, 20, rodapeY + 5);
            }

            doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 150, rodapeY + 5);

            // Optional: Include logo if exists in PDF (basic base64 parsing requires careful handling in jsPDF)
            if (config.system && config.system.logoBase64) {
                 try {
                     // Add image to top right
                     doc.addImage(config.system.logoBase64, 'JPEG', 150, 10, 40, 20); // simplified positioning
                 } catch(e) { console.warn("Failed to add logo to PDF"); }
            }

            doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
        });
    }
};
