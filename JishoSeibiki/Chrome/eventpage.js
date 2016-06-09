function onClickHandler(info,tab) {
	chrome.storage.sync.get({
    dictPref: 'WWWJDIC'
    },function(items) {
	    dict = items.dictPref;
      
    if (dict === 'WWWJDIC') {
      chrome.windows.create({ 
        url: "http://nihongo.monash.edu/cgi-bin/wwwjdic?1ZUJ" + info.selectionText,
        type: 'panel'
      })
    } else if (dict === 'GLOSBE_COM') {
      chrome.windows.create({
        url: "GLOSBEpanel.html?query=" + info.selectionText,
        type: 'panel'
      })
    } else if (dict === 'JISHO_ORG') {
      chrome.windows.create({
        url: "JISHOpanel.html?query=" + info.selectionText,
        type: 'panel'
      })
    }
	});
}


chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
      "title": chrome.i18n.getMessage("searchCommand") + "\'%s\'", 
      "contexts":["selection"],
      "id": "main",
  });
});

chrome.contextMenus.onClicked.addListener(onClickHandler);