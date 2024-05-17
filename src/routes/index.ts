import { FastifyPluginCallback, RouteHandlerMethod } from 'fastify';

const register: FastifyPluginCallback = (server, options, done) => {
  const getStatus: RouteHandlerMethod = async (request, reply) => {
    await new Promise(resolve => {
      setTimeout(resolve, 80);
    });

    return reply.status(200).send('OK');
  };

  const successSchema = {};

  server.get('/', {
    schema: {
      response: {
        200: successSchema,
      },
    },
    handler: getStatus,
  });

  done();
};

export default register;
