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
  var radius = 750;

  this.init = function() {
    OM.emptyWorld = false;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(600, 400, 1500);
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();

    loadSprites();

    createSphere();


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
    //TEMP
    OM.photos.push('assets/flower.jpg');
    var sprite = document.createElement('img');
    sprite.src = OM.photos[OM.photos.length-1];
    sprite.addEventListener('load', function(event) {
      loadSprite(sprite);
      addNodeToSphere();
      transitionOne(objects[objects.length-1]);
    }, false);
    


  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function transitionAll() {
    for (var i = 0, j = 0; i < particlesTotal; i++, j += 3) {
      transitionOne(objects[i], j);
    }
  }

  function transitionOne(object, offset) {
    var offset = offset || (objects.length-1) * 3;
    console.log(offset)
    var duration = 2000;
    new TWEEN.Tween(object.position)
      .to({
        x: positions[offset],
        y: positions[offset + 1],
        z: positions[offset + 2]
      }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
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

  function loadSprite(sprite) {
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

  function createSphere() {
    for (var i = 0; i < OM.photos.length; i++) {
      addNodeToSphere(i);
    }
  }

  function addNodeToSphere(index) {
    var index = index || OM.photos.length - 1;
    var phi = Math.acos(-1 + (2 * index) / OM.photos.length);
    var theta = Math.sqrt(OM.photos.length * Math.PI) * phi;

    positions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }



}