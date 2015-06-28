 $(document).ready(function() {

   setTimeout(function() {
     comment_box_icon();
   }, 8000);
 });

 $(document).on("click", ".samosa_comment", function() {

   if ($('#samosa-frame').length == 0) {
     var iframe = document.createElement('iframe');
     iframe.src = chrome.extension.getURL("../modal.html");
     iframe.className = 'css-isolation-popup';
     iframe.frameBorder = 0;
     iframe.id = "samosa-frame";
     document.body.appendChild(iframe);
     chrome.runtime.sendMessage('show_popup');
   }
   else {
     $('#samosa-frame').show();
   }

 });

 chrome.runtime.onMessage.addListener(function(message) {
   if (message == 'hide_popup') {
     $('#samosa-frame').hide();
   }
   else {
     console.log(message);
   }
 });

 $(window).scroll(function() {
   comment_box_icon();
 });


 comment_box_icon = function() {
   var img_url = chrome.extension.getURL('../icon.png');

   var new_comment = $(".UFICommentAttachmentButtons").filter(function() {
     return $(this).find('.samosa_comment').length == 0;
   });

   $(new_comment).append('<div class="comment_box_icon"><img class="samosa_comment" width="22px" src=' + img_url + '></div>');

 }
