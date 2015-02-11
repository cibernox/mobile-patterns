import { test, module } from 'ember-qunit';
import Gesture from 'mobile-patterns/utils/gesture';

var gesture;

module('Gesture - constructor');

test('sets the proper default values', function(assert) {
  gesture = new Gesture({abc: 123});
  assert.deepEqual(gesture.events, [], 'it has no events');
  assert.ok(!gesture.defaultPrevented, 'defaultPrevented is false');
  assert.ok(!gesture.propagationStopped, 'propagationStopped is false');
  assert.equal(gesture.abc, 123, 'Any property given in the initializer is setted');
});

module('Gesture - push');

test('appends the given event to the gesture', function(assert) {
  gesture = new Gesture();

  assert.equal(gesture.events.length, 0);
  assert.equal(gesture.last, null);
  gesture.push({timeStamp: 123, touches: [{pageX: 1, pageY: 2}]});
  assert.equal(gesture.events.length, 1);
  assert.deepEqual(gesture.last, { timeStamp: 123, x: 1, y: 2 });
});

test('calls preventDefault on the given element when defaultPrevented is set to true', function(assert) {
  gesture = new Gesture();
  var evtNotPrevented = {
    timeStamp: 123,
    touches: [{ pageX: 1, pageY: 2 }],
    preventDefault: function() {
      assert.ok(false, 'This event must not be prevented');
    }
  };
  gesture.push(evtNotPrevented);

  gesture.defaultPrevented = true;
  var evtPrevented = {
    timeStamp: 123,
    touches: [{ pageX: 1, pageY: 2 }],
    preventDefault: function() {
      assert.ok(true, 'This event must be prevented');
    }
  };
  gesture.push(evtPrevented);
});

test('calls stopPropagation on the given element when propagationStopped is set to true', function(assert) {
  gesture = new Gesture();
  var evtNotStopped = {
    timeStamp: 123,
    touches: [{ pageX: 1, pageY: 2 }],
    stopPropagation: function() {
      assert.ok(false, 'The propagation of this event must not be stopped');
    }
  };
  gesture.push(evtNotStopped);

  gesture.propagationStopped = true;
  var evtStopped = {
    timeStamp: 123,
    touches: [{ pageX: 1, pageY: 2 }],
    stopPropagation: function() {
      assert.ok(true, 'The propagation of this event must be stopped');
    }
  };
  gesture.push(evtStopped);
});

test('returns the gesture so we can chain calls', function(assert) {
  gesture = new Gesture();
  var returnValue = gesture.push({timeStamp: 123, touches: [{pageX: 1, pageY: 2}]});
  assert.equal(returnValue, gesture, 'push returns the gesture itself');
});

module('Gesture - first and last', {
  setup: function() {
    gesture = new Gesture();
    gesture.push({ timeStamp: 123, touches: [{ pageX: 1, pageY: 2 }] });
    gesture.push({ timeStamp: 234, touches: [{ pageX: 5, pageY: 6 }] });
  }
});

test('first contains the first captured event', function(assert) {
  assert.deepEqual(gesture.first, { timeStamp: 123, x: 1, y: 2 });
});

test('last contains the last captured event', function(assert) {
  assert.deepEqual(gesture.last, { timeStamp: 234, x: 5, y: 6 });
});

module('Gesture - coordinates', {
  setup: function() {
    gesture = new Gesture();
    gesture.push({ timeStamp: 123, touches: [{ pageX: 1, pageY: 2 }] });
    gesture.push({ timeStamp: 234, touches: [{ pageX: 5, pageY: 6 }] });
  }
});

test('x contains the pageX of the last event', function(assert) {
  assert.equal(gesture.x, 5);
});

test('y contains the pageY of the last event', function(assert) {
  assert.equal(gesture.y, 6);
});

test('initX contains the pageX of the first event', function(assert) {
  assert.equal(gesture.initX, 1);
});

test('initY contains the pageX of the first event', function(assert) {
  assert.equal(gesture.initY, 2);
});

module('Gesture - deltas', {
  setup: function() {
    gesture = new Gesture();
    gesture.push({ touches: [{pageX: 100, pageY: 250}], timeStamp: 1419263004600 });
    gesture.push({ touches: [{pageX: 110, pageY: 270}], timeStamp: 1419263004610 });
    gesture.push({ touches: [{pageX: 120, pageY: 290}], timeStamp: 1419263004620 });
  }
});

test('deltaX contains the X delta between the beginning and the current point of the gesture', function(assert) {
  assert.equal(gesture.deltaX, 20);
});

test('deltaY contains the X delta between the beginning and the current point of the gesture', function(assert) {
  assert.equal(gesture.deltaY, 40);
});

