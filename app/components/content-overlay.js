import Ember from 'ember';

export default Ember.Component.extend({
  progress: 0,
  attributeBindings: ['style'],

  style: function() {
    var progress = this.get('progress');
    return 'opacity: ' + progress + '; visibility: ' + (progress === 0 ? 'hidden' : 'visible') + ';';
  }.property('progress')
});
