import { moduleForComponent } from 'ember-qunit';
import { module } from 'qunit';


export default function(name, options = {}) {
  let opts = {
    integration: options.integration,
    beforeEach(assert) {
      let originalPushResult = assert.pushResult;
      this.pushedResults = [];

      assert.pushResult = result => {
        this.pushedResults.push(result);
      };

      this.restoreAsserts = () => {
        if (originalPushResult) {
          assert.pushResult = originalPushResult;
          originalPushResult = null;
        }
      };

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      this.restoreAsserts();

      if (options.afterEach) {
        return options.afterEach.apply(this, arguments);
      }
    }
  };

  if (opts.integration) {
    // Really we just want to use an integration loop, but we have to have a target for the moduleFor.
    moduleForComponent('component:x-assert-helpers', name, opts);
  } else {
    module(name, opts);
  }
}
