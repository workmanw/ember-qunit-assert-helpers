import Ember from 'ember';
import QUnit from 'qunit';
import { QUnitAdapter } from 'ember-qunit';
import { checkMatcher } from '../-private/utils';


let TestAdapter = QUnitAdapter.extend({
  exception(error) {
    this.lastError = error;
  }
});

let noop = () => {};

let cleanup = (origTestAdapter, origLoggerError) => {
  // Cleanup the test adapter and restore the original.
  return Ember.run(() => {
    Ember.Test.adapter.destroy();
    Ember.Test.adapter = origTestAdapter;
    Ember.Logger.error = origLoggerError;
  });
};

let handleError = (context, error, matcher, isProductionBuild) => {
  let isEmberError = error instanceof Ember.Error;
  let matches = Boolean(isEmberError && checkMatcher(error.message, matcher));
  let errObj = {};

  if (isProductionBuild) {
    errObj = {
      result: true,
      actual: null,
      expected: null,
      message: 'Assertions are disabled in production builds.'
    };
  } else {
    errObj = {
      result: isEmberError && matches,
      actual: error && error.message,
      expected: matcher,
      message: matcher ? 'Ember.assert matched specific message' : 'Ember.assert called with any message'
    };
  }

  context.pushResult(errObj);
};

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
    debugger;
    let origTestAdapter = Ember.Test.adapter;
    let origLoggerError = Ember.Logger.error;
    Ember.run(() => {
      Ember.Test.adapter = TestAdapter.create();
      Ember.Logger.error = noop;
    });

    let error = null;
    let result;
    try {
      result = cb();
    } catch (e) {
      error = e;
    }

    if (error) {
      handleError(this, error, matcher, isProductionBuild);
    } else if (Ember.Test.adapter.lastError) {
      handleError(this, Ember.Test.adapter.lastError, matcher, isProductionBuild);
    } else if(result && typeof result === 'object' && result !== null && typeof result.then === 'function') {
      return result
        .then(() => {
          if (Ember.Test.adapter.lastError) {
            handleError(this, Ember.Test.adapter.lastError, matcher, isProductionBuild);
          } else {
            handleError(this, null, matcher, null);
          }
        })
        .catch(() => handleError(this, error, matcher, isProductionBuild))
        .finally(() => cleanup(origTestAdapter, origLoggerError));
    } else {
      handleError(this, null, matcher, null);
    }

    return cleanup(origTestAdapter, origLoggerError);
  };
}
