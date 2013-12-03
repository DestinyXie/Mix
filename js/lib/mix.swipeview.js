/*from SwipeView v1.0 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org*/ ;
Mix.swipeView = function(el, options) {
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

    div = DOM.create('div', {
        id: 'swipeview-slider'
    });
    div.style.cssText = 'position:relative;top:0;height:100%;width:100%;' + Mix.cssPrefix + 'transition-duration:0;' + Mix.cssPrefix + 'transform:translateZ(0);' + Mix.cssPrefix + 'transition-timing-function:ease-out';
    this.wrapper.appendChild(div);
    this.slider = div;

    this.refreshSize();

    for (i = -1; i < 2; i++) {
        div = DOM.create('div');
        div.id = 'swipeview-masterpage-' + (i + 1);
        div.style.cssText = Mix.cssPrefix + 'transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;left:' + i * 100 + '%';
        if (!div.dataset) div.dataset = {};
        pageIndex = i == -1 ? this.options.numberOfPages - 1 : i;
        div.dataset.pageIndex = pageIndex;
        div.dataset.upcomingPageIndex = pageIndex;

        if (!this.options.loop && i == -1) div.style.visibility = 'hidden';

        this.slider.appendChild(div);
        this.masterPages.push(div);
    }

    DOM.addEvent(this.wrapper, START_EV, this);
    DOM.addEvent(this.slider, TRNEND_EV, this);
    // in Opera >= 12 the transitionend event is lowercase so we register both events
    if (Mix.cssVender == 'O') {
        DOM.addEvent(this.slider, TRNEND_EV.toLowerCase(), this);
    }
};

