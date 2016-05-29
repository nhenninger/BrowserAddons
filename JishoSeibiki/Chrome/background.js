chrome.contextMenus.create({

    title: chrome.i18n.getMessage("searchCommand") + "\'%s\'", 
    contexts:["selection"], 
    onclick: getword,

});

function getword(info,tab) {

	chrome.storage.sync.get({
    dictPref: 'JDIC'
    },function(items) {
	    dict = items.dictPref;
      
    if (dict === 'JDIC') {
      chrome.windows.create({ 
        url: "http://nihongo.monash.edu/cgi-bin/wwwjdic?1ZUJ" + info.selectionText,
        type: 'panel'
      })
    } else {
      chrome.windows.create({
        url: "panel.html?query=" + info.selectionText,
        type: 'panel'
      })
    }
	});
}
