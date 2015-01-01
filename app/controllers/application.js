import Ember from 'ember';

export default Ember.Controller.extend({
  progress: 0,

  actions: {
    updateProgress: function(newProgress) {
      this.set('progress', newProgress);
    }
  }
});
