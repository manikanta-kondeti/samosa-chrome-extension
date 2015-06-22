chrome.webRequest.onCompleted.addListener(function(details) {
        chrome.tabs.executeScript(details.tabId, {
            file: 'contentscript.js',
            allFrames: true // <-- You might want to tweak this
        });
    }, {
        urls: ['http://example.com/foo.js*'],
        types: ['xmlhttprequest']
    });