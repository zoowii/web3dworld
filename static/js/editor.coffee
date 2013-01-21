renderer = null
camera = null
scene = null
light = null
controls = null
ray = null # instance of THREE.Raycaster
projector = null # instanceof THREE.Projector
container = document.getElementById 'canvas-container'
width = container.clientWidth
height = window.innerHeight

helper = window.helper
# require three.helper.js

object3dArray = new helper.Set()
window['web3deditor'] = web3deditor = {}
web3deditor.events = events = {}
window['object3dArray'] = object3dArray
floorDepth = -300

jsonLoader = new THREE.JSONLoader

zero = new THREE.Vector3 0, 0, 0

generateObjectName = ->
  randN = parseInt(Math.random() * 1001) + 1
  "obj#{randN}"

web3deditor['addObjectToScene'] = (obj, posistion = zero, rotation = zero) ->
  if obj instanceof THREE.Geometry
    obj = new THREE.Mesh obj, new THREE.MeshBasicMaterial()
  else if obj instanceof THREE.Object3D and !(obj instanceof THREE.Scene)
    # do nothing
  else
    alert '只有除Scene以外的Object3D对象才可以被添加'
    return
  scene.add obj
  object3dArray.add obj
  if !(obj.name instanceof String)
    obj.name = generateObjectName()
  window[obj.name] = obj

web3deditor['loadObjectByUrl'] = loadObjectByUrl = (url, handler) ->
  jsonLoader.load url, handler

web3deditor['loadObjectById'] = loadObjectById = (id, handler) ->
  url = '/resource/id/' + id
  loadObjectByUrl url, handler

web3deditor['loadObjectByName'] = (name, handler) ->
  url = '/resource/name/' + name
  loadObjectByUrl url, handler

initThree = ->
  renderer = new THREE.WebGLRenderer {
  antialias: true,
  precision: 'highp',
  alpha: true,
  preserveDrawingBuffer: true,
  maxLights: 5
  }
  renderer.setSize width, height
  renderer.setClearColor(0xffffff, 0.1)
  # 设置canvas背景色，透明度
  container.appendChild renderer.domElement
  window['container'] = container

initScene = ->
  scene = new THREE.Scene
  window['scene'] = scene
  object3dArray.add scene

initCamera = ->
  view_angle = 45
  aspect = width / height
  near = 0.1
  far = 20000
  window['camera'] = camera = new THREE.PerspectiveCamera(view_angle, width / height, 0.1, 20000)
  object3dArray.add camera
  camera.position.set(200, 250, 0)
  #  camera.rotation.x = -2.5
  #  camera.rotation.y = 1.0
  #  camera.rotation.z = 2.5
  #  camera.up.x = 0
  #  camera.up.y = 1 # 设置相机的上为「y」轴方向
  #  camera.up.z = 0
  camera.lookAt scene.position

initLight = ->
  light = new THREE.PointLight(0xff0000, 1.0, 0)
  light.position.set(50, 50, 50)
  scene.add(light)
  scene.add new THREE.AmbientLight(0xff0000)

initEvents = ->
  # 绑定窗口大小变动事件，渲染效果随窗口大小变化而改变
  THREEx.WindowResize(renderer, camera)
  # 绑定鼠标滚轮事件，放大、缩小物体
  $(container).bind 'mousewheel', (event, delta, deltaX, deltaY) ->
    proportion = if delta > 0 then 1.05 else 0.95
    for o in object3dArray.data
      helper.scaleObject3DWithPosition o, proportion
  #      task = -> helper.scaleObject3DWithPosition o, proportion
  #      helper.runTimes task, 5, 5

  # 摄像机的身高降低的处理事件，待绑定到 html 事件上
  cameraUpHandler = ->
    helper.scaleObject3DWithPosition camera, 1.1
  cameraDownHandler = ->
    helper.scaleObject3DWithPosition camera, 0.9
  events['cameraUpHandler'] = cameraUpHandler
  events['cameraDownHandler'] = cameraDownHandler

initFloor = -> # init floor
  floorTexture = THREE.ImageUtils.loadTexture(static_url + 'img/grasslight-big.jpg')
  #  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  #  floorTexture.repeat.set 10, 10
  floorMaterial = new THREE.MeshBasicMaterial {
  map: floorTexture
  }
  floorGeometry = new THREE.PlaneGeometry 1000, 1000, 10, 10
  floor = new THREE.Mesh floorGeometry, floorMaterial
  floor.position.set 0, floorDepth, 0
  # 绿色, y轴为上方向，所以把地面放低一点，房子架在上面
  # 红色为 x 轴正方向
  # 蓝色为 z 轴正方向
  proportion = 4.0
  floor.rotation.x = 0
  floor.rotation.y = 0
  floor.rotation.z = 0
  helper.scaleObject3D floor, proportion
  floor.doubleSided = true
  window['floor'] = floor
  scene.add floor
  object3dArray.add floor

