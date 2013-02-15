$(->
  static_url = '/static/'
  window.scenes = []
  window.floors = []
  helper = window.helper
  EditorViewport = Backbone.Model.extend {
  loadSceneFromJson: (json) ->
    this.loadFloorFromJson json.floor
    this.loadWallsFromJson json.walls
    this.loadSkyboxFromJson json.skybox
    this.loadFogFromJson json.fog
    this.loadLightsFromJson json.lights
  loadScene: (sceneUrl) ->
    if this.get('scene') == undefined
      this.initScene()
    helper.loadSceneJson(sceneUrl, _.bind(this.loadSceneFromJson, this))
  initialize: ->
    this.initUtils()
    this.initScene()
#    this.initLight()
    this.initDerectionHelp()
    this.initControls()
    this.initEvents()
#    this.loadWall(static_url + 'json/qiangbi2.json', static_url + 'img/sicai001.jpg', 3.0, {x: 1.57, y: 0, z: 0})
#    this.initSkybox()
#    this.initFog()
    this.initFloor()
#    this.loadFloor(static_url + 'img/diban1.jpg')
    this.loadScene(static_url + 'resources/scenes/test.json')
  initFloor: ->
    scene = this.get('scene')
    jsonLoader = this.get('jsonLoader')
    floorTexture = THREE.ImageUtils.loadTexture(static_url + 'img/checkerboard.jpg')
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
    floorTexture.repeat.set 10, 10
    floorMaterial = new THREE.MeshBasicMaterial {
    map: floorTexture
    }
    floorGeometry = new THREE.PlaneGeometry 2000, 2000, 10, 10
    floor = new THREE.Mesh floorGeometry, floorMaterial
    floor.position.set 0, 0, 0
    proportion = 1.0
    helper.scaleObject3D floor, proportion
    floor.doubleSided = true
    scene.add floor
    this.set('floorboard', floor)
  loadFloorFromJson: (json) ->
    if this.get('floorboard') == undefined
      this.initFloor()
    scene = this.get('scene')
    floorboard = this.get('floorboard')
    floorboard.visible = false
    oldFloor = this.get('floor')
    if oldFloor != undefined
      scene.remove oldFloor
      this.set('floor', undefined)
    geom = new THREE.PlaneGeometry json.width, json.height, json.widthSegments, json.heightSegments
    material = helper.loadMaterialFromJson(json.material)
    floor = new THREE.Mesh geom, material
    scene.add floor
    helper.updateMeshFromJson(floor, json)
    this.set 'floor', floor
  loadFloor: (textureUrl, width = 2000, height = 2000) ->
    scene = this.get('scene')
    floorboard = this.get('floorboard')
    floorboard.visible = false
    oldFloor = this.get('floor')
    if oldFloor != undefined
      scene.remove(oldFloor)
      this.set('floor', undefined)
    geom = new THREE.PlaneGeometry width, height, 10, 10
    texture = THREE.ImageUtils.loadTexture textureUrl
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set width / 50, height / 50
    material = new THREE.MeshBasicMaterial {
    map: texture
    }
    floor = new THREE.Mesh geom, material
    floor.doubleSided = true
    scene.add floor
    this.set('floor', floor)
  loadWallsFromJson: (json) ->
    jsonLoader = this.get 'jsonLoader'
    scene = this.get 'scene'
    for wallJson in json
      wall = helper.loadWallFromJson(wallJson)
      scene.add wall
  loadWall: (geomUrl, textureUrl, proportion = 1.0, rotation = {x: 0, y: 0, z: 0}) ->
    jsonLoader = this.get('jsonLoader')
    scene = this.get('scene')
    jsonLoader.load(geomUrl, (geom) ->
      texture = THREE.ImageUtils.loadTexture(textureUrl)
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set 10, 10
      material = new THREE.MeshBasicMaterial {
      #        map: texture
      color: 0xff0000,
      transparent: true,
      opacity: 0.5
      }
      mesh = new THREE.Mesh geom, material
      mesh.receiveShadow = true
      mesh.doubleSided = true
      mesh.rotation.x = rotation.x
      mesh.rotation.y = rotation.y
      mesh.rotation.z = rotation.z
      mesh.scale.x *= proportion
      mesh.scale.y *= proportion
      mesh.scale.z /= proportion
      mesh.castShadow = true
      scene.add mesh
    )
  loadSkyboxFromJson: (json) ->
    scene = this.get('scene')
    geom = new THREE.CubeGeometry json.width, json.height, json.depth
    material = helper.loadMaterialFromJson(json.material)
    skybox = new THREE.Mesh geom, material
    helper.updateMeshFromJson(skybox, json)
    scene.add skybox
    this.set 'skybox', skybox
  initSkybox: ->
    scene = this.get('scene')
    geom = new THREE.CubeGeometry 10000, 10000, 10000
    material = new THREE.MeshBasicMaterial {
    color: "#9999ff"
    }
    skybox = new THREE.Mesh geom, material
    skybox.flipSided = true
    scene.add skybox
    this.set 'skybox', skybox
  loadFogFromJson: (json) ->
    scene = this.get('scene')
    scene.fog = new THREE.FogExp2 json.color, json.density
  initFog: ->
    scene = this.get('scene')
    scene.fog = new THREE.FogExp2("#9999ff", 0.00025)
  initDerectionHelp: ->
    # 绿色为 y 轴正方向
    # 红色为 x 轴正方向
    # 蓝色为 z 轴正方向
    scene = this.get('scene')
    helper.addAxis scene, 2.0
    selectionAxis = new THREE.AxisHelper(100)
    selectionAxis.material.depthTest = false
    selectionAxis.material.transparent = true
    selectionAxis.matrixAutoUpdate = false
    selectionAxis.visible = false
    scene.add(selectionAxis)
  initUtils: ->
    this.set('jsonLoader', new THREE.JSONLoader)
  initScene: ->
    scene = new THREE.Scene
    this.set('scene', scene)
  initControls: ->
    scene = this.get('scene')
    # 用来选择Mesh的辅助平面
    intersectionPlane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 8, 8))
    intersectionPlane.visible = false
    scene.add intersectionPlane
    this.set('intersectionPlane', intersectionPlane)
  loadLightsFromJson: (json) ->
    scene = this.get 'scene'
    if this.get('lights') == undefined
      this.set('lights', [])
    lights = this.get('lights')
    for lightJson in json
      light = helper.loadLightFromJson lightJson
      lights.push light
      scene.add light
      helper.updateMeshFromJson(light, lightJson)
  initLight: ->
    scene = this.get('scene')
    light = new THREE.DirectionalLight("#ff0000", 1.0, 0)
    this.set('light', light)
    light.position.set(500, 250, 500)
    scene.add(light)
    scene.add new THREE.AmbientLight("#ff0000")
  onAddMeshByJson: (meshJson) ->
    scene = this.get 'scene'
    switch meshJson.meshType
      when 'wall' then mesh = helper.loadWallFromJson(meshJson); scene.add mesh
      when 'walls' then this.loadWallsFromJson(meshJson)
      # else # TODO

  initEvents: ->
    this.on('addMeshByJson', this.onAddMeshByJson, this)
  }

  EditorViewportDelegate = Backbone.Model.extend {
    initialize: ->
      this.set('viewports', [])
      this.on('all', ->
        _arguments = _.toArray(arguments)
        viewports = this.get('viewports')
        _.each(viewports, (viewport) ->
          viewport.trigger.apply(viewport, _arguments)
        )
      )
    addViewport: (viewport) ->
      viewports = this.get('viewports')
      viewports.push viewport
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
  initProjector: ->
    scene = this.model.get('scene')
    # TODO: move these code to Model
    intersectionPlane = this.model.get('intersectionPlane')
    ray = new THREE.Raycaster()
    projector = new THREE.Projector()
    offset = new THREE.Vector3()
    cameraChanged = false
    helpersVisible = true
    picked = null
    selected = this.camera
    _this = this
    this.$el.mousedown((event) ->
      _this.el.focus()
      if !_this.selectionAvailable
        return
      if event.button == 0
        vector = new THREE.Vector3(
          ( event.offsetX / _this.width ) * 2 - 1,
        -( event.offsetY / _this.height ) * 2 + 1,
        0.5
        )
        projector.unprojectVector(vector, _this.camera)
        ray.set(_this.camera.position, vector.sub(_this.camera.position).normalize())
        intersects = ray.intersectObjects(scene.children, true)
        # objects
        if intersects.length > 0
          if _this.controls
            _this.controls.enabled = false
          picked = intersects[ 0 ].object
          if picked.properties.isGizmo
            root = picked.properties.gizmoRoot
            selected = picked.properties.gizmoSubject
          else
            root = picked
            selected = picked
          intersectionPlane.position.copy(root.position)
          intersectionPlane.lookAt(_this.camera.position)
          console.log 'mouse down: ', selected
          # selected is the mesh your mouse selected
          # TODO dispatch the mousedown event to the selected mesh
          #          intersects = ray.intersectObject(intersectionPlane)
          #          offset.copy(intersects[ 0 ].point).sub(intersectionPlane.position)
          _this.mousemoveAvailable = _this.mouseupavailable = true
    )
    this.$el.mousemove((event) ->
      if _this.mousemoveAvailable
        # do the tasks after mouse down
        vector = new THREE.Vector3(
          ( event.offsetX / _this.width ) * 2 - 1,
        -( event.offsetY / _this.height ) * 2 + 1,
        0.5
        )
        projector.unprojectVector(vector, _this.camera)
        ray.set(_this.camera.position, vector.sub(_this.camera.position).normalize())
        intersects = ray.intersectObject(intersectionPlane)
        if intersects.length > 0
          intersects[0].point.sub offset
          if picked.properties.isGizmo
            picked.properties.gizmoRoot.position.copy intersects[0].point
            picked.properties.gizmoSubject.position.copy intersects[0].point
            # TODO: use mouse move subject
            console.log 'mouse move subject: ', picked.properties.gizmoSubject
          else
            # 移动选中的
            picked.position.copy intersects[0].point
            # TODO: use mouse move subject
            console.log 'mouse move subject: ', picked.properties.gizmoSubject
          _this.update()
    )
    this.$el.mouseup((event) ->
      if _this.mouseupavailable
        _this.mousemoveAvailable = false
        _this.mouseupavailable = false
        if _this.controls != undefined
          _this.controls.enabled = true
    )
  update: ->
    this.renderOnce()
  initialize: ->
    this.width = this.options.width
    this.height = this.options.height
    this.selectionAvailable = false
    this.initCamera()
    this.initProjector()
    this.initRenderer()
    this.initEvents()
    this.animate()
  animate: ->
    animate(this)
  renderOnce: ->
    this.renderer.render this.model.get('scene'), this.camera
  initEvents: ->
    _model = this.model
    _camera = this.camera
  # comment below codes because use TracckballControls.js's control system
  #    this.$el.bind('mousewheel', (event, delta) ->
  #      if delta < 0
  #        _camera.position.x *= 1.1
  #        _camera.position.y *= 1.1
  #        _camera.position.z *= 1.1
  #      else
  #        _camera.position.x *= 0.9
  #        _camera.position.y *= 0.9
  #        _camera.position.z *= 0.9
  #    )
  }
  Editor2DView = EditorView.extend {
  initCamera: ->
    view_angle = 100
    aspect = this.width / this.height
    near = 1.0
    far = 5000
    this.camera = camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far)
    camera.position.set(0, 0, 500)
    camera.rotation.set(-1.57, 0, 0)
    camera.up.set(0, 0, 1)
    camera.lookAt @model.get('scene').position
  initEvents: ->
    _model = this.model
    _camera = this.camera
    this.$el.bind('mousewheel', (event, delta) ->
      if delta < 0
        _camera.position.x *= 1.1
        _camera.position.y *= 1.1
        _camera.position.z *= 1.1
      else
        _camera.position.x *= 0.9
        _camera.position.y *= 0.9
        _camera.position.z *= 0.9
    )
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
    camera.position.set(500, 1500, 500)
    camera.rotation.set(-0.46, 0.73, 0.32)
    camera.up.set(0, 0, 1)
    camera.lookAt @model.get('scene').position
    this.controls = controls = new THREE.TrackballControls camera, this.el
    controls.enabled = true
  initEvents: ->
    # comment below codes because use TracckballControls.js's control system
    #    EditorView.prototype.initEvents.apply(this, arguments)
    #    centerPos = {x: this.width / 2, y: this.height / 2}
    #    helper.bindMouseDrag(this.el, (initPos, nowPos, delta) ->
    #      relativeToCenterInitPos = {x: initPos.x - centerPos.x, y: centerPos.y - initPos.y}
    #      relativeToCenterDelta = {x: delta.x, y: - delta.y}
    #      # TODO: 处理3D视图的鼠标拖拽时的相机的移动
    #    )
  animate: ->
    editor3dviewanimate(this)
  }

  animate = (view) ->
    requestAnimationFrame -> animate(view)
    view.update()
  editor3dviewanimate = (view) ->
    requestAnimationFrame -> editor3dviewanimate(view)
    view.update()
    view.controls.update()

  if window.editor == undefined
    window.editor = {}
  editor = window.editor
  viewport2d = new EditorViewport
  viewport3d = new EditorViewport
  viewportDelegate = new EditorViewportDelegate
  viewportDelegate.addViewport viewport2d
  viewportDelegate.addViewport viewport3d
  width = $(".editor_panel").width()
  height = $(".editor_panel").height()
  editor2dview = new Editor2DView {
  el: $(".edit_area"), model: viewport2d, width: width, height: height
  }
  editor3dview = new Editor3DView {
  el: $(".view_area"), model: viewport3d, width: width, height: height
  }
  editor['view2d'] = editor2dview
  editor['view3d'] = editor3dview

  # init dom events
  $(document).on('click', '.addToScene', ->
    _this = this
    $_this = $(this)
    type = $_this.attr('data-type')
    url = $_this.attr('data-url')
    if _.indexOf(['wall'], type) >= 0
      helper.getJSON url, (json) ->
        viewportDelegate.trigger('addMeshByJson', json)
  )
)