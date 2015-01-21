import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

var computed = Ember.computed;

export default Ember.Component.extend({
  classNames: ['animated-deck'],
  classNameBindings: ['animationClass'],
  duration: 1000,

  // Initializer
  setupAnimation: function() {
    this.width = this.element.offsetWidth;
    var cards = this.element.querySelectorAll('.animated-card');
    var opts = { duration: this.duration, fill: 'both' };
    var keyframes = [
      { transform: `scale(1) translate(-${this.width}px)` },
      { transform: `scale(0.9) translate(-${this.width}px)` },
      { transform: `scale(0.9) translate(0px)` },
      { transform: `scale(1) translate(0px)` },
      { transform: `scale(0.9) translate(0px)` },
      { transform: `scale(0.9) translate(${this.width}px)` },
      { transform: `scale(1) translate(${this.width}px)` }
    ]
    var animations = [];
    for (let i = 0; i < cards.length; i++) {
      animations.push(new Animation(cards[i], keyframes, opts));
    }
    this.player = document.timeline.play(new AnimationGroup(animations));
    this.player.pause();
    this.player.currentTime = this.duration / 2;
  }.on('didInsertElement'),

  // CPs
  animationClass: computed('animation', function() {
    return `effect-${this.animation}`;
  }),

  previous: computed('items.[]', 'current', function() {
    var items = this.get('items');
    var index = items.indexOf(this.get('current'));
    return items.objectAt(index - 1);
  }),

  next: computed('items.[]', 'current', function() {
    var items = this.get('items');
    var index = items.indexOf(this.get('current'));
    return items.objectAt(index + 1);
  }),

  // Observers
  resetAnimation: function() {
    this.player.currentTime = this.duration / 2;
  }.observes('current'),

  // Event handling
  touchStart: function(e) {
    this.gesture = new Gesture(e.originalEvent);
    this.gesture.adquire();
  },
  touchMove: function(e) {
    this.gesture.push(e.originalEvent);
    var progress = (this.gesture.deltaX + 320) / (320 * 2);
    this.player.currentTime = progress * this.duration;
  },
  touchEnd: function(e) {
    e.preventDefault();
    if (this.gesture.speedX > 0) {
      this.player.playbackRate = 1;
      this.player.onfinish = (e) => {
        this.player.playbackRate = 0;
        this.sendAction('onChange', this.get('previous'));
      }
    } else if (this.gesture.speedX < 0) {
      this.player.playbackRate = -1;
      this.player.onfinish = (e) => {
        this.player.playbackRate = 0;
        this.sendAction('onChange', this.get('next'));
      }
    }
    this.player.play();
    this.gesture = null;
  }
});
