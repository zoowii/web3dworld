$(->
  window.scenes = []
  window.floors = []
  EditorViewport = Backbone.Model.extend {
  initialize: ->
    this.initUtils()
    this.initScene()
    this.initLight()
    this.initDerectionHelp()
    geom = new THREE.CubeGeometry
    mesh = new THREE.Mesh geom
    scene = this.get('scene')
    window.scenes.push(scene)
    window.cube = mesh
    scene.add mesh
    jsonLoader = this.get('jsonLoader')
    static_url = '/static/'
    floorTexture = THREE.ImageUtils.loadTexture(static_url + 'img/grasslight-big.jpg')
    #  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
    #  floorTexture.repeat.set 10, 10
    floorMaterial = new THREE.MeshBasicMaterial {
    map: floorTexture
    }
    floorGeometry = new THREE.PlaneGeometry 1000, 1000, 10, 10
    floor = new THREE.Mesh floorGeometry, floorMaterial
    floor.position.set 0, 0, 0
    # 绿色, y轴为上方向，所以把地面放低一点，房子架在上面
    # 红色为 x 轴正方向
    # 蓝色为 z 轴正方向
    proportion = 2.0
    floor.rotation.x = -1.57
    floor.rotation.y = 0
    floor.rotation.z = 0
    helper.scaleObject3D floor, proportion
    floor.doubleSided = true
    window.floors.push(floor)
    scene.add floor
    materialArray = []
    materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-xpos.png') }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-xneg.png') }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-ypos.png') }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-yneg.png') }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-zpos.png') }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(static_url + 'img/dawnmountain-zneg.png') }))
    skyboxGeom = new THREE.CubeGeometry 5000, 5000, 5000, 1, 1, 1
    skybox = new THREE.Mesh skyboxGeom, new THREE.MeshFaceMaterial(materialArray)
    skybox.flipSided = true
    scene.add skybox
    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025)
    jsonLoader.load static_url + 'json/ta1.json',
    (geom) ->
      mate = new THREE.MeshBasicMaterial {
      color: "#ff0000"
      }
      taMesh = new THREE.Mesh geom, mate
      # 缩放程度
      proportion = 4.0
      taMesh.receiveShadow = true
      helper.scaleObject3D taMesh, proportion
      scene.add taMesh
      window['ta'] = taMesh
      object3dArray.add taMesh
      taMesh.position.set(-1000, floorDepth, -400)
      taMesh.rotation.set(0, 1.0, 0)

  initDerectionHelp: ->
    scene = this.get('scene')
    xUpD = new THREE.Mesh new THREE.CubeGeometry, new THREE.MeshBasicMaterial { color: '#ff0000'}
    scene.add(xUpD)
  initUtils: ->
    this.set('jsonLoader', new THREE.JSONLoader)
  initScene: ->
    scene = new THREE.Scene
    this.set('scene', scene)
  initLight: ->
    scene = this.get('scene')
    light = new THREE.DirectionalLight(0xff0000, 1.0, 0)
    this.set('light', light)
    light.position.set(500, 250, 500)
    scene.add(light)
    scene.add new THREE.AmbientLight(0xff0000)
  }
  EditorView = Backbone.View.extend {
  initRenderer: ->
    this.renderer = renderer = new THREE.WebGLRenderer {
    antialias: true,
    precision: 'highp',
    alpha: true,
    preserveDrawingBuffer: true,
    maxLights: 5
    }
    renderer.setSize this.width, this.height
    renderer.setClearColor(0xffffff, 0.1)
    # 设置canvas背景色，透明度
    this.el.appendChild renderer.domElement
  initCamera: ->
  initialize: ->
    this.width = this.$el.width()
    this.height = this.$el.height()
    this.initCamera()
    this.initRenderer()
    webglrender(this)
  }
  Editor2DView = EditorView.extend {
  initCamera: ->
    view_angle = 100
    aspect = this.width / this.height
    near = 1.0
    far = 5000
    this.camera = camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far)
    camera.position.set(0, 850, 0)
    camera.rotation.set(-1.57, 0, 0)
    camera.lookAt @model.get('scene').position
  }

  Editor3DView = EditorView.extend {
  initialize: ->
    EditorView.prototype.initialize.apply(this, arguments)
  initCamera: ->
    view_angle = 50
    aspect = this.width / this.height
    near = 1.0
    far = 5000
    this.camera = camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far)
    camera.position.set(500, 1000, 500)
    camera.rotation.set(-0.46, 0.73, 0.32)
    camera.lookAt @model.get('scene').position
  }

  webglrender = (view) ->
    requestAnimationFrame -> webglrender(view)
    view.renderer.render view.model.get('scene'), view.camera

  viewport = new EditorViewport
  editor2dview = new Editor2DView {
  el: $(".edit_area"), model: viewport
  }
  editor3dview = new Editor3DView {
  el: $(".view_area"), model: new EditorViewport
  }
)