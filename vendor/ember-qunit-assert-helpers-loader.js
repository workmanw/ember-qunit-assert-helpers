// This file is appended to `test-support.js`.
// It automatically requires the `install-qunit-asserts` entrypoint module to
// install the assertions onto `Qunit`.
//
// With `ember-auto-import@1` all vanilla JS dependencies, like `qunit`, are
// eagerly bundled into either `vendor.js` or `test-support.js`.
// Therefore they are available, when this module is evaluated.
//
// With `ember-auto-import@2` these dependencies are placed into extra
// `*.chunk.js` files instead. These files are loaded _after_ `vendor.js` and
// `test-support.js`. Therefore they are not available, when this module is
// evaluated.
// To fix this, we delay the evaluation of the entry point until the
// `DOMContentLoaded` event occurs, by which all `<script>` tags will have been
// loaded.
//
// This is not an ideal solution, but only a temporary fix with minimal changes
// to make this addon work with `ember-auto-import@2` host apps.
document.addEventListener('DOMContentLoaded', () => {
  require('ember-qunit-assert-helpers/test-support/install-qunit-asserts');
});
