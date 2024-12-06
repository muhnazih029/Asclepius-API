require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../service/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
  const server = Hapi.server({
    port: 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;
  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response.isBoom && response.output.statusCode === 413) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
      newResponse.code(413);
      return newResponse;
    }

    if (response instanceof InputError || response.isBoom) {
      const statusCode =
        response instanceof InputError
          ? response.statusCode
          : response.output.statusCode;
      const newResponse = h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
      newResponse.code(statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
