/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     summary: Inscrever-se na newsletter
 *     description: |
 *       Inscreve um email na newsletter para receber notificações de novos eventos.
 *       
 *       **Notificações que o inscrito receberá:**
 *       - 📧 Email quando novos eventos forem publicados
 *       - 📱 WhatsApp quando novos eventos forem publicados (se o usuário tiver telefone cadastrado no sistema)
 *       
 *       **Nota:** Para receber notificações via WhatsApp, o usuário deve ter um cadastro completo
 *       no sistema com número de telefone (formato: 244XXXXXXXXX).
 *     tags:
 *       - Newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: subscriber@example.com
 *     responses:
 *       201:
 *         description: Inscrição realizada com sucesso. Receberá notificações de novos eventos.
 *       400:
 *         description: Email já inscrito
 */

/**
 * @swagger
 * /newsletter/unsubscribe:
 *   post:
 *     summary: Desinscrever-se da newsletter
 *     tags:
 *       - Newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: subscriber@example.com
 *     responses:
 *       200:
 *         description: Desinscrito com sucesso
 */

/**
 * @swagger
 * /newsletter/subscribers:
 *   get:
 *     summary: Listar inscritos (admin)
 *     tags:
 *       - Newsletter
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscritos
 *       403:
 *         description: Sem permissão (admin only)
 */

/**
 * @swagger
 * /newsletter/count:
 *   get:
 *     summary: Contar inscritos (admin)
 *     tags:
 *       - Newsletter
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Número de inscritos
 *       403:
 *         description: Sem permissão (admin only)
 */
