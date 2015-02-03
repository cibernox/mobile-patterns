import Gesture from 'mobile-patterns/utils/gesture';

export default class SwipeGesture extends Gesture {
  constructor(opts = {}) {
    opts.minLength   = opts.minLength === undefined && 20 || opts.minLength;
    opts.warnLength  = opts.warnLength === undefined && 10 || opts.warnLength;
    opts.errorMargin = opts.errorMargin === undefined && 20 || opts.errorMargin;
    opts.exclusive   = !!opts.exclusive || true;
    opts.trackOffset = !!opts.trackOffset || true;
    super(opts);
  }

  push(e) {
    if (this._ignoring) {
      return;
    }
    if (this._tracking && e.type === 'touchend') {
      this.emit('end', this);
      return;
    }

    super.push(e);

    if (!this._warned && this.deltaX >= this.warnLength && this.isHorizontal()) {
      this._warned = true;
      this.emit('warn', this);
    }
    if (!this._tracking && this.deltaX >= this.minLength) {
      if (this.isHorizontal()) {
        this._tracking = true;
        this.emit('start', this);
        return;
      } else {
        this._ignoring = true;
      }
    }
    if (this._tracking) {
      this.emit('progress', this);
    }
    return this;
  }
}
