import DS from 'ember-data';
import ENV from 'mobile-patterns/config/environment';

export default DS.RESTAdapter.extend({
  namespace: ENV.apiNamespace,
  ajaxSuccess: function(jqXHR, jsonPayload) {
    var monitor = this.get('networkMonitorService');
    if (jsonPayload.meta && jsonPayload.meta.offlineSupportWorker) {
      monitor.registerOfflineSuccess();
    } else {
      monitor.registerOnlineSuccess();
    }
    return this._super(jqXHR, jsonPayload);
  }
});
