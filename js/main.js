var OM = OM || {}

OM.photos = [];
OM.requestIntervalTime = 1000; //in milliseconds
OM.emptyWorld = true;
$(function() {
  $('.instagram').on('didLoadInstagram', function(event, response) {
    response.data.map(function(photo) {
      console.log("new request")
      OM.photos.push(photo.images.low_resolution.url);
    });

    OM.emptyWorld ? OM.Galaxy.init(): OM.Galaxy.addPhotos();


  });



  var queryInstagram = function() {
    $('.instagram').instagram({
      hash: 'omies',
      clientId: 'cf4ba7af04c942d0a1a141253b04fd16'
    });
  }

  var queryInstagramTest = function() {
    console.log("slower")
    //OM.Galaxy.addPhotos();
  }



  queryInstagram();
  window.setInterval(queryInstagramTest, OM.requestIntervalTime);


});