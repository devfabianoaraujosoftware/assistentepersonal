// js/pdf.js
export const PDFService = {
    generateAlunoReport(aluno, analise, treino) {
        if (!window.jspdf) {
            alert('A biblioteca jsPDF não está carregada corretamente.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Tentar recuperar configurações do banco para personalização do PDF
        let config = null;
        try {
            const storageData = localStorage.getItem('configuracoes');
            if (storageData) config = JSON.parse(storageData);
        } catch (e) {}

        const p = (config && config.personal) ? config.personal : {};
        const corPrimariaHex = p.corPrimaria || '#2563eb';

        // Conversão simples de HEX para RGB
        let r = 37, g = 99, b = 235;
        if (corPrimariaHex.startsWith('#') && corPrimariaHex.length === 7) {
            r = parseInt(corPrimariaHex.slice(1, 3), 16);
            g = parseInt(corPrimariaHex.slice(3, 5), 16);
            b = parseInt(corPrimariaHex.slice(5, 7), 16);
        }

        let yOffset = 20;

        // Logo
        if (p.logoBase64) {
            try {
                // Muito cuidado: jsPDF exige base64 apenas da imagem ou o formato correto.
                // Como mock, assumimos que addImage funcionará se for jpeg/png válido.
                doc.addImage(p.logoBase64, 'JPEG', 20, yOffset - 10, 30, 30);
                yOffset += 25;
            } catch (e) {
                console.warn('Erro ao renderizar logo no PDF', e);
            }
        }

        doc.setFontSize(22);
        doc.setTextColor(r, g, b); // Primary color customized
        doc.text(p.nomeProfissional || "MESTRE - Relatório de Avaliação", 20, yOffset);
        yOffset += 15;

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Aluno: ${aluno.nome}`, 20, yOffset); yOffset += 10;
        doc.text(`Objetivo: ${aluno.objetivoPrincipal}`, 20, yOffset); yOffset += 10;
        doc.text(`Frequência Semanal: ${aluno.frequenciaSemanal} dias`, 20, yOffset); yOffset += 15;

        doc.setFontSize(16);
        doc.setTextColor(r, g, b);
        doc.text("Resumo IA & Alertas Médicos", 20, yOffset); yOffset += 10;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        if (analise) {
            let resumoText = analise.resumo;
            // Juntar alertas médicos no PDF
            if (analise.alertas && analise.alertas.length > 0) {
                resumoText += "\n\nALERTAS:";
                analise.alertas.forEach(a => {
                    resumoText += `\n- [${a.nivel.toUpperCase()}] ${a.mensagem}`;
                });
            }
            if (analise.sugestoes && analise.sugestoes.length > 0) {
                resumoText += "\n\nSUGESTÕES (Nutrição/Hidratação):";
                analise.sugestoes.forEach(s => {
                    resumoText += `\n- [${s.categoria}] ${s.mensagem}`;
                });
            }

            const splitResumo = doc.splitTextToSize(resumoText, 170);
            doc.text(splitResumo, 20, yOffset);
            yOffset += (splitResumo.length * 6) + 10;
        } else {
            doc.text("Nenhuma análise de IA gerada.", 20, yOffset);
            yOffset += 10;
        }

        if (yOffset > 250) {
            doc.addPage();
            yOffset = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(r, g, b);
        doc.text("Prescrição de Treinamento", 20, yOffset); yOffset += 10;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        if (treino && treino.estrutura) {
            treino.estrutura.forEach(dia => {
                if (yOffset > 270) {
                    doc.addPage();
                    yOffset = 20;
                }
                doc.setFont(undefined, 'bold');
                doc.text(`Treino ${dia.identificador} - ${dia.nome}`, 20, yOffset);
                doc.setFont(undefined, 'normal');
                yOffset += 8;

                dia.exercicios.forEach(ex => {
                    if (yOffset > 270) {
                        doc.addPage();
                        yOffset = 20;
                    }
                    // Dividir o texto se for muito longo
                    const exLine = `• ${ex.nome} | ${ex.series}x${ex.repeticoes} | Carga: ${ex.carga} | Descanso: ${ex.descanso}`;
                    doc.text(exLine, 25, yOffset);
                    yOffset += 6;
                    if (ex.linkYoutube) {
                        doc.setTextColor(0, 0, 255);
                        doc.textWithLink("Ver Vídeo", 30, yOffset, { url: ex.linkYoutube });
                        doc.setTextColor(0, 0, 0);
                        yOffset += 6;
                    }
                });
                yOffset += 5;
            });
        } else {
             doc.text("Nenhum treino prescrito.", 20, yOffset);
        }

        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(p.frase || `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 290);

        doc.save(`Relatorio_${aluno.nome.replace(/\s+/g, '_')}.pdf`);
    }
};
