var OM = OM || {};
OM.Galaxy = new function() {

  var camera, scene, renderer;
  var controls;

  var maxNodes = 111;
  var radius = maxNodes * 15;
  var sprites = [];
  var instaSprites = [];
  var loaders = [];
  var positions = [];
  var objects = [];
  var current = 0;
  var pulsingPower = 0.02
  var pulsingSpeed = 0.002
  var newPhotoDuration = 2000;
  var duration = 500;

  this.init = function() {
    OM.emptyWorld = false;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(-135, 340, -2720);
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();


    var flowerSprite = document.createElement('img');
    flowerSprite.src = 'assets/flower.jpg';
    loaders.push(flowerSprite);
    for (var i = 0; i < OM.photos.length; i++) {
      loaders.push(loadSprite(OM.photos[i]));
    }

    $.when.apply(null, loaders).done(function() {
      var sprite;
      for (var i = 0; i < maxNodes; i++) {
        if (i < instaSprites.length) {
          sprite = instaSprites[i];
        } else {
          sprite = flowerSprite;
        }
        sprites.push(sprite);
        var canvas = document.createElement('canvas');
        canvas.width = sprite.width;
        canvas.height = sprite.height;
        var context = canvas.getContext('2d');
        context.drawImage(sprite, 0, 0);
        var object = new THREE.CSS3DSprite(canvas);
        object.position.x = Math.random() * 4000 - 2000,
        object.position.y = Math.random() * 4000 - 2000,
        object.position.z = Math.random() * 4000 - 2000
        scene.add(object);

        objects.push(object);
      }
      initalAnimation();
    });



    // Sphere

    for (var i = 0; i < maxNodes; i++) {

      var phi = Math.acos(-1 + (2 * i) / maxNodes);
      var theta = Math.sqrt(maxNodes * Math.PI) * phi;

      positions.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

    }

    //

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    //

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.1;

    //

    window.addEventListener('resize', onWindowResize, false);

    animate();

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function initalAnimation() {

    for (var i = 0, j = 0; i < maxNodes; i++, j += 3) {

      var object = objects[i];

      new TWEEN.Tween(object.position)
        .to({
          x: positions[j],
          y: positions[j + 1],
          z: positions[j + 2]
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    }

    new TWEEN.Tween(this)
      .to({}, duration * 3)
      .start();
  }

  function loadSprite(src) {
    var deferred = $.Deferred();
    var sprite = document.createElement('img');
    sprite.onload = function() {
      instaSprites.push(sprite)
      deferred.resolve();
    };
    sprite.src = src;
    return deferred.promise();
  }

  function newPhotoAnimation(object, newPosition) {
    new TWEEN.Tween(object.position)
      .to({
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z
      }, Math.random() * newPhotoDuration + newPhotoDuration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

  }


  function addNewPhoto(sprite) {
    //delete old object
    var oldObject = objects[objects.length-1];
    scene.remove(oldObject);

    //add new one
    var canvas = document.createElement('canvas');
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    var context = canvas.getContext('2d');
    context.drawImage(sprite, 0, 0);
    var object = new THREE.CSS3DSprite(canvas);
    scene.add(object);
    object.position.x = Math.random() * 4000 - 2000,
    object.position.y = Math.random() * 4000 - 2000,
    object.position.z = Math.random() * 4000 - 2000
    newPhotoAnimation(object, oldObject.position)
    objects.unshift(object);
    objects.pop();;
  }


  function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();
    controls.update();

    renderer.render(scene, camera);
  }

  this.addPhotos = function(photos) {
    var sprite = document.createElement('img');
    sprite.onload = function(){
      addNewPhoto(sprite)
    }
    sprite.src = OM.photos[OM.photos.length-1];

  }

}