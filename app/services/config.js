import Ember from 'ember';

var localStorage = window.localStorage;

export default Ember.Object.extend({
  deckEffects: ['slide', 'expose', 'stack'],
  deckEffect: Ember.computed({
    get: function() {
      return (localStorage && localStorage.deckEffect) || this.deckEffects[0];
    },
    set: function(key, value) {
      if (localStorage) {
        localStorage.deckEffect = value;
      }
      return value;
    }
  }),
});
