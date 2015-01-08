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

test('Animator#progress is the progress of the animation expressed between 0 (not started) and 1 (finished)', function() {
  ok(false, 'Not implemented');
});

test('Animator#remainingFrames', function() {
  ok(false, 'Not implemented');
});

test('Animator#progressDelta', function() {
  ok(false, 'Not implemented');
});

test('Animator#easing', function() {
  ok(false, 'Not implemented');
});

module('Animator - getters');

test('Animator#nextProgress is the progress of the animation expressed between 0 (not started) and 1 (finished)', function() {
  ok(false, 'Not implemented');
});
