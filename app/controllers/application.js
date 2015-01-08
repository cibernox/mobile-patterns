import Ember from 'ember';
import Animator from 'mobile-patterns/utils/animator';

export default Ember.Controller.extend({
  progress: 0,
  minSpeed: 3,

  actions: {
    toggleMenu: function(){
      var progress = this.get('progress');
      var target = progress === 1 ? 0 : 1;
      var animator = new Animator({origin: progress, target: target, duration: 0.3333, easing: 'ease-in-out'});
      animator.play(this, this.set, 'progress');
    },

    expandMenu: function(speed) {
      var animator = new Animator({origin: 0, target: 1, value: this.get('progress'), speed: Math.max(speed, this.minSpeed), easing: 'ease-in-out'});
      animator.play(this, this.set, 'progress');
    },

    collapseMenu: function(speed) {
      var progress = this.get('progress');
      if (progress !== 0) {
        var animator = new Animator({origin: 1, target: 0, value: progress, speed: Math.max(-speed, this.minSpeed), easing: 'ease-in-out'});
        animator.play(this, this.set, 'progress');
      }
    },

    updateProgress: function(newProgress) {
      this.set('progress', newProgress);
    }
  }
});
