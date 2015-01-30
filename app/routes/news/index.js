import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    show: function(article) {
      this.transitionTo("news.show", article);
    }
  }
});
