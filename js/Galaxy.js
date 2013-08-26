//FLIP DIRECTION WHILE INSIDE SPHERE
//Random Initial distribution
//When user lcicks to go to 2d mode, start zooming in in 3d, then once dom is ready show 2d mode



var OM = OM || {};
OM.Galaxy = new function() {

  var camera, scene, renderer;
  var controls;

  var maxNodes = 60;
  var radius = maxNodes * 15;
  var sprites = [];
  var instaSprites = [];
  var positions = [];
  var objects = [];
  var current = 0;
  var pulsingPower = 0.02
  var pulsingSpeed = 0.002
  var newPhotoDuration = 2000;
  var startingDuration = 500;
  var camDuration = 1500;
  var prevPhotoIndex;
  var time;
  var pulseStrength = 0.001;
  var pulseSpeed = 0.0004;
  var camRotateSpeed = 0.07;
  var lat = 85,
    lon = 0,
    phi = 0,
    theta = 0;
  var startCamPos = {
    x: -117,
    y: 297,
    z: -2386
  }

  this.init = function() {
    OM.emptyWorld = false;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(startCamPos.x, startCamPos.y, startCamPos.z);
    camera.lookAt(new THREE.Vector3());



    scene = new THREE.Scene();


    var yantraSprite = document.createElement('img');
    yantraSprite.src = 'assets/yantra2.png';
    var loaders = [];
    loaders.push(yantraSprite);
    for (var i = 0; i < OM.photos.length; i++) {
      loaders.push(loadSprite(OM.photos[i]));
    }

    $.when.apply(null, loaders).done(function() {
      var sprite;
      for (var i = 0; i < maxNodes; i++) {
        if (i < instaSprites.length) {
          sprite = instaSprites[i];
        } else {
          sprite = yantraSprite;
        }
        sprites.push(sprite);
        var canvas = document.createElement('canvas');
        canvas.width = sprite.width;
        canvas.height = sprite.height;
        canvas.setAttribute('data-source', sprite.src);
        var context = canvas.getContext('2d');
        context.drawImage(sprite, 0, 0);
        var object = new THREE.CSS3DSprite(canvas);
        object.position.x = Math.random() * 4000 - 2000,
        object.position.y = Math.random() * 4000 - 2000,
        object.position.z = Math.random() * 4000 - 2000
        scene.add(object);

        objects.push(object);
      }
      prevPhotoIndex = instaSprites.length;
      initalAnimation();
    });



    // Create Nodes for the construction of the sphere
    for (var i = 0; i < maxNodes; i++) {

      var phi = Math.acos(-1 + (2 * i) / maxNodes);
      var theta = Math.sqrt(maxNodes * Math.PI) * phi;

      positions.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

    }

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.1;
    controls.dynamicDampingFactor = 0.2;
    controls.noRoll = true;


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
        }, Math.random() * startingDuration + startingDuration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    }

    new TWEEN.Tween(this)
      .to({}, startingDuration * 3)
      .start();
  }

  function loadSprite(src) {
    var deferred = $.Deferred();
    var sprite = document.createElement('img');
    sprite.onload = function() {
      instaSprites.push(sprite);
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
    var oldObject = objects[objects.length - 1];
    scene.remove(oldObject);

    //add new one
    var canvas = document.createElement('canvas');
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    canvas.setAttribute('data-source', sprite.src);
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

  this.findCenter = function() {
    new TWEEN.Tween(camera.position)
      .to({
        x: 99.9999,
        y: 0,
        z: 0.12217
      }, Math.random() * camDuration + camDuration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(function() {
        $('#center').text("View the Whole");
        controls.invertPitch = true;

      })
      .start();

  }

  this.leaveCenter = function() {
    new TWEEN.Tween(camera.position)
      .to({
        x: startCamPos.x,
        y: startCamPos.y,
        z: startCamPos.z
      }, Math.random() * camDuration + camDuration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(function() {
        $('#center').text("Find your center");
      })
      .start();

  }



  this.addPhotos = function(photos) {
    if (photos.length === 0) {
      return;
    }
    var loaders = [];
    for (var i = 0; i < photos.length; i++) {
      loaders.push(loadSprite(photos[i]));
    }
    $.when.apply(null, loaders).done(function() {
      for (var i = prevPhotoIndex; i < instaSprites.length; i++) {
        addNewPhoto(instaSprites[i]);
      }
      prevPhotoIndex = instaSprites.length;

    });

  }

  function animate() {
    time = Date.now();


    requestAnimationFrame(animate);

    TWEEN.update();
    controls.update();

    for (var i = 0, len = objects.length; i < len; i++) {
      var object = objects[i];
      var scale = Math.sin((Math.floor(object.position.x) + time) * pulseSpeed) * 0.3 + 1;
      object.scale.set(scale, scale, scale);

    }

    renderer.render(scene, camera);
  }

}