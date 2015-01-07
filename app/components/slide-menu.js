import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';
import BezierEasing from 'mobile-patterns/utils/bezier-easing';

export default Ember.Component.extend({
  progress: 0,
  collapseMenuAction: 'collapseMenu',
  expandMenuAction: 'expandMenu',
  attributeBindings: ['style'],
  easing: new BezierEasing(0.42, 0.0, 0.58, 1.0),
  reverseEasing: new BezierEasing(0.0, 0.42, 1.0, 0.58),

  // Computed properties
  style: function() {
    if (this.width) {
      var translate = (this.easing(this.get('progress')) - 1) * this.width;
      return 'transform: translateX('+ translate +'px);';
    }
  }.property('progress'),

  // Events
  setupEventListeners: function(){
    this.width = this.element.offsetWidth;
    var rootNode = document.querySelector('#' + this.get('observed-element'));
    var self = this;

    function handleTouchStart(evt){
      self.gesture = new Gesture(evt);
      var progress = self.get('progress');
      if (progress === 1 || self.gesture.initPageX <= 20) {
        self.gesture.adquire();
        self.offset = Math.max(0, progress * self.width - self.gesture.initPageX);
        rootNode.addEventListener('touchmove', handleTouchMove);
        rootNode.addEventListener('touchend', handleTouchEnd);
      }
    }
    function handleTouchMove(evt){
      self.gesture.push(evt);
      if (!self.tick) {
        self.tick = true;
        requestAnimationFrame(self.updateProgress.bind(self));
      }
    }
    function handleTouchEnd(){
      rootNode.removeEventListener('touchmove', handleTouchMove);
      rootNode.removeEventListener('touchend', handleTouchEnd);
      self.completeExpansion();
    }

    rootNode.addEventListener('touchstart', handleTouchStart, true);
  }.on('didInsertElement'),

  // Methods
  updateProgress: function(){
    var newProgress = Math.min((this.gesture.pageX + this.offset) / this.width, 1);
    this.sendAction('action', this.reverseEasing(newProgress));
    this.tick = false;
  },

  completeExpansion: function(){
    var progress = this.get('progress');
    if (progress === 0 || progress === 1) {
      return;
    }

    var gestureSpeed = this.gesture.speedX;
    if (gestureSpeed < -500 || gestureSpeed <= 500 && progress < 0.5) {
      this.sendAction('collapseMenuAction');
    } else {
      this.sendAction('expandMenuAction');
    }
  }
});
