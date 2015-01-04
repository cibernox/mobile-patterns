import Ember from 'ember';

export default Ember.Controller.extend({
  attrs: function() {
    return {
      previousArticle: this.get('model.previousArticle'),
      currentArticle: this.get('model'),
      nextArticle: this.get('model.nextArticle')
    }
  }.property('model'),

  actions: {
    goToNext: function() {
      this.transitionToRoute('news.show', this.get('model.nextArticle'));
    },
    goToPrevious: function(){
      this.transitionToRoute('news.show', this.get('model.previousArticle'));
    }
  }
});
