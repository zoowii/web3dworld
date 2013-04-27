define(function (require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        $(document).on('click', '.view_mode_btn', function () {
            var $this = $(this);
            var enter_first_person_mode = true;
            var cls = 'enter_first_person_mode_btn';
            if ($this.hasClass('enter_first_person_mode_btn')) {
                enter_first_person_mode = true;
                cls = 'enter_first_person_mode_btn';
            } else {
                enter_first_person_mode = false;
                cls = 'enter_god_mode_btn';
            }
            _.each($(".view_mode_btn"), function (dom) {
                var $dom = $(dom);
                if ($dom.hasClass(cls)) {
                    $dom.hide();
                } else {
                    $dom.show();
                }
            });
            var view3d = require('editor.app').editor.view3d;
            if (enter_first_person_mode) {
                view3d.enterFirstPersonMode(); // 进入第一人称模式
            } else {
                view3d.enterGodMode(); // 进入上帝模式
            }
        });
    });
});