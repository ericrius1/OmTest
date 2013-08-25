var OM = OM || {}

OM.photos = [];

//This variable determines how often we ping instagram for more photos
OM.requestIntervalTime = 3000; //in milliseconds
OM.emptyWorld = true;
$(function() {
  var flatMode = false;
  var currentPhotoIndex;
  $('.instagram').on('didLoadInstagram', function(event, response) {
    response.data.map(function(photo) {
      OM.photos.push(photo.images.low_resolution.url);
    });

    if (OM.emptyWorld) {
      OM.Galaxy.init()
      $('#container').on('click', 'canvas', function(event) {
        toggleView(event.target.dataset.source);
      })
      $('.instagram').on('click', 'img', function(event) {
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
      var selectedSource
      OM.photos.map(function(photo) {
        if (photo !== targetSource) {
          $('.instagram').prepend('<img src="' + photo + '" />');
        }
      });
      $('.instagram').prepend('<img src="' + targetSource + '"/>');
    } else {
      window.scrollTo(0, 0);
      $('.instagram').empty();
      $('#container').show();
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



});