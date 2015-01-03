import Gesture from 'mobile-patterns/utils/gesture';

var firstEvent, secondEvent, thirdEvent;

module('Gesture', {
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
