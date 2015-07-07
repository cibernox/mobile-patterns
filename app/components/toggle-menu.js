import Ember from 'ember';

export default Ember.Component.extend({
  setupAnimation: function() {
    var opts = { duration: this.get('duration'), fill: 'both' };
    var a1 = new KeyframeEffect(
      this.element.querySelector('#hamburger-stroke-top'),
      [{ transform: 'rotate(0deg) translate(0,0)' }, { transform: 'rotate(45deg) translate(7px, 5.5px)' }],
      opts
    );
    var a2 = new KeyframeEffect(
      this.element.querySelector('#hamburger-stroke-middle'),
      [{ opacity: 1 }, { opacity: 0 }],
      opts
    );
    var a3 = new KeyframeEffect(
      this.element.querySelector('#hamburger-stroke-bottom'),
      [{ transform: 'rotate(0deg) translate(0,0)' }, { transform: 'rotate(-45deg) translate(7px, -5.5px)' }],
      opts
    );
    this.sendAction('action', new GroupEffect([a1, a2, a3]));
  }.on('didInsertElement'),

  click: function(){
    var player = this.get('player');
    console.log(player);
    if (player.playState !== 'paused'){
      return;
    }
    if (player.currentTime === 0) {
      player.playbackRate = 1;
    } else {
      player.playbackRate = -1;
    }
    player.play();
  }
});
