import Ember from 'ember';

export default Ember.Controller.extend({
  menuAnimations: [],
  menuAnimationDuration: 333,

  actions: {
    setupAnimation: function(animation) {
      this.menuAnimations.push(animation);
      Ember.run.scheduleOnce('afterRender', this, this.createAnimationGroup);
    },

    collapseMenu: function() {
      var player = this.get('menu-player');
      if (player.currentTime !== 0) {
        player.playbackRate = -1;
        player.play();
      }
    }
  },

  createAnimationGroup: function(){
    var group = new AnimationGroup(this.menuAnimations);
    var player = document.timeline.play(group);
    player.pause();
    player.currentTime = 0; // Workaround for bug
    player.onfinish = () => player.pause();
    this.set('menu-player', player);
  }
});
