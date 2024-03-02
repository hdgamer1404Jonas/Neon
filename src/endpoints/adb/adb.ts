import * as fastify from 'fastify'
import * as adb from '../../utils/adb'
import * as storage from '../../storage'

export async function handleAPIADB(request: fastify.FastifyRequest, reply: fastify.FastifyReply) {
    const link = request.url;
    const args = link.split('/').slice(2);
    const subpoint = args[1];


    switch (subpoint) {
        case "devices": {
            const devices = await adb.getDevices();
            
            let json = {
                "type": "devices",
                "devices": devices,
                "isNotEmpty": devices.length > 0,
                "isLoaded": storage.hasLoaded
            }

            reply.send(json);
            break;
        }

        case "load": {
            if (!request.query.hasOwnProperty('serial')) {
                reply.code(400);
                reply.send({ error: 'Invalid query' });
                return;
            }

            // @ts-ignore
            const serial = request.query.serial as string;

            console.log('Loading device ' + serial);
        }

        default: {
            reply.code(404);
            reply.send({ error: 'Invalid endpoint' });
            break;
        }
    }
}