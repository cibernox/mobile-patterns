import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

export default Ember.Component.extend({
  progress: 0,
  collapseMenuAction: 'collapseMenu',
  expandMenuAction: 'expandMenu',
  attributeBindings: ['style'],

  // Computed properties
  style: function() {
    if (this.width) {
      var translate = (this.get('progress') - 1) * this.width;
      return 'transform: translateX('+ translate +'px);';
    }
  }.property('progress'),

  // Events
  setupEventListeners: function(){
    this.width = this.element.offsetWidth;
    var rootNode = document.querySelector('#' + this.get('observed-element'));
    var self = this;

    function handleTouchStart(evt){
      var gesture = new Gesture(evt);
      if (self.mustTrack(gesture)) {
        self.gesture = gesture;
        self.offset = Math.max(0, self.get('progress') * self.width - gesture.initPageX);
        rootNode.addEventListener('touchmove', handleTouchMove);
        rootNode.addEventListener('touchend', handleTouchEnd);
      }
    }
    function handleTouchMove(evt){
      evt.preventDefault();
      self.gesture.push(event);
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
  mustTrack: function(gesture) {
    return this.get('progress') === 1 || gesture.initPageX <= 20;
  },

  updateProgress: function(){
    var newProgress = Math.min((this.gesture.pageX + this.offset) / this.width, 1);
    this.sendAction('action', newProgress);
    this.tick = false;
  },

  completeExpansion: function(){
    var progress = this.get('progress');
    var gestureSpeed;

    if (progress === 0 || progress === 1) {
      return;
    }

    gestureSpeed = this.gesture.speedX;

    if (gestureSpeed < -500 || gestureSpeed <= 500 && progress < 0.5) {
      this.sendAction('collapseMenuAction');
    } else {
      this.sendAction('expandMenuAction');
    }
  }
});
