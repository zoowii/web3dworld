$ ->
  menuBar = $(".menu-bar")
  container = $(".container")
  control_area = $(".control-area")
  edit_view_area = $(".edit-view-area")
  edit_area = $('.edit-area')
  view_area = $(".view-area")

  fileMenu = new ZUI.Menu {
    label: 'File'
  }
  fileMenu.addItem({
  label: 'Open'
  }).addItem({
  label: 'Exit',
  click: ->
    alert 'exit'
  })
  editMenu = new ZUI.Menu {
    label: 'Edit'
  }
  editMenu.addItem({
    label: '复制'
  }).addItem({
    label: '删除'
  })
  addMenu = new ZUI.Menu {
    label: 'Add'
  }
  addMenu.addItem({
    label: '平面'
  }).addItem({
    label: '正方体'
  }).addItem({
    label: '圆柱体'
  }).addItem({
    label: '球体'
  }).addItem({
    label: '-----'
  }).addItem({
    label: '点光源'
  }).addItem({
    label: '环境光'
  }).addItem({
    label: '平行光'
  })
  aboutMenu = new ZUI.Menu {
    label: 'About'
  }
  aboutMenu.addItem({
    label: '源码'
  }).addItem({
    label: '关于'
  })

  fileMenu.addedTo menuBar[0]
  editMenu.addedTo menuBar[0]
  addMenu.addedTo menuBar[0]

  container.css {
    top: (menuBar.height() + 1) + 'px'
  }
  panel_height = window.innerHeight - menuBar.height() - 1
  control_area.css {
    height: panel_height + 'px'
  }
  edit_view_area.css {
    height: panel_height + 'px'
  }
  canvas_height = panel_height - 80
  $(".canvas-area").css {
    height: canvas_height + 'px'
  }

