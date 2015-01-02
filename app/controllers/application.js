import Ember from 'ember';

export default Ember.Controller.extend({
  progress: 0,

  actions: {
    toggleMenu: function(){
      this.delta = this.get('progress') === 1 ? -0.04 : 0.04;
      requestAnimationFrame(this.animateProgress.bind(this));
    },

    expandMenu: function() {
      this.delta = 0.04;
      requestAnimationFrame(this.animateProgress.bind(this));
    },

    collapseMenu: function() {
      this.delta = -0.04;
      requestAnimationFrame(this.animateProgress.bind(this));
    },

    updateProgress: function(newProgress) {
      this.set('progress', newProgress);
    }
  },

  // Methods
  animateProgress: function(){
    var newProgress = Math.min(Math.max(0, this.get('progress') + this.delta), 1);
    this.set('progress', newProgress);
    if (newProgress !== 0 && newProgress !== 1) {
      requestAnimationFrame(this.animateProgress.bind(this));
    }
  }
});
