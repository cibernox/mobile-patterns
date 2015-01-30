import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

export default Ember.Component.extend({
  classNames: ['article-summary'],

  click: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.sendAction('select', this.get('article'));
  }
});
