import Ember from 'ember';
import { initialize } from 'mobile-patterns/initializers/offline-support';

var container, application;

module('OfflineSupportInitializer', {
  setup: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function() {
  initialize(container, application);

  // you would normally confirm the results of the initializer here
  ok(true);
});

