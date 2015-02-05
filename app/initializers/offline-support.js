export default {
  name: 'offline-support',
  initialize() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/offline-support.js').
        then(function(registration) {
          console.log('registration succeeded');
        }).catch(function(e) {
          console.log('registration failed:', e);
        });
    } else {
      alert('SW not supported');
    }
  }
};
