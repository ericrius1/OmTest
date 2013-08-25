var OM = OM || {}

OM.photos = [];
OM.requestIntervalTime = 10000; //in milliseconds
OM.emptyWorld = true;
$(function() {
  var currentPhotoIndex;
  $('.instagram').on('didLoadInstagram', function(event, response) {
    response.data.map(function(photo) {
      console.log("new request")
      OM.photos.push(photo.images.low_resolution.url);
    });

    if (OM.emptyWorld) {
      OM.Galaxy.init()
      currentPhotoIndex = OM.photos.length - 1;
    } else {
      var newPhotos = getNewPhotos();
      OM.Galaxy.addPhotos(newPhotos);
      currentPhotoIndex = OM.photos.length - 1;
    }


  });

  var getNewPhotos = function() {
    //Get rid of duplicate photos
    OM.photos = _.uniq(OM.photos);
    return OM.photos.slice(currentPhotoIndex);

  }

  var queryInstagram = function() {
    $('.instagram').instagram({
      hash: 'love',
      clientId: 'cf4ba7af04c942d0a1a141253b04fd16'
    });
  }

  var queryInstagramTest = function() {
    OM.Galaxy.addPhotos();
  }



  queryInstagram();
  setTimeout(function() {
    window.setInterval(queryInstagram, OM.requestIntervalTime);
  }, 4000)



});