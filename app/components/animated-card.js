import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['animated-card'],
  classNameBindings: ['content::placeholder']
});
