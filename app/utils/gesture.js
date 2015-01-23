class Gesture {
  constructor(event = null){
    this.events = [];
    this.defaultPrevented = false;
    this.propagationStopped = false;
    if (event) {
      this.push(event);
    }
  }

  // Methods
  push(event) {
    var touch = event.touches[0];
    var summary = { timeStamp: event.timeStamp, x: touch.pageX, y: touch.pageY };
    this.events.push(summary);
    this.last = summary;
    if (this.defaultPrevented) {
      event.preventDefault();
    }
    if (this.propagationStopped) {
      event.stopPropagation();
    }
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

  isHorizontal(margin = 15) {
    var mod = this.direction % 90;
    return mod < margin || mod > (90 - margin);
  }

  // Getters
  get eventsCount() {
    return this.events.length;
  }

  get duration() {
    return this.last.timeStamp - this.first.timeStamp;
  }

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

  get lastEvents() {
    return this.events.slice(Math.max(this.eventsCount - 5, 0), this.eventsCount);
  }

  get deltaX() {
    return this.x - this.initX;
  }

  get deltaY() {
    return this.y - this.initY;
  }

  get speedX() {
    var lastEvents = this.lastEvents;
    var initX    = lastEvents[0].x;
    var initTime = lastEvents[0].timeStamp;
    var lastX    = lastEvents[lastEvents.length - 1].x;
    var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastX - initX) / (lastTime - initTime) * 1000 || 0;
  }

  get speedY() {
    var lastEvents = this.lastEvents;
    var initY    = lastEvents[0].y;
    var initTime = lastEvents[0].timeStamp;
    var lastY    = lastEvents[lastEvents.length - 1].y;
    var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastY - initY) / (lastTime - initTime) * 1000 || 0;
  }

  get direction() {
    var x = this.deltaX;
    var y = -this.deltaY;
    var radians = Math.acos(Math.abs(y) / Math.sqrt(x*x + y*y));
    var degrees = radians * 180 / Math.PI;
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
}

export default Gesture;
