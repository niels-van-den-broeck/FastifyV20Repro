import Fastify, { Session } from 'fastify';
import autoLoad from '@fastify/autoload';
import path from 'path';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

server.register(autoLoad, {
  dir: path.join(__dirname, 'routes'),
});

const sessions = new Map<string, Session>();

let cancelled = false;

server.addHook('onRequest', (request, reply, done) => {
  request.raw.on('close', () => {
    if (request.raw.aborted) {
      cancelled = true;
    }
  })

  done();
})

server.register(fastifyCookie);
server.register(fastifySession, {
  secret: 'very-secretvery-secretvery-secretvery-secretvery-secretvery-secretvery-secret',
  cookie: { secure: false },
  store: {
    get: (sessionId, callback) => {
      new Promise(resolve => {
        setTimeout(resolve, 80);
      }).then(() => {
        callback(null, sessions.get(sessionId));
      })
    },
    set: (sessionId, session, callback) => {
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (cancelled) reject();
          resolve();
        }, 150);
      }).then(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sessions.set(sessionId, {...session, id: sessionId });
        callback();
      });
    },
    destroy: (sessionId, callback) => {
      setTimeout(() => {
        sessions.delete(sessionId);
        callback()
      }, 80)
    },
  }
  });

export default server;
