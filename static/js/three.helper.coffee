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
