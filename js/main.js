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

$(document).on("click", ".samosa_comment", function(e) {

  var parent_span = $(this).parent().parent().siblings().find('span');
  var data_reactid = parent_span.children().attr('data-reactid');

  $(this).parent().parent().siblings().find('._5ywb').remove();

  parent_span.children().remove();

  parent_span.html('<span data-reactid="' + data_reactid + '">asdasdasd</span>');

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

});

/*
  Close the modal and stop all playing audio clips on modal
 */
$(document).on('click', '.samosa-overlay', function(e) {

  pause_allaudio();

  $('.samosa-modal').hide();
});

$(document).on('click', '.player', function(e) {

  var id = $(this).attr('id');
  if (id === "play") {

    /*
     * Attaching audio end event to the clip. 
     */

    if ($(this).parent().find('audio').length === 0) {

      var myaudio = create_audio(this);
      $(this).parent().append(myaudio);
      audio_action(this, 'pause');

    }
    else {
      audio_action(this, 'pause');
    }
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

$(document).on('click', '.samosa-search-btn', function() {

  $('.samosa-clips').html('<img width = "300" src="' + chrome.extension.getURL('../images/loading.gif') + '">');

  chrome.runtime.sendMessage({
    type: 'search_query',
    text: $('.samosa-search-field').val()
  });

});

/*
  Listner to background popular_tags call.
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    add_voices(request.voices);
  });

create_audio = function(player_object) {

  var _this = player_object;

  var audioclip_path = $(_this).parent().find('span').text();
  var myaudio = new Audio(audioclip_path);

  myaudio.addEventListener("ended", function() {
    $(_this).parent().find('#pause').attr('id', 'play');
    $(_this).parent().find('#play').attr('src', chrome.extension.getURL("../images/play.png"));
  });

  return myaudio;
}

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

    $('.player').filter(function() {
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
        <img class="player" id ="play" src="' + chrome.extension.getURL("../images/play.png") + '" style="width:30px;position: absolute; top: 43px; left: 45px; cursor:pointer;"/> \
        <span style="display:none;" class="audioclip-path">' + voices[i].mp3_url + '</span> \
        <div style="display:none;" class="audioclip-copypath"> http://app.getsamosa.com/play/' + voices[i].key + '</div> \
        <button class="samosa-copybtn" style="height:25px;width:120px;cursor:pointer;font-size:8px;">CLICK TO COPY</button> \
      </div> \
      ');
      }
    }
    else {
      $('.samosa-clips').append('No voices found :( . Try again!!');
    }
  },

  /**
   * comment_box_icon appends samosa icon to fb comment box
   */
  comment_box_icon = function() {
    var img_url = chrome.extension.getURL('../images/icon.png');

    var new_comment = $('.UFICommentAttachmentButtons').filter(function() {
      return $(this).find('.samosa_comment').length == 0;
    });

    $(new_comment).append('<div data-hover="tooltip" data-tooltip-alignh="center" aria-label="Attach a audio clip" class="comment_box_icon"><img class="samosa_comment" width="22px" src=' + img_url + '></div>');

  }
