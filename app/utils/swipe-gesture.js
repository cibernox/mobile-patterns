import Gesture from 'mobile-patterns/utils/gesture';

export default class SwipeGesture extends Gesture {
  constructor(opts = {}) {
    opts.minLength   = opts.minLength === undefined && 20 || opts.minLength;
    opts.warnLength  = opts.warnLength === undefined && 10 || opts.warnLength;
    opts.errorMargin = opts.errorMargin === undefined && 20 || opts.errorMargin;
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
      this.startOffset = this.initX - this.x;
      this.emit('start', this);
      return this;
    }
    if (this._started) {
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
