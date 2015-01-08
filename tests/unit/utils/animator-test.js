import Animator from 'mobile-patterns/utils/animator';
import BezierEasing from 'mobile-patterns/utils/bezier-easing';

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

test('Animator#duration is the time take but a full loop of an animation (not only of the remaining part)', function() {
  var animator = new Animator({duration: 123});
  equal(animator.duration, 123);
  var animator2 = new Animator({speed: 0.5});
  equal(animator2.duration, 2);
});

test('Animator#progress is the progress of the animation expressed between 0 (not started) and 1 (finished)', function() {
  var animator = new Animator({origin: 0, target: 1000});
  equal(animator.progress, 0);
  var animator2 = new Animator({origin: 0, target: 1000, value: 600});
  equal(animator2.progress, 0.6);
  var animator3 = new Animator({origin: 0, target: 1000, value: 4.474615295891681, easing: 'ease-in'});
  ok(animator3.progress - 0.05 < 0.000001, 'The progress is calculated taking int account the easing');
});

test('Animator#remainingFrames is the number of remaining frames based on the progress of the animation', function() {
  var animator = new Animator({origin: 0, target: 1000, duration: 1});
  equal(animator.remainingFrames, 60);
  var animator2 = new Animator({origin: 0, target: 1000, value: 600, duration: 1});
  equal(animator2.remainingFrames, 24);
});

test('Animator#progressDelta is how much the progress will vary per frame', function() {
  var animator  = new Animator({origin: 0, target: 1000, duration: 0.33333});
  equal(animator.progressDelta, 0.05);
});

test('Animator#easing is the easing of the animation, and defaults to linear', function() {
  var animator  = new Animator({origin: 1, target: 2, duration: 2});
  equal(animator.easing(0.05), 0.05);
  var animator2  = new Animator({origin: 1, target: 2, duration: 2, easing: 'ease-in'});
  equal(animator2.easing(0.05), 0.004474615295891681);
});

test('Animator#inverseEasing is the function that composed with the easing the given value', function() {
  var easing    = new BezierEasing(0.15, 0.6, 0.45, 0.85);
  var animator  = new Animator({origin: 1, target: 2, duration: 2, easing: easing});
  var inverseEasing = animator.inverseEasing;

  equal(inverseEasing(easing(0)), 0);
  equal(inverseEasing(easing(1)), 1);
  equal(inverseEasing(easing(0.3)), 0.3);
  equal(inverseEasing(easing(0.8)), 0.8);
});

module('Animator - getters');

test('Animator#nextProgress is the progress of the animation expressed between 0 (not started) and 1 (finished)', function() {
  ok(false, 'Not implemented');
});
