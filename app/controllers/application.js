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
    player.onfinish = () => player.pause();
    player.pause();
    this.set('menu-player', player);
  }
});
