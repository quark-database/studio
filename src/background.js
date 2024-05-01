'use strict'

import {app, BrowserWindow, ipcMain, protocol} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import {askQuarkusFor} from "@/scripts/shared/quarkus";
import {Client} from "quark-api"
import * as fs from "fs";
import * as StringSimilarity from "string-similarity";

const isDevelopment = process.env.NODE_ENV !== 'production'
const serversFile = 'Recent Servers.json';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: __dirname + '/../public/logo.ico',
    title: "Quark Studio 1.1",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.maximize()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

let server = null

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function getServerList() {
  return new Promise(resolve => {

    if(!fs.existsSync(serversFile)) {
      resolve([])
    }

    fs.readFile(serversFile, (error, content) => {
      if(error) {
        console.error(content)
        resolve([])
      } else {
        resolve(JSON.parse(content.toString()).list)
      }
    })
  })
}

function updateServerList(serverListConsumer) {
  return new Promise(resolve => {
    getServerList().then(servers => {
      serverListConsumer(servers)
      fs.writeFile(serversFile, JSON.stringify({ "list": servers }, null, 4), () => {});
      resolve()
    });
  })
}

ipcMain.handle('check-connection', (event, host, port, token) => {
  return new Promise(resolve => {
    const client = new Client(token, host, port);
    client.query("list databases;").then(() => {
      resolve("online");
    }).catch(() => {
      resolve("offline");
    });
  })
})

ipcMain.handle('add-server', (event, host, port, token) => {
  return new Promise(resolve => {
    updateServerList(servers => {
      servers.push({
        host: host,
        port: port,
        token: token
      })

      resolve()
    }).then(resolve)
  })
})

ipcMain.handle('delete-server', (event, host, port, token) => {
  return new Promise(resolve => {
    updateServerList(servers => {
      console.log(servers)

      servers.splice(servers.indexOf({
        host: host,
        port: port,
        token: token
      }), 1)
    }).then(resolve)
  })
})

ipcMain.handle('ask-server-list', () => {
  return getServerList();
})

ipcMain.handle('ask-quarkus', (event, message) => {
  return askQuarkusFor(message)
})

ipcMain.handle('ask-table-list', (event, requestingServer) => {
  return new Promise(resolve => {
    if(requestingServer === undefined) {
      requestingServer = server
    }

    const client = new Client(requestingServer.token, requestingServer.host, requestingServer.port);
    client.query("list databases;").then(listDatabasesResult => {

      Promise.all(listDatabasesResult.tableView.rows.map(row => row.cells[0]).map(databaseName => client.query(`list tables in "${databaseName}";`).then(listTablesInResult => {
        return listTablesInResult.tableView.rows.map(row => row.cells[0]).map(tableName => databaseName + "." + tableName)
      }))).then(list => resolve(list.flat()));
    });
  });
});

ipcMain.handle('run-query', (event, query, requestingServer) => {
  if(requestingServer === undefined) {
    requestingServer = server
  }

  return new Client(requestingServer.token, requestingServer.host, requestingServer.port).query(query);
})

ipcMain.handle('find-best-string', (event, string, options) => {
  return StringSimilarity.findBestMatch(string, options);
})

ipcMain.handle('get-server', () => {
  return server
})

ipcMain.handle('set-server', (event, newServer) => {
  server = newServer
})