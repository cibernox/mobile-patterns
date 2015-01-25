import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

var computed = Ember.computed;

export default Ember.Component.extend({
  classNames: ['animated-deck'],
  classNameBindings: ['effectClass'],
  duration: 600,

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
    var animOpts = { duration: this.duration, fill: 'both' };
    var prevKeyframes = [
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
    var a1 = new Animation(this.element.querySelector('#previous-card'), prevKeyframes, animOpts);
    var a2 = new Animation(this.element.querySelector('#current-card'), prevKeyframes, animOpts);
    this.previousPlayers = [document.timeline.play(a1), document.timeline.play(a2)];

    var a3 = new Animation(this.element.querySelector('#current-card'), nextKeyframes, animOpts);
    var a4 = new Animation(this.element.querySelector('#next-card'), nextKeyframes, animOpts);
    this.nextPlayers = [document.timeline.play(a3), document.timeline.play(a4)];

    this.previousPlayers.forEach(p => p.cancel());
    this.nextPlayers.forEach(p => p.cancel());
  }.on('didInsertElement'),

  // Observers
  resetAnimation: function() {
    this.players.forEach(p => {
      p.currentTime = 0; // This shouldn't be necesary. Another bug in the polyfill?
      p.cancel();
    });
    this.players = null;
  }.observes('current'),

  // Event handling
  touchStart: function(e) {
    this.gesture = new Gesture(e.originalEvent);
  },

  touchMove: function(e) {
    this.gesture.push(e.originalEvent);
    if (this.mustTrack()) {
      this.updateAnimation();
    }
  },

  touchEnd: function(e) {
    e.preventDefault();
    this.finalizeAnimation();
    this.gesture = null;
    this.tracking = false;
  },

  // Functions
  mustTrack: function() {
    if (this.tracking) {
      return true;
    }
    this.tracking = this.gesture.isHorizontal();
    return this.tracking;
  },

  initPlayers: function() {
    if (!this.players) {
      this.players = this.gesture.deltaX > 0 ? this.previousPlayers : this.nextPlayers;
      this.players.forEach(function(p) {
        p.play();
        p.pause();
      });
    }
  },

  updateAnimation: function() {
    this.initPlayers();
    var currentTime = Math.abs(this.gesture.deltaX) / this.width * this.duration;
    this.players.forEach(p => p.currentTime = currentTime);
  },

  finalizeAnimation: function() {
    var progress = this.players[0].currentTime / this.duration;
    if (progress === 0) {
      return;
    }

    var speed = this.gesture.speedX * this.duration / this.width / 1000;
    var targetArticle = this.get(this.players === this.nextPlayers ? 'next' : 'previous');
    if (!targetArticle || progress < 0.5 && Math.abs(speed) < 1) {
      // abort animation
      this.players.forEach(function(p) {
        p.playbackRate = -1;
        p.onfinish = () => p.cancel();
      });
      Ember.run.next(()=>this.players = null);
    } else if (this.players === this.nextPlayers && (speed > 1 || progress > 0.5)) {
      // Transition to next
      this.players.forEach(function(p) {
        p.playbackRate = Math.max(-speed, 1);
        p.onfinish = () => this.sendAction('onChange', targetArticle);
      }, this);
    } else {
      // Transition to previous
      this.players.forEach(function(p) {
        p.playbackRate = Math.max(speed, 1);
        p.onfinish = () => this.sendAction('onChange', targetArticle);
      }, this);
    }

    this.players.forEach(p => p.play());
  }
});
