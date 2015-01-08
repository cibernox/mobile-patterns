import Animator from 'mobile-patterns/utils/animator';

module('Animator - properties');

test('Animator#origin is initialized in the constructor if provided', function() {
  var animator = new Animator({origin: 123});
  equal(animator.origin, 123);
});

test('Animator#target is initialized in the constructor if provided', function() {
  var animator = new Animator({target: 123});
  equal(animator.target, 123);
});

test('Animator#value is initialized in the constructor if provided, and defaults to origin', function() {
  var animator = new Animator({value: 123});
  equal(animator.value, 123);
  var animator2 = new Animator({origin: 234});
  equal(animator2.value, 234);
});

test('Animator#duration is initialized in the constructor if provided, or infered from the duration', function() {
  var animator = new Animator({duration: 123});
  equal(animator.duration, 123);
  var animator2 = new Animator({speed: 0.5});
  equal(animator2.duration, 2);
});

module('Animator - getters');

test('Animator#progress is the progress of the animation expressed between 0 (not started) and 1 (finished)', function() {
  var animator = new Animator({origin: 100, target: 1100, value: 200});
  equal(animator.progress, 0.1);
  var animator2 = new Animator({origin: -1100, target: -100, value: -200});
  equal(animator2.progress, 0.9);
});

test('Animator#remainingFrames returns the number of frames needed to complete the animation', function() {
  var animator = new Animator({origin: 0, target: 1000, value: 0, duration: 1});
  equal(animator.remainingFrames, 60);
  var animator2 = new Animator({origin: -1100, target: -100, value: -200, duration: 1});
  equal(animator2.remainingFrames , 6, 'There is 6 frames remaining');
});

test('Animator#delta returns the increment of the progress per frame', function() {
  var animator = new Animator({origin: 0, target: 1000, value: 0, duration: 0.33333333});
  equal(animator.delta, 50, 'The value will be incremented in 50 each frame');
  var animator2 = new Animator({origin: 100, target: -900, value: 100, duration: 0.6666666});
  equal(animator2.delta, -25, 'The value will be decremented in 25 each frame');
});
