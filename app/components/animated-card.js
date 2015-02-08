import Ember from 'ember';
import SwipeGesture from 'mobile-patterns/utils/swipe-gesture';
import GestureListenerMixin from 'mobile-patterns/mixins/gesture-listener';

export default Ember.Component.extend(GestureListenerMixin, {
  classNames: ['animated-card'],
  classNameBindings: ['content::placeholder'],
  gesture: new SwipeGesture(),
  gestureWarn: 'prepareAnimation',
  gestureProgress: 'updateAnimation',
  gestureEnd: 'finalizeAnimation',

  touchStart: function(e) {
    if (this.get('content.isLoaded')) {
      this.cardPrepared = true;
      this.gesture.push(e.originalEvent);
    }
  },

  touchMove: function(e) {
    if (this.cardPrepared) {
      this.gesture.push(e.originalEvent);
    }
  },

  touchEnd: function(e) {
    if (this.cardPrepared) {
      this.gesture.push(e.originalEvent);
      this.gesture.clear();
      this.cardPrepared = false;
    }
  },

  prepareAnimation: function() {
    this.sendAction('gestureWarn', this.gesture);
  },

  updateAnimation: function() {
    this.sendAction('gestureProgress', this.gesture);
  },

  finalizeAnimation: function() {
    this.sendAction('gestureEnd', this.gesture);
  }
});
