import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

var computed = Ember.computed;

export default Ember.Component.extend({
  classNames: ['animated-deck'],
  classNameBindings: ['effectClass'],
  duration: 600,

  // Initializer
  setupAnimation: function() {
    this.width = this.element.offsetWidth;
    var cards = this.element.querySelectorAll('.animated-card');
    var opts = { duration: this.duration, fill: 'both', easing: 'ease-in-out' };
    var previousKeyframes = [
      { transform: `scale(1) translate(0px)`, offset: 0 },
      { transform: `scale(0.9) translate(0px)`, offset: 0.15 },
      { transform: `scale(0.9) translate(${this.width}px)`, offset: 0.85 },
      { transform: `scale(1) translate(${this.width}px)`, offset: 1 }
    ];
    var nextKeyframes = [
      { transform: `scale(1) translate(0px)`, offset: 0  },
      { transform: `scale(0.9) translate(0px)`, offset: 0.15 },
      { transform: `scale(0.9) translate(-${this.width}px)`, offset: 0.85 },
      { transform: `scale(1) translate(-${this.width}px)`, offset: 1  }
    ];
    var nextAnimations = [];
    var previousAnimations = [];
    for (let i = 0; i < cards.length; i++) {
      nextAnimations.push(new Animation(cards[i], nextKeyframes, opts));
      previousAnimations.push(new Animation(cards[i], previousKeyframes, opts));
    }
    this.nextAnimation = new AnimationGroup(nextAnimations);
    this.previousAnimation = new AnimationGroup(previousAnimations);
    window.debugComponent = this;
  }.on('didInsertElement'),

  // CPs
  effectClass: computed('effect', function() {
    return `effect-${this.effect}`;
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
    this.player.playbackRate = 0;
    this.player.currentTime = 0;
    this.player = null;
  }.observes('current'),

  // Event handling
  touchStart: function(e) {
    this.gesture = new Gesture(e.originalEvent);
  },

  touchMove: function(e) {
    this.gesture.push(e.originalEvent);
    if (this.gesture.isHorizontal()) {
      this.gesture.adquire();
      this.player = this.getPlayer();
      this.player.currentTime = Math.abs(this.gesture.deltaX) / this.width * this.duration;
    }
  },

  touchEnd: function(e) {
    e.preventDefault();
    this.finalizeAnimation();
    this.gesture = null;
  },

  // Functions
  getPlayer: function() {
    if (this.player) {
      return this.player;
    }
    var player;
    if (this.gesture.deltaX > 0) {
      player = document.timeline.play(this.previousAnimation);
    } else {
      player = document.timeline.play(this.nextAnimation);
    }
    player.pause();
    return player;
  },

  finalizeAnimation: function() {
    var progress = this.player.currentTime / this.duration;
    if (progress === 0) {
      return;
    }

    var speed = -this.gesture.speedX * this.duration / this.width / 1000;

    if (progress < 0.5 && Math.abs(speed) < 1) {
      // abort animation
      this.player.playbackRate = -1;
      this.player.onfinish = () => this.player.pause();
    } else if (this.player.source === this.nextAnimation && (speed > 1 || progress > 0.5)) {
      // Transition to next
      this.player.playbackRate = Math.max(speed, 1);
      this.player.onfinish = () => this.sendAction('onChange', this.get('next'));
    } else {
      // Transition to previous
      this.player.playbackRate = Math.max(-speed, 1);
      this.player.onfinish = () => this.sendAction('onChange', this.get('previous'));
    }

    this.player.play();
  }
});
