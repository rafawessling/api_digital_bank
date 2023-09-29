import swaggerAutogen from 'swagger-autogen';

swaggerAutogen()('./swagger.json', ['./src/routes/routes.js']);
