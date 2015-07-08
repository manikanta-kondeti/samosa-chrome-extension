$(window).scroll(function() {
  comment_box_icon();
});

$(document).ready(function() {

  setTimeout(function() {
    comment_box_icon();
  }, 8000);
});

/**
 * copy url of the audio clip to the facebook comment box
 * load html page to the modal and show it 
 */

$(document).on("click", ".samosa_comment_box_wrapper", function(e) {


  if ($('.samosa-modal').length === 0) {

    chrome.extension.sendRequest({
      msg: "load_popup"
    }, function(response) {
      response.html += '<link rel="stylesheet" type="text/css" href="' + chrome.extension.getURL('../css/modal.css') + '">'
      $("body").append(response.html);
      $('.samosa-icon').html('<img width = "42" src="' + chrome.extension.getURL('../images/icon.png') + '">');
      $('.samosa-clips').html('<img width = "300" src="' + chrome.extension.getURL('../images/loading.gif') + '">');

    });
  }
  else {
    $('.samosa-modal').show();
  }
});

$(document).keyup(function(e) {
  if (e.keyCode === 27) {
 
    if($('.samosa-modal').css('display') == 'block'){
        
        pause_allaudio();
        $('.samosa-modal').hide();
    }

  }
});

/*
  click to copy the url of the audio clip.
  copy function is a background job
 */
$(document).on('click', '.samosa-copybtn', function(e) {

  var link = $(this).parent().find('.audioclip-copypath').text();

  chrome.runtime.sendMessage({
    type: 'copy',
    text: link
  });

  pause_allaudio(); //pause all playing audio files

 $( '.samosa-modal' ).fadeOut( "slow", function() {
       
  });

});

/*
  Close the modal and stop all playing audio clips on modal
 */
$(document).on('click', '.samosa-overlay', function(e) {

  pause_allaudio();

  $('.samosa-modal').hide();
});

$(document).on('click', '.samosa-player', function(e) {

  var id = $(this).attr('id');
  if (id === "play") {

    pause_allaudio(); //pause all playing audio files
    audio_action(this, 'pause');

  }  
  else {
    audio_action(this, 'play');
  }

});

/*
  on keypress enter search for the results modal search box
 */

$(document).on('keypress', '.samosa-search-field', function(e) {

  if (e.which == 13) { // Checks for the enter key

    $('.samosa-clips').html('<img width = "300" src="' + chrome.extension.getURL('../images/loading.gif') + '">');
    
    chrome.runtime.sendMessage({
      type: 'search_query',
      text: $('.samosa-search-field').val()
    });

  }
});

$(document).on('mouseenter', '.samosa-audioclip',  function(){
         $(this).find('.samosa-copybtn').css('visibility','visible');
}).on('mouseleave', '.samosa-audioclip', function() {
        $(this).find('.samosa-copybtn').css('visibility','hidden');
});

/*
  Listner to background popular_tags call.
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    add_voices(request.voices);
  });


audio_action = function(player_object, id) {

  var _this = player_object;
  if (id == "pause") {
    $(_this).parent().find('audio')[0].play();
  }
  else {
    $(_this).parent().find('audio')[0].pause();
  }
  //$(this).siblings()[3].pause();
  $(_this).attr('id', id);
  $(_this).attr('src', chrome.extension.getURL('../images/' + id + '.png'));

}

/**
 * pause_allaudio stops all audio files playing in modal and resets music audio clips
 */
pause_allaudio = function() {

    var audio = $('audio');

    for (i = 0; i < audio.length; i++) {
      audio[i].pause();
    }

    $('.samosa-player').filter(function() {
      $(this).attr('id', 'play');
      $(this).attr('src', chrome.extension.getURL("../images/play.png"))
    });

  },

  /**
   * add_voices adds voice clips to the modal of the chrome extension
   * @param {[object]} voices [popular voices object]
   */
  add_voices = function(voices) {

    $('.samosa-clips').empty();


    if (typeof voices != 'undefined') {

      for (i = 0; i < voices.length; i++) {
        $('.samosa-clips').append('<div class="samosa-audioclip"> \
        <img width="120" height="120" src="' + voices[i].poster_url + '" style="position: relative; top: 0; left: 0;"/> \
        <img class="samosa-player" id ="play" src="' + chrome.extension.getURL("../images/play.png") + '"/> \
        <div style="display:none;" class="audioclip-copypath"> http://app.getsamosa.com/play/' + voices[i].key + '</div> \
        <button style="visibility:hidden" class="samosa-copybtn">CLICK TO COPY</button> \
        <audio preload="auto" src="'+ voices[i].opus_url +'"></audio> \
      </div> \
      ');
      }

      end_voices_event();

    }
    else {
      $('.samosa-clips').append('No voices found :( . Try again!!');
    }
  },

  /**
   * 
   */

  end_voices_event = function(){

    var audio = $('audio');

    for (i = 0; i < audio.length; i++) {
      
       audio[i].addEventListener("ended", function() {
          $(this).parent().find('#pause').attr('id', 'play');
          $(this).parent().find('#play').attr('src', chrome.extension.getURL("../images/play.png"));
      });
    }

  }

  /**
   * comment_box_icon appends samosa icon to fb comment box
   */
  comment_box_icon = function() {
    var img_url = chrome.extension.getURL('../images/icon.png');

    var new_comment = $('.UFICommentAttachmentButtons').filter(function() {
      return $(this).find('.samosa_comment_box_icon').length == 0;
    });

    $(new_comment).append('<div class="samosa_comment_box_wrapper" data-hover="tooltip" data-tooltip-alignh="center" aria-label="Attach an Audio Clip"> \
           <i style="background-image: url('+ img_url +')" class="samosa_comment_box_icon"></i> \
      </div>\
     ')
  }
