import 'core-js/stable';
import {app, BrowserWindow, shell} from 'electron';
import log from 'electron-log';
import {autoUpdater} from 'electron-updater';
import path from 'path';
import 'regenerator-runtime/runtime';
import MenuBuilder from './menu';

require('update-electron-app')();

const server = 'https://update.electronjs.org';
const feed = `${server}/ken20001207/ZhiZhang-Desktop/${process.platform}-${process.arch}/${app.getVersion()}`;

autoUpdater.setFeedURL(feed);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify().then();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const {env} = process;

const createWindow = async () => {

  if (env.NODE_ENV === 'development' || env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1600,
    height: 1200,
    frame: false,
    icon: getAssetPath('icon.png'),
    minWidth: 1400,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#2f3237',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });

  await mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.on('did-finish-load', () => {

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }

  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', async () => {
  if (mainWindow === null) await createWindow();
});
