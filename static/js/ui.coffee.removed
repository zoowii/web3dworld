$ ->
  if window.ZUI == undefined
    window.ZUI = UI = {}
  UI.Widget = class Widget
    constructor: () ->
    addedTo: (wrapper) ->
      $wrapper = $(wrapper)
      $wrapper.append @dom
      return $wrapper

  UI.Menu = class Menu extends Widget
    constructor: (params) ->
      default_params = {
        label: 'Menu',
        items: [
        ]
      }
      item_default_params = {
        label: 'Item',
        click: -> return false
      }
      params = _.extend {}, default_params, params
      for item, k in params.items
        params.items[k] = _.extend item_default_params, item
      @items = params.items
      @label = params.label
      @dom = @menu = $('<div class="btn-group"></div>')
      @menu_label = $('<button class="btn btn-small btn-inverse dropdown-toggle" data-toggle="dropdown"></button>')
      @menu_label_span = $("<span class=\"underline\">#{@label[0]}</span><span>#{@label.substring(1)}</span>")
      @menu_label_caret = $("<span class=\"caret\"></span>")
      @menu_label.append @menu_label_span
      @menu_label.append @menu_label_caret
      @menu_items = $("<ul class=\"dropdown-menu\"></ul>")
      @item_doms = []
#      for item in @items
#        $item = $("<li></li>")
#        $item_link = $("<a href=\"javascript: return false;\">#{item.label}</a>")
#        $item_link.click item.click
#        $item.append $item_link
#        @item_doms.push $item
#        @menu_items.append $item
      @menu.append @menu_label
      @menu.append @menu_items
    addItem: (option) ->
      option = _.extend {}, {
      label: 'Item Name',
      click: ->
        return false
      }, option
      $item = $("<li></li>")
      $item_link = $("<a href=\"javascript: return false;\">#{option.label}</a>")
      $item_link.click _.bind(option.click, $item_link[0])
      $item.append $item_link
      @item_doms.push $item
      @menu_items.append $item
      return this

  UI.Panel = class Panel extends Widget
    constructor: (@name, @upperLeftCornerPosition = {x: 0, y: 0}, @width = "500", @height = "500px", @background="#eeeeee", @border="0px") ->
      @dom = @panel = $("<div class='panel' name=\"#{@name}\"></div>")
      @dom.css {
        "z-index": -1
      }
      @title_bar = $("<div class='title-bar'>#{@name}</div>")
      @title_bar.css {
        borderBottom: '1px solid green'
      }
      @panel.css {
        position: 'absolute',
        left: @upperLeftCornerPosition.x,
        top: @upperLeftCornerPosition.y,
        width: @width,
        height: @height,
        background: @background,
        border: @border
      }
      @panel.append @title_bar