Mix.swipeView.prototype = {
    currentMasterPage: 1,
    x: 0,
    page: 0,
    pageIndex: 0,
    customEvents: [],
    onFlip: function(fn) {
        DOM.addEvent(this.wrapper, 'swipeview-flip', fn);
        this.customEvents.push(['flip', fn]);
    },
    onMoveOut: function(fn) {
        DOM.addEvent(this.wrapper, 'swipeview-moveout', fn);
        this.customEvents.push(['moveout', fn]);
    },
    onMoveIn: function(fn) {
        DOM.addEvent(this.wrapper, 'swipeview-movein', fn);
        this.customEvents.push(['movein', fn]);
    },
    onTouchStart: function(fn) {
        DOM.addEvent(this.wrapper, 'swipeview-touchstart', fn);
        this.customEvents.push(['touchstart', fn]);
    },
    destroy: function() {
        while (this.customEvents.length) {
            DOM.removeEvent(this.wrapper, 'swipeview-' + this.customEvents[0][0], this.customEvents[0][1]);
            this.customEvents.shift();
        }

        // Remove the event listeners
        DOM.removeEvent(this.wrapper, START_EV, this);
        DOM.removeEvent(this.wrapper, MOVE_EV, this);
        DOM.removeEvent(this.wrapper, END_EV, this);
        DOM.removeEvent(this.wrapper, CANCEL_EV, this);
        DOM.removeEvent(this.slider, TRNEND_EV, this);
    },
    refreshSize: function() {
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
    next: function() {
        if (!this.options.loop && this.x == this.maxX) return;

        this.directionX = -1;
        this.x -= 1;
        this.__checkPosition();
    },
    prev: function() {
        if (!this.options.loop && this.x === 0) return;

        this.directionX = 1;
        this.x += 1;
        this.__checkPosition();
    },
    handleEvent: function(e) {
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
     * Pseudo private methods
     */
    __pos: function(x) {
        this.x = x;
        this.slider.style[Mix.transform] = 'translate(' + x + 'px,0)' + Mix.translateZ;
    },
    __resize: function() {
        this.refreshSize();
        this.slider.style[Mix.transitionDuration] = '0s';
        this.__pos(-this.page * this.pageWidth);
    },
    __start: function(e) {
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

        this.slider.style[Mix.transitionDuration] = '0s';

        DOM.addEvent(this.wrapper, MOVE_EV, this);
        DOM.addEvent(this.wrapper, END_EV, this);
        DOM.addEvent(this.wrapper, CANCEL_EV, this);
        this.__event('touchstart');
    },
    __move: function(e) {
        if (!this.initiated) return;

        var point = Mix.hasTouch ? e.touches[0] : e,
            deltaX = point.pageX - this.pointX,
            deltaY = point.pageY - this.pointY,
            newX = this.x + deltaX,
            dist = Math.abs(point.pageX - this.startX);

        this.oriDist = point.pageX - this.startX;
        this.moved = true;
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        this.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
        this.stepsX += Math.abs(deltaX);
        this.stepsY += Math.abs(deltaY);

        // We take a 10px buffer to figure out the direction of the swipe
        if (this.stepsX < 10 && this.stepsY < 10) {
            //                e.preventDefault();
            return;
        }

        // We are scrolling vertically, so skip SwipeView and give the control back to the browser
        if (!this.directionLocked && this.stepsY > this.stepsX) { //-->
            this.initiated = false;
            Mix.scroll.outStop = false;
            return;
        }
        e.preventDefault();

        Mix.scroll.outStop = true;
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

        /*if (newX > 0 || newX < this.maxX) {
            newX = this.x + (deltaX / 2);
        }*/

        this.__pos(newX);
    },
    __end: function(e) {
        Mix.scroll.outStop = false;
        if (!this.initiated) return;

        var point = Mix.hasTouch ? e.changedTouches[0] : e,
            dist = Math.abs(point.pageX - this.startX);

        this.initiated = false;

        DOM.removeEvent(this.wrapper, MOVE_EV, this);
        DOM.removeEvent(this.wrapper, END_EV, this);
        DOM.removeEvent(this.wrapper, CANCEL_EV, this);

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
    __checkPosition: function() {
        var that = this,
            pageFlip,
            pageFlipIndex,
            className,
            newX,
            pageNum = that.options.numberOfPages;

        // Flip the page
        if (that.directionX > 0) {
            that.page = -Math.ceil(that.x / that.pageWidth);
            that.currentMasterPage = (that.page + 1) - Math.floor((that.page + 1) / 3) * 3;
            that.pageIndex = (that.page % pageNum + pageNum) % pageNum;

            pageFlip = that.currentMasterPage - 1;
            pageFlip = pageFlip < 0 ? 2 : pageFlip;
            that.masterPages[pageFlip].style.left = that.page * 100 - 100 + '%';

            pageFlipIndex = that.page - 1;
        } else {
            that.page = -Math.floor(that.x / that.pageWidth);
            that.currentMasterPage = (that.page + 1) - Math.floor((that.page + 1) / 3) * 3;
            that.pageIndex = (that.page % pageNum + pageNum) % pageNum;

            pageFlip = that.currentMasterPage + 1;
            pageFlip = pageFlip > 2 ? 0 : pageFlip;
            that.masterPages[pageFlip].style.left = that.page * 100 + 100 + '%';

            pageFlipIndex = that.page + 1;
        }

        pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / that.options.numberOfPages) * that.options.numberOfPages;
        that.masterPages[pageFlip].dataset.upcomingPageIndex = pageFlipIndex; // Index to be loaded in the newly flipped page

        newX = -that.page * that.pageWidth;

        that.slider.style[Mix.transitionDuration] = Math.floor(500 * Math.abs(that.x - newX) / that.pageWidth) + 'ms';

        // Hide the next page if we decided to disable looping
        if (!that.options.loop) {
            that.masterPages[pageFlip].style.visibility = newX === 0 || newX == that.maxX ? 'hidden' : '';
        }

        if (that.x == newX) {
            that.__flip(); // If we swiped all the way long to the next page (extremely rare but still)
        } else {
            that.__pos(newX);
            if (that.options.hastyPageFlip) that.__flip();
        }
    },
    __flip: function() {
        this.__event('flip');
        for (var i = 0; i < 3; i++) {
            this.masterPages[i].dataset.pageIndex = this.masterPages[i].dataset.upcomingPageIndex;
        }
    },
    __event: function(type) {
        var ev = DOC.createEvent("Event");
        ev.initEvent('swipeview-' + type, true, true);
        this.wrapper.dispatchEvent(ev);
    }
};