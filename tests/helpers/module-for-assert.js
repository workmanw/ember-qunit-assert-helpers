import { module } from 'qunit';


export default function(name, options = {}) {
  module(name, {
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
  });
}
