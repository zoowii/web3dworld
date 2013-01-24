container2D = $("#2dview")[0]
container3D = $("#3dview")[0]

SIGNALS = window.signals
signals = {
# actions
cloneSelectedObject: new SIGNALS.Signal(),
removeSelectedObject: new SIGNALS.Signal(),
exportGeometry: new SIGNALS.Signal(),
exportScene: new SIGNALS.Signal(),
toggleHelpers: new SIGNALS.Signal(),
resetScene: new SIGNALS.Signal(),
# notifications
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
}

