var OM = OM || {};
OM.Galaxy = new function() {

  var camera, scene, renderer;
  var controls;

  var particlesTotal = 10;
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

    var sprite = document.createElement('img');
    sprite.addEventListener('load', function(event) {

      for (var i = 0, j = 0; i < particlesTotal; i++, j += 3) {

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

      transition();

    }, false);
    sprite.src = OM.photos[OM.photos.length-1];


   



    // Sphere

    var radius = 750;

    for (var i = 0; i < particlesTotal; i++) {

      var phi = Math.acos(-1 + (2 * i) / particlesTotal) ;
      var theta = Math.sqrt(particlesTotal * Math.PI) * phi;

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

  this.addPhotos = function(){
    console.log('load more!')
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function transition() {
    var offset = current * particlesTotal * 3;
    var duration = 2000;

    for (var i = 0, j = offset; i < particlesTotal; i++, j += 3) {

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
      .onComplete(transition)
      .start();


  }

  function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();
    controls.update();

    // var time = performance.now();

    // for (var i = 0, l = objects.length; i < l; i++) {

    //   var object = objects[i];
    //   var scale = Math.sin((Math.floor(object.position.x) + time) * pulsingSpeed) * pulsingPower + 1;
    //   object.scale.set(scale, scale, scale);

    // }

    renderer.render(scene, camera);
  }

}