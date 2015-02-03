import Gesture from 'mobile-patterns/utils/gesture';

export default class SwipeGesture extends Gesture {
  constructor(opts = {}) {
    opts.minLength   = opts.minLength === undefined && 20 || opts.minLength;
    opts.warnLength  = opts.warnLength === undefined && 10 || opts.warnLength;
    opts.errorMargin = opts.errorMargin === undefined && 20 || opts.errorMargin;
    opts.exclusive   = opts.exclusive === undefined && true || false;
    opts.trackOffset = opts.trackOffset === undefined && true || false;
    super(opts);
  }

  push(e) {
    if (this._ignoring) {
      return this;
    }
    if (this._started && e.type === 'touchend') {
      this.emit('end', this);
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
      if (this.trackOffset) {
        this.events = [this.last];
      }
      this.emit('start', this);
      return this;
    }
    if (this._started) {
      this.emit('progress', this);
    }
    return this;
  }

  // Private
  _mustIgnore() {
    return !this._tracking && this.deltaX >= this.minLength && !this.isHorizontal();
  }

  _mustStart() {
    return this.deltaX >= this.minLength && this.isHorizontal();
  }

  _mustWarn() {
    return this.deltaX >= this.warnLength && this.isHorizontal();
  }
}