test('delta contains the distance in px between the beginning and the current point of the gesture', function(assert) {
  assert.ok(gesture.delta - 44.731359 < 0.0001, 'Calculates the delta using Pythagoras theorem');
});

module('Gesture - direction');

test('returns the direction of the gesture in degrees (0-360)', function(assert) {
  // Gesture to the 1st cuandrant
  var gesture1 = new Gesture();
  gesture1.push({ touches: [{pageX: 100, pageY: 270}] });
  gesture1.push({ touches: [{pageX: 110, pageY: 250}] });
  assert.equal(gesture1.direction, 26.56505117707799);

  // Gesture to the 2st cuandrant
  var gesture2 = new Gesture();
  gesture2.push({ touches: [{pageX: 100, pageY: 250}] });
  gesture2.push({ touches: [{pageX: 110, pageY: 270}] });
  assert.equal(gesture2.direction, 153.43494882292202);

  // Gesture to the 3rd cuandrant
  var gesture3 = new Gesture();
  gesture3.push({ touches: [{pageX: 110, pageY: 250}] });
  gesture3.push({ touches: [{pageX: 100, pageY: 270}] });
  assert.equal(gesture3.direction, 206.56505117707799);

  // Gesture to the 4th cuandrant
  var gesture4 = new Gesture();
  gesture4.push({ touches: [{pageX: 110, pageY: 270}] });
  gesture4.push({ touches: [{pageX: 100, pageY: 250}] });
  assert.equal(gesture4.direction, 333.43494882292202);
});

module('Gesture - isHorizontal');

test('returns true if the gesture is horizontal with a error margin smaller than the given one', function(assert) {
  var gesture = new Gesture();
  gesture.push({ touches: [{pageX: 100, pageY: 250}] });
  gesture.push({ touches: [{pageX: 140, pageY: 255}] });
  gesture.push({ touches: [{pageX: 180, pageY: 260}] });
  assert.ok(gesture.isHorizontal(), 'The gesture is horizontal with an error margin of 15deg'); // The error margin defalts to ± 15°
  assert.ok(!gesture.isHorizontal(2), 'The gesture is not horizontal with an error margin of 2deg'); // The error margin is set to ± 2°

  var gesture2 = new Gesture();
  gesture2.push({ touches: [{pageX: 250, pageY: 100}] });
  gesture2.push({ touches: [{pageX: 255, pageY: 140}] });
  gesture2.push({ touches: [{pageX: 260, pageY: 180}] });
  assert.ok(!gesture2.isHorizontal(), 'The new gesture is not horizontal');
});

module('Gesture - speed', {
  setup: function() {
    gesture = new Gesture();
    gesture.push({ touches: [{pageX: 100, pageY: 250}], timeStamp: 1419263004600 });
    gesture.push({ touches: [{pageX: 110, pageY: 270}], timeStamp: 1419263004610 });
    gesture.push({ touches: [{pageX: 120, pageY: 290}], timeStamp: 1419263004620 });
  }
});

test('speedX contains the speed of the gesture in the X axis', function(assert) {
  assert.equal(gesture.speedX, 1000);
});

test('speedY contains the speed of the gesture in the X axis', function(assert) {
  assert.equal(gesture.speedY, 2000);
});

module('Gesture - duration', {
  setup: function() {
    gesture = new Gesture();
    gesture.push({ touches: [{pageX: 100, pageY: 250}], timeStamp: 1419263004600 });
    gesture.push({ touches: [{pageX: 110, pageY: 270}], timeStamp: 1419263004610 });
    gesture.push({ touches: [{pageX: 120, pageY: 290}], timeStamp: 1419263004620 });
  }
});

test('contains the duration of the gesture in milliseconds', function(assert) {
  assert.equal(gesture.duration, 20);
});

module('Gesture - clear', {
  setup: function() {
    gesture = new Gesture({abc: 123});
    gesture.push({ touches: [{pageX: 100, pageY: 250}], timeStamp: 1419263004600 });
    gesture.push({ touches: [{pageX: 110, pageY: 270}], timeStamp: 1419263004610 });
    gesture.push({ touches: [{pageX: 120, pageY: 290}], timeStamp: 1419263004620 });
    gesture.abc = 234;
  }
});

test('returns the gesture to the state it had when it was initialized', function(assert) {
  gesture.clear();
  assert.deepEqual(gesture.events, [], 'There is not events');
  assert.ok(!gesture.defaultPrevented);
  assert.ok(!gesture.propagationStopped);
  assert.ok(!gesture.first, null, 'There is no first event');
  assert.ok(!gesture.last, null, 'There is no last event');
  assert.equal(gesture.abc, 123, 'Other properties are restored l');
});

