if window.helper == undefined
  window.helper =
    {}

helper = window.helper

store =
  {}
# store cache here. TODO: now needn't here
jsonStore =
  {}
# store ajax got json object here. TODO: delete some too old cache when memory limit, and retrive and store them when needed again
helper.getJSON = (url, handler) ->
  if jsonStore[url] != undefined
    handler(jsonStore[url])
  else
    $.getJSON(url, (json) ->
      jsonStore[url] = json
      handler(json)
    )
helper.storeSet = (name, obj) ->
  store[name] = obj
helper.storeGet = (name) ->
  return store[name]

helper.scaleObject3D = (mesh, proportion = 1.0) ->
  mesh.scale.x *= proportion
  mesh.scale.y *= proportion
  mesh.scale.y *= proportion

helper.scaleObject3DWithPosition = (mesh, proportion = 1.0) ->
  mesh.scale.x *= proportion
  mesh.scale.y *= proportion
  mesh.scale.y *= proportion
  mesh.position.x *= proportion
  mesh.position.y *= proportion
  mesh.position.y *= proportion

helper.addAxis = (scene, proportion = 1.0) ->
  axisWidth = 5
  axisLenght = 5000
  xUpD = new THREE.Mesh new THREE.CubeGeometry(axisLenght, axisWidth,
                                               axisWidth), new THREE.MeshBasicMaterial { color: '#ff0000'}
  yUpD = new THREE.Mesh new THREE.CubeGeometry(axisWidth, axisLenght,
                                               axisWidth), new THREE.MeshBasicMaterial {color: '#00ff00'}
  zUpD = new THREE.Mesh new THREE.CubeGeometry(axisWidth, axisWidth,
                                               axisLenght), new THREE.MeshBasicMaterial {color: '#0000ff'}
  scene.add xUpD
  scene.add yUpD
  scene.add zUpD
  xUpD.position.set axisLenght / 2, 0, 0
  yUpD.position.set 0, axisLenght / 2, 0
  zUpD.position.set 0, 0, axisLenght / 2 + 0
  helper.scaleObject3DWithPosition(xUpD, proportion)
  # x axis
  helper.scaleObject3DWithPosition(yUpD, proportion)
  # y axis
  helper.scaleObject3DWithPosition(zUpD, proportion)
  # z axis
  return {
  x: xUpD, y: yUpD, z: zUpD
  }

helper.runTimes = (task, times = 1, interval = 0) -> # task: 要执行的函数, times: 要执行的次数, interval: 间隔的时间
  if times <= 0
    return
  task()
  interval = if interval < 0 then 0 else interval
  newTask = ->
    helper.runTimes task, times - 1, interval
  setTimeout newTask, interval

helper.Set = class Set
  constructor: () ->
    this.data = []
  add: (ele) ->
    if !(_.contains this.data, ele)
      this.data.push ele
  remove: (ele) ->
    if _.contains this.data, ele
      this.data = this.data.filter (e) ->
        e != ele

helper.bindMouseDrag = (el, handler) ->
  isMouseDown = false
  lastPosition = {x: 0, y: 0}
  nowPosition = {x: 0, y: 0}
  delta = {x: 0, y: 0}
  $el = $(el)
  $el.mousedown((e) ->
    lastPosition.x = e.offsetX
    lastPosition.y = e.offsetY
    isMouseDown = true
  ).mousemove((e) ->
    if isMouseDown
      nowPosition.x = e.offsetX
      nowPosition.y = e.offsetY
      delta =
        {x: nowPosition.x - lastPosition.x, y: nowPosition.y - lastPosition.y}
      oldLastPosition = _.clone(lastPosition)
      lastPosition = _.clone(nowPosition)
      handler(oldLastPosition, nowPosition, delta)
  ).mouseup(->
    isMouseDown = false
  ).mouseleave(->
    isMouseDown = false
  )

defaultSceneJson = null
static_url = '/static/'
defaultSceneJsonUrl = static_url + 'resources/scenes/default.json'
processLoadedSceneJson = (json, handler) ->
  json = _.extend({}, defaultSceneJson, json)
  handler(json)
helper.loadSceneJson = (url, handler) ->
  helper.getJSON url, (json) ->
    if defaultSceneJson == null
      helper.getJSON defaultSceneJsonUrl, (_json) ->
        defaultSceneJson = _json
        processLoadedSceneJson(json, handler)
    else
      processLoadedSceneJson(json, handler)

helper.loadTextureFromJson = (json) ->
  if json.from_type == 'url'
    texture = THREE.ImageUtils.loadTexture json.url
    if json.repeat
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set json.repeat.width, json.repeat.height
    return texture
# TODO: else ...

directExtendObjProperties = (desObj, srcObj, properties) ->
  for property in properties
    if srcObj[property] != undefined
      desObj[property] = srcObj[property]

# 可以使用extend: <name> 等方式减少资源重复量，但使用加载的json数据前先要调用此方法预处理一下还原成完整的对象
helper.preprocessJsonResource = (json, options)->
  if _.isString(options)
    options = {meshType: options}
  if !options.meshType
    options.meshType = 'mesh'
  if !options.name
    options.name = _.uniqueId(options.meshType)
  return _.extend({}, options, json)

helper.loadMaterialFromJson = (json) ->
  if json.type == 'basic'
    materialClass = THREE.MeshBasicMaterial
  else
    materialClass = THREE.MeshBasicMaterial
  # TODO
  params = {}
  if json.map
    texture = helper.loadTextureFromJson json.map
    params.map = texture
  directExtendObjProperties(params, json, ['version', 'color', 'transparent', 'opacity'])
  material = new materialClass(params)
  return material

helper.extendFrom = (des, src) ->
  _.extend(des, src, des)
  return des

helper.loadWallFromJson = (_json) ->
  json = helper.preprocessJsonResource(_json, 'wall')
  if json.type == 'basic'
    geom = new THREE.CubeGeometry json.width, json.height, json.depth
    material = helper.loadMaterialFromJson(json.material)
    mesh = new THREE.Mesh geom, material
    helper.updateMeshFromJson(mesh, json)
    return mesh
  else
    console.log 'unsupported yet'

helper.loadLightFromJson = (_json) ->
  json = helper.preprocessJsonResource(_json, 'light')
  if json.type == 'directional'
    light = new THREE.DirectionalLight json.color, json.intensity, json.distance
  else if json.type == 'point'
    light = new THREE.SpotLight json.color, json.intensity, json.distance
  else if json.type == 'ambient'
    light = new THREE.AmbientLight json.color
  else
    false
  # TODO
  helper.updateMeshFromJson(light, json)
  helper.extendFrom(light, {meshType: 'light', name: _.uniqueId('light')})
  return light
helper.updateMeshFromJson = (mesh, json) ->
  if json.position
    mesh.position.set json.position.x, json.position.y, json.position.z
  if json.rotation
    mesh.rotation.set json.rotation.x, json.rotation.y, json.rotation.z
  if json.scale
    mesh.scale.set json.scale.x, json.scale.y, json.scale.z
  directExtendObjProperties(mesh, json,
                            ['version', 'doubleSided', 'flipSided', 'castShadow', 'name', 'typeName', 'meshType',
                             'meshName', 'typeName'])
  if mesh.name == undefined
    mesh.name = _.uniqueId('Mesh')

helper.inArray = (item, array) ->
  if _.indexOf(array, item) >= 0
    return true
  else
    return false
