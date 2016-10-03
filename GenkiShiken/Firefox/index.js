var {ToggleButton} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");

var button = ToggleButton({
  id: "genkishiken",
  label: "GenkiShiken",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: ("./genkishiken.html"),
  onHide: handleHide,
  width: 600,
  height: 300
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
