'use strict';
import '../scss/index.scss';

const DATA_KEY = 'dev.carousel';
const EVENT_KEY = `.${DATA_KEY}`;

const Data = {
    SLIDE: 'slide',
    DIRECTION: 'direction',
    LOOP: 'loop'
};

const Selector = {
    INNER: '.carousel-inner',
    DATA_SLIDE: `[data-${Data.SLIDE}]`,
};

/** todo drag
 const THRESHOLD = 10;
 const HOLD_INTERVAL = 100;
 */
const Direction = {
    VERTICAL: 'y',
    HORIZONTAL: 'x',
};

const SlideDirection = {
    PREV: 'prev',
    NEXT: 'next',
};

/** todo drag
 const ClassName = {
    DRAG_EVENT: 'drag-event'
};
 */

const Event = {
    CLICK: `click`,
    /** todo drag
     MOUSEDOWN: `mousedown${EVENT_KEY}`,
     MOUSEUP: `mouseup${EVENT_KEY}`,
     MOUSELEAVE: `mouseleave${EVENT_KEY}`,
     MOUSEMOVE: `mousemove${EVENT_KEY}`,
     */
};

function convertToBool(value) {
    switch (value) {
        case true:
        case "1":
        case "true":
            return true
        default:
            return false;
    }
}

class Carousel {
    constructor(el, options, selectors) {
        this.$el = el;

        this.selectors = {
            inner: Selector.INNER,
            item: null, // sets for fractional navigation
            control: `[data-${Data.SLIDE}]`,
            ...selectors
        }


        this.options = {
            direction: Direction.HORIZONTAL,
            loop: false,
            fractional: false,
            ...options
        }


        this.$inner = el.querySelector(this.selectors.inner);

        // this.isVertical = this.$el.dataset[Data.DIRECTION] === Direction.VERTICAL;
        // this.loop = this.$el.dataset[Data.LOOP] !== undefined ? convertToBool(this.$el.dataset[Data.LOOP]) : false;
        // this.isFractional = false;

        this.index = 0;

        /**
         * todo drag
         this.isDragging = false;
         this.isMoving = false;
         this.clickPrevented = false;
         this.start = {};
         this.offset = {};
         this.speed = {x: 1, y: 1};
         */
        this._attachEvents();
    }

    _attachEvents() {

        /** todo drag
         if (this.$inner) {
            this.$inner.addEventListener(Event.MOUSEDOWN, (e) => this.down(e));
            this.$inner.addEventListener(Event.MOUSELEAVE, (e) => this.up(e));
            this.$inner.addEventListener(Event.MOUSEUP, (e) => this.up(e));
            this.$inner.addEventListener(Event.MOUSEMOVE, (e) => this.move(e));
            this.$inner.addEventListener(Event.CLICK, (e) => this.click(e));
        }*/

        [...document.querySelectorAll(`${Selector.DATA_SLIDE}[href="#${this.$el.id}"]`)]
            .forEach((el) => {
                el.addEventListener(Event.CLICK, (e) => this._slide(e))
            })
    }


    /** todo drag
     *  click(e) {
        if (this.clickPrevented) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };
     down(e) {
        e.preventDefault();
        e.stopPropagation();

        const elem = getElementFromEvent(e);

        this.isDragging = true;
        elem.classList.add(ClassName.DRAG_EVENT);

        this.start.x = e.pageX - elem.offsetLeft;
        this.start.y = e.pageY - elem.offsetTop;

        this.offset.x = elem.scrollLeft;
        this.offset.y = elem.scrollTop;
    };

     up(e) {
        this.isDragging = false;

        if (!this.isMoving) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        this.isMoving = false;

        const elem = getElementFromEvent(e);
        elem.classList.remove(ClassName.DRAG_EVENT);

        this.clickPrevented = true;
        setTimeout(() => {
            this.clickPrevented = false
        }, HOLD_INTERVAL);
    };

     move(e) {

        if (!this.isDragging) {
            return;
        }

        const elem = getElementFromEvent(e);
        const x = e.pageX - elem.offsetLeft;
        const y = e.pageY - elem.offsetTop;

        const diff = {
            x: this.start.x - x,
            y: this.start.y - y,
        };


        if (Math.abs(diff.x) < THRESHOLD && Math.abs(diff.y) < THRESHOLD) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        this.isMoving = true;

        const walk = {
            x: (x - start.x) * this.speed.x,
            y: (y - start.y) * this.speed.y,
        };

        requestAnimationFrame(() => {
            elem.scrollLeft = this.offset.x - walk.x;
            elem.scrollTop = this.offset.y - walk.y;
        });
    };
     */

    slideTo(index) {
        const rect = this.$inner.getBoundingClientRect();
        const move = (prop, scrollProp, scrollSizeProp) => {
            const value = rect[prop];
            const max = this.$inner[scrollSizeProp] - value;
            index = Math.max(0, Math.min(index, Math.round(max / value)));

            requestAnimationFrame(() => {
                this.position = this.$inner[scrollProp] = Math.max(0, value * index);
                this.index = index;
            });
        };

        this._isVertical()
            ? move('height', 'scrollTop', 'scrollHeight')
            : move('width', 'scrollLeft', 'scrollWidth');
    }


    slide(direction) {
        const delta = direction === SlideDirection.PREV ? -1 : 1;
        const rect = this.$inner.getBoundingClientRect();

        const move = (prop, scrollProp, scrollSizeProp) => {
            const value = rect[prop];
            const current = this.position || this.$inner[scrollProp];
            const max = this.$inner[scrollSizeProp] - value;

            let to = current + delta * value;
            if (this.loop) {
                if (Math.floor(to) > Math.ceil(max)) to = 0;
                if (Math.ceil(to) < 0) to = max;
            }

            requestAnimationFrame(() => {
                this.position = this.$inner[scrollProp] = Math.max(0, Math.min(max, to));
                this.index = Math.round(this.position / value);
            });
        };

        this._isVertical()
            ? move('height', 'scrollTop', 'scrollHeight')
            : move('width', 'scrollLeft', 'scrollWidth');
    }

    _isVertical(){
        return this.options.direction === Direction.VERTICAL;
    }


    _slide(e) {
        e.preventDefault();
        const $elem = e.currentTarget;
        this.slide($elem.dataset[Data.SLIDE]);
    };
}

export const carousel = (selector) => {
    const elem = [...document.querySelectorAll(selector)];

    const create = (el) => {
        if (el[DATA_KEY]) {
            return el[DATA_KEY];
        }

        return el[DATA_KEY] = new Carousel(el);
    };

    if (elem.length === 1) {
        return create(elem[0]);
    }
    return elem.map(create);
};



