import Gesture from 'mobile-patterns/utils/gesture';

var firstEvent, secondEvent, thirdEvent;

module('Gesture - methods');

test('`Gesture#push` appends the given event to the gesture', function() {
  var gesture = new Gesture();

  equal(gesture.eventsCount, 0);
  equal(gesture.last, null);
  gesture.push({timestamp: 123, touches: [{pageX: 1, pageY: 2}]});
  equal(gesture.eventsCount, 1);
  equal(gesture.last, 'sample-event');
});

test('`Gesture#push` calls preventDefault on the given element when defaultPrevented is set to true', function() {
  var gesture = new Gesture();
  var evtNotPrevented = {
    preventDefault: function() {
      ok(false, 'This event must not be prevented');
    }
  };
  gesture.push(evtNotPrevented);

  gesture.defaultPrevented = true;
  var evtPrevented = {
    preventDefault: function() {
      ok(true, 'This event must be prevented');
    }
  };
  gesture.push(evtPrevented);
});

test('`Gesture#push` calls stopPropagation on the given element when propagationStopped is set to true', function() {
  var gesture = new Gesture();
  var evtNotStopped = {
    stopPropagation: function() {
      ok(false, 'The propagation of this event must not be stopped');
    }
  };
  gesture.push(evtNotStopped);

  gesture.propagationStopped = true;
  var evtStopped = {
    stopPropagation: function() {
      ok(true, 'The propagation of this event must be stopped');
    }
  };
  gesture.push(evtStopped);
});

test('`Gesture#preventDefault` sets the defaultPrevented flag to true if the given condition is met', function() {
  var gesture = new Gesture();
  ok(!gesture.defaultPrevented, 'Newly created gestures are not default prevented');
  gesture.preventDefault();
  ok(gesture.defaultPrevented, 'When not condition is passed, preventDefault() sets the the flag to true');

  var gesture2 = new Gesture();
  var conditionFn = function(g) {
    equal(g.constructor, Gesture, 'The condition function receives the gesture');
    return true;
  };
  var falseyConditionFn = function(g) {
    return false;
  };
  ok(!gesture2.preventDefault(falseyConditionFn), 'preventDefault() returns false if the gesture was not prevented');
  ok(!gesture2.defaultPrevented, 'When the condition function returns false, the gesture is not prevented');
  ok(gesture2.preventDefault(conditionFn), 'preventDefault() returns true if the gesture was prevented');
  ok(gesture2.defaultPrevented, 'When the condition function returns true, the gesture is prevented');

  var gesture3 = new Gesture();
  gesture3.preventDefault('given-context', function(g) {
    equal(this, 'given-context', 'Inside the function, the context has been bound correctly');
    equal(g.constructor, Gesture, 'The condition function receives the gesture');
  });
});

test('`Gesture#stopPropagation` sets the propagationStopped flag to true if the given condition is met', function() {
  var gesture = new Gesture();
  ok(!gesture.propagationStopped, 'Newly created gestures have not its propagation stopped');
  gesture.stopPropagation();
  ok(gesture.propagationStopped, 'When not condition is passed, stopPropagation() sets the flag to true');

  var gesture2 = new Gesture();
  var conditionFn = function(g) {
    equal(g.constructor, Gesture, 'The condition function receives the gesture');
    return true;
  };
  var falseyConditionFn = function(g) {
    return false;
  };
  ok(!gesture2.stopPropagation(falseyConditionFn), 'stopPropagation() returns false if the gesture propagation was not stopped');
  ok(!gesture2.propagationStopped, 'When the condition function returns false, the gesture ipropagation s not stopped');
  ok(gesture2.stopPropagation(conditionFn), 'stopPropagation() returns true if the gesture propagation was stopped');
  ok(gesture2.propagationStopped, 'When the condition function returns true, the gesture propagation is stopped');

  var gesture3 = new Gesture();
  gesture3.stopPropagation('given-context', function(g) {
    equal(this, 'given-context', 'Inside the function, the context has been bound correctly');
    equal(g.constructor, Gesture, 'The condition function receives the gesture');
  });
});

