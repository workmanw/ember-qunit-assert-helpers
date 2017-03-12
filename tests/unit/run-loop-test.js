import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForAssert from '../helpers/module-for-assert';


moduleForAssert('Run Loop Assert', { integration: false });

test('`expectNoRunLoop` in a run loop', function(assert) {
  Ember.run.begin();

  assert.expectNoRunLoop();

  // Restore the asserts (removes the mocking)
  this.restoreAsserts();

  assert.notOk(this.pushedResults[0].result, '`expectNoRunLoop` detected active runloop');
  assert.notOk(Ember.run.currentRunLoop, 'ends run loop');
});

test('`expectNoRunLoop` when timers are active', function(assert) {
  Ember.run.later(function() {
    assert.ok(false, 'should not execute');
  });

  assert.expectNoRunLoop();

  // Restore the asserts (removes the mocking)
  this.restoreAsserts();

  assert.notOk(this.pushedResults[0].result, '`expectNoRunLoop` detected active runloop');
  assert.notOk(Ember.run.hasScheduledTimers(), 'ends run loop');
});
