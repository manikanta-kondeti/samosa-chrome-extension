
/*
  Checks for load_up. If so sends the html page of the modal to the main function and also fetches popular voices  
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    
    if(request.msg === 'load_popup') {
        get_voices();

        $.get(chrome.extension.getURL('../modal.html'), function(response){
            sendResponse({html: response});
        },'html');   
    }


});

/*
 Copy to clipboard. Listens for message from main and executes copy
 */
chrome.runtime.onMessage.addListener(function(message) {
    if (message && message.type === 'copy') {
        var input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = message.text;
        input.focus();
        input.select();
        document.execCommand('Copy');
        input.remove();
    }
});


/**
 * get_voices get popular voices from google app engine
 * @return {[null]} 
 */
get_voices = function() {
        var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
        gapi.client.load('samosa', 'v1', function() {
          popular_now();
        }, ROOT);


}

/**
 * popular_now sends message of voices from background to main to write it on the modal
 * @return {[null]} 
 */
popular_now = function() {

    var popular_voices = gapi.client.samosa.api.expressions.popular().execute(
      function(resp) {


             chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                 chrome.tabs.sendMessage(tabs[0].id, {voices: resp.voices});
            });
    });

 }
