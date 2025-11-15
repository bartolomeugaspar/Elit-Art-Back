/**
 * @swagger
 * /events:
 *   get:
 *     summary: Listar todos os eventos
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Workshop, Exposição, Masterclass, Networking]
 *         description: Filtrar por categoria
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de eventos
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obter detalhes de um evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *       404:
 *         description: Evento não encontrado
 */

/**
 * @swagger
 * /events/search/{query}:
 *   get:
 *     summary: Pesquisar eventos
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados da pesquisa
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Criar novo evento (Arteist/admin)
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - date
 *               - time
 *               - location
 *               - image
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Workshop, Exposição, Masterclass, Networking]
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               isFree:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualizar evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       403:
 *         description: Sem permissão
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deletar evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento deletado
 *       403:
 *         description: Sem permissão
 */

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Inscrever-se em um evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Inscrição realizada
 *       400:
 *         description: Sem vagas disponíveis
 */

/**
 * @swagger
 * /events/registrations/{registrationId}:
 *   delete:
 *     summary: Cancelar inscrição
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscrição cancelada
 */

/**
 * @swagger
 * /events/{id}/registrations:
 *   get:
 *     summary: Listar inscrições do evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *       403:
 *         description: Sem permissão
 */

/**
 * @swagger
 * /events/user/my-registrations:
 *   get:
 *     summary: Minhas inscrições
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Minhas inscrições
 */

/**
 * @swagger
 * /events/{id}/testimonials:
 *   post:
 *     summary: Adicionar depoimento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Depoimento adicionado
 */

/**
 * @swagger
 * /events/{id}/testimonials:
 *   get:
 *     summary: Listar depoimentos do evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de depoimentos aprovados
 */