test('`Gesture#adquire` sets both `defaultPrevented` and `propagationStopped` to true if the given condition is met', function() {
  var gesture = new Gesture();
  gesture.adquire();
  ok(gesture.defaultPrevented, 'When not condition is passed, adquire() sets the flags to true');
  ok(gesture.propagationStopped, 'When not condition is passed, adquire() sets the flags to true');

  var gesture2 = new Gesture();
  var counter = 0;
  var conditionFn = function(g) {
    equal(g.constructor, Gesture, 'The condition function receives the gesture');
    ok(++counter < 2, 'This method is only invoked once');
    return true;
  };
  var falseyConditionFn = function(g) {
    return false;
  };
  ok(!gesture2.adquire(falseyConditionFn), 'adquire() returns false if the gesture propagation was not stopped');
  ok(!gesture2.defaultPrevented, 'When the condition function returns false, the gesture is default not prevented');
  ok(!gesture2.propagationStopped, 'When the condition function returns false, the gesture propagation is not stopped');
  ok(gesture2.adquire(conditionFn), 'adquire() returns true if the gesture propagation was stopped');
  ok(gesture2.defaultPrevented, 'When the condition function returns true, the gesture is default prevented');
  ok(gesture2.propagationStopped, 'When the condition function returns true, the gesture propagation is stopped');

  var gesture3 = new Gesture();
  gesture3.adquire('given-context', function(g) {
    equal(this, 'given-context', 'Inside the function, the context has been bound correctly');
    equal(g.constructor, Gesture, 'The condition function receives the gesture');
  });
});

test('`Gesture#isHorizontal` returns true if the gesture is horizontal with a error margin smaller than the given one', function() {
  var gesture = new Gesture();
  gesture.push({ touches: [{pageX: 100, pageY: 250}] });
  gesture.push({ touches: [{pageX: 140, pageY: 255}] });
  gesture.push({ touches: [{pageX: 180, pageY: 260}] });
  ok(gesture.isHorizontal()); // The error margin defalts to ± 15°
  ok(!gesture.isHorizontal(2)); // The error margin is set to ± 2°
});

module('Gesture - getters', {
  setup: function(){
    firstEvent  = { touches: [{pageX: 100, pageY: 250}], timeStamp: 1419263004600 };
    secondEvent = { touches: [{pageX: 110, pageY: 270}], timeStamp: 1419263004610 };
    thirdEvent  = { touches: [{pageX: 120, pageY: 290}], timeStamp: 1419263004620 };
  }
});

test('`Gesture#eventsCount` contains the number of captured events', function() {
  var gesture = new Gesture('event');
  gesture.push('other event');
  equal(gesture.eventsCount, 2, 'This gesture contains 2 events');
});

test('`Gesture#last` contains the last captured event', function() {
  var gesture = new Gesture('event');
  gesture.push('other event');
  equal(gesture.last, 'other event');
});

test('`Gesture#first` contains the first captured event', function() {
  var gesture = new Gesture('event');
  gesture.push('other event');
  equal(gesture.first, 'event');
});

test('`Gesture#events` contains all the captured events', function() {
  var gesture = new Gesture('event');
  gesture.push('other event');
  deepEqual(gesture.events, ['event', 'other event']);
});

test('`Gesture#duration` contains the duration of the gesture in milliseconds', function() {
  var gesture = new Gesture(firstEvent);
  equal(gesture.duration, 0);
  gesture.push(secondEvent);
  equal(gesture.duration, 10);
});

test('`Gesture#x` contains the pageX of the last event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.x, 110);
});

test('`Gesture#y` contains the pageY of the last event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.y, 270);
});

test('`Gesture#initX` contains the pageX of the first event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.initX, 100);
});

test('`Gesture#initY` contains the pageX of the first event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.initY, 250);
});

test('`Gesture#speedX` contains the speed of the gesture in the X axis', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  gesture.push(thirdEvent);
  equal(gesture.speedX, 1000);
});

test('`Gesture#speedY` contains the speed of the gesture in the X axis', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  gesture.push(thirdEvent);
  equal(gesture.speedY, 2000);
});

test('`Gesture#deltaX` contains the X delta between the beginning and the end of the gesture', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  gesture.push(thirdEvent);
  equal(gesture.deltaX, 20);
});

test('`Gesture#deltaY` contains the X delta between the beginning and the end of the gesture', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  gesture.push(thirdEvent);
  equal(gesture.deltaY, 40);
});

test('`Gesture#direction` returns the direction of the gesture in degrees (0-360)', function() {
  // Gesture to the 1st cuandrant
  var gesture1 = new Gesture({ touches: [{pageX: 100, pageY: 270}] });
  gesture1.push({ touches: [{pageX: 110, pageY: 250}] });
  equal(gesture1.direction, 26.56505117707799);

  // Gesture to the 2st cuandrant
  var gesture2 = new Gesture({ touches: [{pageX: 100, pageY: 250}] });
  gesture2.push({ touches: [{pageX: 110, pageY: 270}] });
  equal(gesture2.direction, 153.43494882292202);

  // Gesture to the 3rd cuandrant
  var gesture3 = new Gesture({ touches: [{pageX: 110, pageY: 250}] });
  gesture3.push({ touches: [{pageX: 100, pageY: 270}] });
  equal(gesture3.direction, 206.56505117707799);

  // Gesture to the 4th cuandrant
  var gesture4 = new Gesture({ touches: [{pageX: 110, pageY: 270}] });
  gesture4.push({ touches: [{pageX: 100, pageY: 250}] });
  equal(gesture4.direction, 333.43494882292202);
});
