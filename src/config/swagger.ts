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
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
