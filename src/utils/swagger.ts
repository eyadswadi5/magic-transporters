import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Magic Transporters API',
      version: '1.0.0',
      description: 'API for managing Magic Movers, Items, and Missions'
    },
    components: {
      schemas: {
        Item: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            weight: { type: 'number' },
          }
        },
        Mover: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            weight_limit: { type: 'number' },
            quest_state: { type: 'string', enum: ['resting','loading','on-mission'] },
            loadedItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/Item' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'],
});
