/*from SwipeView v1.0 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org*/
Mix.swipeView = function (el, options) {
	var i,
		div,
		className,
		pageIndex;

	this.wrapper = typeof el == 'string' ? $(el) : el;
	this.options = {
		text: null,
		numberOfPages: 3,
		snapThreshold: null,
		hastyPageFlip: false,
		loop: true
	};

	// User defined options
	for (i in options) this.options[i] = options[i];

	this.wrapper.style.overflow = 'hidden';
	this.wrapper.style.position = 'relative';

	this.masterPages = [];

	div = DOM.create('div',{id:'swipeview-slider'});
	div.style.cssText = 'position:relative;top:0;height:100%;width:100%;' + Mix.cssPrefix + 'transition-duration:0;' + Mix.cssPrefix + 'transform:translateZ(0);' + Mix.cssPrefix + 'transition-timing-function:ease-out';
	this.wrapper.appendChild(div);
	this.slider = div;

	this.refreshSize();

	for (i=-1; i<2; i++) {
		div = DOM.create('div');
		div.id = 'swipeview-masterpage-' + (i+1);
		div.style.cssText = Mix.cssPrefix + 'transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;left:' + i*100 + '%';
		if (!div.dataset) div.dataset = {};
		pageIndex = i == -1 ? this.options.numberOfPages - 1 : i;
		div.dataset.pageIndex = pageIndex;
		div.dataset.upcomingPageIndex = pageIndex;

		if (!this.options.loop && i == -1) div.style.visibility = 'hidden';

		this.slider.appendChild(div);
		this.masterPages.push(div);
	}

	DOM.addClass(this.masterPages[1],'swipeview-active');

	// window.addEventListener('resize', this, false);
	this.wrapper.addEventListener(START_EV, this, false);
	this.wrapper.addEventListener(MOVE_EV, this, false);
	this.wrapper.addEventListener(END_EV, this, false);
	this.slider.addEventListener(TRNEND_EV, this, false);
	// in Opera >= 12 the transitionend event is lowercase so we register both events
	if ( Mix.cssVender == 'O' ) this.slider.addEventListener(TRNEND_EV.toLowerCase(), this, false);

	/*if (!Mix.hasTouch) {
		this.wrapper.addEventListener('mouseout', this, false);
	}*/
};

