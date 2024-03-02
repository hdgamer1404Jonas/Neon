import fastify from 'fastify'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { startWebsocketServer } from './utils/websocket'
import { validateDatabase } from './utils/database'
import { checkADB } from './utils/adbutils'
import * as adb from './utils/adb'
import { handleAPI } from './endpoints/endpoints'

console.log('WARNING: PLEASE MAKE SURE SIDEQUEST OR QUESTPATCHER IS NOT RUNNING AS THESE PROGRAMS WILL INTERFERE WITH NEON!');

const app = fastify({
});

app.register(require('@fastify/static'), {
    root: path.join(__dirname, '../web'),
    prefix: '/'
});

app.get('/api/*', handleAPI);

app.listen({ port: 3000, host: '0.0.0.0' }, async (err, address) => {
    if (err) throw err
    app.log.info(`server listening on ${address}`)
    await validateDatabase()
    await startWebsocketServer()
    openLink('http://localhost:3000');
    await checkADB();
    await adb.startADB();

    console.log('ADB started, checking devices...');
    const devices = await adb.getDevices();
    console.log(devices);
})


async function openLink(link: string) {
    switch (process.platform) {
        case 'darwin':
            exec(`open ${link}`);
            break;
        case 'win32':
            exec(`start ${link}`);
            break;
        default:
            exec(`xdg-open ${link}`);
    }
}
