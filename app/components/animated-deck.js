import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

var computed = Ember.computed;
var aMap = Array.prototype.map;

export default Ember.Component.extend({
  classNames: ['animated-deck'],
  classNameBindings: ['effectClass'],
  duration: 1000,

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

  // Initializer
  setupAnimation: function() {
    this.width = this.element.offsetWidth;
    var cards = this.element.querySelectorAll('.animated-card');
    var opts = { duration: this.duration, fill: 'both' };
    var keyframes = [
      { transform: `scale(1) translate(${this.width}px)` },
      { transform: `scale(0.9) translate(${this.width}px)`, offset: 1/20 },
      { transform: `scale(0.9) translate(0px)`, offset: 9/20 },
      { transform: `scale(1) translate(0px)`, offset: 10/20 },
      { transform: `scale(0.9) translate(0px)`, offset: 11/20 },
      { transform: `scale(0.9) translate(-${this.width}px)`, offset: 19/20 },
      { transform: `scale(1) translate(-${this.width}px)` },
    ];
    var group = new AnimationGroup(aMap.call(cards, c => new Animation(c, keyframes, opts)));
    this.player = document.timeline.play(group);
    this.player.pause();
    this.player.currentTime = this.duration / 2;
  }.on('didInsertElement'),

  // Event handling
  touchStart: function(e) {
    if (!this.animating) {
      this.gesture = new Gesture(e.originalEvent);
    }
  },

  touchMove: function(e) {
    if (!this.gesture) { return; }
    this.gesture.push(e.originalEvent);
    if (this.mustTrack()) {
      this.updateAnimation();
    }
  },

  touchEnd: function(e) {
    if (!this.gesture) { return; }
    e.preventDefault();
    this.finalizeAnimation();
    this.gesture = null;
    this.tracking = false;
  },

  // Observers
  resetAnimation: function() {
    this.player.currentTime = this.duration / 2;
    this.animating = false;
  }.observes('current'),

  // Functions
  mustTrack: function() {
    if (!this.tracking) {
      this.tracking = this.gesture.isHorizontal();
      return this.tracking;
    }
    return true;
  },

  updateAnimation: function() {
    this.player.currentTime = (-this.gesture.deltaX + this.width) / (this.width * 2) * this.duration;
  },

  finalizeAnimation: function() {
    if (this.gesture.deltaX === 0) {
      return;
    }
    var progress = (-this.gesture.deltaX + this.width) / (this.width * 2);
    var speed = this.gesture.speedX * this.duration / this.width / 1000;
    if (progress > 0.75 || speed < -1) {
      // go to next
      if (!this.get('next')) {
        return this.bounceBack();
      }
      this.player.playbackRate = Math.max(1, -speed);
      this.player.onfinish = () => {
        this.sendAction('onChange', this.get('next'));
        this.player.pause();
      };
      this.player.play();
    } else if (progress < 0.25 || speed > 1) {
      // go to previous
      if (!this.get('previous')) {
        return this.bounceBack();
      }
      this.player.playbackRate = Math.min(-1, speed);
      this.player.onfinish = () => {
        this.sendAction('onChange', this.get('previous'));
        this.player.pause();
      };
      this.player.play();
    } else {
      // to go same
      this.bounceBack();
    }
  },

  bounceBack: function() {
    var progressDiff = (-this.gesture.deltaX + this.width) / (this.width * 2) - 0.5;
    var frames = Math.ceil(Math.abs(progressDiff) * this.duration / 16.67);
    var frameDelta = progressDiff / frames;
    var tick = () => {
      this.player.currentTime = this.player.currentTime - (frameDelta * this.duration);
      if (--frames > 0) {
        requestAnimationFrame(tick);
      } else {
        this.animating = false;
      }
    };
    requestAnimationFrame(tick);
  }
});
