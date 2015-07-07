import Ember from 'ember';

export default Ember.Service.extend({
  deckEffects: ['slide', 'expose', 'stack'],
  deckEffect: Ember.computed({
    get: function() {
      return (window.localStorage && window.localStorage.deckEffect) || this.deckEffects[0];
    },
    set: function(key, value) {
      if (window.localStorage) {
        window.localStorage.deckEffect = value;
      }
      return value;
    }
  }),
});
