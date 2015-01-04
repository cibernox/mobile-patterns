import Gesture from 'mobile-patterns/utils/gesture';

var firstEvent, secondEvent, thirdEvent;

module('Gesture', {
  setup: function(){
    firstEvent  = { touches: [{pageX: 100, pageY: 250}], timeStamp: 1419263004600 };
    secondEvent = { touches: [{pageX: 110, pageY: 270}], timeStamp: 1419263004610 };
    thirdEvent  = { touches: [{pageX: 120, pageY: 290}], timeStamp: 1419263004620 };
  }
});

// Methods
test('`Gesture#push` appends the given event to the gesture', function() {
  var gesture = new Gesture();
  equal(gesture.eventsCount, 0);
  equal(gesture.last, null);
  gesture.push(firstEvent);
  equal(gesture.eventsCount, 1);
  equal(gesture.last, firstEvent);
});

test('`Gesture#isHorizontal` returns true if the gesture is horizontal with a error margin smaller than the given one', function() {
  var gesture = new Gesture();
  gesture.push({ touches: [{pageX: 100, pageY: 250}] });
  gesture.push({ touches: [{pageX: 140, pageY: 255}] });
  gesture.push({ touches: [{pageX: 180, pageY: 260}] });
  ok(gesture.isHorizontal()); // The error margin defalts to ± 15°
  ok(!gesture.isHorizontal(2)); // The error margin is set to ± 2°
});

// Getters
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

test('`Gesture#pageX` contains the pageX of the last event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.pageX, 110);
});

test('`Gesture#pageY` contains the pageY of the last event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.pageY, 270);
});

test('`Gesture#initPageX` contains the pageX of the first event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.initPageX, 100);
});

test('`Gesture#initPageY` contains the pageX of the first event', function() {
  var gesture = new Gesture(firstEvent);
  gesture.push(secondEvent);
  equal(gesture.initPageY, 250);
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
