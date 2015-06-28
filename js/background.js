chrome.runtime.onMessage.addListener(function(message, sender) {

	 if(message == "show_popup"){
	 		
	 		console.log("Init Called");
            var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
            gapi.client.load('samosa', 'v1', function() {
                console.log("Api loaded");
            }, ROOT);
        
        gapi.client.samosa.api.expressions.popular().execute(
            function(resp) {
                console.log(resp);
        });
	 }
	 else{
   	 	chrome.tabs.sendMessage(sender.tab.id, message);
   	}
});