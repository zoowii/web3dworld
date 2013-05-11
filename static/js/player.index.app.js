define(function (require, exports, module) {
    var _ = require('underscore');
//    var $ = require('jquery');
    $(function () {
        $.get('/admin/resource/json/list/type/scene', {}, function (json) {
            var scenes = json;
            var scene_names = _.map(scenes, function (scene) {
                return scene.name;
            });
            var $sceneSelect = $(".select-scene");
            _.each(scene_names, function (scene_name) {
                var scene_url = "/play/path=" + btoa("/admin/resource/get_by_name/" + scene_name);
                $sceneSelect.append($("<option value='" + btoa(scene_url) + "'>" + scene_name + "</option>"));
            });
        }, 'json');
        $(".show-scene-btn").click(function () {
            var scene_url = atob($(".select-scene").val());
            window.location.href = scene_url;
        })
    });
});