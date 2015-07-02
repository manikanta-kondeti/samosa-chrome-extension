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
 */

$(document).on("click", ".samosa_comment", function(e) {

  var parent_span = $(this).parent().parent().siblings().find('span');
  var data_reactid = parent_span.children().attr('data-reactid');

  parent_span.children().remove();

  parent_span.append('<span data-reactid="' + data_reactid + '">asdasdasd</span>');

  $(this).parent().parent().siblings().find('._5ywb').remove();

  if ($('.samosa-modal').length === 0) {

    chrome.extension.sendRequest({
      msg: "load_popup"
    }, function(response) {
      response.html += '<link rel="stylesheet" type="text/css" href="' + chrome.extension.getURL('../css/modal.css') + '">'
      $("body").append(response.html);
    });
  }
  else {
    $('.samosa-modal').show();
  }
});

/*
  click to copy the url of the audio clip.
  copy function is a background job
 */
$(document).on('click', '.samosa-copybtn', function(e) {

  var link = $(this).parent().find('span').text();

  chrome.runtime.sendMessage({
    type: 'copy',
    text: link
  });

});

/*
  Close the modal 
 */
$(document).on('click', '.samosa-overlay', function(e) {

  pause_allaudio();

  $('.samosa-modal').hide();
});

$(document).on('click', '.player', function(e) {

  var id = $(this).attr('id');
  if (id === "play") {

    var audioclip_path = $(this).parent().find('span').text();
    var myaudio = new Audio(audioclip_path);

    /*
     * Attaching audio end event to the clip. 
     */
    myaudio.addEventListener("ended", function() {
      $(this).parent().find('#pause').attr('id', 'play');
      $(this).parent().find('#play').attr('src', chrome.extension.getURL("../images/play.png"));
    });

    if (typeof $(this).siblings()[3] == "undefined") {
      $(this).parent().append(myaudio);
      $(this).siblings()[3].play();
      $(this).attr('id', 'pause');
      $(this).attr('src', chrome.extension.getURL("../images/pause.png"))
    }
    else {
      $(this).siblings()[3].play();
      $(this).attr('id', 'pause');
      $(this).attr('src', chrome.extension.getURL("../images/pause.png"))
    }
  }
  else {
    $(this).siblings()[3].pause();
    $(this).attr('id', 'play');
    $(this).attr('src', chrome.extension.getURL("../images/play.png"))
  }
});

/*
  Listner to background popular_tags call.
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    add_voices(request.voices);
  });


/**
 * pause_allaudio stops all audio files playing in modal
 */
pause_allaudio = function() {
  var audio = $('audio');

  for (i = 0; i < audio.length; i++) {
    audio[i].pause();
  }
}
/**
 * add_voices adds voice clips to the modal of the chrome extension
 * @param {[object]} voices [popular voices object]
 */
add_voices = function(voices) {

    for (i = 0; i < voices.length; i++) {
      $('.samosa-clips').append('<div class="samosa-audioclip"> \
        <img width="120" height="120" src="' + voices[i].poster_url + '" style="position: relative; top: 0; left: 0;"/> \
        <img class="player" id ="play" src="' + chrome.extension.getURL("../images/play.png") + '" style="width:30px;position: absolute; top: 43px; left: 45px; cursor:pointer;"/> \
        <span style="display:none;" class="audioclip-path">' + voices[i].mp3_url + '</span> \
        <button class="samosa-copybtn" style="height:25px;width:120px;cursor:pointer;font-size:8px;">CLICK TO COPY</button> \
      </div> \
      ');
    }
  },

  /**
   * comment_box_icon appends samosa icon to fb comment box
   */
  comment_box_icon = function() {
    var img_url = chrome.extension.getURL('../images/icon.png');

    var new_comment = $(".UFICommentAttachmentButtons").filter(function() {
      return $(this).find('.samosa_comment').length == 0;
    });

    $(new_comment).append('<div data-hover="tooltip" data-tooltip-alignh="center" aria-label="Attach a audio clip" class="comment_box_icon"><img class="samosa_comment" width="22px" src=' + img_url + '></div>');

  }
