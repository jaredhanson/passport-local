var vows = require('vows');
var assert = require('assert');
var util = require('util');
var local = require('../lib/passport-local');


vows.describe('passport-local').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(local.version);
    },
  },
  
}).export(module);
