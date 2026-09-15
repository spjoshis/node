'use strict';

const common = require('../common');
const assert = require('assert');
const { exec } = require('child_process');

// Regression test for issue #56531
// When Array.prototype is polluted with a setter, exec() should not crash
Object.defineProperty(Array.prototype, '2', {
  set: function() {},
  configurable: true,
});

exec('echo test', common.mustCall((err, stdout, stderr) => {
  // Clean up
  delete Array.prototype[2];

  // The command should either succeed or throw a proper error, not crash
  if (err) {
    // It's ok if we get an error, but it should not crash
    assert.ok(err.message.includes('stdio'));
  }
}));
