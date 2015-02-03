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
