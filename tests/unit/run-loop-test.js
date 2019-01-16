import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupAssertTest from '../helpers/setup-assert-test';

module('Run Loop Assert', function(hooks) {
  setupTest(hooks);
  setupAssertTest(hooks);

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
});
