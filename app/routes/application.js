import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition: function() {
      this.controller.send('collapseMenu', 0);
    }
  }
});
