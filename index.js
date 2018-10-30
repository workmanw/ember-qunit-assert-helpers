/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-qunit-assert-helpers',

  included() {
    this._super.included.apply(this, arguments);
    this.import('vendor/ember-qunit-assert-helpers-loader.js', { type: 'test' });
  }
};
