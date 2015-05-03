var iframeElement = document.querySelector('iframe');
var widget = SC.Widget(iframeElement);

var subtitleManager = null;

function SubtitleManager(data) {
  var self = this;
  self.data = data;
}

SubtitleManager.prototype.apply = function(idx) {
  var elem = this.data[idx];
  $('.subtitle-jp').text(elem.text_jp);
  $('.subtitle-ko').text(elem.text_ko);
  $('.subtitle-ko-mean').text(elem.text_ko_mean);
}

SubtitleManager.prototype.clear = function() {
  $('.subtitle-jp').text('---');
  $('.subtitle-ko').text('Ready');
  $('.subtitle-ko-mean').text('---');
}


SubtitleManager.prototype.show = function(pos) {
  var self = this;
  for(var i = 0 ; i < self.data.length - 1 ; i += 1) {
    var subtitleBegin = self.data[i];
    var subtitleEnd = self.data[i+1];
    if(subtitleBegin.start <= pos && pos <= subtitleEnd.start) {
      self.apply(i);
    }
  }
}


widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
  var currPos = data.currentPosition;
  subtitleManager.show(currPos);
  //console.log(currPos);
});

widget.bind(SC.Widget.Events.FINISH, function(data) {
  subtitleManager.clear();
});

widget.bind(SC.Widget.Events.LOAD_PROGRESS, function(data) {
  $('.subtitle-jp').text('---');
  $('.subtitle-ko').text('Loading...');
  $('.subtitle-ko-mean').text('---');
});

function controlPlayerButton(value) {
  if(subtitleManager === null) {
    return;
  }
  
  widget.isPaused(function(val) {
    if(val === value) {
      if(value) {
        widget.play();
      } else {
        widget.pause();
      }
      
      $('.btn-pause').prop('disabled', !value);
      $('.btn-play').prop('disabled', value);
    }
  });
};

$('.btn-pause').click(function() {
  controlPlayerButton(false);
});

$('.btn-play').click(function() {
  controlPlayerButton(true);
});

function syncSubtitle() {
  $.getJSON('./data.json', function(data) {
    subtitleManager = new SubtitleManager(data);
    console.log("subtitle ready");
    
    subtitleManager.clear();
    $('.btn-play').prop('disabled', false);
  });
}

$('.btn-test-runner').click(function() {
  syncSubtitle();  
});



$(document).ready(function() {
  syncSubtitle();
});
