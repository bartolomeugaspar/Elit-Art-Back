/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: |
 *       Registra um novo usuário no sistema.
 *       
 *       **Notificações Automáticas:**
 *       - 📧 Email de boas-vindas com credenciais
 *       - 📱 Mensagem WhatsApp de boas-vindas (se telefone cadastrado)
 *       
 *       **Nota:** As notificações são enviadas em background e não bloqueiam o registro.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *               phone:
 *                 type: string
 *                 description: Número de telefone para receber notificações via WhatsApp (formato 244XXXXXXXXX)
 *                 example: "244923456789"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso. Notificações enviadas por email e WhatsApp.
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     description: |
 *       Realiza login no sistema.
 *       
 *       **Notificações Automáticas de Segurança:**
 *       - 📧 Email notificando sobre novo acesso (IP, data/hora, dispositivo)
 *       - 📱 Mensagem WhatsApp notificando sobre novo acesso (se telefone cadastrado)
 *       
 *       **Nota:** As notificações são enviadas em background para segurança do usuário.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. Notificação de segurança enviada.
 *       401:
 *         description: Email ou senha inválidos
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter usuário atual
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Token inválido ou ausente
 */

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva Updated
 *               bio:
 *                 type: string
 *                 example: Artista apaixonado por teatro
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Não autenticado
 */
