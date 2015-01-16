import Ember from 'ember';

export default Ember.Component.extend({
  setupAnimation: function() {
    var animation = new Animation(
      this.element,
      [{ opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible' }],
      { duration: this.duration, fill: 'both' }
    );
    this.sendAction('action', animation);
  }.on('didInsertElement')
});
