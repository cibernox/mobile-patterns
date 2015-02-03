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


}
