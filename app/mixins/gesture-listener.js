import Ember from 'ember';

export default Ember.Mixin.create({
  _addGestureListeners: function() {
    if (this.gestureWarn) {
      this._onGestureWarn = () => this[this.gestureWarn]();
      this.gesture.on('warn', this._onGestureWarn);
    }
    if (this.gestureStart) {
      this._onGestureStart = () => this[this.gestureStart]();
      this.gesture.on('start', this._onGestureStart);
    }
    if (this.gestureProgress) {
      this._onGestureProgress = () => this[this.gestureProgress]();
      this.gesture.on('progress', this._onGestureProgress);
    }
    if (this.gestureEnd) {
      this._onGestureEnd = () => this[this.gestureEnd]();
      this.gesture.on('end', this._onGestureEnd);
    }
  }.on('didInsertElement'),

  _removeGestureListeners: function() {
    if (this._onGestureWarn) {
      this.gesture.off('warn', this._onGestureWarn);
    }
    if (this._onGestureStart) {
      this.gesture.off('start', this._onGestureStart);
    }
    if (this.onGestureProgress) {
      this.gesture.off('progress', this._onGestureProgress);
    }
    if (this.onGestureEnd) {
      this.gesture.off('end', this._onGestureEnd);
    }
  }.on('willDestroyElement')
});
