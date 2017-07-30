import Ember from 'ember';
import QUnit from 'qunit';
import { QUnitAdapter } from 'ember-qunit';

let TestAdapter = QUnitAdapter.extend({
  exception(error) {
    this.lastError = error;
  }
});

let isProductionBuild = (function() {
  try {
    Ember.assert('fails in debug builds');
  } catch(e) {
    return false;
  }

  return true;
})();

export default function() {
  QUnit.assert.expectAssertion = function(cb, matcher) {
    let assertion = this;
    // Save off the original adapter and replace it with a test one.
    let origTestAdapter = Ember.Test.adapter;
    Ember.run(() => { Ember.Test.adapter = TestAdapter.create(); });

    let error = null;
    let ret;
    try {
      ret = cb();
    } catch (e) {
      error = e;
    } finally {
      error = error || Ember.Test.adapter.lastError;
    }

    if (typeof ret === 'object' && ret !== null && typeof ret.then === 'function') {
      // handle async
      return Ember.RSVP.Promise((resolve, reject) => {
        if (error) reject(error)
        else resolve(ret);
      }).catch(reason => {
          handleError(assertion, reason, matcher)
        }).finally(() => cleanup(origTestAdapter));;
    } else {
        handleError(assertion, error, matcher);
        cleanup(origTestAdapter);
    }
  };
}

function handleError(assertion, error, matcher) {
  let isEmberError = error instanceof Ember.Error;
  let matches = Boolean(isEmberError && error.message.match(matcher));

  if (isProductionBuild) {
    assertion.pushResult({
      result: true,
      actual: null,
      expected: null,
      message: 'Assertions are disabled in production builds.'
    });
  } else {
    assertion.pushResult({
      result: isEmberError && matches,
      actual: error && error.message,
      expected: matcher,
      message: matcher ? 'Ember.assert matched specific message' : 'Ember.assert called with any message'
    });
  }
}

function cleanup(origTestAdapter) {
  // Cleanup the test adapter and restore the original.
  Ember.run(() => {
    Ember.Test.adapter.destroy();
    Ember.Test.adapter = origTestAdapter;
  });
}
