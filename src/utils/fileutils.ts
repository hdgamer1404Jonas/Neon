export const appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
export const database = `${appdata}/neon/database.sqlite`;
export const songcache = `${appdata}/neon/songcache`;
export const configs = `${appdata}/neon/configs`;
export let adbpath = '';

export async function setAdbPath(path: string) {
    adbpath = path;
}