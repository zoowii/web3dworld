$ ->
  web3deditor = window['web3deditor']
  events = web3deditor['events']
  applyCameraPositionBtn = $("#applyCameraPositionBtn")
  applyCameraPositionBtn.click ->
    x = $("#cameraPositionXInput").val()
    y = $("#cameraPositionYInput").val()
    z = $("#cameraPositionZInput").val()
    window.camera.position.set(x, y, z)
  applyCommonAttributeBtn = $("#applyCommonAttributeBtn")
  applyCommonAttributeBtn.click ->
    name = $("#commonNameInput").val()
    posX = $("#commonPositionXInput").val()
    posY = $("#commonPositionYInput").val()
    posZ = $("#commonPositionZInput").val()
    rotX = $("#commonRotationXInput").val()
    rotY = $("#commonRotationYInput").val()
    rotZ = $("#commonRotationZInput").val()
    window[name].position.set(posX, posY, posZ)
    window[name].rotation.set(rotX, rotY, rotZ)
  cameraUpBtn = $("#cameraUpBtn")
  cameraDownBtn = $("#cameraDownBtn")
  cameraUpBtn.click ->
    events['cameraUpHandler']()
  cameraDownBtn.click ->
    events['cameraDownHandler']()
  addMeshByUploadBtn = $("#addMeshByUploadBtn")
  addMeshFromUploadedBtn = $("#addMeshFromUploadedBtn")
  toAddResourceNameInput = $("#toAddResourceNameInput")
  addObject3DBtn = $("#addObject3DBtn")
  addObject3DBtn.click ->
    name = toAddResourceNameInput.val()
    if name.length <= 0
      return
    web3deditor.loadObjectByName name, (geom) ->
      web3deditor.addObjectToScene geom
  addPlaneBtn = $("#addPlaneBtn")
  addCubeBtn = $("#addCubeBtn")
  addCylinderBtn = $("#addCylinderBtn")
  addSphereBtn = $("#addSphereBtn")
  addPlaneBtn.click ->
    web3deditor.addObjectToScene new THREE.PlaneGeometry(100, 100, 100, 100)
  addCubeBtn.click ->
    web3deditor.addObjectToScene new THREE.CubeGeometry(100, 100, 100, 10, 10, 10)
  addCylinderBtn.click ->
    web3deditor.addObjectToScene new THREE.CylinderGeometry(50, 50, 200, 50, 50)
  addSphereBtn.click ->
    web3deditor.addObjectToScene new THREE.SphereGeometry(100)
