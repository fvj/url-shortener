"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BiMap = function () {
	function BiMap(keys, values) {
		var _this = this;

		_classCallCheck(this, BiMap);

		this.mapL = new Map();
		this.mapR = new Map();
		if (keys === undefined || values === undefined || keys.length !== values.length) return;
		keys.forEach(function (key, index) {
			_this.mapL.set(key, values[index]);
			_this.mapR.set(values[index], key);
		});
	}

	_createClass(BiMap, [{
		key: "set",
		value: function set(key, val) {
			this.mapL.set(key, val);
			this.mapR.set(val, key);
			return this;
		}
	}, {
		key: "has",
		value: function has(key) {
			return this.mapL.has(key) || this.mapR.has(key);
		}
	}, {
		key: "get",
		value: function get(key) {
			return this.mapL.get(key) || this.mapR.get(key);
		}
	}, {
		key: "remove",
		value: function remove(key) {
			this.mapL.delete(key);
			this.mapR.delete(key);
			return this;
		}
	}, {
		key: "dump",
		value: function dump() {
			return { keys: Array.from(this.mapL.keys()), values: Array.from(this.mapL.values()) };
		}
	}, {
		key: "import",
		value: function _import(_ref) {
			var _this2 = this;

			var keys = _ref.keys,
			    values = _ref.values;

			keys.forEach(function (key, index) {
				_this2.mapL.set(key, values[index]);
				_this2.mapR.set(values[index], key);
			});
			return this;
		}
	}]);

	return BiMap;
}();

exports.default = BiMap;