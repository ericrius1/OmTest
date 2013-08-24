var OM = OM || {};
OM.Galaxy = new function() {

  var camera, scene, renderer;
  var controls;

  var maxNodes = 111;
  var radius = maxNodes * 15;
  var sprites = [];
  var instaSprites = [];
  var positions = [];
  var objects = [];
  var current = 0;
  var pulsingPower = 0.02
  var pulsingSpeed = 0.002

  this.init = function() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(-135, 340, -2720);
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();

    var flowerSprite = document.createElement('img');
    flowerSprite.src = 'assets/flower.jpg';
    for (var i = 0; i < OM.photos.length; i++) {
      var sprite = document.createElement('img');
      sprite.src = OM.photos[i];
      instaSprites.push(sprite);
    }
    flowerSprite.addEventListener('load', function(event) {
      for (var i = 0; i < maxNodes; i++) {
        sprites.push(flowerSprite);
        var canvas = document.createElement('canvas');
        console.log(sprite);
        canvas.width = flowerSprite.width;
        canvas.height = flowerSprite.height;
        var context = canvas.getContext('2d');
        context.drawImage(flowerSprite, 0, 0);
        var object = new THREE.CSS3DSprite(canvas);
        object.position.x = Math.random() * 4000 - 2000,
        object.position.y = Math.random() * 4000 - 2000,
        object.position.z = Math.random() * 4000 - 2000
        scene.add(object);

        objects.push(object);
      }

      initalAnimation();


    }, false);



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
      var offset = current * maxNodes * 3;
      var duration = 500;

      for (var i = 0, j = offset; i < maxNodes; i++, j += 3) {

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
        .onComplete(loadInstagramPhotos)
        .start();
    }

    function enterPhotoTween(position){

    }

    function loadInstagramPhotos(){
      console.log('load');
      for(var i = 0; i < OM.photos.length; i++){
        //delete old object
        var oldObject = objects[i];
        scene.remove(oldObject);


        //add new one
        var canvas = document.createElement('canvas');
        canvas.width = instaSprites[i].width;
        canvas.height = instaSprites[i].height;
        var context = canvas.getContext('2d');
        context.drawImage(instaSprites[i], 0, 0);
        object = new THREE.CSS3DSprite(canvas);
        debugger;
        object.position = oldObject.position;
        scene.add(object);
        objects.unshift(object);
        objects.splice(i, 1);
        
      }
    }


    function animate() {

      requestAnimationFrame(animate);

      TWEEN.update();
      controls.update();

      renderer.render(scene, camera);
    }

  this.addPhotos = function() {
    OM.photos.push(OM.photos[0]);
    sprites

  }

}