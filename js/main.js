var OM = OM || {}

OM.photos = [];
$(function() {
  $('.instagram').on('didLoadInstagram', function(event, response) {
    response.data.map(function(photo) {
       OM.photos.push(photo.images.standard_resolution.url); 
    });
      OM.Galaxy.init();
  });

  $('.instagram').instagram({
    hash: 'omies',
    clientId: 'cf4ba7af04c942d0a1a141253b04fd16'
  });

});