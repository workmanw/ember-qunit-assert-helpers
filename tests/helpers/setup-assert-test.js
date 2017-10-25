import QUnit from 'qunit';

export default function setupAssertTest(hooks) {
  hooks.beforeEach(function() {
    let originalPushResult = QUnit.assert.pushResult;
    this.pushedResults = [];

    QUnit.assert.pushResult = (result) => {
      this.pushedResults.push(result);
    };

    this.restoreAsserts = () => {
      if (originalPushResult) {
        QUnit.assert.pushResult = originalPushResult;
        originalPushResult = null;
      }
    };
  });

  hooks.afterEach(function() {
    this.restoreAsserts();
  });
}
