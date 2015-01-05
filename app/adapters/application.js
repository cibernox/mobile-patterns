import DS from 'ember-data';
import ENV from 'mobile-patterns/config/environment';

export default DS.RESTAdapter.extend({
  namespace: ENV.apiNamespace
});
