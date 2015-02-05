import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('article');
  },

  setupController: function(controller, model) {
    var articleMeta = this.store.metadataFor('article');
    controller.set('offlineData', !!articleMeta['x-service-worker-offline-support']);
    this._super(controller, model);
  }
});
