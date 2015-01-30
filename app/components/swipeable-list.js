import Ember from 'ember';

export default Ember.Component.extend({
  duration: 400,
  inverseEasing: new BezierEasing(0, 0.42, 1, 0.58),

  // Callbacks
  setupAnimation: function() {
    this.width = this.element.offsetWidth;
    var articlePreview = this.element.querySelector('.article-detail');
    var keyframes = [{ transform: 'translateX(0)' }, { transform: `translateX(-${this.width}px)` }]
    var opts = { duration: this.duration, fill: 'both', easing: 'cubic-bezier(0.42, 0, 0.58, 1)' };
    var animation = new Animation(articlePreview, keyframes, opts);
    this.player = document.timeline.play(animation);
    this.player.pause();
  }.on('didInsertElement'),

  cleanup: function() {
    this.set('selection', null);
  }.on('willDestroy'),

  // Actions
  actions: {
    select: function(article) {
      this.set('selection', article);
    },

    animate: function(gesture) {
      var progress = (-gesture.deltaX + gesture.initialOffset) / this.width;
      this.player.currentTime = this.inverseEasing(progress) * this.duration;
    },

    finalize: function(gesture) {
      var progress = (-gesture.deltaX + gesture.initialOffset) / this.width;
      var speed = -gesture.speedX / this.width;

      if (speed > 1 || progress > 0.5) {
        this.player.playbackRate = Math.max(1, speed);
        this.player.onfinish = () => this.sendAction("select", this.get('selection'));
      } else {
        this.player.playbackRate = -1;
        this.player.onfinish = () => this.player.pause();
      }
      this.player.play();
    }
  }
});
