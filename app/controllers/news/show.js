import Ember from 'ember';

export default Ember.Controller.extend({
  attrs: function() {
    return {
      previousArticle: this.get('model.previousArticle'),
      currentArticle: this.get('model'),
      nextArticle: this.get('model.nextArticle')
    };
  }.property('model'),

  actions: {
    changeArticle: function(articlePosition) {
      var article = this.get('model.'+articlePosition+'Article');
      if (article) {
        this.transitionToRoute('news.show', article);
        this.set('progress', 0);
      }
    }
  }
});
