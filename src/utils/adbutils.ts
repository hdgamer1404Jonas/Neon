import fs from 'fs';
import path from 'path';
import * as fileutils from './fileutils';
import https from 'https';
import extract from 'extract-zip';
import axios, { AxiosResponse } from 'axios';
import { exec } from 'child_process';


export async function checkIfADBIsOnPath(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.access('adb', fs.constants.X_OK, (err) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

export async function checkADB() {
    const isPath = await checkIfADBIsOnPath();
    
    if (isPath) {
        fileutils.setAdbPath('adb');
        return;
    }
    
    await killADB();
    await downloadADB();
}


export async function killADB(): Promise<void> {
    const platform = process.platform;

    let command: string;
    switch (platform) {
        case 'win32':
            command = 'taskkill /IM adb.exe /F';
            break;
        case 'darwin':
        case 'linux':
            command = 'pkill adb';
            break;
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }

    return new Promise<void>((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error killing ADB: ${error}`);
                resolve();
            } else {
                console.log(`Killed ADB: ${stdout}`);
                resolve();
            }
        });
    });
}

export async function downloadADB() {
    const isPath = await checkIfADBIsOnPath();
    
    if (isPath) {
        return;
    }
    
    const platform = process.platform;

    console.log('Downloading ADB for ' + platform);
    
    if (platform === 'win32') {
        // check if the binary is in the appdata folder
        const adblocation = path.join(fileutils.appdata, 'neon', 'platform-tools', 'adb.exe');

        if (fs.existsSync(adblocation)) {
            fileutils.setAdbPath(adblocation);
            return;
        }

        // Download the Windows version of ADB
        const downloadLink = 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip';

        // download the file to appdata/neon/platform-tools-latest-windows.zip
        const downloadPath = path.join(fileutils.appdata, 'neon', 'platform-tools-latest-windows.zip');

        if (!fs.existsSync(path.join(fileutils.appdata, 'neon'))) {
            await fs.mkdirSync(path.join(fileutils.appdata, 'neon'));
        }

        await downloadFile(downloadLink, downloadPath);

        // extract the file to appdata/neon/platform-tools and set the adb path
        const extractPath = path.join(fileutils.appdata, 'neon');
        
        // create the directory if it doesn't exist
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }

        await extract(downloadPath, { dir: extractPath });
        
        fileutils.setAdbPath(path.join(extractPath, 'adb.exe'));
    }

    if (platform === 'darwin') {
        // check if the binary is in the appdata folder
        const adblocation = path.join(fileutils.appdata, 'neon', 'platform-tools', 'adb');

        if (fs.existsSync(adblocation)) {
            fileutils.setAdbPath(adblocation);
            return;
        }

        // Download the macOS version of ADB
        const downloadLink = 'https://dl.google.com/android/repository/platform-tools-latest-darwin.zip';

        // download the file to appdata/neon/platform-tools-latest-darwin.zip
        const downloadPath = path.join(fileutils.appdata, 'neon', 'platform-tools-latest-darwin.zip');

        if (!fs.existsSync(path.join(fileutils.appdata, 'neon'))) {
            await fs.mkdirSync(path.join(fileutils.appdata, 'neon'));
        }

        await downloadFile(downloadLink, downloadPath);

        // extract the file to appdata/neon/platform-tools and set the adb path
        const extractPath = path.join(fileutils.appdata, 'neon');

        // create the directory if it doesn't exist
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }

        await extract(downloadPath, { dir: extractPath });
    }

    if (platform === 'linux') {
        // check if the binary is in the appdata folder
        const adblocation = path.join(fileutils.appdata, 'neon', 'platform-tools', 'adb');

        if (fs.existsSync(adblocation)) {
            fileutils.setAdbPath(adblocation);
            return;
        }

        // Download the Linux version of ADB
        const downloadLink = 'https://dl.google.com/android/repository/platform-tools-latest-linux.zip';

        // download the file to appdata/neon/platform-tools-latest-linux.zip
        const downloadPath = path.join(fileutils.appdata, 'neon', 'platform-tools-latest-linux.zip');

        if (!fs.existsSync(path.join(fileutils.appdata, 'neon'))) {
            await fs.mkdirSync(path.join(fileutils.appdata, 'neon'));
        }

        await downloadFile(downloadLink, downloadPath);

        // extract the file to appdata/neon/platform-tools and set the adb path
        const extractPath = path.join(fileutils.appdata, 'neon');

        // create the directory if it doesn't exist
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }

        await extract(downloadPath, { dir: extractPath });

        fileutils.setAdbPath(path.join(extractPath, 'adb'));
    }
}

export async function downloadFile(url: string, path: string): Promise<void> {
    const response: AxiosResponse<any> = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(path);

    return new Promise<void>((resolve, reject) => {
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}
