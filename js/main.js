 $(document).ready(function() {

   setTimeout(function() {
     comment_box_icon();
   }, 8000);
 });

 $(window).scroll(function() {
   comment_box_icon();
 });

 $(document).on("click", ".samosa_comment", function(e) {

;

   var parent_span  = $(this).parent().parent().siblings().find('span');

   var data_reactid = parent_span.children().attr('data-reactid');

   parent_span.children().remove();
   parent_span.append('<span data-reactid="'+data_reactid+'.0">asdasdasd</span>')

   $(this).parent().parent().siblings().find('._5ywb').remove()


   if ($('.samosa-modal').length == 0) {


     chrome.extension.sendRequest({
       msg: "load_popup"
     }, function(response) {
       $("body").append(response.html);
     });
   }
   else {
     $('.samosa-modal').show();
   }

 });


 chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
     add_voices(request.voices);
   });



 add_voices = function(voices) {
   for (i = 0; i < voices.length; i++) {

     $('.samosa-clips').append('<div class="samosa-audioclip"> \
        <img width="120" height="120" src="' + voices[i].poster_url + '" style="position: relative; top: 0; left: 0;"/> \
        <img class="player" id ="play" src="'+ chrome.extension.getURL("../play.png") +'" style="width:30px;position: absolute; top: 43px; left: 45px; cursor:pointer;"/> \
        <span style="display:none;" class="audioclip-path">' + voices[i].mp3_url + '</span> \
        <button class="samosa-btn" style="height:25px;width:120px;cursor:pointer;font-size:8px;">CLICK TO COPY</button> \
      </div> \
      ');
   }
 }

 comment_box_icon = function() {
   var img_url = chrome.extension.getURL('../icon.png');

   var new_comment = $(".UFICommentAttachmentButtons").filter(function() {
     return $(this).find('.samosa_comment').length == 0;
   });

   $(new_comment).append('<div class="comment_box_icon"><img class="samosa_comment" width="22px" src=' + img_url + '></div>');

 }

$(document).on('click', '.samosa-btn', function(e){

      var link = $(this).parent().find('span').text();

      console.log($(this).parent().find('span').text());

      chrome.runtime.sendMessage({
         type: 'copy',
         text: link
      });

})

$(document).on('click','.samosa-overlay', function(e) {
    $('.samosa-modal').hide();
  });


$('audio').on('ended', function() {
  
  console.log('hieee');

});

$(document).on('click', '.player', function (e) {

       var id = $(this).attr('id');
       if(id === "play") {
  
         var audioclip_path  = $(this).parent().find("span").text();
         var myaudio = new Audio(audioclip_path);
         myaudio.addEventListener("ended", function() { 
              $($(this).siblings()[1]).attr('id', 'play');
              $($(this).siblings()[1]).attr('src', chrome.extension.getURL("../play.png"));
               
          });

         if(typeof $(this).siblings()[3] == "undefined") {
          $(this).parent().append(myaudio);
          $(this).siblings()[3].play();
          $(this).attr('id','pause');
          $(this).attr('src', chrome.extension.getURL("../pause.png"))
         }
        else{
          $(this).siblings()[3].play();
          $(this).attr('id','pause');
          $(this).attr('src', chrome.extension.getURL("../pause.png"))
        }
       }
       else{
         $(this).siblings()[3].pause();
         $(this).attr('id','play');
         $(this).attr('src', chrome.extension.getURL("../play.png"))
         }
    });





