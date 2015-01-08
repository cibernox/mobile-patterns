import BezierEasing from 'mobile-patterns/utils/bezier-easing';

class Animator {

  constructor({origin, target, value, duration, speed, easing}) {
    this.easing = (typeof easing === 'function' ? easing : BezierEasing.css[easing || 'linear']);
    this.origin = origin;
    this.target = target;
    this.value  = value || origin;
    this.progress = this.inverseEasing((this.value - origin) / (target - origin));
    this.duration = duration || 1 / speed;
    this.remainingFrames = Math.round(this.duration * (1 - this.progress) * 60);
    this.progressDelta   = (1 - this.progress) / this.remainingFrames;
  }

  get nextProgress() {
    return Math.max(0, Math.min(1, this.progress + this.progressDelta));
  }

  get inverseEasing() {
    if (!this._inverseEasing) {
      var [{x: x1, y:y1}, {x: x2, y: y2}] = this.easing.getControlPoints();
      this._inverseEasing = new BezierEasing(y1, x1, y2, x2);
    }
    return this._inverseEasing;
  }

  play(thisArg, callback, ...args) {
    if (arguments.length === 1) {
      callback = thisArg;
    } else if (arguments.length >= 2) {
      callback = callback.bind(thisArg, ...args);
    }
    var self = this;
    function fn() {
      self.progress = self.nextProgress;
      self.value    = self.easing(self.progress) * (self.target - self.origin) + self.origin;
      callback(self.value);

      if (self.value !== self.target) {
        requestAnimationFrame(fn);
      }
    }
    requestAnimationFrame(fn);
  }
}

export default Animator;
