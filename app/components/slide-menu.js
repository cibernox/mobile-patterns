import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';
import BezierEasing from 'mobile-patterns/utils/bezier-easing';

export default Ember.Component.extend({
  inverseEasing: new BezierEasing(0, 0.42, 1, 0.58),
  // Events
  setupAnimation: function() {
    this.width = this.element.offsetWidth;
    var animation = new Animation(
      this.element,
      [{ transform: 'translateX(0)' }, { transform: `translateX(${this.width}px)` }],
      { duration: this.duration, fill: 'both', easing: 'cubic-bezier(0.42, 0, 0.58, 1)' }
    );
    this.sendAction('action', animation);
  }.on('didInsertElement'),

  setupEventListeners: function(){
    this.width = this.element.offsetWidth;
    var rootNode = document.querySelector('#' + this.get('observed-element'));
    var self = this;

    function handleTouchStart(evt) {
      var progress = self.player.currentTime / self.duration;
      self.gesture = new Gesture(evt);
      if (progress === 1 || self.gesture.initPageX <= 20) {
        self.gesture.adquire();
        self.offset = Math.max(0, progress * self.width - self.gesture.initPageX);
        rootNode.addEventListener('touchmove', handleTouchMove);
        rootNode.addEventListener('touchend', handleTouchEnd);
      }
    }
    function handleTouchMove(evt) {
      self.gesture.push(evt);
      var newProgress = Math.min((self.gesture.pageX + self.offset) / self.width, 1);
      self.player.currentTime = self.inverseEasing(newProgress) * self.duration;
    }
    function handleTouchEnd() {
      rootNode.removeEventListener('touchmove', handleTouchMove);
      rootNode.removeEventListener('touchend', handleTouchEnd);
      self.completeExpansion();
    }

    rootNode.addEventListener('touchstart', handleTouchStart, true);
  }.on('didInsertElement'),

  completeExpansion: function(){
    var progress = this.player.currentTime / this.duration;
    if (progress === 0 || progress === 1) {
      return;
    }

    var speed = this.gesture.speedX * this.duration / this.width / 1000;
    if (speed < -1 || speed <= 1 && progress < 0.5) {
      this.player.playbackRate = Math.min(speed, -1);
    } else {
      this.player.playbackRate = Math.max(speed, 1);
    }
    this.player.play();
  }
});
