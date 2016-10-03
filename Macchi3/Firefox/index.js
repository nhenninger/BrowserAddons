var {ToggleButton} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");

var button = ToggleButton({
  id: "macchi3",
  label: "Macchi3",
  icon: {
    "16": "./assets/icon-16.png",
    "32": "./assets/icon-32.png",
    "64": "./assets/icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: ("./macchi3.html"),
  onHide: handleHide,
  width: 800,
  height: 800
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
