class Animator {

  constructor(config) {
    this.origin   = config.origin;
    this.target   = config.target;
    this.value    = config.value || config.origin;
    this.duration = config.duration;
    if (config.speed) {
      this.duration = 1 / config.speed;
    }
  }

  get progress() {
    return (this.value - this.origin) / (this.target - this.origin);
  }

  get remainingFrames() {
    return Math.round(this.duration * (1 - this.progress) * 60);
  }

  get delta() {
    return (this.target - this.value) / this.remainingFrames;
  }

  play(thisArg, callback, ...args) {
    if (arguments.length === 1) {
      callback = thisArg;
    }
    if (arguments.length >= 2) {
      callback = callback.bind(thisArg, ...args);
    }
    var self = this;
    var delta = this.delta;
    function fn() {
      self.value = Math.abs(self.target - self.value) <= Math.abs(delta) ? self.target : self.value + delta;
      callback(self.value);

      if (self.value !== self.target) {
        requestAnimationFrame(fn);
      }
    }
    requestAnimationFrame(fn);
  }
}

export default Animator;
