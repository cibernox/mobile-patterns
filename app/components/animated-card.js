import Ember from 'ember';
import SwipeGesture from 'mobile-patterns/utils/swipe-gesture';
import GestureListenerMixin from 'mobile-patterns/mixins/gesture-listener';

export default Ember.Component.extend(GestureListenerMixin, {
  classNames: ['animated-card'],
  classNameBindings: ['content::placeholder'],

  gestureWarn: 'prepareAnimation',
  gestureProgress: 'updateAnimation',
  gestureEnd: 'finalizeAnimation',

  gesture: new SwipeGesture(),

  touchStart: function(e) {
    this.gesture.push(e.originalEvent);
  },

  touchMove: function(e) {
    this.gesture.push(e.originalEvent);
  },

  touchEnd: function(e) {
    this.gesture.push(e.originalEvent);
    this.gesture.clear();
  },

  prepareAnimation: function() {
    this.sendAction('gestureWarn', this.gesture);
  },

  updateAnimation: function() {
    this.sendAction('gestureProgress', this.gesture);
  },

  finalizeAnimation: function() {
    this.sendAction('gestureEnd', this.gesture);
  },

});
