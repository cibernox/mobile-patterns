import Ember from 'ember';
import SwipeGesture from 'mobile-patterns/utils/swipe-gesture';

var computed = Ember.computed;
var aMap = Array.prototype.map;

export default Ember.Component.extend({
  classNames: ['animated-deck'],
  classNameBindings: ['effectClass'],
  attributeBindings: ['style'],
  gesture: new SwipeGesture(),
  duration: 800,

  // CPs
  effectClass: computed('effect', function() {
    return `effect-${this.effect}`;
  }),

  previous: computed('items.[]', 'current', function() {
    let items = this.get('items') || [];
    let index = items.indexOf(this.get('current'));
    return items.objectAt(index - 1);
  }),

  next: computed('items.[]', 'current', function() {
    let items = this.get('items') || [];
    let index = items.indexOf(this.get('current'));
    return items.objectAt(index + 1);
  }),

  // Observers
  resetAnimation: function() {
    this.player.currentTime = 0;
    this.player.cancel();
    this.set('animatingToPrevious', false);
    this.set('animatingToNext', false);
  }.observes('current'),

  // Initializers
  setupAnimation: function() {
    this.width = this.element.offsetWidth;
    this.gesture.on('warn', () => this.prepareAnimation());
    this.gesture.on('progress', () => this.updateAnimation());
    this.gesture.on('end', () => this.finalizeAnimation());
  }.on('didInsertElement'),

  // Event handling
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

  // Functions
  prepareAnimation: function() {
    let opts = { duration: this.duration, fill: 'both' };
    let keyframes;
    if (this.gesture.deltaX < 0) {
      // Animate to next
      this.set('animatingToPrevious', false);
      this.set('animatingToNext', true);
      keyframes = [
        { transform: `scale(1) translate(0)`, offset: 0 },
        { transform: `scale(0.9) translate(0)`, offset: 1.5/10 },
        { transform: `scale(0.9) translate(-${this.width}px, 0)`, offset: 8.5/10 },
        { transform: `scale(1) translate(-${this.width}px, 0)`, offset: 1 }
      ];
    } else {
      // Animate to previous
      this.set('animatingToPrevious', true);
      this.set('animatingToNext', false);
      keyframes = [
        { transform: `scale(1) translate(0,0)`, offset: 0 },
        { transform: `scale(0.9) translate(0,0)`, offset: 1.5/10 },
        { transform: `scale(0.9) translate(${this.width}px, 0)`, offset: 8.5/10 },
        { transform: `scale(1) translate(${this.width}px, 0)`, offset: 1 }
      ];
    }
    Ember.run.schedule('afterRender', this, function() {
      if (this.animatingToPrevious) {
        var group = new AnimationGroup([
          new Animation(this.element.querySelector('#current-card'), keyframes, opts),
          new Animation(this.element.querySelector('#previous-card'), keyframes, opts),
        ]);
      } else {
        var group = new AnimationGroup([
          new Animation(this.element.querySelector('#current-card'), keyframes, opts),
          new Animation(this.element.querySelector('#next-card'), keyframes, opts),
        ]);
      }
      this.player = document.timeline.play(group);
      this.player.pause();
    });
  },

  updateAnimation: function() {
    let progress = Math.abs(-this.gesture.deltaX + this.gesture.startOffset) / this.width;
    this.player.currentTime = progress * this.duration;
  },

  finalizeAnimation: function() {
    let progress = Math.abs(-this.gesture.deltaX + this.gesture.startOffset) / this.width;
    let speed = Math.abs(this.gesture.speedX) / this.width;
    let target = this.get(this.animatingToPrevious ? 'previous' : 'next');
    if (target && (progress > 0.5 || speed > 1)) {
      this.player.playbackRate = speed;
      this.player.onfinish = () => {
        this.sendAction('onChange', target);
        this.player.pause();
      };
    } else {
      this.player.playbackRate = -1;
      this.player.onfinish = () => this.player.pause();
    }
    this.player.play();
  },

  bounceBack: function() {
    let progressDiff = (-this.gesture.deltaX + this.gesture.startOffset + this.width) / (this.width * 2) - 0.5;
    let frames = Math.ceil(Math.abs(progressDiff) * this.duration / 16.67);
    let frameDelta = progressDiff / frames;
    let tick = () => {
      this.player.currentTime = this.player.currentTime - (frameDelta * this.duration);
      if (--frames > 0) {
        requestAnimationFrame(tick);
      } else {
        this.set('animatingToPrevious', false);
        this.set('animatingToNext', false);
      }
    };
    requestAnimationFrame(tick);
  },

  // generateAnimation: function(card, index) {
  //   var keyframes;
  //   if (this.effect === 'slide') {
  //     keyframes = [
  //       { transform: `translate3d(${this.width}px, 0, 0)` },
  //       { transform: `translate3d(0, 0, 0)` },
  //       { transform: `translate3d(-${this.width}px, 0, 0)` }
  //     ];
  //   } else if (this.effect === 'expose') {
  //     keyframes = [
  //       { transform: `scale(1) translate(${this.width}px, 0)` },
  //       { transform: `scale(0.9) translate(${this.width}px, 0)`, offset: 1.5/20 },
  //       { transform: `scale(0.9) translate(0, 0)`, offset: 8.5/20 },
  //       { transform: `scale(1) translate(0, 0)`, offset: 10/20 },
  //       { transform: `scale(0.9) translate(0, 0)`, offset: 11.5/20 },
  //       { transform: `scale(0.9) translate(-${this.width}px, 0)`, offset: 18.5/20 },
  //       { transform: `scale(1) translate(-${this.width}px, 0)` }
  //     ];
  //   } else if (this.effect === 'stack') {
  //     switch (index) {
  //       case 0:
  //         keyframes = [
  //           { transform: `scale(1) translate(0, 0)`, opacity: 1, visibility: 'visible' },
  //           { transform: `scale(0.8) translate(0, 0)`, opacity: 0, visibility: 'hidden' },
  //           { transform: `scale(0) translate(0, 0)`, opacity: 0, visibility: 'hidden' },
  //         ];
  //         break;
  //       case 1:
  //         keyframes = [
  //           { transform: `scale(1) translate(${this.width + 25}px, 50px) rotate(5deg)`, opacity: 1, visibility: 'hidden' },
  //           { transform: `scale(1) translate(0, 0) rotate(0)`, opacity: 1, visibility: 'visible' },
  //           { transform: `scale(0.8) translate(0, 0) rotate(0)`, opacity: 0, visibility: 'hidden' },
  //         ];
  //         break;
  //       case 2:
  //         keyframes = [
  //           { transform: `scale(1) translate(25px, 0) rotate(0)`, opacity: 0, visibility: 'hidden' },
  //           { transform: `scale(1) translate(25px, 50px) rotate(5deg)`, opacity: 1, visibility: 'hidden' },
  //           { transform: `scale(1) translate(${-this.width}px, 0) rotate(0)`, opacity: 1, visibility: 'visible' },
  //         ];
  //     }
  //   }
  //   var opts = { duration: this.duration, fill: 'both' };
  //   return new Animation(card, keyframes, opts);
  // }
});

