import * as fastify from 'fastify'
import { handleAPIADB } from './adb/adb';

export async function handleAPI(request: fastify.FastifyRequest, reply: fastify.FastifyReply) {
    const link = request.url;
    const args = link.split('/').slice(2);
    const endpoint = args[0];

    switch (endpoint) {
        case "adb": {
            await handleAPIADB(request, reply);
            break;
        }

        default: {
            reply.code(404);
            reply.send({ error: 'Invalid endpoint' });
            break;
        }
    }
    
}