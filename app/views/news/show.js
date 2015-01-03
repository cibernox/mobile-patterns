import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

export default Ember.View.extend({
  ignoreGesture: false,

  touchStart: function(evt) {
    this.gesture = new Gesture(evt.originalEvent);
  },

  touchMove: function(evt) {
    if (this.ignoreGesture) {
      return;
    }
    this.gesture.push(evt);
    this.handleGesture();
  },

  touchEnd: function() {
    this.ignoreGesture = false;
  },

  handleGesture: function() {
    if (this.gesture.initPageX < 20) {
      this.ignoreGesture = true;
      return;
    }
    if (Math.abs(this.gesture.deltaX) < 25) {
      console.log('Gesture too short');
    } else {
      console.log('Handle gesture!');
    }
  }
});
