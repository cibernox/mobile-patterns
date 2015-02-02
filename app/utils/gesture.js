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
    for (let key in opts) {
      this[key] = opts[key];
    }
    this.events = this.events || [];
    this.defaultPrevented = this.defaultPrevented || false;
    this.propagationStopped = this.defaultPrevented || false;
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


  // constructor(event = null){
  //   this.events = [];
  //   this.defaultPrevented = false;
  //   this.propagationStopped = false;
  //   if (event) {
  //     this.push(event);
  //   }
  // }

  // // Methods
  // push(event) {
  //   var touch = event.touches[0];
  //   var summary = { timeStamp: event.timeStamp, x: touch.pageX, y: touch.pageY };
  //   this.events.push(summary);
  //   this.last = summary;
  //   if (this.defaultPrevented) {
  //     event.preventDefault();
  //   }
  //   if (this.propagationStopped) {
  //     event.stopPropagation();
  //   }
  // }

  // preventDefault(thisArg, condFn) {
  //   var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
  //   var result = func ? func(this) : true;
  //   this.defaultPrevented = result;
  //   return result;
  // }

  // stopPropagation(thisArg, condFn) {
  //   var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
  //   var result = func ? func(this) : true;
  //   this.propagationStopped = result;
  //   return result;
  // }

  // adquire(thisArg, condFn) {
  //   var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
  //   var result = func ? func(this) : true;
  //   this.defaultPrevented = result;
  //   this.propagationStopped = result;
  //   return result;
  // }

  // isHorizontal(margin = 15) {
  //   var mod = this.direction % 180;
  //   return (mod < 90 + margin) && (mod > 90 - margin);
  // }

  // // Getters
  // get eventsCount() {
  //   return this.events.length;
  // }

  // get duration() {
  //   return this.last.timeStamp - this.first.timeStamp;
  // }

  // get first(){
  //   return this.events[0];
  // }

  // get x(){
  //   return this.last.x;
  // }

  // get y(){
  //   return this.last.y;
  // }

  // get initX() {
  //   return this.first.x;
  // }

  // get initY() {
  //   return this.first.y;
  // }

  // get lastEvents() {
  //   return this.events.slice(Math.max(this.eventsCount - 5, 0), this.eventsCount);
  // }

  // get deltaX() {
  //   return this.x - this.initX;
  // }

  // get deltaY() {
  //   return this.y - this.initY;
  // }

  // get delta() {
  //   return Math.sqrt(Math.pow(this.deltaX, 2) + Math.pow(this.deltaY, 2));
  // }

  // get speedX() {
  //   var lastEvents = this.lastEvents;
  //   var initX    = lastEvents[0].x;
  //   var initTime = lastEvents[0].timeStamp;
  //   var lastX    = lastEvents[lastEvents.length - 1].x;
  //   var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

  //   return (lastX - initX) / (lastTime - initTime) * 1000 || 0;
  // }

  // get speedY() {
  //   var lastEvents = this.lastEvents;
  //   var initY    = lastEvents[0].y;
  //   var initTime = lastEvents[0].timeStamp;
  //   var lastY    = lastEvents[lastEvents.length - 1].y;
  //   var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

  //   return (lastY - initY) / (lastTime - initTime) * 1000 || 0;
  // }

  // get direction() {
  //   var x = this.deltaX;
  //   var y = -this.deltaY;
  //   var radians = Math.acos(Math.abs(y) / Math.sqrt(x*x + y*y));
  //   var degrees = radians * 180 / Math.PI;
  //   if (x >= 0 && y >= 0) {
  //     return degrees;         // 1st cuadrant
  //   } else if (x >= 0 && y < 0) {
  //     return 180 - degrees;   // 2nd cuadrant
  //   } else if (x < 0 && y < 0) {
  //     return 180 + degrees;   // 3rd cuadrant
  //   } else {
  //     return 360 - degrees;   // 4th cuadrant
  //   }
  // }
}

export default Gesture;
