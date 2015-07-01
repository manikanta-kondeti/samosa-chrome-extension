chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    
    if(request.msg == "load_popup") {
        
        
        get_voices();

        $.get(chrome.extension.getURL("../modal.html"), function(response){
            
            sendResponse({html: response});

        },'html');
        
    }


});

chrome.runtime.onMessage.addListener(function(message) {
    if (message && message.type == 'copy') {
        var input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = message.text;
        input.focus();
        input.select();
        document.execCommand('Copy');
        input.remove();
    }
});


get_voices = function() {
        var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
        return gapi.client.load('samosa', 'v1', function() {
          popular_now();
        }, ROOT);


}

popular_now = function() {

    var popular_voices = gapi.client.samosa.api.expressions.popular().execute(
      function(resp) {


             chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {voices: resp.voices});
            });
    });

 }

// chrome.runtime.onMessage.addListener(function(message, sender) {

//   if(message.msg == "load_popup") {

//     $.get(chrome.extension.getURL("../modal.html"),function(response){


//     },'html');

//       $.ajax({
//             url: chrome.extension.getURL("../modal.html"),
//             dataType: "html",
//             success: sendResponse
//         });
//   }

//   if (message == "show_popup") {

  
//     var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
//     gapi.client.load('samosa', 'v1', function() {
//         popular_now();
//     }, ROOT);

//   }

//   else {
//     chrome.tabs.sendMessage(sender.tab.id, message);
//   }

// });

// popular_now = function() {
//   var popular_voices = gapi.client.samosa.api.expressions.popular().execute(
//     function(resp) {
//      //  chrome.runtime.sendMessage({'voices':resp.voices});
//     });
// });
