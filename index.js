/**
 * Capture Mouse component.
 *
 * Control entity rotation directly with captured mouse.
 *
 * @namespace capture-mouse
 * @param {bool} [enabled=true] - To completely enable or disable the controls
 * @param {number} [sensitivity=1] - How fast the object rotates in response to mouse
 */

 // To avoid recalculation at every mouse movement tick
 var PI_2 = Math.PI / 2;


module.exports.component = {
  dependencies: ['rotation'],

  schema: {
    enabled: { default: true },
    sensitivity: { default: 1 },
  },

  init: function () {
    console.log('init called');
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
    this.isSupported = 'pointerLockElement' in document ||
       'mozPointerLockElement' in document ||
       'webkitPointerLockElement' in document;
    this.bindFunctions();
    if (this.isSupported) {
      this.initListeners();
    }
  },

  initListeners: function () {
    var scene = this.el.sceneEl;
    var canvas = scene.canvas;
    document.addEventListener('pointerlockchange', this.onLockChange.bind(this), false);
    document.addEventListener('mozpointerlockchange', this.onLockChange.bind(this), false);
    document.addEventListener('webkitpointerlockchange', this.onLockChange.bind(this), false);

    document.addEventListener('pointerlockerror', this.onLockError, false);
    document.addEventListener('mozpointerlockerror', this.onLockError, false);
    document.addEventListener('webkitpointerlockerror', this.onLockError, false);
    canvas.onclick = this.captureMouse.bind(this);
    scene.addBehavior(this);
  },

  bindFunctions: function () {
    this.onMouseMoveL = this.onMouseMove.bind(this);
  },

  remove: function () {
    var scene = this.el.sceneEl;
    this.releaseMouse();
    scene.removeBehavior(this);
  },

  captureMouse: function () {
    var scene = this.el.sceneEl;
    scene.requestPointerLock = scene.canvas.requestPointerLock ||
      scene.canvas.mozRequestPointerLock ||
      scene.canvas.webkitRequestPointerLock;
    // Ask the browser to lock the pointer
    scene.requestPointerLock();
  },

  releaseMouse: function () {
    document.exitPointerLock = document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
    document.exitPointerLock();
  },

  onLockChange: function (e) {
    var scene = this.el.sceneEl;
    if (document.pointerLockElement === scene ||
      document.mozPointerLockElement === scene ||
      document.webkitPointerLockElement === scene) {
      // Pointer was just locked
      // Enable the mousemove listener
      document.addEventListener('mousemove', this.onMouseMoveL, false);
    } else {
      // Pointer was just unlocked
      // Disable the mousemove listener
      console.log("pointer unlock");
      document.removeEventListener('mousemove', this.onMouseMoveL, false);
    }
  },

  onLockError: function (e) {
    console.trace(e);
  },

  update: function () {
    if (!this.data.enabled) { return; }
    this.updateOrientation();
  },

  updateOrientation: (function () {
    var hmdEuler = new THREE.Euler();
    hmdEuler.order = 'YXZ';
    return function () {
      var pitchObject = this.pitchObject;
      var yawObject = this.yawObject;
      this.el.setAttribute('rotation', {
        x: THREE.Math.radToDeg(pitchObject.rotation.x),
        y: THREE.Math.radToDeg(yawObject.rotation.y)
      });
    };
  })(),

  onMouseMove: function (e) {
    if (!this.data.enabled) {return;}
    var movementX = e.movementX ||
      e.mozMovementX ||
      e.webkitMovementX ||
      0;
    var movementY = e.movementY ||
      e.mozMovementY ||
      e.webkitMovementY ||
      0;
    this.yawObject.rotation.y -= movementX * 0.002 * this.data.sensitivity;
    this.pitchObject.rotation.x -= movementY * 0.002 * this.data.sensitivity;
    this.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
  }
};
