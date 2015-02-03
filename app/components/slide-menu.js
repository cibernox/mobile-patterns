import Ember from 'ember';
import SwipeGesture from 'mobile-patterns/utils/swipe-gesture';
import BezierEasing from 'mobile-patterns/utils/bezier-easing';

export default Ember.Component.extend({
  inverseEasing: new BezierEasing(0, 0.42, 1, 0.58),
  browserDetector: Ember.inject.service(),
  gesture: new SwipeGesture(),

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

  setupEventListeners: function() {
    if (!this.get('browserDetector').isSafari) {
      let rootNode = document.querySelector('#' + this.get('observed-element'));
      let handler = e => this.gesture.push(e);

      rootNode.addEventListener('touchstart', e => {
        if (e.touches[0].pageX < 20 || this.player.currentTime === this.duration) {
          handler(e);
          rootNode.addEventListener('touchmove', handler, true);
          rootNode.addEventListener('touchend', handler, true);
        }
      }, true);

      this.gesture.on('progress', swipe => {
        var progress = Math.min(swipe.x / this.width, 1);
        this.player.currentTime = this.inverseEasing(progress) * this.duration;
      });

      this.gesture.on('end', swipe => {
        this.completeExpansion();
        swipe.clear();
        rootNode.removeEventListener('touchmove', handler, true);
        rootNode.removeEventListener('touchend', handler, true);
      });
    }
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
