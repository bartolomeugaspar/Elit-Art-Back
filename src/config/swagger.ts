// @ts-ignore
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Elit\'Arte API',
      version: '2.0.0',
      description: `API Backend para o projeto Elit\'Arte - Movimento Artístico angolano
      
**Notificações Integradas:**
- 📧 **Email**: Todas as notificações são enviadas via SMTP
- 📱 **WhatsApp**: Integração com Green-API para envio automático de mensagens WhatsApp
- 💬 **SMS**: Notificações via SMS (opcional)

**Notificações Automáticas:**
- ✅ Boas-vindas ao registrar novo usuário (Email + WhatsApp)
- ✅ Recuperação de senha (Email + WhatsApp)
- ✅ Confirmação de inscrição em eventos (Email + WhatsApp + SMS)
- ✅ Registro recebido em eventos (Email + WhatsApp + SMS)
- ✅ Resposta a mensagens de contato (Email + WhatsApp)
- ✅ Notificação de login (Email + WhatsApp)
- ✅ Novos eventos para inscritos na newsletter (Email + WhatsApp)

**WhatsApp (Green-API):**
As mensagens WhatsApp são enviadas automaticamente quando o usuário possui número de telefone cadastrado.
Os números devem estar no formato internacional (ex: 244XXXXXXXXX).`,
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
        url: 'https://elit-Arte-api.vercel.app/api',
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
      responses: {
        Unauthorized: {
          description: 'Não autenticado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        Forbidden: {
          description: 'Sem permissão',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { 
              type: 'string', 
              nullable: true,
              description: 'Número de telefone no formato internacional (ex: 244XXXXXXXXX). Quando fornecido, o usuário receberá notificações via WhatsApp e SMS.'
            },
            role: { type: 'string', enum: ['user', 'artista', 'admin'] },
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
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { 
              type: 'string', 
              nullable: true,
              description: 'Número de telefone para receber confirmações via WhatsApp e SMS (formato: 244XXXXXXXXX)'
            },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'attended'] },
            registrationDate: { type: 'string', format: 'date-time' },
            paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed'] },
          },
          description: 'Quando uma inscrição é criada/confirmada, o sistema envia automaticamente: Email de confirmação, SMS (se telefone fornecido), WhatsApp (se telefone fornecido)'
        },
        NotificationChannels: {
          type: 'object',
          properties: {
            email: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: true },
                provider: { type: 'string', default: 'SMTP' },
                description: { type: 'string', default: 'Todas as notificações são enviadas via email' }
              }
            },
            whatsapp: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: true },
                provider: { type: 'string', default: 'Green-API' },
                description: { type: 'string', default: 'Mensagens enviadas automaticamente quando o usuário possui telefone cadastrado' },
                format: { type: 'string', default: '244XXXXXXXXX (sem o símbolo +)' }
              }
            },
            sms: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: true },
                provider: { type: 'string', default: 'SMS Service' },
                description: { type: 'string', default: 'SMS de confirmação para registros em eventos' }
              }
            }
          },
          description: 'Canais de notificação disponíveis na plataforma'
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
