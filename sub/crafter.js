const { BrowserWindow, ipcMain } = require('electron').remote
const settings = require('electron-settings');
var Mousetrap = require('mousetrap');

var robot = require("robotjs");

ipcMain.on('do-it', () => {
    document.getElementById("getCoords").style.display = "none";

    document.getElementById("status").style.display = "block";
    document.getElementById("status").innerHTML = "Capture active on 'S'";

    Mousetrap.bind('s', function () {
        console.log('s pressed');

        // Get mouse position.
        var mouse = robot.getMousePos();

        settings.set('crafter', {
            x: mouse.x,
            y: mouse.y,
        });

        Mousetrap.unbind('s');

        document.getElementById("status").innerHTML = "";

        RunBot();
    });
})

function RunBot() {
    let running = 1;

    Mousetrap.bindGlobal('esc', function() {
        running = 0;
    });

    document.getElementById("status").innerHTML = "Starting!"

    Sleep(2000);

    let rested = settings.get('rested');
    let action = settings.get('action');
    let target = settings.get('crafter');

    while (running === 1) {
        robot.moveMouse(target.x, target.y);
        robot.mouseClick();

        Sleep(2000);

        let xx = 1

        while (xx === 1) {
            const test = robot.getPixelColor(action.x, action.y);

            document.getElementById("status").innerHTML = "Action - Color Test: " + test.hex + " Need: " + action.hex;
            Sleep(100);

            if (test.hex === action.hex) {
                // not running
                xx = 0
            } else {
                Sleep(1000)
            }
        }

        document.getElementById("status").innerHTML = "Not Active!"

        // Check for Stamina
        let yy = 1
        while (yy === 1) {
            const test = robot.getPixelColor(rested.x, rested.y);

            document.getElementById("status").innerHTML = "Stamina - Color Test: " + test.hex + " Need: " + rested.hex;
            Sleep(1000)

            if (test.hex === rested.hex) {
                // not running
                yy = 0
            } else {
                Sleep(1000)
            }
        }

        document.getElementById("status").innerHTML = "Done!";

        Sleep(4000);
    }
}

function Sleep(timeout) {
    setTimeout(() => {
        return;
    }, timeout);
}

/**
 * adds a bindGlobal method to Mousetrap that allows you to
 * bind specific keyboard shortcuts that will still work
 * inside a text input field
 *
 * usage:
 * Mousetrap.bindGlobal('ctrl+s', _saveChanges);
 */
/* global Mousetrap:true */
(function(Mousetrap) {
    if (! Mousetrap) {
        return;
    }
    var _globalCallbacks = {};
    var _originalStopCallback = Mousetrap.prototype.stopCallback;

    Mousetrap.prototype.stopCallback = function(e, element, combo, sequence) {
        var self = this;

        if (self.paused) {
            return true;
        }

        if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
            return false;
        }

        return _originalStopCallback.call(self, e, element, combo);
    };

    Mousetrap.prototype.bindGlobal = function(keys, callback, action) {
        var self = this;
        self.bind(keys, callback, action);

        if (keys instanceof Array) {
            for (var i = 0; i < keys.length; i++) {
                _globalCallbacks[keys[i]] = true;
            }
            return;
        }

        _globalCallbacks[keys] = true;
    };

    Mousetrap.init();
}) (typeof Mousetrap !== "undefined" ? Mousetrap : undefined);