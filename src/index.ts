import fastify from 'fastify'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'


const app = fastify()

app.listen({port: 3000}, async (err, address) => {
    console.log(`Server listening on http://localhost:3000`);
    openLink('http://localhost:3000');
})


function openLink(link: string) {
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