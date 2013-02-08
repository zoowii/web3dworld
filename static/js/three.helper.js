// Generated by CoffeeScript 1.4.0
(function() {
  var Set, helper;

  if (window.helper === void 0) {
    window.helper = {};
  }

  helper = window.helper;

  helper.scaleObject3D = function(mesh, proportion) {
    if (proportion == null) {
      proportion = 1.0;
    }
    mesh.scale.x *= proportion;
    mesh.scale.y *= proportion;
    return mesh.scale.y *= proportion;
  };

  helper.scaleObject3DWithPosition = function(mesh, proportion) {
    if (proportion == null) {
      proportion = 1.0;
    }
    mesh.scale.x *= proportion;
    mesh.scale.y *= proportion;
    mesh.scale.y *= proportion;
    mesh.position.x *= proportion;
    mesh.position.y *= proportion;
    return mesh.position.y *= proportion;
  };

  helper.addAxis = function(scene, proportion) {
    var axisLenght, axisWidth, xUpD, yUpD, zUpD;
    if (proportion == null) {
      proportion = 1.0;
    }
    axisWidth = 5;
    axisLenght = 5000;
    xUpD = new THREE.Mesh(new THREE.CubeGeometry(axisLenght, axisWidth, axisWidth), new THREE.MeshBasicMaterial({
      color: '#ff0000'
    }));
    yUpD = new THREE.Mesh(new THREE.CubeGeometry(axisWidth, axisLenght, axisWidth), new THREE.MeshBasicMaterial({
      color: '#00ff00'
    }));
    zUpD = new THREE.Mesh(new THREE.CubeGeometry(axisWidth, axisWidth, axisLenght), new THREE.MeshBasicMaterial({
      color: '#0000ff'
    }));
    scene.add(xUpD);
    scene.add(yUpD);
    scene.add(zUpD);
    xUpD.position.set(axisLenght / 2, 0, 0);
    yUpD.position.set(0, axisLenght / 2, 0);
    zUpD.position.set(0, 0, axisLenght / 2 + 0);
    helper.scaleObject3DWithPosition(xUpD, proportion);
    helper.scaleObject3DWithPosition(yUpD, proportion);
    helper.scaleObject3DWithPosition(zUpD, proportion);
    return {
      x: xUpD,
      y: yUpD,
      z: zUpD
    };
  };

  helper.runTimes = function(task, times, interval) {
    var newTask;
    if (times == null) {
      times = 1;
    }
    if (interval == null) {
      interval = 0;
    }
    if (times <= 0) {
      return;
    }
    task();
    interval = interval < 0 ? 0 : interval;
    newTask = function() {
      return helper.runTimes(task, times - 1, interval);
    };
    return setTimeout(newTask, interval);
  };

  helper.Set = Set = (function() {

    function Set() {
      this.data = [];
    }

    Set.prototype.add = function(ele) {
      if (!(_.contains(this.data, ele))) {
        return this.data.push(ele);
      }
    };

    Set.prototype.remove = function(ele) {
      if (_.contains(this.data, ele)) {
        return this.data = this.data.filter(function(e) {
          return e !== ele;
        });
      }
    };

    return Set;

  })();

  helper.bindMouseDrag = function(el, handler) {
    var $el, delta, isMouseDown, lastPosition, nowPosition;
    isMouseDown = false;
    lastPosition = {
      x: 0,
      y: 0
    };
    nowPosition = {
      x: 0,
      y: 0
    };
    delta = {
      x: 0,
      y: 0
    };
    $el = $(el);
    return $el.mousedown(function(e) {
      lastPosition.x = e.offsetX;
      lastPosition.y = e.offsetY;
      return isMouseDown = true;
    }).mousemove(function(e) {
      var oldLastPosition;
      if (isMouseDown) {
        nowPosition.x = e.offsetX;
        nowPosition.y = e.offsetY;
        delta = {
          x: nowPosition.x - lastPosition.x,
          y: nowPosition.y - lastPosition.y
        };
        oldLastPosition = _.clone(lastPosition);
        lastPosition = _.clone(nowPosition);
        return handler(oldLastPosition, nowPosition, delta);
      }
    }).mouseup(function() {
      return isMouseDown = false;
    }).mouseleave(function() {
      return isMouseDown = false;
    });
  };

}).call(this);
