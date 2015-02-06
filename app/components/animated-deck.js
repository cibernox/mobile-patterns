import Ember from 'ember';
import SwipeGesture from 'mobile-patterns/utils/swipe-gesture';
import GestureListenerMixin from 'mobile-patterns/mixins/gesture-listener';

var computed = Ember.computed;
var aMap = Array.prototype.map;

export default Ember.Component.extend(GestureListenerMixin, {
  classNames: ['animated-deck'],
  classNameBindings: ['effectClass'],
  duration: 500,
  gesture: new SwipeGesture(),
  gestureWarn: 'prepareAnimation',
  gestureProgress: 'updateAnimation',
  gestureEnd: 'finalizeAnimation',

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
    this.element.querySelector('#current-card').scrollTop = 0;
  }.observes('current'),

  // Initializers
  cacheWidth: function() {
    this.width = this.element.offsetWidth;
  }.on('didInsertElement'),

  cleanup: function() {
    if (this.player) {
      this.player.cancel();
    }
  }.on('willDestroyElement'),

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
    let currentCardkeyframes, otherCardkeyframes;
    if (this.gesture.deltaX < 0) {
      // Animate to next
      this.set('animatingToPrevious', false);
      this.set('animatingToNext', true);
      currentCardkeyframes = this.getKeyframes({card: 'current', direction: 'next'});
      otherCardkeyframes = this.getKeyframes({card: 'next', direction: 'next'});
    } else {
      // Animate to previous
      this.set('animatingToPrevious', true);
      this.set('animatingToNext', false);
      currentCardkeyframes = this.getKeyframes({card: 'current', direction: 'previous'});
      otherCardkeyframes = this.getKeyframes({card: 'previous', direction: 'previous'});
    }
    Ember.run.schedule('afterRender', this, function() {
      var group;
      if (this.animatingToPrevious) {
        group = new AnimationGroup([
          new Animation(this.element.querySelector('#current-card'), currentCardkeyframes, opts),
          new Animation(this.element.querySelector('#previous-card'), otherCardkeyframes, opts),
        ]);
      } else {
        group = new AnimationGroup([
          new Animation(this.element.querySelector('#current-card'), currentCardkeyframes, opts),
          new Animation(this.element.querySelector('#next-card'), otherCardkeyframes, opts),
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
      this.player.playbackRate = Math.max(speed, 1);
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

  getKeyframes: function({ card, direction }) {
    if (this.effect === 'slide') {
      if (direction === 'next') {
        return [{ transform: `translate(0, 0)` }, { transform: `translate(-${this.width}px, 0)` }];
      } else {
        return [{ transform: `translate(0,0)` }, { transform: `translate(${this.width}px, 0)` }];
      }
    } else if (this.effect === 'expose') {
      if (direction === 'next') {
        return [
          { transform: `scale(1) translate(0,0)` },
          { transform: `scale(0.9) translate(0,0)`, offset: 1.5/10 },
          { transform: `scale(0.9) translate(-${this.width}px, 0)`, offset: 8.5/10 },
          { transform: `scale(1) translate(-${this.width}px, 0)` }
        ];
      } else {
        return [
          { transform: `scale(1) translate(0,0)` },
          { transform: `scale(0.9) translate(0,0)`, offset: 1.5/10 },
          { transform: `scale(0.9) translate(${this.width}px, 0)`, offset: 8.5/10 },
          { transform: `scale(1) translate(${this.width}px, 0)` }
        ];
      }
    } else if (this.effect === 'stack') {
      if (direction === 'next') {
        if (card === 'current') {
          return [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.8)', opacity: 0 }];
        } else {
          return [{ transform: `translate(0,0)` }, { transform: `translate(-${this.width}px, 0)` }];
        }
      } else if (direction === 'previous') {
        if (card === 'current') {
          return [{ transform: `translate(0,0)` }, { transform: `translate(${this.width}px, 0)` }];
        } else {
          return [{ transform: 'scale(0.8)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }];
        }
      }
    }
  }
});

