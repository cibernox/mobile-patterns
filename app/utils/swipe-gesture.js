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
// Other non configurable behavior:
//
// A swipe gesture is a one-try gesture. If by the time the gesture surpasses the `minLength` the
// gesture is not possitively detected as a swipe, the gesture will not be tracked ever again.
// IDEA: Maybe a `fail` event should be triggered??
//

import Gesture from 'mobile-patterns/utils/gesture';

export default class SwipeGesture extends Gesture {
  constructor(opts = {}) {
    opts.minLength   = opts.minLength === undefined && 20 || opts.minLength;
    opts.warnLength  = opts.warnLength === undefined && 8 || opts.warnLength;
    opts.errorMargin = opts.errorMargin === undefined && 25 || opts.errorMargin;
    opts.exclusive   = opts.exclusive === undefined && true || false;
    super(opts);
  }

  push(e) {
    if (this._ignoring) {
      return this;
    }
    if (e.type === 'touchend') {
      //
      // TODO: Test this bit.
      //
      if (this._started) {
        this.emit('end', this);
      }
      return this;
    }

    super.push(e);

    if (this._mustIgnore()) {
      this._ignoring = true;
      return this;
    }

    if (!this._warned && this._mustWarn()) {
      this._warned = true;
      this.emit('warn', this);
    }
    if (!this._started && this._mustStart()) {
      this._started = true;
      this.startOffset = this.deltaX;
      if (this.exclusive) {
        this.adquire();
      }
      this.emit('start', this);
      return this;
    }
    if (this._started) {
      // TODO: Verify that when a swipe starts in once direcction, it can't change that direcction.
      this.emit('progress', this);
    }
    return this;
  }

  clear() {
    //
    // TODO: Add tests
    //
    //
    super.clear();
    this._ignoring = false;
    this._warned = false;
    this._started = false;
    this.startOffset = null;
  }

  // Private
  _mustIgnore() {
    return !this._started && Math.abs(this.deltaX) >= this.minLength && !this.isHorizontal();
  }

  _mustStart() {
    return Math.abs(this.deltaX) >= this.minLength && this.isHorizontal();
  }

  _mustWarn() {
    return Math.abs(this.deltaX) >= this.warnLength && this.isHorizontal();
  }
}
