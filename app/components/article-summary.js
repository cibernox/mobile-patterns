import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

export default Ember.Component.extend({
  classNames: ['article-summary'],

  // Events
  touchStart: function(e) {
    this.gesture = new Gesture(e.originalEvent);
  },

  touchMove: function(e) {
    this.gesture.push(e.originalEvent);
    if (this.mustTrack()) {
      this.gesture.adquire();
      this.sendAction('swipe', this.gesture);
    }
  },

  touchEnd: function() {
    if (this.track) {
      this.sendAction('release', this.gesture);
    }
    this.gesture = null;
    this.track = undefined;
    this.neverTrackAgain = false;
  },

  // Functions
  mustTrack: function() {
    if (this.track === undefined && this.gesture.delta > 15) {
      this.track = !this.neverTrackAgain && this.gesture.isHorizontal(25);
      if (!this.track) {
        this.neverTrackAgain = true;
      } else {
        this.gesture.initialOffset = this.gesture.deltaX;
        this.sendAction('select', this.get('article'));
      }
    }
    return !!this.track;
  },
});
