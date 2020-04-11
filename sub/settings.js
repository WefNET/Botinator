const { BrowserWindow, ipcMain } = require('electron').remote
const settings = require('electron-settings');
var Mousetrap = require('mousetrap');
var robot = require("robotjs");

console.log("Settings JS Loaded");

if (settings.has('rested')) {
    setRestedHTML(settings.get('rested'));
}

ipcMain.on('do-rested', () => {
    document.getElementById("commandText").innerHTML = "Capture active on 'S'";

    Mousetrap.bind('s', function () {
        console.log('s pressed');

        // Get mouse position.
        var mouse = robot.getMousePos();

        // Get pixel color in hex format.
        var hex = robot.getPixelColor(mouse.x, mouse.y);
        console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);

        settings.set('rested', {
            x: mouse.x,
            y: mouse.y,
            color: hex
        });

        setRestedHTML(settings.get('rested'));

        document.getElementById("commandText").innerHTML = "Rested values set.";

        Mousetrap.unbind('s');
    });

    
})

function setRestedHTML(settingsObj) { 
    document.getElementById("restedColour").innerHTML = settingsObj.color;
    document.getElementById("restedColour").style.backgroundColor = settingsObj.color;
    document.getElementById("restedX").innerHTML = settingsObj.x;
    document.getElementById("restedY").innerHTML = settingsObj.y;
}