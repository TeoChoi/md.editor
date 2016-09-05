chrome.browserAction.onClicked.addListener(function (tab) {
    var url = chrome.extension.getURL("index.html")
    chrome.tabs.getAllInWindow(chrome.windows.WINDOW_ID_CURRENT, function (tabs) {
        var tab;
        for (var i in tabs) {
            tab = tabs[i];
            if (tab.url.indexOf(url) != -1) {
                chrome.tabs.update(tab.id, { selected: true });
                return;
            }
        }
        chrome.tabs.create({ url: url });
    });

});