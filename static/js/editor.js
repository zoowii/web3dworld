// Generated by CoffeeScript 1.4.0
(function() {
  var SIGNALS, container2D, container3D, signals;

  container2D = $("#2dview")[0];

  container3D = $("#3dview")[0];

  SIGNALS = window.signals;

  signals = {
    cloneSelectedObject: new SIGNALS.Signal(),
    removeSelectedObject: new SIGNALS.Signal(),
    exportGeometry: new SIGNALS.Signal(),
    exportScene: new SIGNALS.Signal(),
    toggleHelpers: new SIGNALS.Signal(),
    resetScene: new SIGNALS.Signal(),
    sceneAdded: new SIGNALS.Signal(),
    sceneChanged: new SIGNALS.Signal(),
    objectAdded: new SIGNALS.Signal(),
    objectSelected: new SIGNALS.Signal(),
    objectChanged: new SIGNALS.Signal(),
    materialChanged: new SIGNALS.Signal(),
    clearColorChanged: new SIGNALS.Signal(),
    cameraChanged: new SIGNALS.Signal(),
    fogTypeChanged: new SIGNALS.Signal(),
    fogColorChanged: new SIGNALS.Signal(),
    fogParametersChanged: new SIGNALS.Signal(),
    windowResize: new SIGNALS.Signal()
  };

}).call(this);
