import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('article');
  },

  actions: {
    show: function(article) {
      this.transitionTo("news.show", article);
    }
  }
});
