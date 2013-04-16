define(function (require, exports, module) {
	var helper = require('editor.helper');
	exports.parseFogToJson = function (fog) {
		var color = helper.parseRGBToNumber(fog.color);
		var density = fog.density;
		return {
			color: color,
			density: density
		};
	};
	exports.parseSkyboxToJson = function(skybox) {
		var json = helper.parseObject3DToJson(skybox);
		return json;
	};
});