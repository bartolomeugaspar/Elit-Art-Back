/**
 * @swagger
 * tags:
 *   name: WhatsApp
 *   description: Integração com WhatsApp via Green-API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WhatsAppNotification:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Número de telefone no formato internacional (ex: 244XXXXXXXXX, sem o símbolo +)
 *           example: "244923456789"
 *         message:
 *           type: string
 *           description: Mensagem a ser enviada via WhatsApp
 *           example: "Olá! Sua inscrição foi confirmada."
 *         messageId:
 *           type: string
 *           description: ID da mensagem retornado pela Green-API
 *           example: "3EB0C767D097FACD57B1"
 *     
 *     WhatsAppStatus:
 *       type: object
 *       properties:
 *         connected:
 *           type: boolean
 *           description: Status da conexão com WhatsApp
 *           example: true
 *         instanceId:
 *           type: string
 *           description: ID da instância Green-API
 *           example: "7105402510"
 *         stateInstance:
 *           type: string
 *           description: Estado da instância (authorized, notAuthorized, etc)
 *           example: "authorized"
 * 
 * /whatsapp/test-connection:
 *   get:
 *     summary: Testar conexão com Green-API WhatsApp
 *     description: |
 *       Verifica se a instância WhatsApp está autorizada e conectada.
 *       
 *       **Nota:** Este endpoint é útil para diagnóstico e verificação da configuração.
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status da conexão com WhatsApp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 connected:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "WhatsApp conectado com sucesso"
 *                 instanceId:
 *                   type: string
 *                   example: "7105402510"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Apenas administradores podem testar a conexão
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /notifications/channels:
 *   get:
 *     summary: Obter informações sobre canais de notificação
 *     description: |
 *       Retorna informações sobre todos os canais de notificação disponíveis:
 *       - **Email**: Enviado via SMTP para todos os usuários
 *       - **WhatsApp**: Enviado via Green-API quando o usuário possui telefone cadastrado
 *       - **SMS**: Enviado para confirmações de eventos quando telefone está disponível
 *       
 *       **Notificações Automáticas:**
 *       - ✅ Boas-vindas ao registrar (Email + WhatsApp)
 *       - ✅ Recuperação de senha (Email + WhatsApp)
 *       - ✅ Confirmação de inscrição (Email + WhatsApp + SMS)
 *       - ✅ Registro recebido (Email + WhatsApp + SMS)
 *       - ✅ Resposta de contato (Email + WhatsApp)
 *       - ✅ Notificação de login (Email + WhatsApp)
 *       - ✅ Novos eventos (Email + WhatsApp)
 *     tags: [WhatsApp]
 *     responses:
 *       200:
 *         description: Informações sobre canais de notificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 channels:
 *                   $ref: '#/components/schemas/NotificationChannels'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * Documentação de Notificações WhatsApp
 * 
 * VISÃO GERAL:
 * ------------
 * O sistema envia notificações automáticas via WhatsApp usando Green-API.
 * As mensagens são enviadas em paralelo com emails, sem bloquear as operações principais.
 * 
 * CONFIGURAÇÃO:
 * ------------
 * Variáveis de ambiente necessárias:
 * - GREEN_API_URL: https://7105.api.green-api.com
 * - GREEN_API_MEDIA_URL: https://7105.media.green-api.com
 * - GREEN_API_INSTANCE_ID: 7105402510
 * - GREEN_API_TOKEN: sua_chave_de_api
 * 
 * FORMATO DE TELEFONE:
 * -------------------
 * - Formato aceito: 244XXXXXXXXX (código do país + número, sem +)
 * - Exemplo Angola: 244923456789
 * - O sistema formata automaticamente números locais (9XXXXXXXX) adicionando 244
 * 
 * TIPOS DE NOTIFICAÇÕES:
 * ---------------------
 * 1. Boas-vindas (sendWelcomeMessage)
 *    - Enviado quando: Novo usuário é registrado
 *    - Inclui: Nome, email, senha temporária, link de acesso
 * 
 * 2. Recuperação de Senha (sendPasswordResetMessage)
 *    - Enviado quando: Usuário solicita reset de senha
 *    - Inclui: Nome, link de recuperação (válido por 1 hora)
 * 
 * 3. Confirmação de Inscrição (sendRegistrationConfirmation)
 *    - Enviado quando: Inscrição em evento é confirmada
 *    - Inclui: Nome, título do evento, data, local
 * 
 * 4. Registro Recebido (sendRegistrationReceived)
 *    - Enviado quando: Nova inscrição é criada (status pendente)
 *    - Inclui: Nome, título do evento, data, hora, local
 * 
 * 5. Resposta de Contato (sendContactReply)
 *    - Enviado quando: Admin responde mensagem de contato
 *    - Inclui: Nome, assunto, resposta, mensagem original
 * 
 * 6. Notificação de Login (sendLoginNotification)
 *    - Enviado quando: Usuário faz login
 *    - Inclui: Nome, IP, data/hora do acesso
 * 
 * 7. Novo Evento (sendNewEventNotification)
 *    - Enviado quando: Novo evento é publicado
 *    - Inclui: Título, descrição, data, hora, local, categoria, preço
 *    - Enviado para: Inscritos na newsletter que têm telefone cadastrado
 * 
 * TRATAMENTO DE ERROS:
 * -------------------
 * - Erros no envio de WhatsApp NÃO bloqueiam operações principais
 * - Erros são logados mas não impedem registro/inscrição/etc
 * - Se Green-API não estiver configurado, sistema continua funcionando normalmente
 * 
 * SEGURANÇA:
 * ---------
 * - Apenas usuários com telefone cadastrado recebem mensagens
 * - Números são validados e formatados antes do envio
 * - Credenciais Green-API são armazenadas em variáveis de ambiente
 * 
 * LIMITAÇÕES:
 * ----------
 * - Green-API tem limites de mensagens por dia (verificar seu plano)
 * - Instância WhatsApp deve estar autorizada no Green-API
 * - Mensagens são apenas texto (sem mídia por enquanto)
 */
