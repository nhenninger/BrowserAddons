self.on("context", function () {
 var text = window.getSelection().toString();
 if (text.length > 18)
   text = text.substr(0, 18) + "...";
 return "Search for \'" + text + "\'";
});
self.on("click", function() {
 var text = window.getSelection().toString();
 self.postMessage(text);
});