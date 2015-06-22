$(document).ready(function() {

 $('.samosa_chat , .samosa_comment, ._552n').click(function() {     
      alert('hi');
  });


    setTimeout(function(){
      chat_box_icon();
      comment_box_icon();
    },8000);   
});



$(window).scroll(function() {
    chat_box_icon();
    comment_box_icon();
});

comment_box_icon = function() {
  var img_url = chrome.extension.getURL('../icon.png');

  var new_comment = $(".UFICommentAttachmentButtons").filter(function(){ 
         return $(this).find('.samosa_comment').length == 0;
      });

  $(new_comment).append('<img class="samosa_comment" style="z-index:100px;cursor:pointer;display:block;" width="23px" src=' + img_url + '>');

},  

chat_box_icon = function() {
    var img_url = chrome.extension.getURL('../icon.png');

      var new_chat = $("._552n").filter(function(){ 
         return $(this).find('.samosa_chat').length == 0;
      });

      $(new_chat).append('<img class="samosa_chat" style="z-index:100px;cursor:pointer;display:block" width="23px" src=' + img_url + '>');
  }
