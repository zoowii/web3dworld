define(['jquery'],function ($) {
    var __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    var Menu, Panel, UI, Widget;
    if (window.ZUI === void 0) {
        window.ZUI = UI = {};
    }
    UI.Widget = Widget = (function () {

        function Widget() {
        }

        Widget.prototype.addedTo = function (wrapper) {
            var $wrapper;
            $wrapper = $(wrapper);
            $wrapper.append(this.dom);
            return $wrapper;
        };

        return Widget;

    })();
    UI.Menu = Menu = (function (_super) {

        __extends(Menu, _super);

        function Menu(params) {
            var default_params, item, item_default_params, k, _i, _len, _ref;
            default_params = {
                label: 'Menu',
                items: []
            };
            item_default_params = {
                label: 'Item',
                click: function () {
                    return false;
                }
            };
            params = _.extend({}, default_params, params);
            _ref = params.items;
            for (k = _i = 0, _len = _ref.length; _i < _len; k = ++_i) {
                item = _ref[k];
                params.items[k] = _.extend(item_default_params, item);
            }
            this.items = params.items;
            this.label = params.label;
            this.dom = this.menu = $('<div class="btn-group"></div>');
            this.menu_label = $('<button class="btn btn-small btn-inverse dropdown-toggle" data-toggle="dropdown"></button>');
            this.menu_label_span = $("<span class=\"underline\">" + this.label[0] + "</span><span>" + (this.label.substring(1)) + "</span>");
            this.menu_label_caret = $("<span class=\"caret\"></span>");
            this.menu_label.append(this.menu_label_span);
            this.menu_label.append(this.menu_label_caret);
            this.menu_items = $("<ul class=\"dropdown-menu\"></ul>");
            this.item_doms = [];
// #      for item in @items
//              #        $item = $("<li></li>")
//#        $item_link = $("<a href=\"javascript: return false;\">#{item.label}</a>")
//#        $item_link.click item.click
//#        $item.append $item_link
//#        @item_doms.push $item
//#        @menu_items.append $item
            this.menu.append(this.menu_label);
            this.menu.append(this.menu_items);
        }

        Menu.prototype.addItem = function (option) {
            var $item, $item_link;
            option = _.extend({}, {
                label: 'Item Name',
                click: function () {
                    return false;
                }
            }, option);
            $item = $("<li></li>");
            $item_link = $("<a href=\"javascript: return false;\">" + option.label + "</a>");
            $item_link.click(_.bind(option.click, $item_link[0]));
            $item.append($item_link);
            this.item_doms.push($item);
            this.menu_items.append($item);
            return this;
        };

        return Menu;

    })(Widget);
    return UI.Panel = Panel = (function (_super) {

        __extends(Panel, _super);

        function Panel(name, upperLeftCornerPosition, width, height, background, border) {
            this.name = name;
            this.upperLeftCornerPosition = upperLeftCornerPosition != null ? upperLeftCornerPosition : {
                x: 0,
                y: 0
            };
            this.width = width != null ? width : "500";
            this.height = height != null ? height : "500px";
            this.background = background != null ? background : "#eeeeee";
            this.border = border != null ? border : "0px";
            this.dom = this.panel = $("<div class='panel' name=\"" + this.name + "\"></div>");
            this.dom.css({
                             "z-index": -1
                         });
            this.title_bar = $("<div class='title-bar'>" + this.name + "</div>");
            this.title_bar.css({
                                   borderBottom: '1px solid green'
                               });
            this.panel.css({
                               position: 'absolute',
                               left: this.upperLeftCornerPosition.x,
                               top: this.upperLeftCornerPosition.y,
                               width: this.width,
                               height: this.height,
                               background: this.background,
                               border: this.border
                           });
            this.panel.append(this.title_bar);
        }

        return Panel;

    })(Widget);
});
