import Ember from 'ember';

export default Ember.Service.extend({
  offline: false,

  registerOfflineSuccess() {
    this.set('offline', true);
  },

  registerOnlineSuccess() {
    this.set('offline', false);
  }
});
