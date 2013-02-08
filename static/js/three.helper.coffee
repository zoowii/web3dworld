if window.helper == undefined
  window.helper = {}

helper = window.helper

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
  xUpD = new THREE.Mesh new THREE.CubeGeometry(axisLenght, axisWidth, axisWidth), new THREE.MeshBasicMaterial { color: '#ff0000'}
  yUpD = new THREE.Mesh new THREE.CubeGeometry(axisWidth, axisLenght, axisWidth), new THREE.MeshBasicMaterial {color: '#00ff00'}
  zUpD = new THREE.Mesh new THREE.CubeGeometry(axisWidth, axisWidth, axisLenght), new THREE.MeshBasicMaterial {color: '#0000ff'}
  scene.add xUpD
  scene.add yUpD
  scene.add zUpD
  xUpD.position.set axisLenght / 2, 0, 0
  yUpD.position.set 0, axisLenght / 2, 0
  zUpD.position.set 0, 0, axisLenght / 2 + 0
  helper.scaleObject3DWithPosition(xUpD, proportion) # x axis
  helper.scaleObject3DWithPosition(yUpD, proportion) # y axis
  helper.scaleObject3DWithPosition(zUpD, proportion) # z axis
  return {
    x: xUpD, y: yUpD, z: zUpD
  }

helper.runTimes = (task, times = 1, interval = 0) -> # task: 要执行的函数, times: 要执行的次数, interval: 间隔的时间
  if times <= 0
    return
  task()
  interval = if interval < 0 then 0 else interval
  newTask = -> helper.runTimes task, times - 1, interval
  setTimeout newTask, interval

helper.Set = class Set
  constructor: () ->
    this.data = []
  add: (ele) ->
    if !(_.contains this.data, ele)
      this.data.push ele
  remove: (ele) ->
    if _.contains this.data, ele
      this.data = this.data.filter (e) -> e != ele

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
      delta = {x: nowPosition.x - lastPosition.x, y: nowPosition.y - lastPosition.y}
      oldLastPosition = _.clone(lastPosition)
      lastPosition = _.clone(nowPosition)
      handler(oldLastPosition, nowPosition, delta)
  ).mouseup( ->
    isMouseDown = false
  ).mouseleave( ->
    isMouseDown = false
  )
