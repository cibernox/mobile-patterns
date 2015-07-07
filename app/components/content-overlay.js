import Ember from 'ember';

export default Ember.Component.extend({
  setupAnimation: function() {
    this.duration = this.get('duration');
    var animation = new KeyframeEffect(
      this.element,
      [{ opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible' }],
      { duration: this.duration, fill: 'both' }
    );
    this.sendAction('action', animation);
  }.on('didInsertElement')
});
