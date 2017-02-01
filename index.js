/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-qunit-assert-helpers',

  postprocessTree: function(type, tree) {
    this._requireBuildPackages();
    if (type === 'all' && this.app.tests) {
      // Create a tree that pulls out the test file and it's source map
      var treeTestLoader = new Funnel(tree, {
        files: ['test-support.js', 'test-support.map'], // don't loose the sourcemaps
        srcDir: 'assets',
        destDir: 'app'
      });

      // Load in the loader file from the vendor package
      var vendor = this.treeGenerator(path.join(__dirname, 'vendor'));
      var loader = new Funnel(vendor, {
        files: ['ember-qunit-assert-helpers-loader.js'],
        srcDir: '/',
        destDir: '/assets/'
      });

      // Merge the trees and concatenate the loader into the `test-support.js`
      var testLoaderTree = this.concatFiles(mergeTrees([treeTestLoader, loader]), {
        inputFiles: ['**/*.js'],
        outputFile: '/assets/test-support.js'
      });

      // Merge it all back together
      return mergeTrees([tree, testLoaderTree], {
        overwrite: true
      });
    } else {
      return tree;
    }
  }
};
