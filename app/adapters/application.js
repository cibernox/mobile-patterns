import DS from 'ember-data';
import ENV from 'mobile-patterns/config/environment';

export default DS.RESTAdapter.extend({
  namespace: ENV.apiNamespace,
  ajaxSuccess: function(jqXHR, jsonPayload) {
    var monitor = this.get('networkMonitorService');
    if (jqXHR.getResponseHeader('x-service-worker-offline-support') === 'true') {
      jsonPayload.meta = jsonPayload.meta || {};
      jsonPayload.meta['x-service-worker-offline-support'] = true;
      monitor.registerOfflineSuccess();
    } else {
      monitor.registerOnlineSuccess();
    }
    return this._super(jqXHR, jsonPayload);
  }
});
