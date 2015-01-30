import Ember from 'ember';

export default Ember.Component.extend({
  duration: 400,

  // Callbacks
  setupAnimation: function() {
    this.width = this.element.offsetWidth;
    var articlePreview = this.element.querySelector('.article-detail');
    var keyframes = [{ transform: 'translateX(0)' }, { transform: `translateX(-${this.width}px)` }]
    var opts = { duration: this.duration, fill: 'both', easing: 'ease-in-out' };
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
      Ember.run.schedule('afterRender', () => {
        this.player.onfinish = () => this.sendAction("select", article);
        this.player.play();
      });
    }
  }
});