Mix.swipeView.prototype = {
	currentMasterPage: 1,
	x: 0,
	page: 0,
	pageIndex: 0,
	customEvents: [],
	onFlip: function (fn) {
		this.wrapper.addEventListener('swipeview-flip', fn, false);
		this.customEvents.push(['flip', fn]);
	},
	onMoveOut: function (fn) {
		this.wrapper.addEventListener('swipeview-moveout', fn, false);
		this.customEvents.push(['moveout', fn]);
	},
	onMoveIn: function (fn) {
		this.wrapper.addEventListener('swipeview-movein', fn, false);
		this.customEvents.push(['movein', fn]);
	},
	onTouchStart: function (fn) {
		this.wrapper.addEventListener('swipeview-touchstart', fn, false);
		this.customEvents.push(['touchstart', fn]);
	},
	destroy: function () {
		while ( this.customEvents.length ) {
			this.wrapper.removeEventListener('swipeview-' + this.customEvents[0][0], this.customEvents[0][1], false);
			this.customEvents.shift();
		}

		// Remove the event listeners
		// window.removeEventListener('resize', this, false);
		this.wrapper.removeEventListener(START_EV, this, false);
		this.wrapper.removeEventListener(MOVE_EV, this, false);
		this.wrapper.removeEventListener(END_EV, this, false);
		this.slider.removeEventListener(TRNEND_EV, this, false);

/*			if (!Mix.hasTouch) {
			this.wrapper.removeEventListener('mouseout', this, false);
		}*/
	},
	refreshSize: function () {
		this.wrapperWidth = this.wrapper.clientWidth;
		this.wrapperHeight = this.wrapper.clientHeight;
		this.pageWidth = this.wrapperWidth;
		this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
		this.snapThreshold = this.options.snapThreshold === null ?
			Math.round(this.pageWidth * 0.15) :
			/%/.test(this.options.snapThreshold) ?
				Math.round(this.pageWidth * this.options.snapThreshold.replace('%', '') / 100) :
				this.options.snapThreshold;
	},
	updatePageCount: function (n) {
		this.options.numberOfPages = n;
		this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
	},
	goToPage: function (p) {
		var i,that=this;

		DOM.removeClass(that.masterPages[that.currentMasterPage],'swipeview-active');

		for (i=0; i<3; i++) {
			className = that.masterPages[i].className;
			/(^|\s)swipeview-loading(\s|$)/.test(className) || (that.masterPages[i].className = !className ? 'swipeview-loading' : className + ' swipeview-loading');
		}

		p = p < 0 ? 0 : p > that.options.numberOfPages-1 ? that.options.numberOfPages-1 : p;
		that.page = p;
		that.pageIndex = p;
		that.slider.style[Mix.transitionDuration] = '0s';
		that.__pos(-p * that.pageWidth);

		that.currentMasterPage = (that.page + 1) - Math.floor((that.page + 1) / 3) * 3;

		that.masterPages[that.currentMasterPage].className = that.masterPages[that.currentMasterPage].className + ' swipeview-active';

		if (that.currentMasterPage === 0) {
			that.masterPages[2].style.left = that.page * 100 - 100 + '%';
			that.masterPages[0].style.left = that.page * 100 + '%';
			that.masterPages[1].style.left = that.page * 100 + 100 + '%';

			that.masterPages[2].dataset.upcomingPageIndex = that.page === 0 ? that.options.numberOfPages-1 : that.page - 1;
			that.masterPages[0].dataset.upcomingPageIndex = that.page;
			that.masterPages[1].dataset.upcomingPageIndex = that.page == that.options.numberOfPages-1 ? 0 : that.page + 1;
		} else if (that.currentMasterPage == 1) {
			that.masterPages[0].style.left = that.page * 100 - 100 + '%';
			that.masterPages[1].style.left = that.page * 100 + '%';
			that.masterPages[2].style.left = that.page * 100 + 100 + '%';

			that.masterPages[0].dataset.upcomingPageIndex = that.page === 0 ? that.options.numberOfPages-1 : that.page - 1;
			that.masterPages[1].dataset.upcomingPageIndex = that.page;
			that.masterPages[2].dataset.upcomingPageIndex = that.page == that.options.numberOfPages-1 ? 0 : that.page + 1;
		} else {
			that.masterPages[1].style.left = that.page * 100 - 100 + '%';
			that.masterPages[2].style.left = that.page * 100 + '%';
			that.masterPages[0].style.left = that.page * 100 + 100 + '%';

			that.masterPages[1].dataset.upcomingPageIndex = that.page === 0 ? that.options.numberOfPages-1 : that.page - 1;
			that.masterPages[2].dataset.upcomingPageIndex = that.page;
			that.masterPages[0].dataset.upcomingPageIndex = that.page == that.options.numberOfPages-1 ? 0 : that.page + 1;
		}

		that.__flip();
	},
	next: function () {
		if (!this.options.loop && this.x == this.maxX) return;

		this.directionX = -1;
		this.x -= 1;
		this.__checkPosition();
	},
	prev: function () {
		if (!this.options.loop && this.x === 0) return;

		this.directionX = 1;
		this.x += 1;
		this.__checkPosition();
	},
	handleEvent: function (e) {
		switch (e.type) {
			case START_EV:
				this.__start(e);
				break;
			case MOVE_EV:
				this.__move(e);
				break;
			case CANCEL_EV:
			case END_EV:
				this.__end(e);
				break;
			case 'resize':
				this.__resize();
				break;
			case TRNEND_EV:
			case 'otransitionend':
				if (e.target == this.slider && !this.options.hastyPageFlip) this.__flip();
				break;
		}
	},
	/**
	*
	* Pseudo private methods
	*
	*/
	__pos: function (x) {
		this.x = x;
		this.slider.style[Mix.transform] = 'translate(' + x + 'px,0)' + Mix.translateZ;
	},
	__resize: function () {
		this.refreshSize();
		this.slider.style[Mix.transitionDuration] = '0s';
		this.__pos(-this.page * this.pageWidth);
	},
	__start: function (e) {
		Mix.scroll.stop=true;
		e.preventDefault();

		if (this.initiated) return;

		var point = Mix.hasTouch ? e.touches[0] : e;

		this.initiated = true;
		this.moved = false;
		this.thresholdExceeded = false;
		this.startX = point.pageX;
		this.startY = point.pageY;
		this.pointX = point.pageX;
		this.pointY = point.pageY;
		this.stepsX = 0;
		this.stepsY = 0;
		this.directionX = 0;
		this.directionLocked = false;

/*			var matrix = getComputedStyle(this.slider, null).webkitTransform.replace(/[^0-9-.,]/g, '').split(',');
		this.x = matrix[4] * 1;*/

		this.slider.style[Mix.transitionDuration] = '0s';

		this.__event('touchstart');
	},
	__move: function (e) {
		if (!this.initiated) return;

		var point = Mix.hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - this.pointX,
			deltaY = point.pageY - this.pointY,
			newX = this.x + deltaX,
			dist = Math.abs(point.pageX - this.startX);

		this.moved = true;
		this.pointX = point.pageX;
		this.pointY = point.pageY;
		this.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
		this.stepsX += Math.abs(deltaX);
		this.stepsY += Math.abs(deltaY);

		// We take a 10px buffer to figure out the direction of the swipe
		if (this.stepsX < 10 && this.stepsY < 10) {
//				e.preventDefault();
			return;
		}

		// We are scrolling vertically, so skip SwipeView and give the control back to the browser
		if (!this.directionLocked && this.stepsY > this.stepsX) {
			this.initiated = false;
			return;
		}

		e.preventDefault();

		this.directionLocked = true;

		if (!this.options.loop && (newX > 0 || newX < this.maxX)) {
			newX = this.x + (deltaX / 2);
		}

		if (!this.thresholdExceeded && dist >= this.snapThreshold) {
			this.thresholdExceeded = true;
			this.__event('moveout');
		} else if (this.thresholdExceeded && dist < this.snapThreshold) {
			this.thresholdExceeded = false;
			this.__event('movein');
		}

/*			if (newX > 0 || newX < this.maxX) {
			newX = this.x + (deltaX / 2);
		}*/

		this.__pos(newX);
	},
	__end: function (e) {
		Mix.scroll.stop=false;
		if (!this.initiated) return;

		var point = Mix.hasTouch ? e.changedTouches[0] : e,
			dist = Math.abs(point.pageX - this.startX);

		this.initiated = false;

		if (!this.moved) return;

		if (!this.options.loop && (this.x > 0 || this.x < this.maxX)) {
			dist = 0;
			this.__event('movein');
		}

		// Check if we exceeded the snap threshold
		if (dist < this.snapThreshold) {
			this.slider.style[Mix.transitionDuration] = Math.floor(300 * dist / this.snapThreshold) + 'ms';
			this.__pos(-this.page * this.pageWidth);
			return;
		}

		this.__checkPosition();
	},
	__checkPosition: function () {
		var that=this,
			pageFlip,
			pageFlipIndex,
			className;

		DOM.removeClass(that.masterPages[that.currentMasterPage],'swipeview-active');

		// Flip the page
		if (that.directionX > 0) {
			that.page = -Math.ceil(that.x / that.pageWidth);
			that.currentMasterPage = (that.page + 1) - Math.floor((that.page + 1) / 3) * 3;
			that.pageIndex = that.pageIndex === 0 ? that.options.numberOfPages - 1 : that.pageIndex - 1;

			pageFlip = that.currentMasterPage - 1;
			pageFlip = pageFlip < 0 ? 2 : pageFlip;
			that.masterPages[pageFlip].style.left = that.page * 100 - 100 + '%';

			pageFlipIndex = that.page - 1;
		} else {
			that.page = -Math.floor(that.x / that.pageWidth);
			that.currentMasterPage = (that.page + 1) - Math.floor((that.page + 1) / 3) * 3;
			that.pageIndex = that.pageIndex == that.options.numberOfPages - 1 ? 0 : that.pageIndex + 1;

			pageFlip = that.currentMasterPage + 1;
			pageFlip = pageFlip > 2 ? 0 : pageFlip;
			that.masterPages[pageFlip].style.left = that.page * 100 + 100 + '%';

			pageFlipIndex = that.page + 1;
		}

		// Add active class to current page
		DOM.addClass(that.masterPages[that.currentMasterPage],' swipeview-active');

		// Add loading class to flipped page
		DOM.addClass(that.masterPages[pageFlip],'swipeview-loading');

		pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / that.options.numberOfPages) * that.options.numberOfPages;
		that.masterPages[pageFlip].dataset.upcomingPageIndex = pageFlipIndex;		// Index to be loaded in the newly flipped page

		newX = -that.page * that.pageWidth;

		that.slider.style[Mix.transitionDuration] = Math.floor(500 * Math.abs(that.x - newX) / that.pageWidth) + 'ms';

		// Hide the next page if we decided to disable looping
		if (!that.options.loop) {
			that.masterPages[pageFlip].style.visibility = newX === 0 || newX == that.maxX ? 'hidden' : '';
		}

		if (that.x == newX) {
			that.__flip();		// If we swiped all the way long to the next page (extremely rare but still)
		} else {
			that.__pos(newX);
			if (that.options.hastyPageFlip) that.__flip();
		}
	},
	__flip: function () {
		this.__event('flip');

		for (var i=0; i<3; i++) {
			DOM.removeClass(this.masterPages[i],'swipeview-loading');
			this.masterPages[i].dataset.pageIndex = this.masterPages[i].dataset.upcomingPageIndex;
		}
	},
	__event: function (type) {
		var ev = DOC.createEvent("Event");

		ev.initEvent('swipeview-' + type, true, true);

		this.wrapper.dispatchEvent(ev);
	}
};