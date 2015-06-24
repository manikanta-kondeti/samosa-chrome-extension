chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg == 'open_dialog_box') {

    var w = 800;
    var h = 400;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2); 

    chrome.windows.create({'url': '../popup.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top}, 
      function(window) {
        console.log(window);
      });
  
  }
});
