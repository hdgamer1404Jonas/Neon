import { exec } from 'child_process';
import * as fileutils from './fileutils';

export type Device = {
    serial: string;
    status: string;
};

export async function startADB() {
    const execPath = fileutils.adbpath;

    return new Promise<void>((resolve, reject) => {
        exec(`${execPath} start-server`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error starting ADB: ${error}`);
                reject(error);
            } else {
                console.log(`Started ADB: ${stdout}`);
                resolve();
            }
        });
    });
}

export async function getDevices(): Promise<Device[]> {
    const execPath = fileutils.adbpath;

    return new Promise<Device[]>((resolve, reject) => {
        exec(`${execPath} devices`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error getting devices: ${error}`);
                reject(error);
            } else {
                const devices = parseAdbDevices(stdout);
                resolve(devices);
            }
        });
    });
}

function parseAdbDevices(output: string) {
    const devices: Device[] = [];
    const lines = output.split('\n').slice(1);

    lines.forEach(line => {
        if (line.trim() !== '') {
            const [serial, status] = line.split('\t');
            devices.push({ serial, status });
        }
    });

    return devices;
}