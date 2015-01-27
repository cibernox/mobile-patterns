import Ember from 'ember';

export default Ember.Object.extend({
  get isIOS() {
    if (this._isIOS === undefined) {
      var userAgent = window.navigator.userAgent.toLowerCase();
      this._isIOS = /iphone|ipod|ipad/.test(userAgent);
    }
    return this._isIOS;
  },

  get isStandalone() {
    if (this._isStandalone === undefined) {
      this._isStandalone = window.navigator.standalone;
    }
    return this._isStandalone;
  },

  get isSafari(){
    if (this._isSafari === undefined) {
      var userAgent = window.navigator.userAgent.toLowerCase();
      this._isSafari = this.isIOS && !this.isStandalone && /safari/.test(userAgent);
    }
    return this._isSafari;
  }
});
