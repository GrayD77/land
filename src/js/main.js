;(function($){

	class Screen {
		constructor(section, firstIndex) {
			let innerElements;

			innerElements = section.find('.inner-state');

			this.el = section;
			this.firstIndex = firstIndex;
			this.lastIndex = firstIndex + (innerElements.length || 1) - 1;


			this._bindEvents();
		}

		in(dir) {
			let className = dir < 0 ? 'in-prev' : 'in-next';
			this._animate(className, () => { this.el.addClass('active') })
		}

		out(dir) {
			let className = dir < 0 ? 'out-prev' : 'out-next';
			this._animate(className, () => { this.el.removeClass('active') })
		}

		_animate(className, callback) {
			this.el.addClass(className);

			this.el.on('animationend', () => {

				this.el.removeClass(className);
				callback();

				this.el.off('animationend');
			})
		}

		_bindEvents() {
		}
	}

	class Page {

		constructor(sections) {
			this.screens = [];
			this.statesCount = 0;
			this.index = 0;

			sections.each((i, el) => {
				let newScreen = new Screen($(el), this.statesCount);
				this.statesCount = newScreen.lastIndex + 1; 
				this.screens.push(newScreen);
			});

			this._bindEvents();
		}

		get index() {
			return this._index;
		}

		set index(value) {
			this._prevIndex = this._index;
			this._index = Math.max(0, Math.min(this.statesCount - 1, value));

			if (this._prevIndex === this._index) return false;

			this.updateState(this._prevIndex, this._index);
		}

		updateState(prevIndex, currIndex) {
			let delta = currIndex - prevIndex || 0;
			console.log(delta)
			let currentScreen = this.screens.filter((screen) => {
				return currIndex >= screen.firstIndex && currIndex <= screen.lastIndex;
			})[0];

			let prevScreen = this.screens.filter((screen) => {
				return prevIndex >= screen.firstIndex && prevIndex <= screen.lastIndex;
			})[0];
			// console.log(prevScreen);
			if (prevScreen) prevScreen.out(delta);
			if (currentScreen) currentScreen.in(delta);

		}


		_nextState() {
			this.index++;
		}

		_prevState() {
			this.index--;
		}


		_bindEvents() {

			$(window).on('wheel', (e) => {
				let delta = e.originalEvent.wheelDelta;

				if (delta > 0) {
					this._prevState();
					return;
				};

				if (delta < 0) {
					this._nextState();
					return;
				};
			});

		}
	}


	// test
	let page = new Page($('section'));
	console.log(page);

}(jQuery))