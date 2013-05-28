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
				var scene_src = btoa("/admin/resource/get_by_name/" + scene_name);
				var scene_url = "/play/path=" + scene_src;
				$sceneSelect.append($("<option scene-url='" + scene_src + "' value='" + btoa(scene_url) + "'>" + scene_name + "</option>"));
			});
		}, 'json');
		$(".show-scene-btn").click(function () {
			var scene_url = atob($(".select-scene").val());
			window.location.href = scene_url;
		});
		$(".edit-scene-btn").click(function () {
			var $select = $(".select-scene");
			var val = $select.val();
			var $options = $select.find('option');
			$options.each(function (k) {
				var option = $options[k];
				var $option = $(option);
				if ($option.val() == val) {
					var scene_src = $option.attr('scene-url');
					window.location.href = '/editor/' + scene_src;
				}
			});
		});
	});
});