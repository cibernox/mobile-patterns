export default {
  name: 'offline-support',
  initialize() {
    if ('serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.register('/offline-support.js');
    }
  }
};
