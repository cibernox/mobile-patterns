// TODO: Refactor gesture to handle more logic about gesture detection and tracking
//
// Desired API:
//
// var swipe = new Gesture('swipe');
// // Equivalent to `new Gesture('swipe', { minLength: 20, warnLength: 10, errorMargin: 20, exclusive: true, trackOffset: true })`
//
// swipe.on('warn', function(gesture) {
//   // Do my stuff
// });
//
// swipe.on('warn', function(gesture) {
//   // Do my stuff
// });
//
// swipe.on('progress', function(gesture) {
//   // Do my stuff
// });
//
// swipe.on('end', function(gesture) {
//   // Do my stuff
// });
//
// About the options:
//
// - minLength: Given that user gesture aren't perfect, a swipe gesture needs to have a minimum
//              length to be detected. The event will not emit a `start` event until the lenght
//              surpasses that length.
//
// - warnLength: In order to respond as fast as possible, sometime we want to preemtively do some
//               work ahead of time when we foreseen that the gesture will be a swipe. The gesture
//               will emit a `warn` event when the gesture looks like a swipe and it's length is at
//               least this one.
//
// - errorMargin: Swipe gesture should be horizontal, but there must be a certain error marging. A
//                gesture will be considered horizontal if it's closer than 20deg of being completely
//                horitontal.
//
// - exclusive: Wheter this gesture, once possitively detected as a swipe, should be defaultPrevented
//              or propagationStopped. Defaults to true.
//
// - trackOffset: When a gesture is possitively detected as a swipe, it has already advanced at
//                least the `minLength`. If `trackOffset` is true (the default behavior), all events
//                previous to the one that surpassed the `minLength` will be ignored, meaning that
//                when we ask for the `length`, `start` or `speed` of that gesture, that event will
//                be considered the first one to all practical effects.
//
//
// Other non configurable behavior:
//
// A swipe gesture is a one-try gesture. If by the time the gesture surpasses the `minLength` the
// gesture is not possitively detected as a swipe, the gesture will not be tracked ever again.
// IDEA: Maybe a `fail` event should be triggered??
//


/* global EventEmitter */
class Gesture extends EventEmitter {
  constructor(opts = {}) {
    opts.defaultPrevented = opts.defaultPrevented || false;
    opts.propagationStopped = opts.defaultPrevented || false;
    this._originalOpts = opts;
    for (let key in opts) {
      this[key] = opts[key];
    }
    this.events = [];
  }

  // Properties
  get first(){
    return this.events[0];
  }

  get x(){
    return this.last.x;
  }

  get y(){
    return this.last.y;
  }

  get initX() {
    return this.first.x;
  }

  get initY() {
    return this.first.y;
  }

  get deltaX() {
    return this.x - this.initX;
  }

  get deltaY() {
    return this.y - this.initY;
  }

  get delta() {
    return Math.sqrt(Math.pow(this.deltaX, 2) + Math.pow(this.deltaY, 2));
  }

  get direction() {
    let x = this.deltaX;
    let y = -this.deltaY;
    let radians = Math.acos(Math.abs(y) / Math.sqrt(x*x + y*y));
    let degrees = radians * 180 / Math.PI;
    if (x >= 0 && y >= 0) {
      return degrees;         // 1st cuadrant
    } else if (x >= 0 && y < 0) {
      return 180 - degrees;   // 2nd cuadrant
    } else if (x < 0 && y < 0) {
      return 180 + degrees;   // 3rd cuadrant
    } else {
      return 360 - degrees;   // 4th cuadrant
    }
  }

  get duration() {
    return this.last.timeStamp - this.first.timeStamp;
  }

  get speedX() {
    let lastEvents = this._getLastEvents();
    let initX    = lastEvents[0].x;
    let initTime = lastEvents[0].timeStamp;
    let lastX    = lastEvents[lastEvents.length - 1].x;
    let lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastX - initX) / (lastTime - initTime) * 1000 || 0;
  }

  get speedY() {
    let lastEvents = this._getLastEvents();
    let initY    = lastEvents[0].y;
    let initTime = lastEvents[0].timeStamp;
    let lastY    = lastEvents[lastEvents.length - 1].y;
    let lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastY - initY) / (lastTime - initTime) * 1000 || 0;
  }

  // Methods
  push(event) {
    let touch = event.touches[0];
    let summary = { timeStamp: event.timeStamp, x: touch.pageX, y: touch.pageY };
    this.events.push(summary);
    this.last = summary;
    if (this.defaultPrevented) {
      event.preventDefault();
    }
    if (this.propagationStopped) {
      event.stopPropagation();
    }
    return this;
  }

  isHorizontal(margin = 15) {
    let mod = this.direction % 180;
    return (mod < 90 + margin) && (mod > 90 - margin);
  }

  clear() {
    for (let key in this._originalOpts) {
      this[key] = this._originalOpts[key];
    }
    this.events = [];
    this.last = null;
  }

  preventDefault(thisArg, condFn) {
    var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
    var result = func ? func(this) : true;
    this.defaultPrevented = result;
    return result;
  }

  stopPropagation(thisArg, condFn) {
    var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
    var result = func ? func(this) : true;
    this.propagationStopped = result;
    return result;
  }

  adquire(thisArg, condFn) {
    var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
    var result = func ? func(this) : true;
    this.defaultPrevented = result;
    this.propagationStopped = result;
    return result;
  }

  // Private methods
  _getLastEvents() {
    return this.events.slice(Math.max(this.events.length - 5, 0), this.events.length);
  }
}

export default Gesture;
