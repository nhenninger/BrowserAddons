var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "shinkei-button",
  label: "ShinkeiSuijaku",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  windows.open("shinkeisuijaku.html");
}