import { test, module } from 'ember-qunit';
import Ember from 'ember';
import GestureListenerMixin from 'mobile-patterns/mixins/gesture-listener';

module('GestureListenerMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var GestureListenerObject = Ember.Object.extend(GestureListenerMixin);
  var subject = GestureListenerObject.create();
  assert.ok(subject);
});
