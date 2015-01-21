import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('article', params.article_id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('items', this.modelFor('news'));
  },

  actions: {
    transitionToSibling: function(article) {
      this.transitionTo('news.show', article);
    }
  }
});
