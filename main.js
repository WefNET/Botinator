const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win = null;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    // win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

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
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

function openSettingsWindow() {
    const modalPath = path.join('file://', __dirname, '/sub/settings.html')
    console.log(modalPath);

    // win.hide();

    let settingsWin = new BrowserWindow({
        frame: false,
        opacity: 1,
        width: 200,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    })

    settingsWin.on('close', () => {
        // win.show();
        settingsWin = null;
    });

    settingsWin.loadURL(modalPath)
    settingsWin.show()

    settingsWin.webContents.openDevTools();
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('do-settings', () => {
    openSettingsWindow();
})