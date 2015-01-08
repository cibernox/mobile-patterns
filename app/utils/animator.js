import BezierEasing from 'mobile-patterns/utils/bezier-easing';

var linearEasing = x => x;

class Animator {

  constructor(config) {
    this.origin   = config.origin;
    this.target   = config.target;
    this.value    = config.value || config.origin;
    this.duration = config.duration;
    this.progress = (this.value - this.origin) / (this.target - this.origin);
    if (config.speed) {
      this.duration = 1 / config.speed;
    }
    var easing = config.easing || linearEasing;
    this.remainingFrames = Math.round(this.duration * (1 - this.progress) * 60);
    this.progressDelta   = (1 - this.progress) / this.remainingFrames;
    this.easing          = typeof easing === 'function' ? easing : BezierEasing.css[easing];
  }

  get nextProgress() {
    return Math.max(0, Math.min(1, this.progress + this.progressDelta));
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
      self.value = self.easing(self.progress) * (self.target - self.origin) + self.origin;
      callback(self.value);

      if (self.value !== self.target) {
        requestAnimationFrame(fn);
      }
    }
    requestAnimationFrame(fn);
  }
}

export default Animator;