// test('`Gesture#preventDefault` sets the defaultPrevented flag to true if the given condition is met', function(assert) {
//   var gesture = new Gesture();
//   assert.ok(!gesture.defaultPrevented, 'Newly created gestures are not default prevented');
//   gesture.preventDefault();
//   assert.ok(gesture.defaultPrevented, 'When not condition is passed, preventDefault() sets the the flag to true');

//   var gesture2 = new Gesture();
//   var conditionFn = function(g) {
//     assert.equal(g.constructor, Gesture, 'The condition function receives the gesture');
//     return true;
//   };
//   var falseyConditionFn = function(g) {
//     return false;
//   };
//   assert.ok(!gesture2.preventDefault(falseyConditionFn), 'preventDefault() returns false if the gesture was not prevented');
//   assert.ok(!gesture2.defaultPrevented, 'When the condition function returns false, the gesture is not prevented');
//   assert.ok(gesture2.preventDefault(conditionFn), 'preventDefault() returns true if the gesture was prevented');
//   assert.ok(gesture2.defaultPrevented, 'When the condition function returns true, the gesture is prevented');

//   var gesture3 = new Gesture();
//   gesture3.preventDefault('given-context', function(g) {
//     assert.equal(this, 'given-context', 'Inside the function, the context has been bound correctly');
//     assert.equal(g.constructor, Gesture, 'The condition function receives the gesture');
//   });
// });

// test('`Gesture#stopPropagation` sets the propagationStopped flag to true if the given condition is met', function(assert) {
//   var gesture = new Gesture();
//   assert.ok(!gesture.propagationStopped, 'Newly created gestures have not its propagation stopped');
//   gesture.stopPropagation();
//   assert.ok(gesture.propagationStopped, 'When not condition is passed, stopPropagation() sets the flag to true');

//   var gesture2 = new Gesture();
//   var conditionFn = function(g) {
//     assert.equal(g.constructor, Gesture, 'The condition function receives the gesture');
//     return true;
//   };
//   var falseyConditionFn = function(g) {
//     return false;
//   };
//   assert.ok(!gesture2.stopPropagation(falseyConditionFn), 'stopPropagation() returns false if the gesture propagation was not stopped');
//   assert.ok(!gesture2.propagationStopped, 'When the condition function returns false, the gesture ipropagation s not stopped');
//   assert.ok(gesture2.stopPropagation(conditionFn), 'stopPropagation() returns true if the gesture propagation was stopped');
//   assert.ok(gesture2.propagationStopped, 'When the condition function returns true, the gesture propagation is stopped');

//   var gesture3 = new Gesture();
//   gesture3.stopPropagation('given-context', function(g) {
//     assert.equal(this, 'given-context', 'Inside the function, the context has been bound correctly');
//     assert.equal(g.constructor, Gesture, 'The condition function receives the gesture');
//   });
// });

// test('`Gesture#adquire` sets both `defaultPrevented` and `propagationStopped` to true if the given condition is met', function(assert) {
//   var gesture = new Gesture();
//   gesture.adquire();
//   assert.ok(gesture.defaultPrevented, 'When not condition is passed, adquire() sets the flags to true');
//   assert.ok(gesture.propagationStopped, 'When not condition is passed, adquire() sets the flags to true');

//   var gesture2 = new Gesture();
//   var counter = 0;
//   var conditionFn = function(g) {
//     assert.equal(g.constructor, Gesture, 'The condition function receives the gesture');
//     assert.ok(++counter < 2, 'This method is only invoked once');
//     return true;
//   };
//   var falseyConditionFn = function(g) {
//     return false;
//   };
//   assert.ok(!gesture2.adquire(falseyConditionFn), 'adquire() returns false if the gesture propagation was not stopped');
//   assert.ok(!gesture2.defaultPrevented, 'When the condition function returns false, the gesture is default not prevented');
//   assert.ok(!gesture2.propagationStopped, 'When the condition function returns false, the gesture propagation is not stopped');
//   assert.ok(gesture2.adquire(conditionFn), 'adquire() returns true if the gesture propagation was stopped');
//   assert.ok(gesture2.defaultPrevented, 'When the condition function returns true, the gesture is default prevented');
//   assert.ok(gesture2.propagationStopped, 'When the condition function returns true, the gesture propagation is stopped');

//   var gesture3 = new Gesture();
//   gesture3.adquire('given-context', function(g) {
//     assert.equal(this, 'given-context', 'Inside the function, the context has been bound correctly');
//     assert.equal(g.constructor, Gesture, 'The condition function receives the gesture');
//   });
// });
