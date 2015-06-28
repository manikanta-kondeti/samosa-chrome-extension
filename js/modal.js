var overlay = document.querySelector('.overlay');

overlay.addEventListener('click', function() {
  chrome.runtime.sendMessage('hide_popup');
});

var title = document.querySelector('.wrapper');

title.addEventListener('click', function() {

   var text = $(title).text();
   chrome.runtime.sendMessage({'text': text});
});
