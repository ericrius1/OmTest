var OM = OM || {}

OM.photos = [];

//This variable determines how often we ping instagram for more photos
OM.requestIntervalTime = 4000; //in milliseconds
OM.emptyWorld = true;
OM.centered = false;
$(function() {
  var flatMode = false;
  var currentPhotoIndex;
  var visActive = false;
  $('.instagram').on('didLoadInstagram', function(event, response) {
    response.data.map(function(photo) {
      OM.photos.push(photo.images.low_resolution.url);
    });

    if (OM.emptyWorld) {
      OM.Galaxy.init()
      $('#container').hide();
      $('#container').on('click', 'canvas', function(event) {
        $('#return').show();
        toggleView(event.target.dataset.source);
      })
      $('#return').on('click', function(event) {
        toggleView();
      })

      currentPhotoIndex = OM.photos.length;
    } else {
      var newPhotos = getNewPhotos();
      OM.Galaxy.addPhotos(newPhotos);
      currentPhotoIndex = OM.photos.length;
    }


  });

  var toggleView = function(targetSource) {
    flatMode = !flatMode;
    if (flatMode) {
      $('#container').hide();
      $('.instagram').prepend('<img src="' + targetSource + '"/>');
      $('#begin').hide();
    } else {
      window.scrollTo(0, 0);
      $('#return').hide();
      $('.instagram').empty();
      $('#container').show();
      $('#begin').show();
    }

  }

  var getNewPhotos = function() {
    //Get rid of duplicate photos
    OM.photos = _.uniq(OM.photos);
    return OM.photos.slice(currentPhotoIndex);

  }

  var queryInstagram = function() {
    $('.instagram').instagram({
      hash: 'omies',
      clientId: 'cf4ba7af04c942d0a1a141253b04fd16'
    });
  }

  var queryInstagramTest = function() {
    OM.Galaxy.addPhotos();
  }

  queryInstagram();

  window.setInterval(queryInstagram, OM.requestIntervalTime);

  $('#center').on('click', function() {
    OM.centered = !OM.centered;
    if (OM.centered) {
      OM.Galaxy.findCenter();
    } else {
      OM.Galaxy.leaveCenter();
    }
  });

  $('#begin').on('click', function() {
    visActive = !visActive;
    if (visActive) {
      $('#container').show();
      $('#begin').text("Exit");


    } else {
      $('#container').hide();
      $('#begin').text("Enter the Source");
    }
  })



});