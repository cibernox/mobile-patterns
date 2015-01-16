import Ember from 'ember';

export default Ember.Controller.extend({
  menuAnimations: [],
  menuAnimationDuration: 333,


  actions: {
    setupAnimation: function(animation) {
      this.menuAnimations.push(animation);
      var self = this;
      function joinAnimations(){
        var group = new AnimationGroup(self.menuAnimations);
        var player = document.timeline.play(group);
        player.pause();
        player.currentTime = 0; // Workaround for bug
        self.set('menu-player', player);
      }
      Ember.run.scheduleOnce('afterRender', joinAnimations);
    },

    collapseMenu: function() {
      var player = this.get('menu-player');
      if (player.currentTime !== 0) {
        player.playbackRate = -1;
        player.play();
      }
    }
  }
});
