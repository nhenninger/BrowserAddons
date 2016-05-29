var self = require('sdk/self');
var selection = require("sdk/selection");
var tabs = require("sdk/tabs");

var preferences = require("sdk/simple-prefs").prefs;
require("sdk/simple-prefs").on("", onPrefChange);
function onPrefChange(prefname) {
	dict = preferences.dictPref;
	console.log("preferences changed: " + dict);
};

var contextMenu = require("sdk/context-menu");
 var menuItem = contextMenu.Item({
  label: "Something went wrong!",
  context: contextMenu.SelectionContext(),
  contentScriptFile: self.data.url("contentscript.js"),
//  accessKey: "j",
  image: self.data.url("JS-icon-16.png"),
  onMessage: function (selectionText) {
		queryDict(selectionText);
	}
});

function queryDict(text){
	dict = preferences.dictPref;
  if (dict === "JDIC") {
      contentURL = "http://nihongo.monash.edu/cgi-bin/wwwjdic?1ZUJ" + text;
      scriptFile = "JDICpanelscript.js";
    } else {
      contentURL = "./panel.html?query=" + text;
      scriptFile = "GLOSBEpanelscript.js";
    }
  var panel = require("sdk/panel").Panel({
    width: 600,
    height: 600,
    contentURL: contentURL,
    contentScriptFile: self.data.url(scriptFile),
    contentStyleFile: self.data.url("panel-style.css")
  });

  panel.show();
}