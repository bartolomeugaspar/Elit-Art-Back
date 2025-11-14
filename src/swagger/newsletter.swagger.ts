/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     summary: Inscrever-se na newsletter
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
 *         description: Inscrição realizada com sucesso
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
