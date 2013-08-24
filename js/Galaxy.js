var OM = OM || {};
OM.Galaxy = new function() {

  var camera, scene, renderer;
  var controls;

  var particlesTotal = 10;
  var sprites = []
  var positions = [];
  var objects = [];
  var current = 0;
  var pulsingPower = 0.02
  var pulsingSpeed = 0.002

  this.init = function() {
    OM.emptyWorld = false;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(600, 400, 1500);
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();

    loadSprites();


    // Sphere

    var radius = 750;

    for (var i = 0; i < particlesTotal; i++) {

      var phi = Math.acos(-1 + (2 * i) / particlesTotal);
      var theta = Math.sqrt(particlesTotal * Math.PI) * phi;

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

    window.addEventListener('resize', onWindowResize, false);

    animate();

  }

  this.addPhotos = function() {
    var sprite = document.createElement('img');
    sprite.src = 'assets/flower.jpg';
    sprite.addEventListener('load', function(event){
      loadSprite(sprite);
    }, false);
    transitionAll();


  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function transitionAll() {
    var duration = 2000;

    for (var i = 0, j = 0; i < particlesTotal; i++, j += 3) {

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

  function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();
    controls.update();


    renderer.render(scene, camera);
  }

  function loadSprites() {
    for (var i = 0; i < OM.photos.length; i++) {
      var sprite = document.createElement('img');
      sprite.src = OM.photos[i];
      sprites.push(sprite);
    }

    sprites[sprites.length - 1].addEventListener('load', function() {

      for (var i = 0; i < OM.photos.length; i++) {
        loadSprite(sprites[i]);
      }

      transitionAll();
    }, false);
  }

  function loadSprite(sprite){
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



}