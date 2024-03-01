function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    registerIpcHandler()
  })
}

function registerIpcHandler(): void {
  window.electron.ipcRenderer.on('log', (_, json) => {
    const log = JSON.parse(json);
    console[log.type](log.message);
    const logs = document.getElementById('logs');

    if (logs) {
      const logDiv = document.createElement('div');
      logDiv.classList.add('log');
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('log__title');
      titleDiv.innerText = `[${log.type}]`;
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('log__content');
      contentDiv.innerText = log.message;
      logDiv.appendChild(titleDiv);
      logDiv.appendChild(contentDiv);
      logs.appendChild(logDiv);
    }
  })
}

function doAThing(): void {
  const versions = window.electron.process.versions
  replaceText('.electron-version', `Electron v${versions.electron}`)
  replaceText('.chrome-version', `Chromium v${versions.chrome}`)
  replaceText('.node-version', `Node v${versions.node}`)

  const ipcHandlerBtn = document.getElementById('ipcHandler')
  ipcHandlerBtn?.addEventListener('click', () => {
    window.electron.ipcRenderer.send('ping')
  })
}

function replaceText(selector: string, text: string): void {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) {
    element.innerText = text
  }
}

init()
