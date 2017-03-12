import Ember from 'ember';
import QUnit from 'qunit';
import { QUnitAdapter } from 'ember-qunit';

let TestAdapter = QUnitAdapter.extend({
  exception(error) {
    this.lastError = error;
  }
});

export default function() {
  let isProductionBuild = (function() {
    try {
      Ember.assert('fails in debug builds');
    } catch(e) {
      return false;
    }

    return true;
  })();

  QUnit.assert.expectAssertion = function(cb, matcher) {
    // Save off the original adapter and replace it with a test one.
    let origTestAdapter = Ember.Test.adapter;
    Ember.run(() => { Ember.Test.adapter = TestAdapter.create(); });

    let error = null;
    try {
      cb();
    } catch (e) {
      error = e;
    } finally {
      error = error || Ember.Test.adapter.lastError;
    }

    let isEmberError = error instanceof Ember.Error;
    let matches = Boolean(isEmberError && error.message.match(matcher));

    if (isProductionBuild) {
      this.pushResult({
        result: true,
        actual: null,
        expected: null,
        message: 'Assertions are disabled in production builds.'
      });
    } else {
      this.pushResult({
        result: isEmberError && matches,
        actual: error && error.message,
        expected: matcher,
        message: matcher ? 'Ember.assert matched specific message' : 'Ember.assert called with any message'
      });
    }

    // Cleanup the test adapter and restore the original.
    Ember.run(() => {
      Ember.Test.adapter.destroy();
      Ember.Test.adapter = origTestAdapter;
    });
  };
}
