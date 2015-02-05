import DS from 'ember-data';
import ENV from 'mobile-patterns/config/environment';

export default DS.RESTAdapter.extend({
  namespace: ENV.apiNamespace,
  ajaxSuccess: function(jqXHR, jsonPayload) {
    var rescuedFromNetworkError = jqXHR.getResponseHeader('x-service-worker-offline-support');
    if (rescuedFromNetworkError === 'true' || true  ) {
      jsonPayload.meta = jsonPayload.meta || {};
      jsonPayload.meta['x-service-worker-offline-support'] = true;
    }
    return this._super(jqXHR, jsonPayload);
  }
});
