import SwipeGesture from 'mobile-patterns/utils/swipe-gesture';

var swipe;

module('SwipeGesture - constructor');

test('initializes the default values', function() {
  swipe = new SwipeGesture();
  equal(swipe.minLength, 20, 'minLength is 20 by default');
  equal(swipe.warnLength, 10, 'warnLength is 10 by default');
  equal(swipe.errorMargin, 20, 'errorMargin is 10 by default');
  ok(swipe.exclusive, 'exclusive is true by default');
  ok(swipe.trackOffset, 'trackOffset is true by default');
  ok(!swipe.defaultPrevented, 'defaultPrevented is false by default');
  ok(!swipe.propagationStopped, 'propagationStopped is false by default');
});


module('SwipeGesture - warn event');

test('is fired once for horizontal gestures when the warn length is surpassed', function(assert) {
  expect(2);
  var eventsCount = 0;
  swipe = new SwipeGesture();

  swipe.on('warn', function(gesture) {
    equal(++eventsCount, 1, 'The warn event is fired once');
    equal(gesture.x, 10, 'The gesture contains the last event');
    setTimeout(assert.async, 1);
  });

  swipe.push({ timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ timeStamp: 234, touches: [{ pageX: 5, pageY: 10 }] });
  swipe.push({ timeStamp: 345, touches: [{ pageX: 9, pageY: 10 }] });
  swipe.push({ timeStamp: 456, touches: [{ pageX: 10, pageY: 10 }] });
  swipe.push({ timeStamp: 567, touches: [{ pageX: 15, pageY: 10 }] });
});

test('is never fired if the gesture is not horizontal', function(assert) {
  expect(0);
  swipe = new SwipeGesture();

  swipe.on('warn', function(gesture) {
    ok(false, 'no warn event is emitted');
  });

  swipe.push({ timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ timeStamp: 234, touches: [{ pageX: 5, pageY: 20 }] });
  swipe.push({ timeStamp: 345, touches: [{ pageX: 9, pageY: 30 }] });
  swipe.push({ timeStamp: 456, touches: [{ pageX: 10, pageY: 40 }] });
  swipe.push({ timeStamp: 567, touches: [{ pageX: 15, pageY: 50 }] });
  setTimeout(assert.async, 1);
});

test('if the gesture is not horizontal by the time the warnLength is surpassed but it gets corrected before surpassing the minLength the event is fired', function(assert) {
  expect(2);
  swipe = new SwipeGesture();

  swipe.on('warn', function(gesture) {
    ok(true, 'the event is emitted');
    equal(gesture.x, 15, 'The gesture contains the last event');
  });

  swipe.push({ timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ timeStamp: 234, touches: [{ pageX: 5, pageY: 20 }] });
  swipe.push({ timeStamp: 345, touches: [{ pageX: 9, pageY: 30 }] });
  swipe.push({ timeStamp: 456, touches: [{ pageX: 10, pageY: 40 }] });
  swipe.push({ timeStamp: 567, touches: [{ pageX: 15, pageY: 10 }] });
  setTimeout(assert.async, 1);
});


module('SwipeGesture - start event');

test('is fired once for horizontal gestures when the minimum length is surpassed', function(assert) {
  expect(2);
  var eventsCount = 0;
  swipe = new SwipeGesture();

  swipe.on('start', function(gesture) {
    equal(++eventsCount, 1, 'The start event is fired once');
    equal(gesture.x, 30, 'The gesture contains the last event');
    setTimeout(assert.async, 1);
  });

  swipe.push({ timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ timeStamp: 234, touches: [{ pageX: 10, pageY: 10 }] });
  swipe.push({ timeStamp: 345, touches: [{ pageX: 19, pageY: 10 }] });
  swipe.push({ timeStamp: 456, touches: [{ pageX: 30, pageY: 10 }] });
  swipe.push({ timeStamp: 567, touches: [{ pageX: 35, pageY: 10 }] });
});

test('is never fired if the gesture is not horizontal', function(assert) {
  expect(0);
  swipe = new SwipeGesture();

  swipe.on('start', function(gesture) {
    ok(false, 'no start event is emitted');
  });

  swipe.push({ timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ timeStamp: 234, touches: [{ pageX: 10, pageY: 20 }] });
  swipe.push({ timeStamp: 345, touches: [{ pageX: 19, pageY: 30 }] });
  swipe.push({ timeStamp: 456, touches: [{ pageX: 30, pageY: 40 }] });
  swipe.push({ timeStamp: 567, touches: [{ pageX: 35, pageY: 50 }] });
  setTimeout(assert.async, 1);
});

test('if the gesture is not horizontal by the time the minLength is surpassed, the event is not emitted even if the gesture becomes horizontal', function(assert) {
  expect(0);
  swipe = new SwipeGesture();

  swipe.on('start', function(gesture) {
    ok(false, 'no start event is emitted');
  });

  swipe.push({ timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ timeStamp: 234, touches: [{ pageX: 10, pageY: 20 }] });
  swipe.push({ timeStamp: 345, touches: [{ pageX: 19, pageY: 30 }] });
  swipe.push({ timeStamp: 456, touches: [{ pageX: 30, pageY: 40 }] });
  swipe.push({ timeStamp: 567, touches: [{ pageX: 35, pageY: 10 }] });
  setTimeout(assert.async, 1);
});

module('SwipeGesture - progress event');

test('is fired when an event is added to a tracked gesture', function(assert) {
  expect(2);
  var eventsCount = 0;
  swipe = new SwipeGesture();

  swipe.on('progress', function(gesture) {
    equal(++eventsCount, 1, 'The event that triggers the start event does not trigger a progress event');
    equal(gesture.x, 35, 'The gesture contains the last event');
    setTimeout(assert.async, 1);
  });

  swipe.push({ timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ timeStamp: 234, touches: [{ pageX: 10, pageY: 10 }] });
  swipe.push({ timeStamp: 345, touches: [{ pageX: 19, pageY: 10 }] });
  swipe.push({ timeStamp: 456, touches: [{ pageX: 30, pageY: 10 }] });
  swipe.push({ timeStamp: 567, touches: [{ pageX: 35, pageY: 10 }] });
});

module('SwipeGesture - end event');

test('is fired when a tracked event finalized', function(assert) {
  expect(2);
  var eventsCount = 0;
  swipe = new SwipeGesture();

  swipe.on('end', function(gesture) {
    equal(++eventsCount, 1, 'The event that triggers the start event does not trigger a progress event');
    equal(gesture.x, 31, 'The last event is the previous one');
    setTimeout(assert.async, 1);
  });

  swipe.push({ type: 'touchstart', timeStamp: 123, touches: [{ pageX: 0, pageY: 10 }] });
  swipe.push({ type: 'touchmove', timeStamp: 234, touches: [{ pageX: 30, pageY: 10 }] });
  swipe.push({ type: 'touchmove', timeStamp: 345, touches: [{ pageX: 31, pageY: 11 }] });
  swipe.push({ type: 'touchend', timeStamp: 456, touches: [{ pageX: 35, pageY: 10}] });
});
