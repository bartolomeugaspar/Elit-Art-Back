import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Elit\'Arte API',
      version: '1.0.0',
      description: 'API Backend para o projeto Elit\'Arte - Movimento artístico angolano',
      contact: {
        name: 'Elit\'Arte Team',
        email: 'faustinodomingos83@hotmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://elit-arte-api.vercel.app/api',
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'artist', 'admin'] },
            profileImage: { type: 'string', nullable: true },
            bio: { type: 'string', nullable: true },
            isEmailVerified: { type: 'boolean' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            user_id: { type: 'string', format: 'uuid', nullable: true },
            action: { type: 'string' },
            entity_type: { type: 'string' },
            entity_id: { type: 'string' },
            old_values: { 
              type: 'object',
              additionalProperties: true,
              nullable: true 
            },
            new_values: { 
              type: 'object',
              additionalProperties: true,
              nullable: true 
            },
            ip_address: { type: 'string', nullable: true },
            user_agent: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            fullDescription: { type: 'string', nullable: true },
            category: { type: 'string', enum: ['Workshop', 'Exposição', 'Masterclass', 'Networking'] },
            date: { type: 'string' },
            time: { type: 'string' },
            location: { type: 'string' },
            image: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            capacity: { type: 'integer' },
            attendees: { type: 'integer' },
            availableSpots: { type: 'integer' },
            price: { type: 'number' },
            isFree: { type: 'boolean' },
            status: { type: 'string', enum: ['upcoming', 'ongoing', 'completed', 'cancelled'] },
            organizerId: { type: 'string', format: 'uuid' },
          },
        },
        Registration: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            eventId: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['registered', 'attended', 'cancelled'] },
            registrationDate: { type: 'string', format: 'date-time' },
            paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed'] },
          },
        },
        Testimonial: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            authorId: { type: 'string', format: 'uuid' },
            eventId: { type: 'string', format: 'uuid' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            isApproved: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/audit-logs': {
        get: {
          tags: ['Auditoria'],
          summary: 'Listar logs de auditoria (apenas admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'entityType',
              in: 'query',
              description: 'Filtrar por tipo de entidade',
              schema: { type: 'string' }
            },
            {
              name: 'entityId',
              in: 'query',
              description: 'Filtrar por ID da entidade',
              schema: { type: 'string' }
            },
            {
              name: 'userId',
              in: 'query',
              description: 'Filtrar por ID do usuário',
              schema: { type: 'string' }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Limite de resultados por página',
              schema: { type: 'integer', default: 50 }
            },
            {
              name: 'offset',
              in: 'query',
              description: 'Deslocamento para paginação',
              schema: { type: 'integer', default: 0 }
            }
          ],
          responses: {
            200: {
              description: 'Lista de logs de auditoria',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/AuditLog' }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          limit: { type: 'integer' },
                          offset: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/audit-logs/{entityType}/{entityId}': {
        get: {
          tags: ['Auditoria'],
          summary: 'Obter logs de auditoria de uma entidade específica',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'entityType',
              in: 'path',
              required: true,
              description: 'Tipo da entidade',
              schema: { type: 'string' }
            },
            {
              name: 'entityId',
              in: 'path',
              required: true,
              description: 'ID da entidade',
              schema: { type: 'string' }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Limite de resultados por página',
              schema: { type: 'integer', default: 50 }
            },
            {
              name: 'offset',
              in: 'query',
              description: 'Deslocamento para paginação',
              schema: { type: 'integer', default: 0 }
            }
          ],
          responses: {
            200: {
              description: 'Logs de auditoria da entidade',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/AuditLog' }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          limit: { type: 'integer' },
                          offset: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options)
