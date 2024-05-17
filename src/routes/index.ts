import { FastifyPluginCallback, RouteHandlerMethod } from 'fastify';

const register: FastifyPluginCallback = (server, options, done) => {
  const getStatus: RouteHandlerMethod = async (request, reply) => {
    return reply.redirect('https://www.google.com');
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
