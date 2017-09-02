'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function ($) {
	var Screen = function () {
		function Screen(section, firstIndex) {
			_classCallCheck(this, Screen);

			var innerElements = void 0;

			innerElements = section.find('.inner-state');

			this.el = section;
			this.firstIndex = firstIndex;
			this.lastIndex = firstIndex + (innerElements.length || 1) - 1;

			this._bindEvents();
		}

		_createClass(Screen, [{
			key: 'in',
			value: function _in(dir) {
				var _this = this;

				var className = dir < 0 ? 'in-prev' : 'in-next';
				this._animate(className, function () {
					_this.el.addClass('active');
				});
			}
		}, {
			key: 'out',
			value: function out(dir) {
				var _this2 = this;

				var className = dir < 0 ? 'out-prev' : 'out-next';
				this._animate(className, function () {
					_this2.el.removeClass('active');
				});
			}
		}, {
			key: '_animate',
			value: function _animate(className, callback) {
				var _this3 = this;

				this.el.addClass(className);

				this.el.on('animationend', function () {

					_this3.el.removeClass(className);
					callback();

					_this3.el.off('animationend');
				});
			}
		}, {
			key: '_bindEvents',
			value: function _bindEvents() {}
		}]);

		return Screen;
	}();

	var Page = function () {
		function Page(sections) {
			var _this4 = this;

			_classCallCheck(this, Page);

			this.screens = [];
			this.statesCount = 0;
			this.index = 0;

			sections.each(function (i, el) {
				var newScreen = new Screen($(el), _this4.statesCount);
				_this4.statesCount = newScreen.lastIndex + 1;
				_this4.screens.push(newScreen);
			});

			this._bindEvents();
		}

		_createClass(Page, [{
			key: 'updateState',
			value: function updateState(prevIndex, currIndex) {
				var delta = currIndex - prevIndex || 0;
				console.log(delta);
				var currentScreen = this.screens.filter(function (screen) {
					return currIndex >= screen.firstIndex && currIndex <= screen.lastIndex;
				})[0];

				var prevScreen = this.screens.filter(function (screen) {
					return prevIndex >= screen.firstIndex && prevIndex <= screen.lastIndex;
				})[0];
				// console.log(prevScreen);
				if (prevScreen) prevScreen.out(delta);
				if (currentScreen) currentScreen.in(delta);
			}
		}, {
			key: '_nextState',
			value: function _nextState() {
				this.index++;
			}
		}, {
			key: '_prevState',
			value: function _prevState() {
				this.index--;
			}
		}, {
			key: '_bindEvents',
			value: function _bindEvents() {
				var _this5 = this;

				$(window).on('wheel', function (e) {
					var delta = e.originalEvent.wheelDelta;

					if (delta > 0) {
						_this5._prevState();
						return;
					};

					if (delta < 0) {
						_this5._nextState();
						return;
					};
				});
			}
		}, {
			key: 'index',
			get: function get() {
				return this._index;
			},
			set: function set(value) {
				this._prevIndex = this._index;
				this._index = Math.max(0, Math.min(this.statesCount - 1, value));

				if (this._prevIndex === this._index) return false;

				this.updateState(this._prevIndex, this._index);
			}
		}]);

		return Page;
	}();

	// test


	var page = new Page($('section'));
	console.log(page);
})(jQuery);
//# sourceMappingURL=all.js.map
