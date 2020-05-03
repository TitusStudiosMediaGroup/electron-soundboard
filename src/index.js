const { app, BrowserWindow, dialog, Menu, MenuItem } = require('electron');
const path = require('path');
const fs = require('fs');

if (require('electron-squirrel-startup')) {
  app.quit();
}


let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 375,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true
    },
    show: false,
    frame: false
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.show();
  });

};


let loadingScreen;

const createLoadingScreen = () => {
  loadingScreen = new BrowserWindow(
    Object.assign({
      width: 600,
      height: 370,
      frame: false,
      transparent: true
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.loadURL(`file://${__dirname}/windows/loader/loader.html`);
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};

/*
const template = [
  {
    label: 'Open',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click() {
          openFile();
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
*/

app.on('ready', () => {
  createLoadingScreen();

  setTimeout(() => {
    createWindow();

    const contextMenu = new Menu()
    contextMenu.append(new MenuItem(
      {
        label: 'Upload File',
        accelerator: 'CmdOrCtrl+O',
        click() {
          openFile();
        }
      }))

      contextMenu.append(new MenuItem(
        {
          label: 'Refresh',
          accelerator: 'CmdOrCtrl+R',
          click() {
            mainWindow.reload();
          }
        }))

    mainWindow.webContents.on('context-menu', function(e, params) {
      contextMenu.popup(mainWindow, params.x, params.y)
    })
  }, 20000);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


function openFile() {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Audio files (*.mp3)', extensions: ['mp3'] }]
  }).then(result => {
    (result.filePaths).forEach(function(file) {
        copyFile(file)
      }
    )
  }).catch(err => {
    console.log(err)
  })

  if(!files) return;
}


function copyFile(selectedFilePath) {
  const fileName = path.basename((selectedFilePath.toString()))

  fs.copyFile(selectedFilePath, (__dirname + '/audio/' + fileName), (err) => {
    if(err) {
      console.log(err)
    }
  });
}
