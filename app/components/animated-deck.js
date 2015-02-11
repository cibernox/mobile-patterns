import Ember from 'ember';

var computed = Ember.computed;

export default Ember.Component.extend({
  classNames: ['animated-deck'],
  classNameBindings: ['effectClass'],
  duration: 500,

  // CPs
  previous: computed.alias('current.previousArticle.content'),
  next: computed.alias('current.nextArticle.content'),
  effectClass: computed('effect', function() {
    return `effect-${this.effect}`;
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

  // Functions
  actions: {
    prepareAnimation: function(gesture) {
      let opts = { duration: this.duration, fill: 'both' };
      let currentCardkeyframes, otherCardkeyframes;
      if (gesture.deltaX < 0) {
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

    updateAnimation: function(gesture) {
      let progress = Math.abs(-gesture.deltaX + gesture.startOffset) / this.width;
      this.player.currentTime = progress * this.duration;
    },

    finalizeAnimation: function(gesture) {
      let progress = Math.abs(-gesture.deltaX + gesture.startOffset) / this.width;
      let speed = Math.abs(gesture.speedX) / this.width;
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

