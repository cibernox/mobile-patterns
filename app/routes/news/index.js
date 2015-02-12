import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('article').then(articles => articles.sortBy('id'));
  },

  actions: {
    show: function(article) {
      this.transitionTo("news.show", article);
    }
  }
});
