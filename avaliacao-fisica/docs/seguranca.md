# Segurança e LGPD

Por lidar com dados sensíveis de saúde e informações corporais dos alunos, aplicam-se regras rigorosas:

## 1. Armazenamento de Dados e Fotos
- Atualmente, as fotos e dados são convertidos para Base64 e guardados no LocalStorage da máquina do Personal Trainer.
- Futuramente, ao usar um backend, as fotos deverão ter **armazenamento privado (S3 buckets fechados)** e não serão acessíveis via URLs públicas não assinadas.
- Deve-se usar criptografia *at-rest* no servidor.

## 2. Consentimento (LGPD)
- Antes do cadastro final de qualquer aluno, é mandatório aceitar o **Termo de Consentimento de Uso de Dados**.
- O sistema fornecerá ao aluno os direitos de **Revogação**, **Exclusão** e **Exportação** de seus dados, bastando o Personal clicar nos respectivos botões de privacidade.

## 3. Segurança da Aplicação Frontend
- **Sanitização de Entradas:** Todas as strings renderizadas no DOM vindas do banco local devem passar por *escape* (prevenção de XSS).
- O motor não confia em dados "cegamente".
- API Keys de serviços externos (OpenAI/Gemini) **nunca** serão embutidas no código estático (`.js`), aguardando uma implementação de BFF (Backend for Frontend).