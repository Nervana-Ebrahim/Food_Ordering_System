 import swaggerJSDoc from 'swagger-jsdoc';

const port = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Ordering System API',
      version: '1.0.0',
      description:
        'REST API for a Food Ordering System: authentication, users, categories, foods, cart and orders.',
    },
    servers: [
      { url: `http://localhost:${port}/api`, description: 'Local development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Scans every route file for JSDoc @swagger blocks
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
