import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';
import BezierEasing from 'mobile-patterns/utils/bezier-easing';

export default Ember.Component.extend({
  inverseEasing: new BezierEasing(0, 0.42, 1, 0.58),
  browserDetector: Ember.inject.service(),

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
    if (this.get('browserDetector').isSafari) {
      return;
    }
    let rootNode = document.querySelector('#' + this.get('observed-element'));

    let handleTouchStart = evt => {
      var progress = this.player.currentTime / this.duration;
      this.gesture = new Gesture().push(evt);
      if (progress === 1 || this.gesture.initX <= 20) {
        this.gesture.adquire();
        this.offset = Math.max(0, progress * this.width - this.gesture.initX);
        rootNode.addEventListener('touchmove', handleTouchMove);
        rootNode.addEventListener('touchend', handleTouchEnd);
      }
    }

    let handleTouchMove = evt => {
      this.gesture.push(evt);
      let newProgress = Math.min((this.gesture.x + this.offset) / this.width, 1);
      this.player.currentTime = this.inverseEasing(newProgress) * this.duration;
    }

    let handleTouchEnd = () => {
      rootNode.removeEventListener('touchmove', handleTouchMove);
      rootNode.removeEventListener('touchend', handleTouchEnd);
      this.completeExpansion();
    }

    rootNode.addEventListener('touchstart', handleTouchStart, true);
  }.on('didInsertElement'),

  completeExpansion: function(){
    let progress = this.player.currentTime / this.duration;
    if (progress === 0 || progress === 1) {
      return;
    }

    let speed = this.gesture.speedX * this.duration / this.width / 1000;
    if (speed < -1 || speed <= 1 && progress < 0.5) {
      this.player.playbackRate = Math.min(speed, -1);
    } else {
      this.player.playbackRate = Math.max(speed, 1);
    }
    this.player.play();
  }
});