initSky = -> # init sky
  materialArray = []
  materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-xpos.png') }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-xneg.png') }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-ypos.png') }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-yneg.png') }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-zpos.png') }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-zneg.png') }))
  skyboxGeom = new THREE.CubeGeometry 5000, 5000, 5000, 1, 1, 1, materialArray
  skybox = new THREE.Mesh skyboxGeom, new THREE.MeshFaceMaterial()
  skybox.flipSided = true
  window['skybox'] = skybox
  scene.add skybox
  object3dArray.add skybox
  scene.fog = new THREE.FogExp2(0x9999ff, 0.00025)

initWalls = -> # init walls
  jsonLoader.load static_url + 'json/qiangbi1.json',
  (geom) ->
    wallTexture = THREE.ImageUtils.loadTexture static_url + 'img/sicai001.jpg'
    #    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
    #    wallTexture.repeat.set 10, 10
    wallMaterial = new THREE.MeshBasicMaterial {
    map: wallTexture
    }
    wallMesh = new THREE.Mesh geom, wallMaterial
    wallMesh.receiveShadow = true
    proportion = 1.5
    helper.scaleObject3D wallMesh, proportion
    scene.add wallMesh
    window['wall'] = wallMesh
    object3dArray.add wallMesh
    wallMesh.position.set proportion * 50, floorDepth, 0


# 加载周边环境
initOutsideEnv = ->
  # add 塔
  jsonLoader.load static_url + 'json/ta1.json',
  (geom) ->
    mate = new THREE.MeshBasicMaterial {
    color: "#ff0000"
    }
    taMesh = new THREE.Mesh geom, mate
    # 缩放程度
    proportion = 7.0
    taMesh.receiveShadow = true
    helper.scaleObject3D taMesh, proportion
    scene.add taMesh
    window['ta'] = taMesh
    object3dArray.add taMesh
    taMesh.position.set(-1000, floorDepth, -400)
    taMesh.rotation.set(0, 1.0, 0)

# 添加家具
initFurnitures = ->
  # add 沙发
  jsonLoader.load static_url + 'json/safa3.json',
  (geom) ->
    texture = THREE.ImageUtils.loadTexture static_url + 'img/bed_auto.jpg'
    material = new THREE.MeshBasicMaterial {
    map: texture
    }
    safaMesh = new THREE.Mesh geom, material
    safaMesh.receiveShadow = true
    helper.scaleObject3D safaMesh, 1.2
    scene.add safaMesh
    window['safa'] = safaMesh
    object3dArray.add safaMesh
    safaMesh.position.set(-50, floorDepth, 400)
    safaMesh.rotation.set(0, 3.2, 0)
  # add 门
  jsonLoader.load static_url + 'json/men1.json',
  (geom) ->
    mate = new THREE.MeshBasicMaterial {
#    map: THREE.ImageUtils.loadTexture static_url + 'img/bed_auto.jpg'
    }
    men = new THREE.Mesh geom, mate
    # 缩放程度
    proportion = 2.6
    men.receiveShadow = true
    helper.scaleObject3D men, proportion
    scene.add men
    window['men'] = men
    object3dArray.add men
    men.position.set(-100, floorDepth, -150)

# init the world
initWorld = ->
  initFloor()
  initSky()
  initWalls()
  initOutsideEnv()
  initFurnitures()

initViewport = ->
  ray = new THREE.Raycaster()
  projector = new THREE.Projector()
  picked = null
  selected = camera
  onMouseDown = (event) ->
    container.focus()
    event.preventDefault()
    if event.button == 0
      vector = new THREE.Vector3(
        ((event.clientX - container.offsetLeft) / container.offsetWidth) * 2 - 1,
        - ((event.clientY - container.offsetTop) / container.offsetHeight) * 2 + 1,
        0.5
      )
      projector.unprojectVector(vector, camera)
      ray.set(camera.position, vector.sub(camera.position).normalize())
      intersects = ray.intersectObjects(object3dArray.data, true) # TODO: objects?
      if intersects.length > 0
        controls.enabled = false
        picked = intersects[0].object
        root = null
        if picked.properties.isGizmo
          root = picked.properties.gizmoRoot
          selected = picked.properties.gizmoSubject
        else
          root = picked
          selected = picked
        console.log selected
      else
        controls.enabled = true
update = ->
  controls.update()

render = ->
  requestAnimationFrame render
  renderer.render scene, camera
  update()

threeStart = ->
  initThree()
  initScene()
  initCamera()
  initLight()
  initWorld()
  initEvents()
#  initViewport()
  window['controls'] = controls = new THREE.TrackballControls(camera, container)
  window['axes'] = axes = new THREE.AxisHelper()
  scene.add axes
  render()

threeStart()
