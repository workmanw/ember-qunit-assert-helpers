import Ember from 'ember';
import QUnit from 'qunit';


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
    let error = null;
    try {
			cb();
		} catch (e) {
			error = e;
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
  };
}
